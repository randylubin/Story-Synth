import { createApp } from "vue";

import App from './App.vue'
const app = createApp(App)

import { createMetaManager } from 'vue-meta'
app.use(createMetaManager); // TODO use throughout app 

import { marked } from "marked";
app.config.globalProperties.$marked = marked;

import VueDOMPurifyHTML from "vue-dompurify-html";
app.use(VueDOMPurifyHTML, {
  default: {
    FORCE_BODY: true,
    ALLOWED_ATTR: [
      "alt",
      "class",
      "controls",
      "d",
      "height",
      "href",
      "rel",
      "path",
      "src",
      "style",
      "target",
      "title",
      "transform",
      "type",
      "width",
      "xmlns",
      " xmlns:xlink",
      "viewbox",
      "version",
      "xml:space",
      "xmlns:serif",
      "x",
      "y",
    ],
    ADD_TAGS: ["audio", "autoplay", "blockquote", "code", "figure", "figcaption", "g", "img", "link", "loop", "style", "svg", "pre", "span"],
  },
});

import markdownFriendlyOptions from "./misc/markdown-friendly-options.json";
app.config.globalProperties.$markdownFriendlyOptions = markdownFriendlyOptions;

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue-next/dist/bootstrap-vue-next.css'

// import {
//   BootstrapVue,
//   BIcon,
//   BIconSave,
//   BIconArrowsExpand,
//   BIconArrowsCollapse,
//   BIconPeople,
//   BIconCoin,
//   BIconPencil,
//   BIconTrash,
//   BIconCheck2,
//   BIconList,
//   BIconLink45deg,
//   BIconArrowClockwise,
//   BIconArrowsMove,
//   BIconChevronLeft,
//   BIconCardHeading,
//   BIconChevronRight,
//   BIconEyeSlashFill,
//   BIconZoomIn,
//   BIconZoomOut,
// } from "bootstrap-vue";

// // Install BootstrapVue
// app.use(BootstrapVue);
// // Optionally install the BootstrapVue icon components plugin
// app.component("BIcon", BIcon);
// app.component("BIconArrowsExpand", BIconArrowsExpand),
// app.component("BIconArrowsCollapse", BIconArrowsCollapse),
// app.component("BIconPencil", BIconPencil);
// app.component("BIconTrash", BIconTrash);
// app.component("BIconCheck2", BIconCheck2);
// app.component("BIconList", BIconList);
// app.component("BIconLink45deg", BIconLink45deg);
// app.component("BIconArrowClockwise", BIconArrowClockwise);
// app.component("BIconArrowsMove", BIconArrowsMove);
// app.component("BIconChevronLeft", BIconChevronLeft);
// app.component("BIconChevronRight", BIconChevronRight);
// app.component("BIconCardHeading", BIconCardHeading);
// app.component("BIconCoin", BIconCoin);
// app.component("BIconPeople", BIconPeople);
// app.component("BIconSave", BIconSave);
// app.component("BIconEyeSlashFill", BIconEyeSlashFill);
// app.component("BIconZoomIn", BIconZoomIn);
// app.component("BIconZoomOut", BIconZoomOut)

import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-vue/dist/bootstrap-vue.css";

import "./assets/styleTemplates/homepage.scss";

import "./assets/styleTemplates/light.scss";
import "./assets/styleTemplates/dark.scss";
import "./assets/styleTemplates/cyberpunk.scss";
import "./assets/styleTemplates/vaporwave.scss";
import "./assets/styleTemplates/fantasy.scss";

import VueGtag from "vue-gtag";
app.use(VueGtag, {
  config: { id: "G-B8L2T2PSP7" },
});

import VueMixpanel from "vue-mixpanel";
app.use(VueMixpanel, {
  token: "e5df6aab318089da6c499bc6bf3123f9", //TODO replace this token with your own MixPanel tracking token
});

import { createRouter, createWebHistory } from "vue-router";

const routes = [
  { path: "/", component: App },
  { path: "/:gameType/:gSheetID/", component: App },
  { path: "/:gameType/:gSheetID/:roomID", component: App },
  { path: "/:gameType/:gSheetID/:roomID/:userRole", component: App },
  { path: "/Games/", redirect: "/Gallery/"},
];

let router = createRouter({
  history: createWebHistory(),
  routes: routes,
});

router.beforeEach((to, from, next) => {
  if (to.fullPath.includes("?")) {
    const path = to.fullPath.substr(0, to.fullPath.indexOf("?"));
    next(path);
    return;
  }

  if (to.fullPath.substr(0, 2) === "/#") {
    const path = to.fullPath.substr(2);
    next(path);
    return;
  }
  if (to.path == "/_=_") {
    return next(false);
  }
  if (to.fullPath.substr(-1) !== "/") {
    const path = to.fullPath + "/";
    next(path);
    return;
  }

  next();
});
app.use(router)

app.component('App', App)
app.config.globalProperties.$gSheet = null;

app.mount('#app')

// var vm = new Vue({
//   el: "#app",
//   router,
//   render: (h) => h(App),
//   data() {
//     return {
//       gSheet: null,
//     };
//   },
// });
