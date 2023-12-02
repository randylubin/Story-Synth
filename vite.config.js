import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import Icons from 'unplugin-icons/vite'
import Components from 'unplugin-vue-components/vite'
import {BootstrapVueNextResolver} from 'unplugin-vue-components/resolvers'
import IconsResolve from 'unplugin-icons/resolver'

const path = require("path");
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
  ],
  extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json', '.vue'],
  resolve: {
    alias: {
      vue: '@vue/compat',
      "@": path.resolve(__dirname, "./src"),
    },
  },
});