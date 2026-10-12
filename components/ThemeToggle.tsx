'use client';

import React, { useState, useEffect } from 'react';

export default function ThemeToggle() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    try {
      const current = document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light';
      setTheme(current);
    } catch {
      // fallback
    }
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    try {
      document.documentElement.dataset.theme = nextTheme;
      localStorage.setItem('aura.theme', nextTheme);
    } catch {
      // ignore storage access errors
    }
    setTheme(nextTheme);
  };

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-pressed={theme === 'dark'}
      className="px-2.5 py-1 sm:px-3 sm:py-1.5 rounded border border-[var(--ag-border)] bg-[var(--ag-surface)] text-[var(--ag-text)] text-xs font-semibold hover:bg-[var(--ag-bg)] cursor-pointer focus-visible:outline-3 focus-visible:outline-[var(--ag-accent)] focus-visible:outline-offset-2 whitespace-nowrap"
    >
      Dashboard theme: {theme === 'dark' ? 'Dark' : 'Light'}
    </button>
  );
}
