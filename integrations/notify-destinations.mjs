import { readFile } from 'node:fs/promises';

/**
 * After a production build, rebuilds each live destination site whose feed changed.
 * Compares against the feed still live from the previous deploy, so unrelated
 * blog edits don't trigger rebuilds. Each site's hook URL comes from its hookEnv.
 * @param {{ site: string, destinations: readonly import('../src/utils/destinations').Destination[] }} options
 * @returns {import('astro').AstroIntegration}
 */
export default function notifyDestinations({ site, destinations }) {
  return {
    name: 'notify-destinations',
    hooks: {
      'astro:build:done': async ({ dir, logger }) => {
        if (process.env.VERCEL_ENV !== 'production') return;

        for (const { id, label, hookEnv, live } of destinations) {
          const hook = process.env[hookEnv];
          if (!live || !hook) continue;

          const feedPath = `feeds/${id}.json`;
          const next = await readFile(new URL(feedPath, dir), 'utf8');
          const current = await fetch(new URL(feedPath, site))
            .then((res) => (res.ok ? res.text() : ''))
            .catch(() => '');

          if (current === next) {
            logger.info(`${label} feed unchanged; site left alone.`);
            continue;
          }

          // A failed hook shouldn't fail the blog deploy; the site catches up on its next build.
          const res = await fetch(hook, { method: 'POST' }).catch((err) => err);
          if (res instanceof Response && res.ok) logger.info(`${label} feed changed; rebuild triggered.`);
          else logger.warn(`${label} deploy hook failed: ${res instanceof Response ? res.status : res}`);
        }
      },
    },
  };
}
