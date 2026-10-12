# AuraGaze: Sensory-Safe Web Reading

> AuraGaze turns loud, cluttered web pages into calm, predictable reading, and lets a caregiver configure a sensory profile once that stays in place everywhere. Built for autistic individuals and anyone experiencing sensory processing sensitivity, it combines an accessible web dashboard with a Manifest V3 Chrome extension to eliminate animations, freeze surprise autoplay videos, hide aggressive banners, and apply time-calibrated soothing palettes.

---

## Key Features

1. **Zero Motion Engine**: Disables all CSS animations, transitions, and marquees globally (`animation: none !important; transition: none !important;`).
2. **Video Freeze & Delayed Reveal**: Autoplay videos pause and turn grayscale. A video is revealed in a paused state only after sustained hover or keyboard focus for 2 seconds (customizable 1–4s).
3. **Calm WCAG AA Palettes**:
   - **Sage** (Daytime baseline: `#EAF0E6` bg, `#26352A` text, `#3F6445` accent)
   - **Amber** (Dusk warmth: `#F6E7CF` bg, `#3A2E1C` text, `#8A5A14` accent)
   - **Forest** (Night low-light: `#1E2B23` bg, `#E2EBDD` text, `#8FB996` accent)
   - All palettes pass WCAG AA contrast ($\ge 4.5:1$).
4. **Caregiver Profile Sharing**: Portable JSON profiles, shareable URLs (`?p=...`), and local browser persistence.
5. **Safe Reader API**: High-performance SSRF-protected serverless article extractor with Mozilla Readability and DOMPurify sanitization.

---

## What AuraGaze Does Not Do (Honest Claims)

- **No Real-Time Audio Isolation**: Separating voices or distinct sounds from mixed web audio requires heavy machine learning; current Web Audio API filters only compress broad dynamic range.
- **No Webcam Eye Tracking**: Browsers cannot track gaze accurately or privately. Video reveals rely on deliberate pointer hover or keyboard focus.
- **Article-Centric Extraction**: Reader view is tailored for article and editorial content; single-page applications or complex dashboards remain in sensory-safe overlay mode.
- **Not a Clinical Therapy**: Palettes and timing thresholds are ergonomic, caregiver-adjustable design choices rather than validated medical treatments.

---

## Project Architecture

```
auragaze/
  app/                      # Next.js App Router (TypeScript Strict)
    page.tsx                # Landing page
    dashboard/page.tsx      # Sensory tuning & Before/After dashboard
    extension/page.tsx      # Extension installation & documentation
    api/reader/route.ts     # SSRF-protected article extraction API
  components/               # ControlsPanel, BeforeAfter, ReaderView, ProfileIO, ContrastBadge, TimeSlider
  lib/                      # useReader hook, error definitions, sample fixture article, urlGuard
  shared/
    profile.js              # Dependency-free UMD module (Node, Next.js, and Extension)
    profile.d.ts            # Complete TypeScript declarations
    profile.test.js         # Automated node:test suite
  public/
    fixtures/cluttered.html # Hostile demo page for before/after comparison
    demo/clip.mp4           # Self-contained test video loop
    auragaze-extension.zip  # Downloadable extension bundle
  extension/                # Chrome Extension (Manifest V3)
    manifest.json           # MV3 configuration
    content.js              # Style injection, video freeze, and in-tab reader
    popup.html / popup.js   # Extension settings popup
    profile.js              # Synced from shared/
    Readability.js          # Synced from @mozilla/readability
  scripts/
    ext-sync.mjs            # Syncs shared code to extension
    ext-zip.mjs             # Packages extension into downloadable zip
    test-reader.mjs         # Automated API & SSRF security tests
```

---

## Getting Started

### 1. Installation & Local Development

```bash
# Install dependencies
npm install

# Run shared profile tests
npm run test:profile

# Build production bundle
npm run build

# Start local server (http://localhost:3000)
npm run dev
```

### 2. Testing the Reader API

In a second terminal while the server is running:

```bash
# Run automated SSRF and article extraction tests
npm run test:reader

# Or test against a deployed Vercel URL:
BASE_URL=https://your-deployment.vercel.app npm run test:reader
```

---

## Loading the Chrome Extension

1. Download `auragaze-extension.zip` from `/auragaze-extension.zip` (or build it locally with `npm run ext:zip`).
2. Extract the zip file to a local directory.
3. Open Google Chrome and go to `chrome://extensions`.
4. Turn on **Developer mode** in the top-right corner.
5. Click **Load unpacked** in the top-left toolbar and select the extracted `extension` directory.
6. Open `/fixtures/cluttered.html` or any noisy article page and observe motion kill and video freeze in action!

---

## Security & Privacy

- **Server-Side URL Safety**: The Reader API resolves all hostnames via `dns.promises.lookup` and strictly blocks loopback, private RFC1918 subnets, cloud metadata (`169.254.169.254`), and link-local IPv6 addresses.
- **Zero Tracking**: Profiles are stored entirely in client-side storage or URL search parameters. No databases, analytics trackers, or user telemetry exist.
