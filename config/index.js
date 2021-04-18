/*
 * @Author       : ADI
 * @Date         : 2021-04-18 12:42:20
 * @LastEditors  : ADI
 * @LastEditTime : 2021-04-18 12:45:32
 */
import { defineConfig } from "vite";
import { createVuePlugin } from "vite-plugin-vue2";
import envCompatible from "vite-plugin-env-compatible";
import htmlTemplate from "vite-plugin-html-template";
import vueCli from "vite-plugin-vue-cli";
import mpa from "vite-plugin-mpa";
import path from "path";
import chalk from "chalk";
import { name } from "../package.json";

const resolve = (p) => path.resolve(process.cwd(), p);

// vue.config.js
let vueConfig = {};
try {
  vueConfig = require(resolve("vue.config.js")) || {};
} catch (e) {
  if (process.env.VITE_DEBUG) {
    console.error(chalk.redBright(e));
  }
  /**/
}

const pluginOptions = vueConfig.pluginOptions || {};
const viteOptions = pluginOptions.vite || {};
const extraPlugins = viteOptions.plugins || [];

if (viteOptions.alias) {
  console.log(
    chalk.cyan(
      `[${name}]: pluginOptions.vite.alias is deprecated, will auto-resolve from chainWebpack / configureWebpack`
    )
  );
}

const useMPA = Boolean(vueConfig.pages);

// @see https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    envCompatible(),
    // auto infer pages
    htmlTemplate({ pages: vueConfig.pages || {} }),
    vueCli(),
    createVuePlugin(viteOptions.vitePluginVue2Options),
    useMPA ? mpa() : undefined,
    ...extraPlugins,
  ],
  optimizeDeps: viteOptions.optimizeDeps,
});
