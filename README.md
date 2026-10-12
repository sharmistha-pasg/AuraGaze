# AuraGaze — Sensory-Safe Web Reading

> Sensory-safe web reading for autistic individuals and people experiencing sensory processing sensitivity. Strips intrusive CSS animations, freezes surprise autoplay videos behind deliberate delayed reveals, suppresses aggressive banners, and lets caregivers configure calibrated WCAG AA palettes once to apply everywhere with a lightweight Chrome extension.

[![Tests](https://img.shields.io/badge/Tests-7%20passing-3F6445?style=flat-square&logo=node.js&logoColor=white)](shared/profile.test.js)
[![Next.js](https://img.shields.io/badge/Next.js-16%20App%20Router-1E2B23?style=flat-square&logo=nextdotjs&logoColor=white)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5%20Strict-26352A?style=flat-square&logo=typescript&logoColor=white)](tsconfig.json)
[![Chrome Extension](https://img.shields.io/badge/Chrome%20Extension-Manifest%20V3-3F6445?style=flat-square&logo=googlechrome&logoColor=white)](#loading-the-chrome-extension)
[![WCAG Contrast](https://img.shields.io/badge/WCAG%20Contrast-AAA%20%2F%20AA%20Pass-8A5A14?style=flat-square&logo=w3c&logoColor=white)](#sensory-palette-system-wcag-aa--aaa)
[![Engine](https://img.shields.io/badge/Engine-Zero%20Motion-3F6445?style=flat-square&logo=speedtest&logoColor=white)](#core-capabilities)
[![Security](https://img.shields.io/badge/Security-SSRF%20DNS%20Guard-1E2B23?style=flat-square&logo=shield&logoColor=white)](#security--privacy-architecture)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-v4-8A5A14?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)

> **Extension Quickstart:** see [Loading the Chrome Extension](#loading-the-chrome-extension) &middot; **Live Cluttered Test Fixture:** [public/fixtures/cluttered.html](public/fixtures/cluttered.html) &middot; **Sensory Tuning:** [Sensory Palette System](#sensory-palette-system-wcag-aa--aaa)

---

## 🌿 The Sensory Challenge & The AuraGaze Solution

Modern websites are built for attention capture rather than cognitive comfort: aggressive auto-playing videos, flashing promotional overlays, continuous scrolling tickers, and jarring pure-white glare. For autistic readers and individuals with sensory processing sensitivity, these triggers can cause acute cognitive exhaustion, visual disorientation, or sensory overload.

Standard browser "dark mode" only flips surface color values—it does not halt motion, freeze video surprises, or tame erratic layouts.

| Web Friction | Standard Browsers / Dark Mode | AuraGaze Experience |
| :--- | :--- | :--- |
| **Motion & Transitions** | CSS animations, parallax, and marquees fire unrestrained | **Zero Motion Engine** completely disables all animations, transforms, and transitions |
| **Autoplay Videos** | Videos start abruptly with moving frames and sound | **Immediate Freeze**: Videos are paused and grayscale until 2s deliberate hover or focus |
| **Visual Overload & Popups** | Modals, floating banners, and newsletters obscure content | **Conservative Shield**: Heuristic suppression of noise while preserving critical login flows |
| **Color Temperature & Glare** | Harsh high-contrast pure black (`#000000`) or white (`#FFFFFF`) | **Circadian WCAG AA/AAA Palettes**: Time-calibrated Sage, Amber, and Forest themes |
| **Typography & Layout** | Crowded multi-column layouts with dense typography | **Atkinson Hyperlegible single-column reader** with adjustable spacing and steady visual border |
| **Profile Portability** | Settings locked to individual browser silos | **Portable Caregiver Sync**: Shareable Base64 URLs and cross-synced Chrome extension |

---

## 🎨 Sensory Palette System (WCAG AA & AAA)

AuraGaze uses three carefully calibrated, circadian-aware palettes specifically crafted to ease eye fatigue and visual overstimulation. In automatic mode, AuraGaze transitions smoothly between palettes based on local time.

```
       06:00 – 16:59                    17:00 – 20:59                    21:00 – 05:59
   ┌───────────────────┐            ┌───────────────────┐            ┌───────────────────┐
   │    🌿 SAGE        │   ───────► │    🌾 AMBER       │   ───────► │    🌲 FOREST      │
   │ Daytime Baseline  │            │    Dusk Warmth    │            │  Night Low-Light  │
   └───────────────────┘            └───────────────────┘            └───────────────────┘
```

| Palette | Circadian Window | Background | Surface | Text | Accent | Border | Contrast Ratio (Text/Bg) | Compliance |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :---: | :---: |
| **Sage** | Daytime Baseline (06:00–16:59) | `![#EAF0E6](https://img.shields.io/badge/%23EAF0E6-EAF0E6?style=flat-square&labelColor=26352A)` | `![#F3F7F0](https://img.shields.io/badge/%23F3F7F0-F3F7F0?style=flat-square&labelColor=26352A)` | `![#26352A](https://img.shields.io/badge/%2326352A-26352A?style=flat-square&labelColor=EAF0E6)` | `![#3F6445](https://img.shields.io/badge/%233F6445-3F6445?style=flat-square&labelColor=EAF0E6)` | `![#A9BFA9](https://img.shields.io/badge/%23A9BFA9-A9BFA9?style=flat-square&labelColor=26352A)` | **11.14 : 1** | **WCAG AAA** |
| **Amber** | Dusk Warmth (17:00–20:59) | `![#F6E7CF](https://img.shields.io/badge/%23F6E7CF-F6E7CF?style=flat-square&labelColor=3A2E1C)` | `![#FBF1E0](https://img.shields.io/badge/%23FBF1E0-FBF1E0?style=flat-square&labelColor=3A2E1C)` | `![#3A2E1C](https://img.shields.io/badge/%233A2E1C-3A2E1C?style=flat-square&labelColor=F6E7CF)` | `![#8A5A14](https://img.shields.io/badge/%238A5A14-8A5A14?style=flat-square&labelColor=F6E7CF)` | `![#D9BF94](https://img.shields.io/badge/%23D9BF94-D9BF94?style=flat-square&labelColor=3A2E1C)` | **10.87 : 1** | **WCAG AAA** |
| **Forest** | Night Low-Light (21:00–05:59) | `![#1E2B23](https://img.shields.io/badge/%231E2B23-1E2B23?style=flat-square&labelColor=E2EBDD)` | `![#26362C](https://img.shields.io/badge/%2326362C-26362C?style=flat-square&labelColor=E2EBDD)` | `![#E2EBDD](https://img.shields.io/badge/%23E2EBDD-E2EBDD?style=flat-square&labelColor=1E2B23)` | `![#8FB996](https://img.shields.io/badge/%238FB996-8FB996?style=flat-square&labelColor=1E2B23)` | `![#3E5646](https://img.shields.io/badge/%233E5646-3E5646?style=flat-square&labelColor=E2EBDD)` | **12.04 : 1** | **WCAG AAA** |

> All palettes surpass standard WCAG AA contrast thresholds ($\ge 4.5:1$) and satisfy WCAG AAA enhanced contrast ($\ge 7.0:1$) for body text.

---

## ⚡ Core Capabilities

### 1. Zero Motion Engine
Injected globally at `document_start` across all web documents:
- Permanently suppresses CSS animations (`animation: none !important`).
- Strips transitions and micro-movements (`transition: none !important`).
- Halts marquee elements and smooth-scrolling disorientations (`scroll-behavior: auto !important`).

### 2. Video Freeze & Delayed Deliberate Reveal
- A mutation observer detects all `<video>` elements dynamically entering the DOM.
- Instantly pauses playback, sets volume to mute, and applies a calming grayscale filter (`filter: grayscale(100%) brightness(0.7)`).
- **Deliberate Reveal Mechanism:** Requires **2.0 seconds** of sustained pointer hover or keyboard focus before restoring full color. The video remains safely paused until the user explicitly clicks play.

### 3. Conservative Distraction Shield
- Targets and hides intrusive floating promo bars, newsletter popovers, and sticky ad units.
- Operates under a conservative safety heuristic to never break essential website functions, such as authentication forms or cookie consent dialogs.

### 4. Caregiver Profile Orchestration
- **Single Source of Truth (`shared/profile.js`):** Dependency-free UMD module shared between Next.js, Node.js, and the Chrome Extension runtime.
- **Portability:** Profiles encode into compact, URL-safe Base64 strings (`?p=...`) that caregivers can share via bookmark or message.
- **Auto-Clamping & Sanitization:** Bounds-checks every profile parameter (e.g. font scale clamped between `0.9` and `1.6`, reveal delay between `1000ms` and `4000ms`).

### 5. In-Tab Reader & Safe Serverless Reader API
- **In-Tab Reader Mode:** Extracted via `@mozilla/readability` and cleaned through `DOMPurify` to convert cluttered pages into single-column sanctuary reading.
- **SSRF-Protected Serverless API (`/api/reader`):** Pre-resolves remote DNS queries to block loopback addresses, cloud metadata endpoints, and internal network ranges before fetching.

---

## 🔍 What AuraGaze Does Not Do (Honest Claims)

> [!NOTE]
> AuraGaze is designed with complete transparency about its technical scope and intentional ergonomic boundaries:

- **No Real-Time Audio Isolation:** Separating spoken voices from ambient background tracks in mixed web audio requires heavy real-time machine learning models. Web Audio API filters only compress broad dynamic range.
- **No Webcam Eye Tracking:** Eye tracking through webcams is computationally heavy, inaccurate across lighting conditions, and introduces privacy concerns. Video reveals rely strictly on deliberate pointer hover or keyboard focus.
- **Article-Centric Extraction:** Reader view is optimized for editorial, journalistic, and long-form reading. Complex single-page web applications (e.g., spreadsheets, dashboards) remain in sensory-safe overlay mode.
- **Not a Clinical Medical Treatment:** AuraGaze provides ergonomic design accommodations and caregiver-adjustable tools, not a clinically certified medical therapy.

---

## 📂 Project Architecture

```
auragaze/
├── app/                          # Next.js App Router (TypeScript Strict)
│   ├── page.tsx                  # Landing & philosophy overview
│   ├── dashboard/page.tsx        # Interactive sensory profile tuner & Before/After split
│   ├── extension/page.tsx        # Extension install guide & bundle download
│   ├── api/reader/route.ts       # SSRF-protected serverless article extractor
│   └── globals.css               # Base Tailwind v4 styles & root palette CSS variables
├── components/                   # Reusable UI components
│   ├── ControlsPanel.tsx         # Sensory profile adjustment sliders & toggles
│   ├── BeforeAfter.tsx           # Side-by-side interactive comparison frame
│   ├── ReaderView.tsx            # Clean single-column reader renderer
│   ├── ProfileIO.tsx             # Profile import/export & shareable link generator
│   ├── ContrastBadge.tsx         # Live WCAG AA/AAA contrast calculator badge
│   └── TimeSlider.tsx            # Circadian clock scrubber for palette previews
├── extension/                    # Chrome Extension (Manifest V3)
│   ├── manifest.json             # MV3 extension configuration & permissions
│   ├── content.js                # Zero-motion engine, video freeze, & DOM sanitizer
│   ├── popup.html / popup.js     # Compact extension control panel
│   ├── popup.css                 # Sensory-friendly extension styling
│   ├── profile.js                # Profile engine (synced from shared/)
│   └── Readability.js            # Standalone Mozilla Readability bundle
├── shared/                       # Cross-platform core logic
│   ├── profile.js                # UMD profile module (Node, Next.js, Extension)
│   ├── profile.d.ts              # Full TypeScript definitions
│   └── profile.test.js           # Automated test suite (node:test)
├── public/                       # Static public assets
│   ├── fixtures/cluttered.html   # Intentionally hostile test page (ads, video, motion)
│   ├── demo/clip.mp4             # Self-contained test video loop
│   └── auragaze-extension.zip    # Pre-packaged Chrome extension release
└── scripts/                      # Developer tooling & test harnesses
    ├── ext-sync.mjs              # Syncs shared/profile.js into extension/
    ├── ext-zip.mjs               # Packages extension folder into zip bundle
    └── test-reader.mjs           # Automated SSRF security & extraction test suite
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js `v20.x` or higher
- npm `v10.x` or higher

### 1. Installation & Local Development

```bash
# Clone the repository
git clone https://github.com/sharmistha-pasg/AuraGaze.git
cd AuraGaze

# Install dependencies
npm install

# Run the profile test suite (7 automated tests)
npm run test:profile

# Start the Next.js development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to access the AuraGaze dashboard and interactive demo.

### 2. Testing the Reader API & SSRF Guard

In a separate terminal while the server is active:

```bash
# Run automated SSRF validation and live article extraction tests
npm run test:reader

# Or test against a deployed remote endpoint:
BASE_URL=https://your-deployment.vercel.app npm run test:reader
```

---

## 🧩 Loading the Chrome Extension

To install AuraGaze into Google Chrome or any Chromium-compatible browser (Edge, Brave, Arc):

```
 1. Download/Build Zip        2. Open Chrome Extensions        3. Enable Developer Mode        4. Click "Load unpacked"
 ┌──────────────────────┐     ┌───────────────────────┐        ┌───────────────────────┐       ┌───────────────────────┐
 │ npm run ext:zip      │ ──► │ chrome://extensions   │  ───►  │ Toggle top-right      │ ───►  │ Select 'extension'    │
 │ (or download .zip)   │     │ in address bar        │        │ Developer Mode switch │       │ directory             │
 └──────────────────────┘     └───────────────────────┘        └───────────────────────┘       └───────────────────────┘
```

1. **Obtain the extension:**
   - Either run `npm run ext:zip` locally to build `public/auragaze-extension.zip`, or use the uncompressed `extension/` folder directly.
2. **Open Extensions settings:**
   - Navigate to `chrome://extensions` in Google Chrome.
3. **Turn on Developer Mode:**
   - Toggle the switch in the top-right corner of the Extensions page.
4. **Load the extension:**
   - Click **Load unpacked** in the top-left toolbar.
   - Select the `extension` folder inside this project repository.
5. **Verify with test fixture:**
   - Open [public/fixtures/cluttered.html](public/fixtures/cluttered.html) (or run via `http://localhost:3000/fixtures/cluttered.html`).
   - Notice animations freeze immediately, autoplay media pauses in grayscale, and clicking the AuraGaze toolbar icon allows instant sensory tuning.

---

## 🔒 Security & Privacy Architecture

### SSRF Protection Matrix
The Reader API (`/api/reader`) performs strict multi-stage safety verification before initiating outbound HTTP requests:

| Security Check | Implementation Details | Target Blocked |
| :--- | :--- | :--- |
| **Protocol Restriction** | Validates URL scheme | Disallows `file://`, `ftp://`, `gopher://`, `javascript:` |
| **DNS Pinning** | `dns.promises.lookup` resolves destination IPv4/IPv6 | Prevents DNS rebinding and internal network scanning |
| **Loopback Block** | Rejects `127.0.0.0/8`, `::1` | Blocks `http://localhost`, `127.0.0.1`, `127.1` |
| **Private RFC1918 Block** | Rejects `10.0.0.0/8`, `172.16.0.0/12`, `192.168.0.0/16` | Blocks local router admin panels and internal microservices |
| **Cloud Metadata Block** | Rejects `169.254.169.254`, `fe80::/10` | Blocks AWS, GCP, and Azure cloud instance metadata services |
| **XSS Sanitization** | `DOMPurify` scrubs all parsed HTML nodes | Strips `<script>`, inline handlers, and unsanitized tags |

### Zero Telemetry & Privacy Commitment
- **Zero Remote Logging:** No user browsing history, URLs, or interaction metrics are collected, stored, or transmitted.
- **Client-Side Persistence:** Sensory preferences are stored locally in the browser (`chrome.storage.local` or `localStorage`) or serialized into shareable URL parameters.
- **Zero Third-Party Trackers:** No analytical scripts, advertising SDKs, or external trackers are bundled.

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
