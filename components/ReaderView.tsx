'use client';

import React, { useMemo } from 'react';
import AuraProfile, { SensoryProfile } from '@/lib/profile';

interface ReaderViewProps {
  title: string;
  byline?: string;
  contentHtml: string;
  profile: SensoryProfile;
  hour: number;
}

export default function ReaderView({
  title,
  byline,
  contentHtml,
  profile,
  hour,
}: ReaderViewProps) {
  // Generate reader CSS scoped to .aura-reader
  const dynamicCss = useMemo(() => {
    return AuraProfile.buildReaderCss(profile, hour, '.aura-reader');
  }, [profile, hour]);

  // Strip or neutralize videos into a calm static placeholder
  const safeContentHtml = useMemo(() => {
    if (!contentHtml) return '';
    return contentHtml.replace(
      /<video[\s\S]*?<\/video>/gi,
      `<div class="reader-video-placeholder" style="border: 1px dashed var(--ag-border); background: var(--ag-surface); color: var(--ag-text); padding: 16px; margin: 20px 0; border-radius: 8px; text-align: center; font-size: 0.9em; font-weight: 600;">
        [ Video content neutralized & hidden for calm reading ]
      </div>`
    );
  }, [contentHtml]);

  return (
    <div className="relative">
      {/* Dynamic scoped styles */}
      <style dangerouslySetInnerHTML={{ __html: dynamicCss }} />

      <div className="aura-reader">
        <article>
          {title && <h1 className="article-title">{title}</h1>}
          {byline && (
            <div
              className="article-byline"
              style={{
                fontSize: '0.85em',
                opacity: 0.85,
                borderBottom: '1px solid var(--ag-border)',
                paddingBottom: '0.75em',
                marginBottom: '1.5em',
              }}
            >
              {byline}
            </div>
          )}
          <div
            className="article-content"
            dangerouslySetInnerHTML={{ __html: safeContentHtml }}
          />
        </article>
      </div>
    </div>
  );
}
