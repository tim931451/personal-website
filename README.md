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

## Open TODOs

- [ ] Restaurant order forecast: add team size and Tim's own part, then remove `draft: true`.
- [ ] Ad campaign success prediction: add Tim's own part, then remove `draft: true`.
- [ ] Swiss Legal Agent: after the submission on 23 November 2026, add the repo link if the repository becomes public.
- [ ] Custom domain: change `SITE` in `astro.config.mjs` and add the domain to the Cloudflare Pages project `timrusch`.
- [ ] Footer year: redeploy after 1 January 2027 so the footer shows the new year.
- [ ] Cloudflare account: switch the account e-mail from the FHNW student address to a private address before the end of studies.
