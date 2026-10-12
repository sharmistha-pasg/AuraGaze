'use client';

import React, { useState, useEffect } from 'react';
import { SensoryProfile } from '@/lib/profile';
import SourcePicker from './SourcePicker';
import ReaderView from './ReaderView';
import { useReader } from '@/lib/useReader';

interface BeforeAfterProps {
  profile: SensoryProfile;
  simulatedHour: number;
}

export default function BeforeAfter({ profile, simulatedHour }: BeforeAfterProps) {
  const [activeUrl, setActiveUrl] = useState<string>('/fixtures/cluttered.html');
  const [viewMode, setViewMode] = useState<'original' | 'calm'>('calm');

  const { status, article, errorMessage, loadUrl } = useReader(activeUrl);

  const handleSelectUrl = (url: string) => {
    setActiveUrl(url);
    loadUrl(url);
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
      {/* Source Picker */}
      <SourcePicker activeUrl={activeUrl} onSelectUrl={handleSelectUrl} />

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
          <div className="space-y-2">
            <div className="w-full h-[700px] border border-[var(--ag-border)] rounded-lg overflow-hidden bg-white">
              <iframe
                src={activeUrl}
                title="Original webpage preview"
                sandbox="allow-scripts allow-same-origin"
                className="w-full h-full border-0"
              />
            </div>
            {activeUrl !== '/fixtures/cluttered.html' && (
              <p className="text-xs opacity-75 italic text-center">
                Some sites block embedding. If the frame is empty, the site does not allow it.
              </p>
            )}
          </div>
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
