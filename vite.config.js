import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { PIXEL_PRIORITY_PATHS, gaMeasurementId } from './src/data/analyticsConfig.js';
import { publishedCaseStudies } from './src/data/caseStudyData.js';
import { hasEnabledGuarantees } from './src/data/guarantees.js';

/**
 * Writes the measurement settings from src/data/analyticsConfig.js into the
 * inline loader in index.html (dev and build), so the GA4 id lives in one
 * place and the Privacy Policy, which reads the same file, always matches.
 * Only a well-formed "G-…" id is written; anything else stays null (GA off).
 */
function measurementSettings() {
  const replace = (html, marker, value) => {
    const re = new RegExp(`(?:null|"[^"\\n]*"|\\[[^\\]\\n]*\\]) /\\* ${marker} \\*/`);
    if (!re.test(html)) throw new Error(`index.html: measurement marker "${marker}" not found`);
    return html.replace(re, () => `${JSON.stringify(value)} /* ${marker} */`);
  };
  return {
    name: 'measurement-settings',
    transformIndexHtml(html) {
      let out = replace(html, 'ga4-id', gaMeasurementId());
      out = replace(out, 'pixel-priority-paths', PIXEL_PRIORITY_PATHS.filter((p) => /^\/[a-z0-9/-]*$/.test(p)));
      return out;
    },
  };
}

/**
 * Serves the functions in /api (deployed as Vercel functions) from the local
 * dev server, so the /free-quote form works end to end with `npm run dev`.
 *
 * With GHL_API_TOKEN in .env.local, requests go to the real GoHighLevel
 * account — test leads and bookings will show up there. Without it the
 * functions run in mock mode: fake calendar slots, nothing sent anywhere.
 */
function localApiFunctions(env) {
  return {
    name: 'local-api-functions',
    apply: 'serve',
    configureServer(server) {
      for (const key of ['GHL_API_TOKEN', 'GHL_LOCATION_ID', 'GHL_CALENDAR_ID']) {
        if (env[key]) process.env[key] = env[key];
      }
      // Set explicitly both ways: Vite restarts inside the same process when the
      // config changes, so a flag left over from a token-less start would stick.
      if (process.env.GHL_API_TOKEN) {
        delete process.env.BOOKING_MOCK;
        server.config.logger.info('  booking API: LIVE GoHighLevel — test submissions create real contacts and bookings');
      } else {
        process.env.BOOKING_MOCK = '1';
        server.config.logger.info('  booking API: mock mode (no GHL_API_TOKEN in .env.local)');
      }

      server.middlewares.use('/api', async (req, res, next) => {
        const name = req.url.split('?')[0].replace(/^\/+|\/+$/g, '');
        if (!/^[a-z-]+(\/[a-z-]+)*$/.test(name) || !existsSync(resolve('api', `${name}.js`))) return next();
        try {
          const handler = (await server.ssrLoadModule(`/api/${name}.js`)).default;
          await handler(req, res);
        } catch (error) {
          server.config.logger.error(`[api/${name}] ${error.stack || error}`);
          if (!res.headersSent) {
            res.statusCode = 500;
            res.end('{"error":"server_error"}');
          }
        }
      });
    },
  };
}

export default defineConfig(({ mode, isSsrBuild }) => ({
  plugins: [react(), measurementSettings(), localApiFunctions(loadEnv(mode, process.cwd(), ''))],
  define: {
    // Whether /projects has a published case study of our own work yet
    // (src/data/caseStudyData.js). The footer and /services call the page
    // "Our projects" only then, "Design ideas" before. A build-time constant,
    // so the footer (entry chunk) never imports the case-study data. The client
    // and SSR builds read the same value; restart the dev server after
    // publishing a case study.
    __HAS_CASE_STUDIES__: JSON.stringify(publishedCaseStudies().length > 0),
    // Whether the owner has switched on a named guarantee
    // (src/data/guarantees.js). While false the pages leave the section out,
    // so no page downloads the guarantee text. Restart the dev server after
    // switching one on.
    __HAS_GUARANTEES__: JSON.stringify(hasEnabledGuarantees()),
  },
  build: {
    // Client build only: scripts/prerender.mjs reads dist/.vite/manifest.json
    // to add <link rel="modulepreload"> for each route's page chunk, then moves
    // it out of dist/ so it is never served.
    manifest: !isSsrBuild,
  },
}));
