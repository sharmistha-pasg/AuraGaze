'use client';

import React, { useState } from 'react';
import AuraProfile, { SensoryProfile } from '@/lib/profile';

interface ProfileIOProps {
  profile: SensoryProfile;
  onProfileChange: (newProfile: SensoryProfile) => void;
}

export default function ProfileIO({ profile, onProfileChange }: ProfileIOProps) {
  const [importText, setImportText] = useState('');
  const [copyStatus, setCopyStatus] = useState<string | null>(null);
  const [importError, setImportError] = useState<string | null>(null);
  const [importSuccess, setImportSuccess] = useState<string | null>(null);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onProfileChange({
      ...profile,
      name: e.target.value,
    });
  };

  const handleDownloadJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(profile, null, 2));
    const downloadAnchor = document.createElement('a');
    const safeName = profile.name.trim().toLowerCase().replace(/[^a-z0-9_-]+/g, '-') || 'profile';
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `auragaze-${safeName}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleCopyShareLink = async () => {
    try {
      const encoded = AuraProfile.encodeProfile(profile);
      const origin = typeof window !== 'undefined' ? window.location.origin : '';
      const shareUrl = `${origin}/dashboard?p=${encoded}`;
      await navigator.clipboard.writeText(shareUrl);
      setCopyStatus('Link copied');
      setTimeout(() => setCopyStatus(null), 4000);
    } catch {
      setCopyStatus('Failed to copy to clipboard');
      setTimeout(() => setCopyStatus(null), 4000);
    }
  };

  const handleApplyImport = () => {
    setImportError(null);
    setImportSuccess(null);
    const trimmed = importText.trim();
    if (!trimmed) {
      setImportError('Please enter a profile string, share link, or JSON.');
      return;
    }

    // Try 1: Share Link containing ?p=
    if (trimmed.includes('?p=')) {
      try {
        const url = new URL(trimmed);
        const pParam = url.searchParams.get('p');
        if (pParam) {
          const decoded = AuraProfile.decodeProfile(pParam);
          if (decoded) {
            onProfileChange(decoded);
            setImportSuccess(`Imported "${decoded.name}" successfully!`);
            setImportText('');
            return;
          }
        }
      } catch {
        // Not a standard full URL, try regex
        const match = trimmed.match(/[?&]p=([A-Za-z0-9_-]+)/);
        if (match && match[1]) {
          const decoded = AuraProfile.decodeProfile(match[1]);
          if (decoded) {
            onProfileChange(decoded);
            setImportSuccess(`Imported "${decoded.name}" successfully!`);
            setImportText('');
            return;
          }
        }
      }
    }

    // Try 2: Raw base64url encoded string
    const decodedFromCode = AuraProfile.decodeProfile(trimmed);
    if (decodedFromCode) {
      onProfileChange(decodedFromCode);
      setImportSuccess(`Imported "${decodedFromCode.name}" successfully!`);
      setImportText('');
      return;
    }

    // Try 3: JSON object
    try {
      const parsed = JSON.parse(trimmed);
      if (parsed && typeof parsed === 'object') {
        const validated = AuraProfile.validateProfile(parsed);
        onProfileChange(validated);
        setImportSuccess(`Imported "${validated.name}" successfully!`);
        setImportText('');
        return;
      }
    } catch {
      // Not JSON
    }

    setImportError('Could not read this profile. Please provide a valid profile JSON, share link, or encoded code.');
  };

  return (
    <div className="space-y-4 pt-4 border-t border-[var(--ag-border)]">
      <h3 className="text-base font-bold text-[var(--ag-text)]">
        Caregiver Profile Management
      </h3>

      {/* Profile Name Input */}
      <div>
        <label htmlFor="profile-name-input" className="block text-sm font-semibold mb-1">
          Profile Name:
        </label>
        <input
          id="profile-name-input"
          type="text"
          value={profile.name}
          onChange={handleNameChange}
          placeholder="e.g. Maya's profile"
          className="w-full px-3 py-2 rounded border border-[var(--ag-border)] bg-[var(--ag-surface)] text-[var(--ag-text)] font-medium text-sm"
        />
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={handleDownloadJson}
          className="px-3 py-2 bg-[var(--ag-surface)] text-[var(--ag-text)] border border-[var(--ag-border)] rounded text-sm font-medium hover:bg-[var(--ag-bg)] cursor-pointer"
        >
          Download profile (.json)
        </button>

        <button
          type="button"
          onClick={handleCopyShareLink}
          className="px-3 py-2 bg-[var(--ag-accent)] text-white rounded text-sm font-medium hover:opacity-95 cursor-pointer"
        >
          Copy share link
        </button>
      </div>

      {/* Copy notification */}
      {copyStatus && (
        <p
          aria-live="polite"
          className="text-xs font-semibold px-2 py-1 bg-[var(--ag-surface)] border border-[var(--ag-border)] rounded text-[var(--ag-text)]"
        >
          {copyStatus}
        </p>
      )}

      {/* Import Section */}
      <div className="space-y-2 pt-2">
        <label htmlFor="import-profile-textarea" className="block text-sm font-semibold">
          Import profile:
        </label>
        <textarea
          id="import-profile-textarea"
          rows={3}
          value={importText}
          onChange={(e) => setImportText(e.target.value)}
          placeholder="Paste JSON, share link, or encoded string here..."
          className="w-full px-3 py-2 rounded border border-[var(--ag-border)] bg-[var(--ag-surface)] text-[var(--ag-text)] font-mono text-xs"
        />

        <button
          type="button"
          onClick={handleApplyImport}
          className="px-4 py-1.5 bg-[var(--ag-surface)] text-[var(--ag-text)] border border-[var(--ag-border)] rounded text-sm font-medium hover:bg-[var(--ag-bg)] cursor-pointer"
        >
          Apply Profile
        </button>

        {importError && (
          <div
            role="alert"
            className="p-2.5 rounded border border-[#8b0000] bg-[#fff5f5] text-[#8b0000] text-xs font-medium"
          >
            {importError}
          </div>
        )}

        {importSuccess && (
          <div
            aria-live="polite"
            className="p-2.5 rounded border border-[var(--ag-border)] bg-[var(--ag-surface)] text-[var(--ag-text)] text-xs font-medium"
          >
            {importSuccess}
          </div>
        )}
      </div>
    </div>
  );
}
