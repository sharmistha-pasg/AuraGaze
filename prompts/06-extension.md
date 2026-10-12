# Module 06: Chrome extension

Time box: 45 minutes. Target: core working by 13:00, video freeze and reader view by 13:25.
Depends on: 01, 02, 03 (and 04 for the install page).
Context to paste first: about-project.md.

Hard rule: if the extension is not loading and working on `/fixtures/cluttered.html` by 13:15, stop and demo from the dashboard alone.

Build in two steps. Paste 06a, check it in Chrome, then paste 06b.

## 06a: Core (target 13:00)

### Prompt for Antigravity

```text
Follow the Global rules in about-project.md.

Build a Manifest V3 Chrome extension in extension/ in plain JavaScript (no bundler).

manifest.json:
- manifest_version 3, name "AuraGaze", version "1.0.0", description "A sensory-safe way to read the web."
- permissions: ["storage", "activeTab"]
- action with default_popup "popup.html"
- content_scripts: matches ["<all_urls>"], js ["profile.js", "content.js"], run_at "document_start", all_frames true, match_about_blank true
- No icons are required. Skip them.

Shared code: scripts/ext-sync.mjs (replace the stub) copies shared/profile.js to extension/profile.js and node_modules/@mozilla/readability/Readability.js to extension/Readability.js. Add the Readability.js copy to the manifest content_scripts js list before content.js only in 06b. Run npm run ext:sync.

Storage: chrome.storage.sync keys "aura.profile" (a profile object) and "aura.enabled" (boolean, default true). Always pass stored profiles through AuraProfile.validateProfile.

content.js (runs in every frame):
1. Read profile and enabled flag from chrome.storage.sync. If disabled, do nothing and remove anything previously added.
2. Inject one <style id="aura-style"> into document.documentElement containing:
   - the overlay CSS from AuraProfile.buildOverlayCss(profile, new Date().getHours())
   - a motion kill rule: *, *::before, *::after { animation: none !important; transition: none !important; scroll-behavior: auto !important; } and marquee { display: none !important; }
   - when profile.hideDistractions is true, display none for this CONSERVATIVE selector list: [id^="ad-"], [class^="ad-"], [class*=" ad-"], [class*="advert" i], [id*="advert" i], [class*="ad-slot" i], [class*="ad-banner" i], ins.adsbygoogle, iframe[src*="doubleclick"], iframe[src*="googlesyndication"], #newsletter-popup, [class*="newsletter-popup" i], [class*="subscribe-modal" i], .ticker. Do not hide cookie or consent dialogs and do not hide generic modals or role="dialog", because that can block real sign-in or consent flows.
3. Create the overlay elements aura-tint and aura-dim as divs appended to document.documentElement when needed (top frame only, to avoid double tinting in iframes).
4. React live to chrome.storage.onChanged: re-apply or remove everything without needing a page reload.
5. Re-evaluate the time-of-day palette when the tab becomes visible again (visibilitychange). No timers.
6. Never throw: wrap in try/catch. A bug here must not break the host page.

popup.html, popup.css, popup.js (360px wide, same sage palette, no animation, labeled controls, keyboard friendly):
- Master toggle "AuraGaze is on/off".
- Preset buttons (Gentle, Low light, Max calm), palette select, text size slider, dimming slider, checkboxes for warm tint, hide distractions, freeze videos, plus reveal delay slider.
- "Import profile from dashboard": an input that accepts a share link or encoded string, decoded with AuraProfile.decodeProfile.
- Save to chrome.storage.sync on every change.
- Small text at the bottom: "Reveal uses hover or keyboard focus for the set delay. AuraGaze cannot detect where you are looking."

Run npm run ext:sync. Then give me exact steps to load the extension unpacked in Chrome (chrome://extensions, Developer mode, Load unpacked, choose the extension folder). Commit with the message: "06a extension: manifest, content styles, popup".
```

### Check in Chrome before continuing

- Load unpacked. Open `/fixtures/cluttered.html` on the deployed site and on localhost.
- Toggle on: banner, ads, ticker, pop-up are hidden, motion stops, tint appears.
- Toggle off: page returns to normal without a reload.
- Open Wikipedia: nothing breaks.

## 06b: Video freeze and reader view (target 13:25)

### Prompt for Antigravity

```text
Follow the Global rules in about-project.md. Extend the extension from 06a. Do not rewrite the files from scratch.

Video freeze (in content.js, runs in all frames, including embedded player frames, since content scripts run in iframes too):
1. When profile.videoFreeze is true, find every <video> (on load and via a debounced MutationObserver for videos added later). For each: call pause(), set autoplay to false, remove the autoplay attribute, set muted to true, add class "aura-frozen", and set data-aura-frozen="1".
2. CSS for .aura-frozen: filter grayscale(1) brightness(0.85). Add a 3px dashed outline in the accent color while a reveal is pending.
3. Reveal: on pointerenter and on focus, start a timer for profile.revealDelayMs. On pointerleave and blur, cancel it. If the timer completes, remove the aura-frozen class, set data-aura-revealed="1", and leave the video PAUSED. The user then presses play. A revealed video stays revealed until the page reloads.
4. Make frozen videos keyboard reachable (set tabindex="0" if not focusable) and add an aria-label "Video paused for sensory safety. Hold hover or focus for N seconds to reveal."
5. Add a play event listener (capture phase) that immediately pauses any video that is frozen and not revealed, so players that re-autoplay stay stopped.
6. If videoFreeze is turned off, undo everything above (remove classes, listeners, tabindex, aria-label) without a reload.
7. Show a small fixed hint near the pointer while the reveal timer is running: static text "Keep hovering to reveal", no animation.

Reader view (top frame only):
1. Add Readability.js to the manifest content_scripts js list before content.js. Run npm run ext:sync.
2. In popup.html add a button "Reader view". It sends { type: "aura-reader-toggle" } to the active tab via chrome.tabs.sendMessage. Handle the case where the content script is not reachable with a short message in the popup.
3. In content.js on that message: clone the document, run new Readability(clone).parse(). If null or too short, show a small dismissible notice "No article found on this page". Otherwise: parse article.content with DOMParser, remove script, style, iframe, object, embed, form, and every on* attribute and style attribute, replace video and audio with a static "Video removed for sensory safety." note, then replace document.body contents with a container div.aura-reader holding h1 title, byline, and the cleaned content. Inject AuraProfile.buildReaderCss(profile, hour, ".aura-reader") and set body background to the palette bg. Keep the original body nodes in memory.
4. Add a button at the top of the reader "Show original page" that restores the original body. The popup button toggles the same way.

Create scripts/ext-zip.mjs (replace the stub) that runs the sync, then zips the extension/ folder (adm-zip) into public/auragaze-extension.zip, excluding any source maps or hidden files. Run npm run ext:zip.

Build the real app/extension/page.tsx: what the extension does, a download link to /auragaze-extension.zip, and numbered install steps (unzip, open chrome://extensions, turn on Developer mode, Load unpacked, choose the unzipped folder, pin the icon). Add a "Known limits" list: works best on article pages, some sites with custom players may re-autoplay, reveal uses hover or focus not gaze, hide list is heuristic.

Run npm run build. Commit with the message: "06b extension: video freeze, reader view, install page, zip".
```

## Done when

- On the fixture page the video starts frozen in grayscale. Hovering for 2 seconds reveals color and keeps it paused. Moving away early cancels.
- Tab to the video, wait 2 seconds, it reveals.
- Reader view works on the fixture and on Wikipedia, and "Show original page" restores the page.
- The extension zip downloads from the deployed site and loads unpacked.

## Test one embedded player

Open any page with an embedded YouTube video. Content scripts run inside embedded frames when all_frames is on, so it can work, but custom players are less predictable. If it works, mention it. If it does not, do not demo it and list it under known limits.
