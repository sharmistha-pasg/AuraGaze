'use client';

import { useState, useEffect } from 'react';
import sampleFixture from '@/lib/sample-fixture';
import { getFriendlyErrorMessage } from '@/lib/errors';

export interface ReaderArticle {
  title: string;
  byline: string;
  siteName?: string;
  contentHtml: string;
  textLength?: number;
}

export type ReaderStatus = 'idle' | 'loading' | 'success' | 'error';

export interface UseReaderResult {
  status: ReaderStatus;
  article: ReaderArticle | null;
  errorMessage: string | null;
  loadUrl: (url: string) => void;
}

export function useReader(initialUrl: string = '/fixtures/cluttered.html'): UseReaderResult {
  const [currentUrl, setCurrentUrl] = useState<string>(initialUrl);
  const [status, setStatus] = useState<ReaderStatus>('idle');
  const [article, setArticle] = useState<ReaderArticle | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!currentUrl) {
      setStatus('idle');
      setArticle(null);
      setErrorMessage(null);
      return;
    }

    // Demo page fixture bypass
    if (currentUrl === '/fixtures/cluttered.html' || currentUrl === 'demo') {
      setStatus('success');
      setArticle(sampleFixture);
      setErrorMessage(null);
      return;
    }

    let isCancelled = false;
    setStatus('loading');
    setErrorMessage(null);

    async function fetchArticle() {
      try {
        const res = await fetch(`/api/reader?url=${encodeURIComponent(currentUrl)}`);
        if (isCancelled) return;

        if (!res.ok) {
          let code: string | null = null;
          try {
            const data = await res.json();
            code = data.error || data.code;
          } catch {
            // Not JSON
          }
          setStatus('error');
          setArticle(null);
          setErrorMessage(getFriendlyErrorMessage(code || 'UPSTREAM_ERROR'));
          return;
        }

        const data = await res.json();
        if (isCancelled) return;

        setStatus('success');
        setArticle({
          title: data.title || 'Untitled Article',
          byline: data.byline || '',
          siteName: data.siteName || '',
          contentHtml: data.contentHtml || '',
          textLength: data.textLength || 0,
        });
        setErrorMessage(null);
      } catch (err: unknown) {
        if (isCancelled) return;
        setStatus('error');
        setArticle(null);
        setErrorMessage(getFriendlyErrorMessage('TIMEOUT'));
      }
    }

    fetchArticle();

    return () => {
      isCancelled = true;
    };
  }, [currentUrl]);

  return {
    status,
    article,
    errorMessage,
    loadUrl: setCurrentUrl,
  };
}

export type RawOriginalStatus = 'idle' | 'loading' | 'success' | 'error';

export interface UseRawOriginalResult {
  status: RawOriginalStatus;
  html: string | null;
  sourceUrl: string | null;
  errorMessage: string | null;
  loadUrl: (url: string) => void;
}

export function useRawOriginal(initialUrl: string = '/fixtures/cluttered.html'): UseRawOriginalResult {
  const [currentUrl, setCurrentUrl] = useState<string>(initialUrl);
  const [status, setStatus] = useState<RawOriginalStatus>('idle');
  const [html, setHtml] = useState<string | null>(null);
  const [sourceUrl, setSourceUrl] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!currentUrl || currentUrl === '/fixtures/cluttered.html' || currentUrl === 'demo') {
      setStatus('idle');
      setHtml(null);
      setSourceUrl(null);
      setErrorMessage(null);
      return;
    }

    let isCancelled = false;
    setStatus('loading');
    setErrorMessage(null);

    async function fetchRaw() {
      try {
        const res = await fetch(`/api/reader?url=${encodeURIComponent(currentUrl)}&raw=1`);
        if (isCancelled) return;

        if (!res.ok) {
          let code: string | null = null;
          try {
            const data = await res.json();
            code = data.error || data.code;
          } catch {
            // Not JSON
          }
          setStatus('error');
          setHtml(null);
          setSourceUrl(null);
          setErrorMessage(getFriendlyErrorMessage(code || 'UPSTREAM_ERROR'));
          return;
        }

        const data = await res.json();
        if (isCancelled) return;

        setStatus('success');
        setHtml(data.html || '');
        setSourceUrl(data.sourceUrl || currentUrl);
        setErrorMessage(null);
      } catch {
        if (isCancelled) return;
        setStatus('error');
        setHtml(null);
        setSourceUrl(null);
        setErrorMessage(getFriendlyErrorMessage('TIMEOUT'));
      }
    }

    fetchRaw();

    return () => {
      isCancelled = true;
    };
  }, [currentUrl]);

  return {
    status,
    html,
    sourceUrl,
    errorMessage,
    loadUrl: setCurrentUrl,
  };
}

