'use client';

import React, { useState, useEffect } from 'react';
import { SensoryProfile } from '@/lib/profile';
import SourcePicker from './SourcePicker';
import ReaderView from './ReaderView';
import { useReader, useRawOriginal } from '@/lib/useReader';

interface BeforeAfterProps {
  profile: SensoryProfile;
  simulatedHour: number;
}

export default function BeforeAfter({ profile, simulatedHour }: BeforeAfterProps) {
  const [activeUrl, setActiveUrl] = useState<string>('/fixtures/cluttered.html');
  const [viewMode, setViewMode] = useState<'original' | 'calm'>('calm');

  const { status, article, errorMessage, loadUrl } = useReader(activeUrl);
  const {
    status: rawStatus,
    html: rawHtml,
    errorMessage: rawErrorMessage,
    loadUrl: loadRawUrl,
  } = useRawOriginal(activeUrl);

  const handleSelectUrl = (url: string) => {
    setActiveUrl(url);
    loadUrl(url);
    loadRawUrl(url);
  };

  // Keyboard shortcut Alt+B to toggle between Original and Calm views
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.altKey && (e.key === 'b' || e.key === 'B')) {
        e.preventDefault();
        setViewMode((prev) => (prev === 'calm' ? 'original' : 'calm'));
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <section
      aria-label="Article Preview"
      className="space-y-4"
    >
      {/* Source Picker & Open in New Tab link */}
      <div className="space-y-2">
        <SourcePicker activeUrl={activeUrl} onSelectUrl={handleSelectUrl} />
        {activeUrl && (
          <div className="flex justify-end px-1">
            <a
              href={activeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-semibold text-[var(--ag-accent)] hover:underline focus-visible:outline-3 focus-visible:outline-[var(--ag-accent)] focus-visible:outline-offset-2 rounded"
            >
              Open original in new tab
            </a>
          </div>
        )}
      </div>

      {/* Toggle Button Group */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl border border-[var(--ag-border)] bg-[var(--ag-surface)]">
        <div role="group" aria-label="View mode toggle" className="flex items-center gap-2">
          <button
            type="button"
            aria-pressed={viewMode === 'original'}
            onClick={() => setViewMode('original')}
            className={`px-4 py-2 rounded text-xs font-bold border border-[var(--ag-border)] cursor-pointer ${
              viewMode === 'original'
                ? 'bg-[var(--ag-accent)] text-white'
                : 'bg-[var(--ag-bg)] text-[var(--ag-text)] hover:opacity-90'
            }`}
          >
            Original
          </button>
          <button
            type="button"
            aria-pressed={viewMode === 'calm'}
            onClick={() => setViewMode('calm')}
            className={`px-4 py-2 rounded text-xs font-bold border border-[var(--ag-border)] cursor-pointer ${
              viewMode === 'calm'
                ? 'bg-[var(--ag-accent)] text-white'
                : 'bg-[var(--ag-bg)] text-[var(--ag-text)] hover:opacity-90'
            }`}
          >
            Calm view
          </button>
        </div>

        <div className="text-xs opacity-80 font-mono">
          Shortcut: <kbd className="px-1.5 py-0.5 bg-[var(--ag-bg)] border border-[var(--ag-border)] rounded">Alt</kbd> + <kbd className="px-1.5 py-0.5 bg-[var(--ag-bg)] border border-[var(--ag-border)] rounded">B</kbd>
        </div>
      </div>

      {/* Preview Content Area */}
      <div className="rounded-xl border border-[var(--ag-border)] bg-[var(--ag-surface)] p-4 min-h-[500px]">
        {viewMode === 'original' ? (
          activeUrl === '/fixtures/cluttered.html' ? (
            <div className="space-y-2">
              <div className="w-full h-[700px] border border-[var(--ag-border)] rounded-lg overflow-hidden bg-white">
                <iframe
                  src="/fixtures/cluttered.html"
                  title="Original webpage preview"
                  sandbox="allow-scripts allow-same-origin"
                  className="w-full h-full border-0"
                />
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              {rawStatus === 'loading' && (
                <div className="py-20 text-center font-bold text-base text-[var(--ag-text)]" aria-live="polite">
                  Loading...
                </div>
              )}

              {rawStatus === 'error' && (
                <div className="space-y-4 py-8">
                  <div
                    role="alert"
                    className="p-4 rounded-lg border border-[#8b0000] bg-[#fff5f5] text-[#8b0000] text-sm font-semibold text-center"
                  >
                    {rawErrorMessage}
                  </div>
                  <div className="text-center">
                    <a
                      href={activeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-bold text-[var(--ag-accent)] underline focus-visible:outline-3 focus-visible:outline-[var(--ag-accent)] focus-visible:outline-offset-2 rounded"
                    >
                      Open original in new tab
                    </a>
                  </div>
                </div>
              )}

              {rawStatus === 'success' && rawHtml && (
                <div className="space-y-2">
                  <p className="text-xs text-[var(--ag-text)] opacity-90 font-medium">
                    Original HTML with scripts disabled. Ads and pop-ups inserted by JavaScript are not shown. Use the extension on the live page to see them removed.
                  </p>
                  <div className="w-full border border-[var(--ag-border)] rounded-lg overflow-hidden bg-white">
                    <iframe
                      title="Original page, scripts disabled"
                      srcDoc={rawHtml}
                      sandbox="allow-popups allow-popups-to-escape-sandbox"
                      className="w-full h-[70vh] border-0"
                    />
                  </div>
                </div>
              )}
            </div>
          )
        ) : (
          <div>
            {status === 'loading' && (
              <div className="py-20 text-center font-bold text-base text-[var(--ag-text)]" aria-live="polite">
                Loading...
              </div>
            )}

            {status === 'error' && (
              <div
                role="alert"
                className="p-4 rounded-lg border border-[#8b0000] bg-[#fff5f5] text-[#8b0000] text-sm font-semibold text-center"
              >
                {errorMessage}
              </div>
            )}

            {status === 'success' && article && (
              <ReaderView
                title={article.title}
                byline={article.byline}
                contentHtml={article.contentHtml}
                profile={profile}
                hour={simulatedHour}
              />
            )}
          </div>
        )}
      </div>
    </section>
  );
}
