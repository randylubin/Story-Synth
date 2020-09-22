import './firebase'

import Vue from 'vue'

import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'

// Install BootstrapVue
Vue.use(BootstrapVue)
// Optionally install the BootstrapVue icon components plugin
Vue.use(IconsPlugin)

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

import App from './App.vue'

import VueRouter from 'vue-router'
Vue.use(VueRouter);

const routes = [
  { path: '/', component: App },
  { path: '/:gameType/:gSheetID/', component: App},
  { path: '/:gameType/:gSheetID/:roomID', component: App}
]


const router = new VueRouter({
  routes // short for `routes: routes`
})

router.beforeEach((to, from, next) => {
  if (to.path == '/_=_') {
    return next(false);
  }
  next();
})

import { firestorePlugin } from 'vuefire'

Vue.use(firestorePlugin)

new Vue({
  el: '#app',
  router,
  render: h => h(App),
  data () {
    return {
      gSheet: null
    }
  }
})
