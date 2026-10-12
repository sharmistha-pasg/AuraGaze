# Module 02: Sensory profile (shared logic)

Time box: 15 minutes. Target done: 11:15.
Depends on: 01.
Context to paste first: about-project.md.

## Goal

One dependency-free file, `shared/profile.js`, that both the Next.js app and the Chrome extension use. It defines the profile, validates it, resolves the palette by time of day, generates CSS, and checks contrast. Tests prove it.

## Prompt for Antigravity

```text
Follow the Global rules in about-project.md.

Create shared/profile.js as a UMD module with no dependencies, so that it works with require() in Node, with import in the Next.js app, and as a classic script in a Chrome extension content script (it should attach to globalThis.AuraProfile when no module system exists). Use this wrapper pattern:

(function (root, factory) {
  if (typeof module === 'object' && module.exports) { module.exports = factory(); }
  else { root.AuraProfile = factory(); }
})(typeof self !== 'undefined' ? self : this, function () { ... return { ... }; });

Export these functions and constants:

- PALETTES: the three palettes from about-project.md (sage, amber, forest), each with bg, surface, text, accent, border.
- PRESETS: gentle, lowLight, maxCalm, each a full profile.
- defaultProfile(): returns the gentle preset with name "My profile".
- validateProfile(input): never throws. Takes any value, returns a complete valid profile. Unknown palette or font falls back to default. Numbers are clamped to the ranges in about-project.md. Booleans are coerced. Unknown keys are dropped. Non-objects return defaultProfile().
- resolvePalette(profile, hour): hour is 0 to 23. If profile.palette is "auto", use 06 to 16 sage, 17 to 20 amber, 21 to 05 forest. Otherwise return the chosen palette name. Returns { name, tokens }.
- buildReaderCss(profile, hour, scopeSelector): returns a CSS string. It sets CSS custom properties (--ag-bg, --ag-surface, --ag-text, --ag-accent, --ag-border) on scopeSelector, plus rules for font family, font size (fontScale), letter-spacing, line-height, max-width in ch, and a 2px solid var(--ag-border) rounded border with generous padding around the content when profile.steadyBorder is true. Include rules for headings, links (accent color, underlined), images (max-width 100%, height auto, rounded corners), blockquote, and code. Include "animation: none !important; transition: none !important;" for everything inside the scope. Also apply brightness dimming via a background-color overlay rule or a box-shadow-free method, not filter on the whole page, using profile.dimPercent.
- buildOverlayCss(profile, hour): returns CSS for two fixed full-viewport overlay elements with ids aura-tint and aura-dim: position fixed, inset 0, pointer-events none, z-index 2147483647. aura-tint uses mix-blend-mode multiply with rgba(255,170,60,0.12) and is only emitted if warmTint is true. aura-dim is rgba(0,0,0,dimPercent/100) and is only emitted if dimPercent is greater than 0.
- contrastRatio(hexA, hexB): WCAG 2.x relative luminance formula, returns a number rounded to 2 decimals.
- encodeProfile(profile): returns a base64url string of the JSON (works in Node and browsers, use btoa/atob when available and Buffer otherwise).
- decodeProfile(str): returns a validated profile, or null if the string cannot be decoded.

Also create shared/profile.d.ts with accurate TypeScript types for all of the above, and add allowJs and a path alias @shared/* to tsconfig.json so that the app can do: import AuraProfile from '@shared/profile'. If default-import interop is a problem, create lib/profile.ts that uses require and re-exports typed functions, and use that instead.

Create shared/profile.test.js using node:test and node:assert. Tests:
1. validateProfile clamps out-of-range values and drops unknown keys.
2. validateProfile(null), validateProfile("x"), validateProfile(42) all return a full valid profile.
3. resolvePalette with palette "auto" returns sage at hour 6 and 16, amber at 17 and 20, forest at 21 and 5.
4. encodeProfile then decodeProfile round-trips, and decodeProfile("not base64 !!") returns null.
5. For each palette: contrastRatio(text, bg) >= 4.5, contrastRatio(accent, bg) >= 4.5, contrastRatio(text, surface) >= 4.5. If any fail, adjust the hex value in PALETTES (darken or lighten accent first) until all pass, then update the table in about-project.md to match.
6. buildReaderCss output never contains the word "animation" without "none" and never contains "@keyframes".
7. buildOverlayCss emits aura-tint only when warmTint is true, and aura-dim only when dimPercent > 0.

Run npm run test:profile and npm run build. Fix until both pass.
Commit with the message: "02 profile: shared sensory profile, palettes, css builders, tests".
```

## Done when

- `npm run test:profile` passes, including the contrast checks.
- `import AuraProfile from '@shared/profile'` type-checks in a Next.js file.
- about-project.md palette table matches the final hex values.

## If stuck

If the TypeScript import interop eats more than 5 minutes, use the lib/profile.ts wrapper with require and move on.
