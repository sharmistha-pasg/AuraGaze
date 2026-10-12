# Module 01: Project setup

Time box: 15 minutes. Target done: 11:00.
Depends on: nothing.
Context to paste first: about-project.md.

## Goal

A deployable Next.js skeleton with the folder layout, scripts, and calm base styling, committed to the existing GitHub repo.

## Prompt for Antigravity

```text
Follow the Global rules in about-project.md.

Set up the AuraGaze project in the existing git repository.

1. Create a Next.js app (App Router, TypeScript strict, Tailwind CSS, ESLint) in the repository root. Use the latest stable Next.js. Do not create a nested folder.
2. Create this structure with empty or minimal placeholder files where needed: app/, components/, lib/, shared/, public/fixtures/, public/demo/, extension/, scripts/, prompts/. Move the module md files into prompts/ if they are in the root.
3. Install dependencies: @mozilla/readability, jsdom, dompurify, @types/jsdom, adm-zip. Do not install anything else without telling me.
4. Fonts: load Atkinson Hyperlegible and Lexend with next/font/google. Expose them as CSS variables --font-atkinson and --font-lexend.
5. Global styles: base the whole site on the sage palette from about-project.md using CSS variables --ag-bg, --ag-surface, --ag-text, --ag-accent, --ag-border. Add a global rule that sets animation: none and transition: none on everything, and scroll-behavior: auto. Add a visible focus outline (3px solid var(--ag-accent), 2px offset) for :focus-visible.
6. Create a root layout with a skip-to-content link, lang="en", the title "AuraGaze", and a meta description: "A sensory-safe way to read the web."
7. Create placeholder pages: app/page.tsx (landing, just a heading and one sentence), app/dashboard/page.tsx ("Dashboard coming in module 04"), app/extension/page.tsx ("Extension install page coming in module 06").
8. In package.json add scripts: "test:profile": "node --test shared/", "ext:sync": "node scripts/ext-sync.mjs", "ext:zip": "node scripts/ext-zip.mjs". Create the two script files as stubs that print "not implemented yet" and exit 0.
9. Add a .gitignore entry for node_modules, .next, and public/auragaze-extension.zip is NOT ignored (we want it committed).
10. Run npm run build. Fix errors.
11. Commit with the message: "01 setup: Next.js skeleton, scripts, calm base styles".
```

## Done when

- `npm run build` passes.
- `npm run dev` shows the landing page with sage background and no motion.
- The folder layout matches about-project.md.
- Tab key shows the skip link first.

## If stuck

If font loading fails offline, fall back to a system font stack and move on. Do not spend more than 5 minutes here.
