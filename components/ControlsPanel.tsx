'use client';

import React from 'react';
import AuraProfile, {
  SensoryProfile,
  PaletteName,
  FontChoice,
  ResolvedPalette,
} from '@/lib/profile';
import ContrastBadge from './ContrastBadge';
import TimeSlider from './TimeSlider';
import ProfileIO from './ProfileIO';

interface ControlsPanelProps {
  profile: SensoryProfile;
  onProfileChange: (newProfile: SensoryProfile) => void;
  simulatedHour: number;
  onHourChange: (hour: number) => void;
  resolvedPalette: ResolvedPalette;
}

export default function ControlsPanel({
  profile,
  onProfileChange,
  simulatedHour,
  onHourChange,
  resolvedPalette,
}: ControlsPanelProps) {
  const updateField = <K extends keyof SensoryProfile>(field: K, value: SensoryProfile[K]) => {
    onProfileChange({
      ...profile,
      [field]: value,
    });
  };

  const applyPreset = (presetKey: 'gentle' | 'lowLight' | 'maxCalm') => {
    const preset = AuraProfile.PRESETS[presetKey];
    onProfileChange({
      ...preset,
      name: profile.name || preset.name,
    });
  };

  return (
    <section
      aria-label="Sensory Profile Controls"
      className="p-5 rounded-xl border border-[var(--ag-border)] bg-[var(--ag-surface)] space-y-6 shadow-sm"
    >
      <div>
        <h2 className="text-xl font-bold mb-1 text-[var(--ag-text)]">
          Sensory Tuning
        </h2>
        <p className="text-xs opacity-80">
          Configure sensory thresholds once. Motion is permanently disabled.
        </p>
      </div>

      {/* Preset Buttons */}
      <div className="space-y-2">
        <label className="block text-sm font-semibold">Quick Presets:</label>
        <div className="grid grid-cols-3 gap-2">
          <button
            type="button"
            onClick={() => applyPreset('gentle')}
            className="px-3 py-2 text-xs font-semibold rounded border border-[var(--ag-border)] bg-[var(--ag-bg)] text-[var(--ag-text)] hover:opacity-90 cursor-pointer"
          >
            Gentle
          </button>
          <button
            type="button"
            onClick={() => applyPreset('lowLight')}
            className="px-3 py-2 text-xs font-semibold rounded border border-[var(--ag-border)] bg-[var(--ag-bg)] text-[var(--ag-text)] hover:opacity-90 cursor-pointer"
          >
            Low Light
          </button>
          <button
            type="button"
            onClick={() => applyPreset('maxCalm')}
            className="px-3 py-2 text-xs font-semibold rounded border border-[var(--ag-border)] bg-[var(--ag-bg)] text-[var(--ag-text)] hover:opacity-90 cursor-pointer"
          >
            Max Calm
          </button>
        </div>
      </div>

      {/* Palette Selector */}
      <div className="space-y-1">
        <label htmlFor="palette-select" className="block text-sm font-semibold">
          Palette:
        </label>
        <select
          id="palette-select"
          value={profile.palette}
          onChange={(e) => updateField('palette', e.target.value as PaletteName)}
          className="w-full px-3 py-2 rounded border border-[var(--ag-border)] bg-[var(--ag-bg)] text-[var(--ag-text)] text-sm cursor-pointer"
        >
          <option value="auto">Auto (follows time of day)</option>
          <option value="sage">Sage (Calm daytime green)</option>
          <option value="amber">Amber (Warm dusk gold)</option>
          <option value="forest">Forest (Low-light deep night)</option>
        </select>
      </div>

      {/* Time-of-day Slider */}
      <TimeSlider
        hour={simulatedHour}
        onChange={onHourChange}
        palette={profile.palette}
        resolvedPaletteName={resolvedPalette.name}
      />

      {/* Contrast Badge */}
      <ContrastBadge palette={resolvedPalette.name} />

      {/* Font Selector */}
      <div className="space-y-1">
        <label htmlFor="font-select" className="block text-sm font-semibold">
          Reading Font:
        </label>
        <select
          id="font-select"
          value={profile.font}
          onChange={(e) => updateField('font', e.target.value as FontChoice)}
          className="w-full px-3 py-2 rounded border border-[var(--ag-border)] bg-[var(--ag-bg)] text-[var(--ag-text)] text-sm cursor-pointer"
        >
          <option value="atkinson">Atkinson Hyperlegible (Low Vision / Clarity)</option>
          <option value="lexend">Lexend (Reading Fluency)</option>
          <option value="system">System UI (Native)</option>
        </select>
      </div>

      {/* Typography & Layout Sliders */}
      <div className="space-y-4 pt-2 border-t border-[var(--ag-border)]">
        <h3 className="text-sm font-bold text-[var(--ag-text)]">
          Typography & Sizing
        </h3>

        {/* Text Size */}
        <div>
          <div className="flex justify-between text-xs font-medium mb-1">
            <label htmlFor="slider-font-scale">Text Size:</label>
            <span className="font-mono">{profile.fontScale.toFixed(2)}x</span>
          </div>
          <input
            id="slider-font-scale"
            type="range"
            min={1.0}
            max={1.6}
            step={0.05}
            value={profile.fontScale}
            onChange={(e) => updateField('fontScale', Number(e.target.value))}
            className="w-full accent-[var(--ag-accent)] cursor-pointer"
          />
        </div>

        {/* Letter Spacing */}
        <div>
          <div className="flex justify-between text-xs font-medium mb-1">
            <label htmlFor="slider-letter-spacing">Letter Spacing:</label>
            <span className="font-mono">{profile.letterSpacing.toFixed(2)}em</span>
          </div>
          <input
            id="slider-letter-spacing"
            type="range"
            min={0}
            max={0.12}
            step={0.01}
            value={profile.letterSpacing}
            onChange={(e) => updateField('letterSpacing', Number(e.target.value))}
            className="w-full accent-[var(--ag-accent)] cursor-pointer"
          />
        </div>

        {/* Line Height */}
        <div>
          <div className="flex justify-between text-xs font-medium mb-1">
            <label htmlFor="slider-line-height">Line Height:</label>
            <span className="font-mono">{profile.lineHeight.toFixed(1)}</span>
          </div>
          <input
            id="slider-line-height"
            type="range"
            min={1.5}
            max={2.2}
            step={0.1}
            value={profile.lineHeight}
            onChange={(e) => updateField('lineHeight', Number(e.target.value))}
            className="w-full accent-[var(--ag-accent)] cursor-pointer"
          />
        </div>

        {/* Line Length */}
        <div>
          <div className="flex justify-between text-xs font-medium mb-1">
            <label htmlFor="slider-max-width">Line Length:</label>
            <span className="font-mono">{profile.maxWidthCh}ch</span>
          </div>
          <input
            id="slider-max-width"
            type="range"
            min={50}
            max={80}
            step={1}
            value={profile.maxWidthCh}
            onChange={(e) => updateField('maxWidthCh', Number(e.target.value))}
            className="w-full accent-[var(--ag-accent)] cursor-pointer"
          />
        </div>

        {/* Dimming */}
        <div>
          <div className="flex justify-between text-xs font-medium mb-1">
            <label htmlFor="slider-dim">Screen Dimming:</label>
            <span className="font-mono">{profile.dimPercent}%</span>
          </div>
          <input
            id="slider-dim"
            type="range"
            min={0}
            max={30}
            step={1}
            value={profile.dimPercent}
            onChange={(e) => updateField('dimPercent', Number(e.target.value))}
            className="w-full accent-[var(--ag-accent)] cursor-pointer"
          />
        </div>
      </div>

      {/* Sensory Safeguards */}
      <div className="space-y-3 pt-2 border-t border-[var(--ag-border)]">
        <h3 className="text-sm font-bold text-[var(--ag-text)]">
          Sensory Safeguards
        </h3>

        <div className="space-y-2 text-sm">
          <label className="flex items-center gap-2.5 cursor-pointer">
            <input
              type="checkbox"
              checked={profile.warmTint}
              onChange={(e) => updateField('warmTint', e.target.checked)}
              className="w-4 h-4 accent-[var(--ag-accent)] rounded"
            />
            <span>Warm Amber Tint (Reduces blue glare)</span>
          </label>

          <label className="flex items-center gap-2.5 cursor-pointer">
            <input
              type="checkbox"
              checked={profile.hideDistractions}
              onChange={(e) => updateField('hideDistractions', e.target.checked)}
              className="w-4 h-4 accent-[var(--ag-accent)] rounded"
            />
            <span>Hide Distractions (Ads, banners, pop-ups)</span>
          </label>

          <label className="flex items-center gap-2.5 cursor-pointer">
            <input
              type="checkbox"
              checked={profile.videoFreeze}
              onChange={(e) => updateField('videoFreeze', e.target.checked)}
              className="w-4 h-4 accent-[var(--ag-accent)] rounded"
            />
            <span>Freeze Autoplay Videos</span>
          </label>

          <label className="flex items-center gap-2.5 cursor-pointer">
            <input
              type="checkbox"
              checked={profile.steadyBorder}
              onChange={(e) => updateField('steadyBorder', e.target.checked)}
              className="w-4 h-4 accent-[var(--ag-accent)] rounded"
            />
            <span>Steady Border (Frames content anchor)</span>
          </label>
        </div>

        {/* Reveal Delay Slider */}
        <div className="pt-2">
          <div className="flex justify-between text-xs font-medium mb-1">
            <label htmlFor="slider-reveal-delay">Video Reveal Delay:</label>
            <span className="font-mono">{(profile.revealDelayMs / 1000).toFixed(1)}s</span>
          </div>
          <input
            id="slider-reveal-delay"
            type="range"
            min={1000}
            max={4000}
            step={250}
            value={profile.revealDelayMs}
            onChange={(e) => updateField('revealDelayMs', Number(e.target.value))}
            className="w-full accent-[var(--ag-accent)] cursor-pointer"
          />
          <span className="text-[11px] opacity-75">
            Hold pointer or keyboard focus for this duration to unfreeze videos.
          </span>
        </div>

        {/* Static Rule Note */}
        <div className="p-2.5 rounded bg-[var(--ag-bg)] border border-[var(--ag-border)] text-xs font-semibold text-[var(--ag-text)]">
          Motion is always off.
        </div>
      </div>

      {/* Caregiver Profile IO */}
      <ProfileIO profile={profile} onProfileChange={onProfileChange} />
    </section>
  );
}
