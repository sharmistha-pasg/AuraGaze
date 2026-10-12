import { NextRequest, NextResponse } from 'next/server';
import { JSDOM } from 'jsdom';
import { Readability } from '@mozilla/readability';
import createDOMPurify from 'dompurify';
import { validateSafeUrl } from '@/lib/urlGuard';
import { ERROR_MESSAGES } from '@/lib/errors';

export const runtime = 'nodejs';
export const maxDuration = 10;
export const dynamic = 'force-dynamic';

const MAX_BYTES = 2 * 1024 * 1024; // 2 MB
const TIMEOUT_MS = 7000; // 7 seconds
const MAX_REDIRECTS = 3;

interface ReaderErrorResponse {
  ok: false;
  code: string;
  message: string;
  upstreamStatus?: number;
}

function makeError(code: string, status: number, upstreamStatus?: number) {
  const message = ERROR_MESSAGES[code] || 'Something went wrong. Try the demo page.';
  const payload: ReaderErrorResponse = { ok: false, code, message };
  if (upstreamStatus !== undefined) {
    payload.upstreamStatus = upstreamStatus;
  }
  return NextResponse.json(payload, { status });
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const rawUrl = searchParams.get('url');

  if (!rawUrl || !rawUrl.trim()) {
    return makeError('INVALID_URL', 400);
  }

  let currentUrl = rawUrl.trim();
  let hostnameForLogging = 'unknown';

  try {
    const parsedInit = new URL(currentUrl);
    hostnameForLogging = parsedInit.hostname;
  } catch {
    console.error(`[ReaderAPI] host=${hostnameForLogging} code=INVALID_URL`);
    return makeError('INVALID_URL', 400);
  }

  try {
    let response: Response | null = null;
    let hops = 0;

    // Follow redirects manually with SSRF checks on every hop
    while (hops <= MAX_REDIRECTS) {
      const guard = await validateSafeUrl(currentUrl);
      if (!guard.valid) {
        console.error(`[ReaderAPI] host=${hostnameForLogging} code=${guard.code}`);
        return makeError(guard.code || 'INVALID_URL', 400);
      }

      hostnameForLogging = guard.parsedUrl?.hostname || hostnameForLogging;

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);

      try {
        response = await fetch(currentUrl, {
          method: 'GET',
          redirect: 'manual',
          signal: controller.signal,
          headers: {
            'User-Agent': 'AuraGazeHackathon/1.0 (accessibility reader; contact: see repository)',
            'Accept': 'text/html,application/xhtml+xml',
          },
        });
      } catch (fetchErr: unknown) {
        clearTimeout(timeoutId);
        if (fetchErr instanceof Error && fetchErr.name === 'AbortError') {
          console.error(`[ReaderAPI] host=${hostnameForLogging} code=TIMEOUT`);
          return makeError('TIMEOUT', 504);
        }
        console.error(`[ReaderAPI] host=${hostnameForLogging} code=UPSTREAM_ERROR`);
        return makeError('UPSTREAM_ERROR', 502);
      } finally {
        clearTimeout(timeoutId);
      }

      // Handle HTTP redirects (301, 302, 303, 307, 308)
      if ([301, 302, 303, 307, 308].includes(response.status)) {
        hops++;
        if (hops > MAX_REDIRECTS) {
          console.error(`[ReaderAPI] host=${hostnameForLogging} code=UPSTREAM_ERROR (too many redirects)`);
          return makeError('UPSTREAM_ERROR', 502, response.status);
        }
        const location = response.headers.get('location');
        if (!location) {
          console.error(`[ReaderAPI] host=${hostnameForLogging} code=UPSTREAM_ERROR (missing location)`);
          return makeError('UPSTREAM_ERROR', 502, response.status);
        }
        currentUrl = new URL(location, currentUrl).href;
        continue;
      }

      // Not a redirect: break loop
      break;
    }

    if (!response) {
      console.error(`[ReaderAPI] host=${hostnameForLogging} code=UPSTREAM_ERROR`);
      return makeError('UPSTREAM_ERROR', 502);
    }

    if (!response.ok) {
      console.error(`[ReaderAPI] host=${hostnameForLogging} code=UPSTREAM_ERROR status=${response.status}`);
      return makeError('UPSTREAM_ERROR', 502, response.status);
    }

    // 1. Content-Type verification
    const contentType = (response.headers.get('content-type') || '').toLowerCase();
    if (!contentType.includes('text/html') && !contentType.includes('application/xhtml')) {
      console.error(`[ReaderAPI] host=${hostnameForLogging} code=NOT_HTML`);
      return makeError('NOT_HTML', 415);
    }

    // 2. Stream body and enforce 2 MB limit
    if (!response.body) {
      console.error(`[ReaderAPI] host=${hostnameForLogging} code=EMPTY_CONTENT`);
      return makeError('EMPTY_CONTENT', 422);
    }

    const reader = response.body.getReader();
    const chunks: Uint8Array[] = [];
    let receivedBytes = 0;

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      if (value) {
        receivedBytes += value.length;
        if (receivedBytes > MAX_BYTES) {
          reader.cancel();
          console.error(`[ReaderAPI] host=${hostnameForLogging} code=TOO_LARGE`);
          return makeError('TOO_LARGE', 413);
        }
        chunks.push(value);
      }
    }

    const htmlBuffer = Buffer.concat(chunks);
    const rawHtml = new TextDecoder('utf-8').decode(htmlBuffer);

    // 3. Parse with JSDOM
    const dom = new JSDOM(rawHtml, { url: currentUrl });
    const document = dom.window.document;

    // Pre-processing before sanitization: replace <video> and <audio> elements
    const mediaElements = document.querySelectorAll('video, audio');
    mediaElements.forEach((el) => {
      const figure = document.createElement('figure');
      figure.className = 'aura-media-removed';
      const caption = document.createElement('figcaption');
      caption.textContent = 'Video removed for sensory safety.';
      figure.appendChild(caption);
      el.replaceWith(figure);
    });

    // 4. Run Readability
    const readerInstance = new Readability(document);
    const parsedArticle = readerInstance.parse();

    if (!parsedArticle || !parsedArticle.textContent || parsedArticle.textContent.trim().length < 200) {
      console.error(`[ReaderAPI] host=${hostnameForLogging} code=EMPTY_CONTENT`);
      return makeError('EMPTY_CONTENT', 422);
    }

    // 5. Sanitize with DOMPurify
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const DOMPurify = createDOMPurify(dom.window as any);
    const cleanHtml = DOMPurify.sanitize(parsedArticle.content || '', {
      FORBID_TAGS: [
        'script',
        'style',
        'iframe',
        'object',
        'embed',
        'form',
        'input',
        'button',
        'link',
        'meta',
      ],
      FORBID_ATTR: ['style'],
      ADD_TAGS: ['figure', 'figcaption', 'picture'],
    });

    // 6. Post-process sanitized HTML with JSDOM
    const postDom = new JSDOM(cleanHtml, { url: currentUrl });
    const postDoc = postDom.window.document;

    // Resolve images
    const images = postDoc.querySelectorAll('img');
    images.forEach((img) => {
      const src = img.getAttribute('src');
      if (src) {
        try {
          img.setAttribute('src', new URL(src, currentUrl).href);
        } catch {
          // Keep raw src
        }
      }
      img.setAttribute('loading', 'lazy');
      img.setAttribute('referrerpolicy', 'no-referrer');
      img.removeAttribute('srcset');
    });

    // Links open safely in new tab
    const links = postDoc.querySelectorAll('a');
    links.forEach((a) => {
      a.setAttribute('rel', 'noopener noreferrer');
      a.setAttribute('target', '_blank');
    });

    const finalHtml = postDoc.body.innerHTML;

    return NextResponse.json({
      ok: true,
      title: parsedArticle.title || 'Untitled Article',
      byline: parsedArticle.byline || '',
      siteName: parsedArticle.siteName || '',
      lang: parsedArticle.lang || '',
      contentHtml: finalHtml,
      textLength: parsedArticle.textContent.trim().length,
      sourceUrl: currentUrl,
    });
  } catch (err: unknown) {
    console.error(`[ReaderAPI] host=${hostnameForLogging} code=INTERNAL`, err);
    return makeError('INTERNAL', 500);
  }
}
