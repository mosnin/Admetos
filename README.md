# Admetos

Light adaptation of the supplied P Wilms website. The original motion implementations remain in `src/vendor/`; light colors and page composition are handled in `src/styles/site.css`. The Google Doc accordion is integrated on the research overview.

## Run

- `npm ci`
- `npm run dev`
- `npm run build`

`scripts/build-pages.py` generates static pages from the ecosystem data and articles. Vite packages the generated routes.

## Publish articles and updates

Create a JSON file in `content/articles/`, following either existing draft. Required fields: `slug`, `title`, `excerpt`, `date` (YYYY-MM-DD), `author`, `category`, `status`, and `sections` (each with a `heading` and `paragraphs`). Categories: Company, Research, Product updates, Engineering. Keep `status: "draft"` until ready. Set `status: "published"` to include the article in the news index, homepage, RSS, sitemap, and its own route on the next build/deploy. The included drafts are unpublished editorial working copy, not historical announcements.

Update `content/products.json` and `content/systems.json` to maintain the ecosystem. Product identity assets are in `public/brand`.

## Deployment

Existing GitHub repository: `mosnin/Admetos`, production branch `codex/admetos-pwilms`.
Existing Vercel project: `admetos` (`prj_ItZbkeJvDilLZYjLU3TPMqiHRkZr`).
Vercel URL: https://admetos.vercel.app

The custom domain is distinct from this Vercel deployment. Verify DNS and domain assignment before claiming the new site is live at admetos.org.

## Sources

See `references/design-provenance.md` for layout research, component mapping, and content recovery. The paid source library is retained locally under `references/effects` and is not published as an unused source archive.
