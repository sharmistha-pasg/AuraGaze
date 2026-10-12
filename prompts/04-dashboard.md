# Module 04: Dashboard

Time box: 40 minutes. Target done: 12:15, then deploy to Vercel immediately.
Depends on: 01, 02, 03.
Context to paste first: about-project.md.

## Goal

A calm, accessible dashboard where a judge or caregiver can pick a source, flip between the original and the reader view, tune a sensory profile, preview time-of-day palettes, and export or share the profile. Works fully on the fixture without the API. Live URLs plug in during module 05.

## Prompt for Antigravity

```text
Follow the Global rules in about-project.md. The dashboard itself must be calm: sage palette, no animation, large readable text.

Build these pages and components using the shared profile from shared/profile.js (module 02). Do not duplicate palette or CSS-building logic.

Landing page (app/page.tsx):
- Short hero: "AuraGaze" and the line "A sensory-safe way to read the web."
- Three short columns: The problem (flicker, autoplay, glare, clutter), What AuraGaze does (calm reader, video freeze, caregiver profile), What it does not do (no audio processing yet, no eye tracking, works best on article pages, not clinically validated).
- Two buttons: "Open the dashboard" and "Get the extension". Plain links with strong focus outlines.

Dashboard (app/dashboard/page.tsx), two-column layout on desktop, stacked on phones:

Left: controls panel (components/ControlsPanel.tsx)
- Preset buttons: Gentle, Low light, Max calm.
- Palette select: Auto (by time), Sage, Amber, Forest.
- Font select: Atkinson Hyperlegible, Lexend, System.
- Sliders with labels and live value text: text size, letter spacing, line height, line length, dimming.
- Checkboxes: warm tint, hide distractions, freeze videos, steady border. Slider: reveal delay (1 to 4 seconds).
- A line of text: "Motion is always off."
- Contrast badge (components/ContrastBadge.tsx): shows the contrast ratio of text on background and accent on background for the current palette using contrastRatio, with a text label "Passes WCAG AA" or "Below WCAG AA".
- Time-of-day slider (components/TimeSlider.tsx): 0 to 23 hours. When profile.palette is auto, it changes which palette the preview shows. Show the current simulated hour and palette name as text. Include a "Use my local time" button.

Right: preview (components/BeforeAfter.tsx)
- Source picker (components/SourcePicker.tsx): "Demo page" (default), "Wikipedia: Photosynthesis", "Paste a URL" with a text input and a Load button.
- A single toggle button group with two options: "Original" and "Calm view". Use proper aria-pressed. Default to Calm view. Also support the keyboard shortcut Alt+B to flip.
- Original: an iframe of the source (/fixtures/cluttered.html for the demo page, sandboxed with sandbox="allow-scripts allow-same-origin"). For other sources, try an iframe and show a clear note below it: "Some sites block embedding. If the frame is empty, the site does not allow it." Add title attributes for accessibility.
- Calm view: components/ReaderView.tsx renders { title, byline, contentHtml } inside a div with class "aura-reader". Inject the CSS from AuraProfile.buildReaderCss(profile, hour, ".aura-reader") into a <style> tag. For the demo page use lib/sample-fixture.ts. For Wikipedia and pasted URLs call GET /api/reader?url=... through a hook in lib/useReader.ts with states: idle, loading ("Loading..." plain text), success, error. Until module 05 exists, a 404 is expected: show the friendly error then.
- Error code to friendly message map in lib/errors.ts: INVALID_URL "That does not look like a web address.", BLOCKED_HOST "For safety, AuraGaze will not fetch local or private addresses.", UPSTREAM_ERROR "That site refused the request or returned an error.", NOT_HTML "That link is not a web page.", EMPTY_CONTENT "This page builds itself with JavaScript, so there is no article text to extract.", TOO_LARGE "That page is too large to process.", TIMEOUT "The site took too long to respond.", and a default "Something went wrong. Try the demo page." Errors render in a visible box with role="alert".
- Videos are replaced in reader output by a static placeholder, so there is nothing to freeze in the reader view.

Caregiver profile (components/ProfileIO.tsx), under the controls:
- Profile name input.
- "Download profile (.json)" button.
- "Copy share link" button. The link is the current origin + /dashboard?p= + encodeProfile(profile). Confirm with an aria-live text "Link copied" (no animation).
- "Import profile" textarea plus an Apply button that accepts either JSON or a share link or a bare encoded string, validates via validateProfile or decodeProfile, and shows a clear error if it cannot read it.
- On load: read ?p= from the URL, else localStorage key "aura.profile". Save to localStorage on every change. Wrap all localStorage use in try/catch.

Accessibility requirements:
- Every control has a visible label, a skip link works, headings are in order, focus is always visible, regions have landmarks, status text uses aria-live="polite".
- Test with the keyboard only: you must be able to do everything without a mouse.

Extension page (app/extension/page.tsx): leave the placeholder from module 01. It is finished in module 06.

Run npm run build and fix errors. Start the dev server and check /, /dashboard, and /dashboard?p=<encoded profile> manually or with a script.
Commit with the message: "04 dashboard: controls, before/after, profile io, time preview".
```

## After this module: deploy

1. Push to GitHub.
2. In Vercel, import the repo. Framework: Next.js. No environment variables needed.
3. Open the deployed URL and check `/dashboard` and `/fixtures/cluttered.html` on it. Deployment is where things break, so do this now and not at 13:30.

## Done when

- Demo page: Original shows the cluttered iframe, Calm view shows the clean article in the chosen palette.
- Dragging the time slider with palette Auto changes sage, amber, and forest at the right hours.
- Contrast badge shows a pass for all three palettes.
- Export, share link, and import round-trip a profile.
- Keyboard-only walkthrough works.
- Deployed on Vercel.
