import React from 'react';
import Link from 'next/link';

export default function ExtensionPage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12 space-y-12">
      {/* Top Navigation */}
      <nav className="flex items-center justify-between pb-6 border-b border-[var(--ag-border)] text-sm">
        <Link href="/" className="font-bold text-[var(--ag-text)] hover:underline">
          &larr; AuraGaze Home
        </Link>
        <Link href="/dashboard" className="font-bold text-[var(--ag-text)] hover:underline">
          Open Dashboard &rarr;
        </Link>
      </nav>

      {/* Header & Download CTA */}
      <header className="space-y-4">
        <h1 className="text-3xl sm:text-4xl font-black text-[var(--ag-text)]">
          AuraGaze Chrome Extension
        </h1>
        <p className="text-lg text-[var(--ag-text)] opacity-90 leading-relaxed max-w-2xl">
          Apply your calm sensory profile to the live web. Permanently disable disruptive animations, freeze loud autoplay videos, hide aggressive banners, and read in peace.
        </p>

        <div className="pt-2">
          <a
            href="/auragaze-extension.zip"
            download="auragaze-extension.zip"
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-lg bg-[var(--ag-accent)] text-white font-bold text-base hover:opacity-95 shadow-sm"
          >
            <span>Download Extension (.zip)</span>
          </a>
          <span className="block text-xs opacity-75 mt-2">
            Manifest V3 &middot; Lightweight (~37 KB) &middot; No tracking or external scripts
          </span>
        </div>
      </header>

      {/* Core Features Overview */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6" aria-label="Extension features">
        <div className="p-5 rounded-xl border border-[var(--ag-border)] bg-[var(--ag-surface)] space-y-2">
          <h2 className="text-base font-bold text-[var(--ag-text)]">
            Zero Motion & Transition Killer
          </h2>
          <p className="text-xs text-[var(--ag-text)] opacity-85 leading-relaxed">
            Eliminates flickering CSS animations, transitions, and scrolling tickers across all web pages so content stays still.
          </p>
        </div>

        <div className="p-5 rounded-xl border border-[var(--ag-border)] bg-[var(--ag-surface)] space-y-2">
          <h2 className="text-base font-bold text-[var(--ag-text)]">
            Hover-or-Focus Video Freeze
          </h2>
          <p className="text-xs text-[var(--ag-text)] opacity-85 leading-relaxed">
            Videos pause and turn grayscale upon loading. Holding your pointer or keyboard focus for 2 seconds reveals color while leaving the video safely paused.
          </p>
        </div>

        <div className="p-5 rounded-xl border border-[var(--ag-border)] bg-[var(--ag-surface)] space-y-2">
          <h2 className="text-base font-bold text-[var(--ag-text)]">
            Conservative Distraction Hiding
          </h2>
          <p className="text-xs text-[var(--ag-text)] opacity-85 leading-relaxed">
            Hides intrusive ad banners, sponsored boxes, and newsletter modals without breaking essential login or cookie consent flows.
          </p>
        </div>

        <div className="p-5 rounded-xl border border-[var(--ag-border)] bg-[var(--ag-surface)] space-y-2">
          <h2 className="text-base font-bold text-[var(--ag-text)]">
            One-Click Native Reader Mode
          </h2>
          <p className="text-xs text-[var(--ag-text)] opacity-85 leading-relaxed">
            Transform article pages directly in your active tab into clean, single-column reading with instant toggle-back support.
          </p>
        </div>

        <div className="p-5 rounded-xl border border-[var(--ag-border)] bg-[var(--ag-surface)] space-y-2">
          <h2 className="text-base font-bold text-[var(--ag-text)]">
            Calm View Suggestion
          </h2>
          <p className="text-xs text-[var(--ag-text)] opacity-85 leading-relaxed">
            Suggests a calm view when a page looks busy with excessive animations, autoplay videos, or pop-ups. Never changes a page without your approval.
          </p>
        </div>
      </section>

      {/* Numbered Install Steps */}
      <section className="p-6 rounded-xl border border-[var(--ag-border)] bg-[var(--ag-surface)] space-y-6">
        <h2 className="text-xl font-bold text-[var(--ag-text)] border-b border-[var(--ag-border)] pb-3">
          Installation Guide (Load Unpacked)
        </h2>

        <ol className="space-y-4 text-sm list-decimal list-inside leading-relaxed text-[var(--ag-text)]">
          <li className="pl-2">
            <strong>Download and extract:</strong> Click the download button above and unzip the <code className="px-1.5 py-0.5 rounded bg-[var(--ag-bg)] font-mono text-xs">auragaze-extension.zip</code> file to a folder on your computer.
          </li>
          <li className="pl-2">
            <strong>Open Extensions:</strong> In Google Chrome, open a new tab and navigate to <code className="px-1.5 py-0.5 rounded bg-[var(--ag-bg)] font-mono text-xs">chrome://extensions</code> in your address bar.
          </li>
          <li className="pl-2">
            <strong>Enable Developer Mode:</strong> Toggle the <strong>Developer mode</strong> switch in the upper right-hand corner of the page.
          </li>
          <li className="pl-2">
            <strong>Load Unpacked:</strong> Click the <strong>Load unpacked</strong> button in the upper left corner.
          </li>
          <li className="pl-2">
            <strong>Select Directory:</strong> Choose the unzipped folder containing <code className="px-1.5 py-0.5 rounded bg-[var(--ag-bg)] font-mono text-xs">manifest.json</code>.
          </li>
          <li className="pl-2">
            <strong>Pin for Easy Access:</strong> Click the Extensions puzzle icon in Chrome&apos;s toolbar and pin AuraGaze so you can tune your sensory profile anytime.
          </li>
        </ol>
      </section>

      {/* Known Limitations */}
      <section className="p-6 rounded-xl border border-[var(--ag-border)] bg-[var(--ag-surface)] space-y-4">
        <h2 className="text-lg font-bold text-[var(--ag-text)] border-b border-[var(--ag-border)] pb-2">
          Known Limits & Honest Design Boundaries
        </h2>

        <ul className="space-y-2 text-xs text-[var(--ag-text)] opacity-90 list-disc list-inside leading-relaxed">
          <li>
            <strong>Article-style pages:</strong> Reader mode is optimized for editorial, news, and article content. Dynamic web apps (like dashboards or complex web email clients) remain in standard sensory-safe mode.
          </li>
          <li>
            <strong>Custom video players:</strong> While standard HTML5 video elements are frozen instantly, some non-standard custom players or deeply nested external iframes may occasionally resist pauses.
          </li>
          <li>
            <strong>Physical focus, not gaze:</strong> Video reveal operates through sustained pointer hover or keyboard focus, not webcam eye tracking.
          </li>
          <li>
            <strong>Heuristic hiding:</strong> Distraction removal uses targeted heuristic selector rules rather than a heavy full ad-blocking engine.
          </li>
          <li>
            <strong>Calm view suggestion:</strong> The calm view suggestion looks only at the page and at your own reduce-motion setting. It cannot tell how you feel.
          </li>
        </ul>
      </section>

      {/* Footer */}
      <footer className="text-center pt-6 border-t border-[var(--ag-border)] text-xs opacity-75">
        <p>AuraGaze &middot; Built for calm, accessible web reading.</p>
      </footer>
    </div>
  );
}
