import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import Icons from 'unplugin-icons/vite';
import Components from 'unplugin-vue-components/vite';
import { BootstrapVueNextResolver } from 'unplugin-vue-components/resolvers';
import IconsResolve from 'unplugin-icons/resolver';
import { existsSync } from 'fs';
import vitePrerender, { PuppeteerRenderer } from 'vite-plugin-prerender';
import path from 'path';
import puppeteer from 'puppeteer';

const prerenderRoutes = [
  "/",
  "/Gallery/",
  "/Upload/",
  "/Formats/",
  "/Grants/",
  "/Microgrant-Gallery",
  "/CSS-Playground/",
  "/Games/Aethelreds-Academy/",
  "/Games/Around-The-Realm/",
  "/Games/Clash-At-Ikara/",
  "/Games/Post-Work-Paradise/",
  "/Games/Raised-By-Mechs/",
  "/Games/Umberdred-Institute/",
  "/Shuffled/A-Plague-Among-Us/",
  "/Shuffled/1N5eeyKTVWo5QeGcUV_zYtwtR0DikJCcvcj6w69UkC1w/",
  "/Shuffled/1N2N8URSswhmxLalPOkzi5d4kdeFiGrsobEmM_ojk0ow/",
  "/Timed/1yq2AKwaYL1uZrCnEfwgSpC0SPkQAZqnCdjNxH_pm018/",
  "/Monster/1NgNHy7Qe1R8KhGR2cOmJwL2aOl2tocBemW2HIAKjrvI/",
  "/SlotMachine/1t5LRUQG9DzMJ3kd8E9DZV7_EbE8J5-Gqhz7TWQ4Y-uU/",
  "/Phases/1HataDfV2lrA4hfzmLgDjXH09dEMLQV6OT10tVH9G52A/",
  "/SecretCards/1JwMF02DSxNKtjHp6u-wyznSs-iEG_3DpOobgc17I16o/",
];
const bundledChrome = puppeteer.executablePath();
const chromeExecutablePath = [
  process.env.CHROME_PATH,
  bundledChrome,
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
].find((candidate) => candidate && existsSync(candidate));
const prerenderChromeDataDir = path.join(__dirname, '.chrome-prerender');
const enablePrerender = process.env.ENABLE_PRERENDER !== '0' && !!chromeExecutablePath;
export default defineConfig({
  plugins: [
    vue({
      template: {
        compilerOptions: {
          compatConfig: {
            MODE: 2,
          }
        }
      }
    }),
    Components({
      resolvers: [BootstrapVueNextResolver(), IconsResolve()],
      dts: true,
    }),
    Icons({
      compiler: 'vue3',
      autoInstall: true,
    }),
    enablePrerender &&
      vitePrerender({
        staticDir: path.join(__dirname, 'dist'),
        routes: prerenderRoutes,
        renderer: new PuppeteerRenderer({
          headless: 'new',
          renderAfterDocumentEvent: 'render-event',
          inject: { isPrerender: true },
          userDataDir: prerenderChromeDataDir,
          args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--disable-gpu',
            '--disable-crash-reporter',
          ],
          executablePath: chromeExecutablePath,
          env: {
            ...process.env,
            HOME: prerenderChromeDataDir,
            XDG_CONFIG_HOME: prerenderChromeDataDir,
          },
        }),
      }),
  ],
  extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json', '.vue'],
  resolve: {
    alias: {
      vue: '@vue/compat',
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
