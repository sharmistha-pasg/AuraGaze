# Module 07: QA, deploy, and demo

Time box: 25 minutes plus a 10 minute buffer. Window: 13:25 to 13:50. Submit by 14:00.
Depends on: everything that shipped.

## 1. Deploy checklist

- [ ] Latest commit is pushed to GitHub and the Vercel deployment shows Ready.
- [ ] The Vercel URL opens `/`, `/dashboard`, `/extension`, `/fixtures/cluttered.html`.
- [ ] `public/auragaze-extension.zip` is committed and downloads from the deployed site.
- [ ] Hit `/api/reader?url=https://en.wikipedia.org/wiki/Photosynthesis` once to warm the function. The first call after idle is slow.
- [ ] README at the repo root: one paragraph, the live URL, how to load the extension, the "What it does not do" list.

## 2. Test commands (copy and run)

```bash
npm run test:profile
npm run build
npm run dev
# in a second terminal:
npm run test:reader
# against the deployed site:
BASE_URL=https://YOUR-APP.vercel.app node scripts/test-reader.mjs
```

Manual API checks (replace the host):

```bash
curl -s "https://YOUR-APP.vercel.app/api/reader" 
curl -s "https://YOUR-APP.vercel.app/api/reader?url=ftp://example.com"
curl -s "https://YOUR-APP.vercel.app/api/reader?url=http://169.254.169.254/"
curl -s "https://YOUR-APP.vercel.app/api/reader?url=http://localhost:3000"
curl -s "https://YOUR-APP.vercel.app/api/reader?url=https://en.wikipedia.org/wiki/Photosynthesis" | head -c 400
```

Expected results:

| Request | Status | Code |
|---------|--------|------|
| no url | 400 | INVALID_URL |
| ftp scheme | 400 | INVALID_URL |
| 169.254.169.254 | 400 | BLOCKED_HOST |
| localhost | 400 | BLOCKED_HOST |
| Wikipedia article | 200 | ok true |
| a PDF or image URL | 415 | NOT_HTML |
| single-page-app homepage | 422 | EMPTY_CONTENT |

## 3. Test matrix (run on the deployed URL, not only localhost)

| Area | Test | Pass when |
|------|------|-----------|
| Dashboard | Demo page, Original then Calm view | Clean single column, steady border, chosen palette |
| Dashboard | Wikipedia, Calm view | Article text and images, no scripts, no video |
| Dashboard | Paste a bad URL, a blocked URL, a JS-only URL | Calm error message in a box, never a blank screen |
| Profile | Export, change settings, import | Settings restored exactly |
| Profile | Share link opened in a private window | Same settings load |
| Time | Drag the time slider with palette Auto | Sage by day, amber evening, forest night |
| Contrast | Contrast badge on all three palettes | Passes AA. Cross-check one pair with an outside contrast checker |
| Motion | Dashboard and reader view | Nothing animates. Turn on the OS reduce-motion setting and confirm the same |
| Keyboard | Do the full dashboard flow with Tab, Space, Enter only | Everything reachable, focus always visible |
| Accessibility | Run Lighthouse accessibility and the axe browser extension on `/dashboard` | Fix every serious or critical issue. Report the real score, do not quote a target |
| Mobile | Dashboard at 375px wide (browser dev tools) | No horizontal scroll, controls usable |
| Extension | Fixture page, toggle on and off | Hides banner, ads, ticker, pop-up. Returns to normal when off |
| Extension | Video freeze | Frozen grayscale, 2 second hover reveals, stays paused, early leave cancels |
| Extension | Keyboard focus reveal | Reveals after the delay |
| Extension | Reader view on fixture and Wikipedia, then Show original | Works both ways |
| Extension | A site you rely on, such as your college site or a search page | Nothing broken. If it breaks, note it as a known limit |
| Extension | One embedded YouTube page | Works or is listed as a known limit |
| Safety | Flash rate on the fixture | No element flashes more than 2 times per second |

## 4. Demo day setup

- Chrome profile with the extension already loaded unpacked, and the extension pinned.
- Tabs opened in order: dashboard, fixture page, Wikipedia article, the install page.
- A 30 second screen recording of the full flow, saved locally and open in a tab, in case Wi-Fi or the live demo fails.
- Screenshots of before and after as a second fallback.
- Phone hotspot ready. Laptop charged.
- Warm the API with one Wikipedia request five minutes before judging.
- Warn the judges before showing the cluttered page: "This page is intentionally harsh and animates." Then show the extension calming it.

## 5. Three-minute pitch script

| Time | What you do | What you say (adapt in your own words) |
|------|-------------|----------------------------------------|
| 0:00 to 0:30 | Show the cluttered page | "For many autistic people, pages like this are physically overwhelming: flicker, autoplay, glare, clutter. Dark mode does not fix that." |
| 0:30 to 1:15 | Dashboard, flip Original to Calm view | "AuraGaze turns the same page into a single calm column. No motion, steady border, soft palette, wide-spaced readable type." |
| 1:15 to 1:55 | Extension on the live page, then the video | "The extension applies the same profile to the real web. Videos freeze in grayscale and only reveal after two seconds of hover or focus, so nothing surprises you." |
| 1:55 to 2:25 | Profile, share link, time slider | "Children rarely set up their own browser, so a caregiver builds a profile once and shares it. Colors shift with the time of day." |
| 2:25 to 2:50 | Safety and honesty | "We cannot detect gaze, so reveal uses hover or focus. We block private addresses on the server. This is a design for fewer triggers, not a clinical claim." |
| 2:50 to 3:00 | Next steps | "Next: test with autistic users and occupational therapists, and research real audio softening." |

## 6. Likely judge questions

- "How is this different from Reader View?" Reader View removes clutter. AuraGaze adds a sensory profile: no motion, video freeze with a delayed reveal, caregiver-configurable and shareable settings, and time-aware palettes.
- "Does it work on every site?" No. It works best on article pages. Single-page apps and some custom players are limits. It shows a clear message instead of failing silently.
- "Is it clinically validated?" No. The palettes and delay are starting points the caregiver adjusts. The next step is user testing.
- "What about privacy?" The extension runs locally. The dashboard fetches pages server-side for the reader view and stores nothing: no database, no accounts. Profiles live in the browser or in the share link.
- "Why not eye tracking or audio softening?" Browsers have no gaze data, and softening one sound inside mixed audio needs ML. Both are on the roadmap, not claimed.

## 7. Cut list if time runs short (cut in this order)

1. Extension reader view (keep the dashboard reader).
2. Extension popup import field.
3. Dashboard keyboard shortcut and share link.
4. The extension itself. Demo from the dashboard only.

Never cut: the fixture page, the dashboard Calm view, the deploy, the fallback recording.
