import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

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

export default defineConfig(({ mode }) => ({
  plugins: [react(), localApiFunctions(loadEnv(mode, process.cwd(), ''))],
}));
