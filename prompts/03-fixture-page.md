# Module 03: Fixture page (the "before")

Time box: 20 minutes. Target done: 11:35.
Depends on: 01.
Context to paste first: about-project.md.

## Goal

A deliberately hostile static page at `/fixtures/cluttered.html` that looks like a bad real-world article page. It is the primary demo target for the dashboard and the extension. Plus a short test video.

## Prompt for Antigravity

```text
Follow the Global rules in about-project.md. This module is an exception to the "nothing animates" rule: the fixture page is intentionally hostile and animates on purpose, but it must stay safe (see the flash limit below).

Create public/fixtures/cluttered.html, a single self-contained static HTML file (inline CSS, tiny inline JS allowed, no external requests except /demo/clip.mp4). It must look like a noisy news site:

Layout and content:
- A harsh pure white and bright blue color scheme, small cramped text, a three-column grid: left sidebar, center article, right sidebar.
- A top banner with class "ad-banner" that pulses between two bright colors. HARD LIMIT: no element may flash or change brightness more than 2 times per second. Use a CSS animation with a duration of at least 1 second per cycle.
- Two sidebar ads with class names "ad-slot" and "advert-box", bright colors, with a slow shifting gradient.
- A scrolling ticker using a <marquee> element or a CSS animation, with class "ticker".
- A sticky pop-up with id "newsletter-popup" and class "newsletter-popup subscribe-modal" that appears 1.5 seconds after load, covers part of the article, and has a working "No thanks" button that hides it.
- An autoplay video: <video id="demo-video" autoplay muted loop playsinline src="/demo/clip.mp4"> placed inside the article between paragraphs.
- Two more distractions: a "Trending now" grid of six small colorful tiles, and an "Around the web" block of fake link cards. Use invented headlines. Do not use real brand names or logos.
- A small fixed label in the corner: "Demo page: intentionally cluttered".
- The center article: an ORIGINAL article of about 600 words with a headline, byline, date, an h2 or two, a blockquote, and one image. Topic: how honeybees keep a hive cool in summer. Write it yourself in clear plain English. Wrap it in <article> with a proper <h1>. Use a data URI or a simple inline SVG for the image so there is no external dependency.
- Make sure Mozilla Readability can find the article: use semantic <article>, <h1>, and <p> tags and keep the article text in one block.

Also create lib/sample-fixture.ts exporting a typed object { title, byline, siteName, contentHtml, textLength } that contains the SAME article (title, byline, and the paragraphs, headings, blockquote, and image from the fixture) as clean semantic HTML with no ads or scripts. The dashboard uses this in module 04 so it works without the API. Keep the text in sync with the fixture page.

Video: create public/demo/clip.mp4.
- If a file already exists at that path, do not overwrite it.
- Otherwise, if ffmpeg is installed, generate one with: ffmpeg -f lavfi -i testsrc=duration=10:size=640x360:rate=24 -pix_fmt yuv420p -movflags +faststart public/demo/clip.mp4
- If ffmpeg is not installed, create the page anyway, add a short README line in public/demo/README.txt saying "Drop a 10 second clip named clip.mp4 here (under 3 MB)", and tell me clearly that the video is missing.
Also make the page degrade gracefully if the video file is missing (no broken layout).

Verify by starting the dev server and fetching /fixtures/cluttered.html. Confirm the returned HTML contains the ids and classes listed above.
Commit with the message: "03 fixture: hostile demo page, sample article, test clip".
```

## Done when

- Opening `/fixtures/cluttered.html` feels uncomfortable in the intended way: clutter, pulsing banner, ticker, pop-up, autoplay video.
- No element flashes more than 2 times per second.
- `lib/sample-fixture.ts` exists and type-checks.
- `public/demo/clip.mp4` exists and is under 3 MB.

## Notes

- You can replace the generated test clip with your own 10 second recording. Keep it silent or short and under 3 MB.
- The class names (`ad-banner`, `ad-slot`, `advert-box`, `newsletter-popup`, `ticker`) are what the extension's hide list targets. Say in the pitch that the hide list is heuristic.
