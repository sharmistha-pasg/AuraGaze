import React from 'react';
import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="max-w-5xl mx-auto px-6 py-12 space-y-16">
      {/* Hero Section */}
      <header className="text-center space-y-4 max-w-2xl mx-auto pt-6">
        <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-[var(--ag-text)]">
          AuraGaze
        </h1>
        <p className="text-xl sm:text-2xl font-medium leading-relaxed text-[var(--ag-text)] opacity-90">
          A sensory-safe way to read the web.
        </p>
        <p className="text-base text-[var(--ag-text)] opacity-80 leading-normal pt-2">
          AuraGaze turns loud, cluttered web pages into calm, predictable reading, and lets a caregiver configure the profile once so it stays in place everywhere.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-wrap justify-center gap-4 pt-6">
          <Link
            href="/dashboard"
            className="px-6 py-3 rounded-lg bg-[var(--ag-accent)] text-white font-bold text-base hover:opacity-95 shadow-sm inline-block"
          >
            Open the dashboard
          </Link>
          <Link
            href="/extension"
            className="px-6 py-3 rounded-lg bg-[var(--ag-surface)] text-[var(--ag-text)] border border-[var(--ag-border)] font-bold text-base hover:bg-[var(--ag-bg)] shadow-sm inline-block"
          >
            Get the extension
          </Link>
        </div>
      </header>

      {/* Main 3-Column Overview */}
      <main id="main-content" className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Column 1: The Problem */}
        <div className="p-6 rounded-xl border border-[var(--ag-border)] bg-[var(--ag-surface)] space-y-3">
          <h2 className="text-lg font-bold text-[var(--ag-text)] border-b border-[var(--ag-border)] pb-2">
            The problem
          </h2>
          <p className="text-sm leading-relaxed text-[var(--ag-text)] opacity-90">
            Many autistic individuals and people with sensory processing sensitivity find everyday web reading exhausting or painful: flickering banner ads, sudden autoplay videos, glaring pure-white backdrops, and crowded multi-column layouts that jump unexpectedly into view. Ordinary dark mode only swaps colors—it does not strip away motion, surprises, or clutter.
          </p>
        </div>

        {/* Column 2: What AuraGaze Does */}
        <div className="p-6 rounded-xl border border-[var(--ag-border)] bg-[var(--ag-surface)] space-y-3">
          <h2 className="text-lg font-bold text-[var(--ag-text)] border-b border-[var(--ag-border)] pb-2">
            What AuraGaze does
          </h2>
          <p className="text-sm leading-relaxed text-[var(--ag-text)] opacity-90">
            AuraGaze provides a calm, single-column reader with a steady visual border, time-calibrated palettes (sage, amber, forest), and high-legibility Atkinson Hyperlegible typography. All motion is permanently disabled. Autoplay videos are paused and grayscale until deliberately revealed with 2 seconds of sustained hover or keyboard focus.
          </p>
        </div>

        {/* Column 3: What It Does Not Do */}
        <div className="p-6 rounded-xl border border-[var(--ag-border)] bg-[var(--ag-surface)] space-y-3">
          <h2 className="text-lg font-bold text-[var(--ag-text)] border-b border-[var(--ag-border)] pb-2">
            What it does not do
          </h2>
          <p className="text-sm leading-relaxed text-[var(--ag-text)] opacity-90">
            AuraGaze does not perform real-time audio isolation (not technically feasible today), does not use webcam eye-tracking, and works primarily on article-style reading pages. Our palettes are carefully chosen starting points designed to reduce sensory overload, not a clinically proven therapy or medical cure.
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer className="text-center pt-8 border-t border-[var(--ag-border)] text-xs opacity-75">
        <p>AuraGaze &middot; Built for calm, accessible, sensory-friendly web exploration.</p>
      </footer>
    </div>
  );
}
