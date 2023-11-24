import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

const path = require("path");
export default defineConfig({
  plugins: [
    vue({
      template: {
        compilerOptions: {
          compatConfig: {
            MODE: 2
          }
        }
      }
    })
  ],
  extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json', '.vue'],
  resolve: {
    alias: {
      vue: '@vue/compat',
      "@": path.resolve(__dirname, "./src"),
    },
  },
});