'use client';

import React from 'react';
import { PaletteName, ConcretePaletteName } from '@/lib/profile';

interface TimeSliderProps {
  hour: number;
  onChange: (hour: number) => void;
  palette: PaletteName;
  resolvedPaletteName: ConcretePaletteName;
}

export default function TimeSlider({
  hour,
  onChange,
  palette,
  resolvedPaletteName,
}: TimeSliderProps) {
  const handleResetToLocal = () => {
    const currentLocalHour = new Date().getHours();
    onChange(currentLocalHour);
  };

  const formattedHour = `${hour.toString().padStart(2, '0')}:00`;

  return (
    <div className="space-y-2 p-3 rounded-lg border border-[var(--ag-border)] bg-[var(--ag-surface)]">
      <div className="flex items-center justify-between">
        <label htmlFor="time-of-day-slider" className="font-semibold text-sm">
          Simulated Time of Day:
        </label>
        <span className="font-mono text-sm font-bold bg-[var(--ag-bg)] px-2 py-0.5 rounded border border-[var(--ag-border)]">
          {formattedHour}
        </span>
      </div>

      <input
        id="time-of-day-slider"
        type="range"
        min={0}
        max={23}
        step={1}
        value={hour}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-[var(--ag-accent)] cursor-pointer"
        aria-valuemin={0}
        aria-valuemax={23}
        aria-valuenow={hour}
        aria-valuetext={`${formattedHour}, resolved palette ${resolvedPaletteName}`}
      />

      <div className="flex items-center justify-between text-xs pt-1">
        <span className="opacity-90">
          Resolved palette:{' '}
          <strong className="capitalize underline">{resolvedPaletteName}</strong>
          {palette === 'auto' ? ' (auto)' : ' (fixed)'}
        </span>
        <button
          type="button"
          onClick={handleResetToLocal}
          className="px-2 py-1 bg-[var(--ag-bg)] border border-[var(--ag-border)] rounded hover:bg-[var(--ag-surface)] text-xs font-medium cursor-pointer"
        >
          Use my local time
        </button>
      </div>

      {palette === 'auto' && (
        <p className="text-xs opacity-75">
          Schedule: 06:00–16:59 Sage · 17:00–20:59 Amber · 21:00–05:59 Forest
        </p>
      )}
    </div>
  );
}
