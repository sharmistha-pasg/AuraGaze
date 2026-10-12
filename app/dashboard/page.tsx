'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import AuraProfile, { SensoryProfile } from '@/lib/profile';
import ControlsPanel from '@/components/ControlsPanel';
import BeforeAfter from '@/components/BeforeAfter';
import Link from 'next/link';

function DashboardInner() {
  const searchParams = useSearchParams();

  const [profile, setProfile] = useState<SensoryProfile>(() => {
    return AuraProfile.defaultProfile();
  });

  const [simulatedHour, setSimulatedHour] = useState<number>(() => {
    return typeof window !== 'undefined' ? new Date().getHours() : 12;
  });

  const [isLoaded, setIsLoaded] = useState(false);

  // Initialize from ?p= or localStorage
  useEffect(() => {
    try {
      const pParam = searchParams.get('p');
      if (pParam) {
        const decoded = AuraProfile.decodeProfile(pParam);
        if (decoded) {
          setProfile(decoded);
          setIsLoaded(true);
          return;
        }
      }

      const stored = localStorage.getItem('aura.profile');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed && typeof parsed === 'object') {
          setProfile(AuraProfile.validateProfile(parsed));
          setIsLoaded(true);
          return;
        }
      }
    } catch {
      // Graceful fallback to defaultProfile
    }
    setIsLoaded(true);
  }, [searchParams]);

  // Persist to localStorage on change
  const handleProfileChange = (newProfile: SensoryProfile) => {
    setProfile(newProfile);
    try {
      localStorage.setItem('aura.profile', JSON.stringify(newProfile));
    } catch {
      // localStorage may fail in restricted/private modes
    }
  };

  const resolvedPalette = AuraProfile.resolvePalette(profile, simulatedHour);

  if (!isLoaded) {
    return (
      <div className="py-20 text-center font-bold text-base text-[var(--ag-text)]" aria-live="polite">
        Loading...
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      {/* Top Header */}
      <header className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[var(--ag-border)]">
        <div>
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="text-2xl font-black text-[var(--ag-text)] hover:opacity-80"
            >
              AuraGaze
            </Link>
            <span className="text-xs px-2.5 py-0.5 rounded-full border border-[var(--ag-border)] bg-[var(--ag-surface)] font-medium">
              Sensory Dashboard
            </span>
          </div>
          <p className="text-xs opacity-80 mt-1">
            Caregiver profile tuning & before/after reader comparison.
          </p>
        </div>

        <nav className="flex items-center gap-4 text-xs font-semibold">
          <Link
            href="/"
            className="hover:underline text-[var(--ag-text)]"
          >
            &larr; Home
          </Link>
          <Link
            href="/extension"
            className="px-3 py-1.5 rounded border border-[var(--ag-border)] bg-[var(--ag-surface)] text-[var(--ag-text)] hover:bg-[var(--ag-bg)]"
          >
            Get Extension
          </Link>
        </nav>
      </header>

      {/* Main Grid: Controls on Left, Preview on Right */}
      <main id="main-content" className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-5 xl:col-span-4">
          <ControlsPanel
            profile={profile}
            onProfileChange={handleProfileChange}
            simulatedHour={simulatedHour}
            onHourChange={setSimulatedHour}
            resolvedPalette={resolvedPalette}
          />
        </div>

        <div className="lg:col-span-7 xl:col-span-8">
          <BeforeAfter
            profile={profile}
            simulatedHour={simulatedHour}
          />
        </div>
      </main>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense
      fallback={
        <div className="py-20 text-center font-bold text-base text-[var(--ag-text)]" aria-live="polite">
          Loading...
        </div>
      }
    >
      <DashboardInner />
    </Suspense>
  );
}
