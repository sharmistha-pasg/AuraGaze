'use client';

import React from 'react';
import AuraProfile, { ConcretePaletteName } from '@/lib/profile';

interface ContrastBadgeProps {
  palette: ConcretePaletteName;
}

export default function ContrastBadge({ palette }: ContrastBadgeProps) {
  const tokens = AuraProfile.PALETTES[palette] || AuraProfile.PALETTES.sage;
  const textRatio = AuraProfile.contrastRatio(tokens.text, tokens.bg);
  const accentRatio = AuraProfile.contrastRatio(tokens.accent, tokens.bg);

  const passes = textRatio >= 4.5 && accentRatio >= 4.5;
  const statusLabel = passes ? 'Passes WCAG AA' : 'Below WCAG AA';

  return (
    <div
      className="p-3 rounded-lg border text-sm"
      style={{
        backgroundColor: tokens.surface,
        borderColor: tokens.border,
        color: tokens.text,
      }}
      aria-label="WCAG contrast verification details"
    >
      <div className="flex items-center justify-between mb-1">
        <span className="font-semibold">Palette Contrast:</span>
        <span
          className="font-bold px-2 py-0.5 rounded text-xs"
          style={{
            backgroundColor: passes ? tokens.accent : '#8b0000',
            color: '#ffffff',
          }}
        >
          {statusLabel}
        </span>
      </div>
      <div className="grid grid-cols-2 gap-2 text-xs">
        <div>
          <span className="opacity-80">Text / BG:</span>{' '}
          <strong className="font-mono">{textRatio.toFixed(2)}:1</strong>
        </div>
        <div>
          <span className="opacity-80">Accent / BG:</span>{' '}
          <strong className="font-mono">{accentRatio.toFixed(2)}:1</strong>
        </div>
      </div>
    </div>
  );
}
