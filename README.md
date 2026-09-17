# Bridgeland Builders

Marketing website for Bridgeland Builders, a home renovation and construction company. Built as a statically pre-rendered React site with server-side rendering for SEO, an auto-generated blog, and a dynamically built sitemap.

## Features

- **React 18 + React Router 7** single-page app, pre-rendered at build time for fast first paint and full SEO crawlability.
- **Blog data pipeline** (`scripts/build-blog-data.mjs`) that generates the blog's content/index files as part of the build.
- **SEO file generation** (`scripts/build-seo-files.mjs`) for sitemap and related SEO assets.
- **Server-side rendering** via a dedicated SSR entry point (`src/entry-server.jsx`), built separately from the client bundle.
- **Prerendering** (`scripts/prerender.mjs`) that walks the routes in `prerender-routes.json` and outputs static HTML for each page.
- **SEO audit script** (`scripts/audit-seo.mjs`) for checking the generated site.

## Tech Stack

- React 18, React Router 7
- Vite 5
- Node scripts for blog data, SEO files, and prerendering

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the Vite dev server |
| `npm run build` | Full production build: blog data → SEO files → client build → SSR build → prerender |
| `npm run preview` | Preview the production build locally |
| `npm run seo` | Regenerate SEO files only |
| `npm run blog:data` | Regenerate blog data only |
| `npm run prerender` | Run the prerender step only |
| `npm run audit` | Run the SEO audit script |
| `npm run build:ssr` | Build the SSR entry point only |

## Deployment

Deployed via Vercel (see `vercel.json`).

