import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import customGameData from '../src/misc/customGameData.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distDir = path.resolve(__dirname, '..', 'dist');

// Keep this in sync with vite.config.js prerenderRoutes.
const routes = [
  '/Gallery/',
  '/Upload/',
  '/Formats/',
  '/Grants/',
  '/Microgrant-Gallery',
  '/CSS-Playground/',
  '/Games/Aethelreds-Academy/',
  '/Games/Around-The-Realm/',
  '/Games/Clash-At-Ikara/',
  '/Games/Post-Work-Paradise/',
  '/Games/Raised-By-Mechs/',
  '/Games/Umberdred-Institute/',
  '/Shuffled/A-Plague-Among-Us/',
  '/Shuffled/1N5eeyKTVWo5QeGcUV_zYtwtR0DikJCcvcj6w69UkC1w/',
  '/Shuffled/1N2N8URSswhmxLalPOkzi5d4kdeFiGrsobEm_ojk0ow/',
  '/Timed/1yq2AKwaYL1uZrCnEfwgSpC0SPkQAZqnCdjNxH_pm018/',
  '/Monster/1NgNHy7Qe1R8KhGR2cOmJwL2aOl2tocBemW2HIAKjrvI/',
  '/SlotMachine/1t5LRUQG9DzMJ3kd8E9DZV7_EbE8J5-Gqhz7TWQ4Y-uU/',
  '/Phases/1HataDfV2lrA4hfzmLgDjXH09dEMLQV6OT10tVH9G52A/',
  '/SecretCards/1JwMF02DSxNKtjHp6u-wyznSs-iEG_3DpOobgc17I16o/',
];

const baseHtml = readFileSync(path.join(distDir, 'index.html'), 'utf8');
const siteBase = process.env.SITE_BASE || '';

function injectMeta(html, { title, description, ogImage, url, twitterImageAlt }) {
  const metaBlock = `
    <title>${title}</title>
    <meta name="description" content="${description}">
    <meta property="og:title" content="${title}">
    <meta property="og:description" content="${description}">
    <meta property="og:image" content="${ogImage}">
    <meta property="og:url" content="${url}">
    <meta property="twitter:card" content="summary">
    <meta property="og:site_name" content="Story Synth">
    <meta property="twitter:image:alt" content="${twitterImageAlt || title}">
  `;
  return html.replace('</head>', `${metaBlock}\n</head>`);
}

for (const route of routes) {
  let title = 'Story Synth';
  let description =
    'A platform for designing and playing storytelling games online. Free to use, open source, no coding knowledge needed.';
  let ogImage = 'https://storysynth.org/img/story-synth-square-logo.png';
  let twitterImageAlt = 'Story Synth logo';

  const match = route.match(/^\/Games\/([^/]+)/);
  if (match) {
    const gameKey = match[1];
    const game = customGameData[gameKey];
    if (game) {
      title = game.gameTitle || title;
      description = game.gameBlurb || description;
      ogImage = game.ogImageSquare || game.ogImage || ogImage;
      twitterImageAlt = `${title} logo`;
    }
  }

  const url = siteBase + route;
  const rendered = injectMeta(baseHtml, { title, description, ogImage, url, twitterImageAlt });

  const targetDir = path.join(distDir, route.replace(/^\//, ''));
  mkdirSync(targetDir, { recursive: true });
  writeFileSync(path.join(targetDir, 'index.html'), rendered, 'utf8');
  // eslint-disable-next-line no-console
  console.log(`Wrote static prerender for ${route}`);
}

// Root index.html
const rootTitle = 'Story Synth';
const rootDescription =
  'A platform for designing and playing storytelling games online. Free to use, open source, no coding knowledge needed.';
const rootOgImage = 'https://storysynth.org/img/story-synth-square-logo.png';
const rootUrl = siteBase + '/';
const rootRendered = injectMeta(baseHtml, {
  title: rootTitle,
  description: rootDescription,
  ogImage: rootOgImage,
  url: rootUrl,
  twitterImageAlt: 'Story Synth logo',
});
writeFileSync(path.join(distDir, 'index.html'), rootRendered, 'utf8');
console.log('Wrote static prerender for /');
