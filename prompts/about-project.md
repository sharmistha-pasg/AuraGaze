# AuraGaze: Sensory-Safe Web Reading

One line: AuraGaze turns loud, cluttered web pages into calm, predictable reading, and lets a caregiver set the profile once.

Hackathon theme: solutions for specially abled people.
Team: solo.
Submission: 2:00 PM, Monday 12 October 2026.
Hosting: GitHub to Vercel. Each module below is built by Antigravity from a pasted prompt.

---

## The problem

Many autistic people and people with sensory processing sensitivity find parts of the everyday web painful or overwhelming: flickering banners, autoplay video, harsh white glare, crowded multi-column layouts, pop-ups that jump into view. Ordinary dark mode only swaps colors. It does not remove motion, clutter, or surprise.

## Who it is for

- Primary user: an autistic person or anyone with sensory sensitivity who reads online.
- Configurer: a parent, teacher, or support worker. Children rarely set up their own browser, so the caregiver builds a sensory profile once and it stays in place. This is the main difference from a plain reader mode.

## The product

Two parts that share one profile format:

1. Web dashboard (Next.js on Vercel). Paste a public article URL and see a calm reader view. Before/after toggle, caregiver profile editor, time-of-day preview, extension install page.
2. Chrome extension (Manifest V3). Applies the same profile to the live web: motion off, distraction hiding, hover-or-focus-to-reveal video freeze, warm tint, optional reader view.

## In scope

- Single-column reader view with a soft, steady border around the content.
- Calm palettes: sage, amber, forest. Palette can follow local time of day.
- Wide-spaced, highly legible type: Atkinson Hyperlegible, with adjustable size, letter spacing, line height, and line length.
- All animation off by default, always. Reduced motion is respected.
- Video freeze: videos pause and turn grayscale. A video is revealed after the pointer or keyboard focus stays on it for 2 seconds (adjustable 1 to 4 seconds). A revealed video stays paused until the user presses play.
- Distraction hiding with a conservative selector list (ads, newsletter pop-ups, tickers).
- Caregiver profile: presets, JSON export and import, share link.
- Contrast badge that shows the real contrast ratio for the current palette.

## Out of scope (do not build, do not promise)

- Real-time audio softening. Separating a voice or an alarm from other audio needs audio separation or ML. The Web Audio compressor only lowers loud peaks across the whole signal. Not feasible today.
- A pulsing "breathing border". Motion is a common trigger, and there is no strong evidence that a pulsing border regulates heart rate. The border is steady.
- Eye tracking. A browser cannot tell where someone is looking. Reveal uses 2 seconds of hover or keyboard focus. Say this plainly in the pitch.
- Reflowing every JavaScript-heavy site. Reader view works on article-style pages.
- Accounts, databases, analytics.

## Claims policy for the pitch

Say: "designed to reduce common sensory triggers", "follows WCAG contrast guidance", "palettes are starting points the caregiver can adjust".
Do not say: "treats", "prevents meltdowns", "clinically proven", "scientifically backed palette". The palettes are design choices, not validated therapy.

## Architecture

```
auragaze/
  app/                      Next.js App Router
    page.tsx                landing
    dashboard/page.tsx      dashboard
    extension/page.tsx      install steps
    api/reader/route.ts     fetch + Readability + sanitize
  components/               ControlsPanel, ReaderView, BeforeAfter, ProfileIO, TimeSlider, ContrastBadge, SourcePicker
  lib/                      hooks, error messages, sample fixture article
  shared/
    profile.js              UMD, dependency free, used by Next and the extension
    profile.d.ts
    profile.test.js         node:test
  public/
    fixtures/cluttered.html deliberately hostile demo page
    demo/clip.mp4           short test video
  extension/                Manifest V3 extension
    manifest.json, content.js, popup.html, popup.js, popup.css
    profile.js              copied from shared/ by script
    Readability.js          copied from node_modules by script
  scripts/                  ext-sync.mjs, ext-zip.mjs
  prompts/                  these md files
```

## Shared profile (one format everywhere)

```
{
  version: 1,
  name: "Maya's profile",
  palette: "auto" | "sage" | "amber" | "forest",
  font: "atkinson" | "lexend" | "system",
  fontScale: 1.0 to 1.6,
  letterSpacing: 0 to 0.12 (em),
  lineHeight: 1.5 to 2.2,
  maxWidthCh: 50 to 80,
  dimPercent: 0 to 30,
  warmTint: boolean,
  hideDistractions: boolean,
  videoFreeze: boolean,
  revealDelayMs: 1000 to 4000,
  steadyBorder: boolean
}
```

Motion is not a field. It is always off.
Presets: gentle (sage), lowLight (forest, dim 10), maxCalm (amber, larger text, wider spacing).
Auto palette by local hour: 06:00 to 16:59 sage, 17:00 to 20:59 amber, 21:00 to 05:59 forest.

## Palettes (starting values, the contrast test in module 02 must pass at 4.5:1 for text and accent)

| Name | bg | surface | text | accent | border |
|------|----|---------|------|--------|--------|
| sage | #EAF0E6 | #F3F7F0 | #26352A | #3F6445 | #A9BFA9 |
| amber | #F6E7CF | #FBF1E0 | #3A2E1C | #8A5A14 | #D9BF94 |
| forest | #1E2B23 | #26362C | #E2EBDD | #8FB996 | #3E5646 |

These ratios are hand estimates. The test script is the source of truth. If a pair fails, darken or lighten the accent until it passes.

## Global rules (every module prompt starts with "Follow the Global rules in about-project.md")

1. TypeScript strict for the Next.js app. Tailwind for styling. No UI libraries beyond what a module names.
2. Nothing animates or transitions. No spinners that spin: use static "Loading..." text.
3. Text contrast at least 4.5:1. Visible focus outline on every interactive element. Everything works by keyboard.
4. Do not edit files owned by earlier modules unless the prompt says so. If a fix in an earlier file is required, make the smallest change and say what changed.
5. Before saying a module is done: run `npm run build` (and tests if the module has them), fix errors, then list what was built and what was not.
6. One git commit per module with the message given in the module file.
7. No placeholder lorem ipsum in anything judges will see.

## Demo sites

- Primary: `/fixtures/cluttered.html` on the deployed site. Built by us, so every failure point is under control.
- Real-site proof: `https://en.wikipedia.org/wiki/Photosynthesis`. Fetchable, well structured, reuse-friendly. The API sends a descriptive User-Agent, which Wikimedia asks for.
- Safety demo: paste `http://169.254.169.254/` or `http://localhost:3000`. The API refuses it with a clear message. This shows the server is not an open proxy.
- Failure demo: any single-page-app homepage to show the "this page builds itself with JavaScript" message instead of a blank screen. Pick the URL during testing.
- Stress test only: one live news article, checked on the deployed site the morning of the demo. Leave it out of the pitch unless it works.

## Build order and time boxes (start 10:45, submit by 14:00)

| Module | Target done | Notes |
|--------|-------------|-------|
| 01 setup | 11:00 | repo, Next.js, scripts |
| 02 sensory profile | 11:15 | shared logic and tests |
| 03 fixture page | 11:35 | hostile page and clip |
| 04 dashboard | 12:15 | deploy to Vercel right after this |
| 05 reader API | 12:45 | live URLs |
| 06 extension | 13:25 | core by 13:00, video freeze and reader by 13:25 |
| 07 QA, deploy, demo | 13:25 to 13:50 | 10 minute buffer |

Hard rule: if the extension does not load and work on the fixture page by 13:15, freeze it and demo from the dashboard alone.

## Decisions log

- Web app plus extension, because Vercel cannot host an extension and judges need a link they can open.
- Steady border, not pulsing, because motion is a trigger.
- Hover or focus for 2 seconds, not gaze, because browsers have no gaze data.
- Hide list is heuristic. The fixture uses common ad class names on purpose, so say that it is a heuristic list and not an ad-blocker.
- Custom URLs go through our server. No database, nothing is stored by us, but say that the page is fetched server-side.

## Known risks

- jsdom on Vercel can be heavy. Fallback: linkedom.
- Some sites block server-side fetches or require JavaScript. The API returns clear error codes.
- Some video players re-autoplay. The extension re-pauses frozen videos on the play event.
- The fixture flashes. Keep it under 3 flashes per second (WCAG 2.3.1) so the demo itself is safe for judges.
