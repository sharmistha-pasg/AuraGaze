'use client';

import React, { useState } from 'react';

interface SourcePickerProps {
  activeUrl: string;
  onSelectUrl: (url: string) => void;
}

export default function SourcePicker({ activeUrl, onSelectUrl }: SourcePickerProps) {
  const [customUrl, setCustomUrl] = useState('');
  const [mode, setMode] = useState<'demo' | 'wiki' | 'custom'>(() => {
    if (activeUrl === '/fixtures/cluttered.html') return 'demo';
    if (activeUrl.includes('wikipedia')) return 'wiki';
    return 'custom';
  });

  const handleDemoSelect = () => {
    setMode('demo');
    onSelectUrl('/fixtures/cluttered.html');
  };

  const handleWikiSelect = () => {
    setMode('wiki');
    onSelectUrl('https://en.wikipedia.org/wiki/Photosynthesis');
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = customUrl.trim();
    if (!trimmed) return;
    setMode('custom');
    let formatted = trimmed;
    if (!formatted.startsWith('http://') && !formatted.startsWith('https://')) {
      formatted = 'https://' + formatted;
    }
    onSelectUrl(formatted);
  };

  return (
    <div className="p-4 rounded-xl border border-[var(--ag-border)] bg-[var(--ag-surface)] space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <label className="text-sm font-bold text-[var(--ag-text)]">
          Article Source:
        </label>
        <span className="text-xs opacity-75 font-mono truncate max-w-xs">
          Active: {activeUrl === '/fixtures/cluttered.html' ? 'Hostile Fixture Demo' : activeUrl}
        </span>
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={handleDemoSelect}
          className={`px-3 py-1.5 text-xs font-semibold rounded border border-[var(--ag-border)] cursor-pointer ${
            mode === 'demo'
              ? 'bg-[var(--ag-accent)] text-white'
              : 'bg-[var(--ag-bg)] text-[var(--ag-text)] hover:opacity-90'
          }`}
        >
          Demo Page (Cluttered Hostile Site)
        </button>

        <button
          type="button"
          onClick={handleWikiSelect}
          className={`px-3 py-1.5 text-xs font-semibold rounded border border-[var(--ag-border)] cursor-pointer ${
            mode === 'wiki'
              ? 'bg-[var(--ag-accent)] text-white'
              : 'bg-[var(--ag-bg)] text-[var(--ag-text)] hover:opacity-90'
          }`}
        >
          Wikipedia: Photosynthesis
        </button>
      </div>

      <form onSubmit={handleCustomSubmit} className="flex gap-2 pt-1">
        <input
          type="url"
          value={customUrl}
          onChange={(e) => setCustomUrl(e.target.value)}
          placeholder="Paste article URL (e.g. https://...)"
          className="flex-1 px-3 py-1.5 rounded border border-[var(--ag-border)] bg-[var(--ag-bg)] text-[var(--ag-text)] text-xs font-medium"
        />
        <button
          type="submit"
          className="px-4 py-1.5 bg-[var(--ag-surface)] text-[var(--ag-text)] border border-[var(--ag-border)] rounded text-xs font-semibold hover:bg-[var(--ag-bg)] cursor-pointer"
        >
          Load
        </button>
      </form>
    </div>
  );
}
