import { readFile } from 'node:fs/promises';

const FEED_PATH = 'feeds/map-and-app-development.json';

/**
 * After a production build, rebuilds alexhordal.ca if the dev-post feed changed.
 * Compares against the feed still live from the previous deploy, so unrelated
 * blog edits don't trigger portfolio builds. Needs PORTFOLIO_DEPLOY_HOOK_URL.
 * @param {{ site: string }} options
 * @returns {import('astro').AstroIntegration}
 */
export default function notifyPortfolio({ site }) {
  return {
    name: 'notify-portfolio',
    hooks: {
      'astro:build:done': async ({ dir, logger }) => {
        const hook = process.env.PORTFOLIO_DEPLOY_HOOK_URL;
        if (process.env.VERCEL_ENV !== 'production' || !hook) return;

        const next = await readFile(new URL(FEED_PATH, dir), 'utf8');
        const live = await fetch(new URL(FEED_PATH, site))
          .then((res) => (res.ok ? res.text() : ''))
          .catch(() => '');

        if (live === next) {
          logger.info('Dev-post feed unchanged; portfolio left alone.');
          return;
        }

        // A failed hook shouldn't fail the blog deploy; the portfolio catches up on its next build.
        const res = await fetch(hook, { method: 'POST' }).catch((err) => err);
        if (res instanceof Response && res.ok) logger.info('Dev-post feed changed; portfolio rebuild triggered.');
        else logger.warn(`Portfolio deploy hook failed: ${res instanceof Response ? res.status : res}`);
      },
    },
  };
}
