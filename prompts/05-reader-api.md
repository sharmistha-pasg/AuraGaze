# Module 05: Reader API

Time box: 30 minutes. Target done: 12:45.
Depends on: 01, 02, 04.
Context to paste first: about-project.md.

## Goal

A serverless route that takes a public URL, fetches the page safely, extracts the article with Mozilla Readability, sanitizes it, and returns JSON. It must fail with clear error codes, and it must never be usable to reach private networks.

## Prompt for Antigravity

```text
Follow the Global rules in about-project.md.

Create app/api/reader/route.ts: GET /api/reader?url=<encoded url>.

Runtime and limits:
- export const runtime = "nodejs"; export const maxDuration = 10; export const dynamic = "force-dynamic".
- Fetch timeout 7 seconds using AbortController. Maximum response size 2 MB (stream and stop reading past the limit).
- Send headers: User-Agent "AuraGazeHackathon/1.0 (accessibility reader; contact: see repository)" and Accept "text/html,application/xhtml+xml". Wikimedia asks for a descriptive User-Agent.

URL safety (this matters, treat the route as a possible SSRF target):
1. Only http and https. Anything else returns INVALID_URL.
2. Resolve the hostname with dns.promises.lookup (all addresses) and refuse if ANY address is private, loopback, link-local, or unspecified: 127.0.0.0/8, 10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16, 169.254.0.0/16, 0.0.0.0/8, ::1, fc00::/7, fe80::/10, and IPv4-mapped IPv6 forms of those. Refuse hostnames "localhost" and names ending in ".local" or ".internal". Return BLOCKED_HOST.
3. Follow redirects manually, at most 3 hops, and re-run the checks above on every hop. Never use automatic redirect following.
4. Put the check in lib/urlGuard.ts as a pure, testable function.

Processing:
1. Require content-type to include text/html or application/xhtml. Otherwise NOT_HTML.
2. Parse with jsdom (pass the final URL so relative links resolve). Disable script execution (jsdom default runScripts is off: keep it off, do not enable resources).
3. Run new Readability(document).parse(). If it returns null or textContent shorter than 200 characters, return EMPTY_CONTENT.
4. Sanitize article.content with DOMPurify (created from the jsdom window). Forbid tags: script, style, iframe, object, embed, form, input, button, link, meta. Forbid attributes: style, on*. Keep img, figure, figcaption, picture, source is NOT needed.
5. Post-process the sanitized HTML with jsdom: resolve every img src to an absolute URL, add loading="lazy", referrerpolicy="no-referrer", and drop srcset. Replace every <video> and <audio> with <figure class="aura-media-removed"><figcaption>Video removed for sensory safety.</figcaption></figure> (do the replacement BEFORE sanitizing, since DOMPurify may drop them). Make every link open with rel="noopener noreferrer" and target="_blank".
6. Success response (200): { ok: true, title, byline, siteName, lang, contentHtml, textLength, sourceUrl } with sourceUrl being the final URL.

Errors always return JSON { ok: false, code, message } with these statuses:
- INVALID_URL 400 (missing, malformed, or wrong scheme)
- BLOCKED_HOST 400
- NOT_HTML 415
- EMPTY_CONTENT 422
- TOO_LARGE 413
- TIMEOUT 504
- UPSTREAM_ERROR 502 (include upstreamStatus when known)
- INTERNAL 500 (never leak stack traces)
Messages are plain, calm sentences. Do not log full URLs with query strings to the console, log only the hostname and the error code.

If jsdom fails to build or run on Vercel, replace jsdom with linkedom for parsing (Readability works with linkedom's document) and tell me.

Create scripts/test-reader.mjs that starts from a running dev server (default http://localhost:3000) and checks:
- /api/reader (no url) returns 400 INVALID_URL
- url=ftp://example.com returns 400 INVALID_URL
- url=http://localhost:3000 returns 400 BLOCKED_HOST
- url=http://169.254.169.254/ returns 400 BLOCKED_HOST
- url=http://127.1/ returns 400 BLOCKED_HOST
- url=https://en.wikipedia.org/wiki/Photosynthesis returns 200 with ok true, a title containing "Photosynthesis", and textLength greater than 5000
- The Wikipedia contentHtml contains no "<script" and no "onclick"
Print a pass or fail line per check and exit non-zero on failure. Add the script to package.json as "test:reader".

Wire the dashboard: confirm that the Wikipedia source and Paste a URL in module 04 now work and that the friendly error messages show for every error code. Do not redesign the dashboard.

Run npm run build, start the dev server, run npm run test:reader, fix failures.
Commit with the message: "05 reader api: safe fetch, readability, sanitize, error codes".
```

## Done when

- `npm run test:reader` passes locally.
- Wikipedia works in the dashboard's Calm view.
- Pasting `http://169.254.169.254/` shows the BLOCKED_HOST message.
- Push, let Vercel redeploy, then run `BASE_URL=<your vercel url> node scripts/test-reader.mjs` against the deployed site. The first call may be slow (cold start). Call it once before any demo.

## If stuck

- jsdom build trouble: use linkedom.
- Wikipedia refuses: check the User-Agent header is being sent and that redirects are handled.
- Do not spend more than 10 minutes on any one failure. The fixture demo still works without this module.
