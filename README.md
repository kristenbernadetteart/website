# Art Portfolio (React + Vite + TinaCMS)

Everything on the site is editable: site settings (name, headline, intro,
contact, footer), pages (About and any others), and every painting (image,
title, year, medium, size, price, status, description, optional checkout link).

## Run locally

```fish
npm install
npm run dev
```

- Site: http://localhost:5173
- Editor: http://localhost:5173/admin/index.html

`npm run dev` starts Tina's local GraphQL server and Vite together, and
generates `tina/__generated__/` (the typed client the app imports) on first run.
Local edits write straight to the files in `content/` and `public/uploads/`.

## Content model

| Collection | Files | Used for |
| --- | --- | --- |
| Site settings | `content/settings/site.json` | Name, home headline/intro, email, Instagram, footer |
| Pages | `content/pages/*.mdx` | `/about`, or any new page at `/<filename>` |
| Paintings | `content/paintings/*.md` | Gallery cards and `/work/<filename>` detail pages |

Painting status is `available`, `reserved`, or `sold`. The first painting with
"Feature on home page" checked appears in the hero. Add a Stripe Payment Link
(or similar) in a painting's "Checkout link" field to show a Buy now button;
every available painting also has an email inquiry button.

## Deploy

1. Push the repo to GitHub (commit `tina/tina-lock.json` after the first run).
2. Create a project at https://app.tina.io, connect the repo, and add your
   site's production URL under the project's allowed sites.
3. On your host (Cloudflare Pages, Netlify, Vercel...), set:
   - Build command: `npm run build`
   - Output directory: `dist`
   - Environment variables: `TINA_PUBLIC_CLIENT_ID`, `TINA_TOKEN`
     (see `.env.example`; the token is the read-only token from Tina Cloud)
4. Editors then sign in at `https://your-site/admin/index.html`. Saves commit
   to your GitHub branch.

`public/_redirects` provides the single-page-app fallback for Netlify and
Cloudflare Pages. On Vercel, add a rewrite of `/(.*)` to `/index.html`.

## Notes

- Pages load content from Tina at runtime (client-side), so the site is not
  pre-rendered. Good enough for a portfolio; if search-engine previews matter
  later, pre-rendering is the next step.
- Placeholder paintings in `public/uploads/` are generated SVGs. Replace them
  by uploading real photos through the editor's media manager.
- Colors, type scale, and spacing are tokens at the top of
  `src/styles/index.css`.
