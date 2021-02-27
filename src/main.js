//import './firebase'
import 'firebase/app'
import 'firebase/firestore'
import 'firebase/database'


import Vue from 'vue'

import VueMeta from 'vue-meta'
Vue.use(VueMeta);

import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'

// Install BootstrapVue
Vue.use(BootstrapVue)
// Optionally install the BootstrapVue icon components plugin
Vue.use(IconsPlugin)

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

import App from './App.vue'

import VueGtag from "vue-gtag";
Vue.use(VueGtag, {
  config: { id: "G-B8L2T2PSP7" }
});

import VueMixpanel from 'vue-mixpanel'
Vue.use(VueMixpanel, {
  token: 'e5df6aab318089da6c499bc6bf3123f9'
})


import VueRouter from 'vue-router'
Vue.use(VueRouter);

const routes = [
  { path: '/', component: App },
  { path: '/:gameType/:gSheetID/', component: App},
  { path: '/:gameType/:gSheetID/:roomID', component: App}
]


const router = new VueRouter({
  mode: 'history',
  routes // short for `routes: routes`
})

router.beforeEach((to, from, next) => {
   if (to.fullPath.substr(0,2) === "/#") {
    const path = to.fullPath.substr(2);
    next(path);
    return;
  }
  if (to.path == '/_=_') {
    return next(false);
  }
  if (to.fullPath.substr(-1) !== "/") {
    const path = to.fullPath + "/"
    next(path);
    return;
  }
  next();
})

import { firestorePlugin } from 'vuefire'
import { rtdbPlugin } from 'vuefire'


Vue.use(firestorePlugin)
Vue.use (rtdbPlugin)

new Vue({
  el: '#app',
  router,
  render: h => h(App),
  //mounted: () => document.dispatchEvent(new Event("x-app-rendered")),
  data () {
    return {
      gSheet: null
    }
  }
})