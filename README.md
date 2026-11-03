# timrusch.pages.dev

Personal portfolio of Tim Rusch, Business AI student at FHNW. Static site built with Astro, deployed to
Cloudflare Pages.

## Develop

```bash
npm install
npm run dev        # http://localhost:4321
npm run verify     # tests, type check, CV check, build, content checks
npm run preview
```

Projects live in `src/content/projects/` as one Markdown file each. See `CLAUDE.md` for the full
workflow and content rules.

## Deploy

```bash
npx wrangler login   # once
npm run publish      # verify, then upload dist/ to the Cloudflare Pages project "timrusch"
```

## Rights

The code structure may be read for reference. The content (texts, portrait photo, CV, diagrams) is not
licensed for reuse.
