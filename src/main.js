//import './firebase'
import 'firebase/app'
import 'firebase/firestore'
import 'firebase/database'

import Vue from 'vue'

import VueMeta from 'vue-meta'
Vue.use(VueMeta);

import { BootstrapVue, BIcon, BIconPencil, BIconTrash, BIconCheck2, BIconList, BIconLink45deg, BIconArrowClockwise, BIconArrowsMove, BIconChevronLeft, BIconCardHeading, BIconChevronRight} from 'bootstrap-vue'

// Install BootstrapVue
Vue.use(BootstrapVue)
// Optionally install the BootstrapVue icon components plugin
Vue.component('BIcon', BIcon)
Vue.component('BIconPencil', BIconPencil)
Vue.component('BIconTrash', BIconTrash)
Vue.component('BIconCheck2', BIconCheck2)
Vue.component('BIconList', BIconList)
Vue.component('BIconLink45deg', BIconLink45deg)
Vue.component('BIconArrowClockwise', BIconArrowClockwise)
Vue.component('BIconArrowsMove', BIconArrowsMove)
Vue.component('BIconChevronLeft', BIconChevronLeft)
Vue.component('BIconChevronRight', BIconChevronRight)
Vue.component('BIconCardHeading', BIconCardHeading)

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

import './assets/styleTemplates/homepage.scss'

import './assets/styleTemplates/light.scss'
import './assets/styleTemplates/dark.scss'
import './assets/styleTemplates/cyberpunk.scss'
import './assets/styleTemplates/vaporwave.scss'
import './assets/styleTemplates/fantasy.scss'

import App from './App.vue'

import VueGtag from "vue-gtag";
Vue.use(VueGtag, {
  config: { id: "G-B8L2T2PSP7" }
});

import VueMixpanel from 'vue-mixpanel'
Vue.use(VueMixpanel, {
  token: 'e5df6aab318089da6c499bc6bf3123f9' //TODO replace this token with your own MixPanel tracking token
})


import VueRouter from 'vue-router'
Vue.use(VueRouter);

const routes = [
  { path: '/', component: App },
  { path: '/:gameType/:gSheetID/', component: App},
  { path: '/:gameType/:gSheetID/:roomID', component: App },
  { path: '/:gameType/:gSheetID/:roomID/:userRole', component: App}
]


const router = new VueRouter({
  mode: 'history',
  routes // short for `routes: routes`
})

router.beforeEach((to, from, next) => {
  if (to.fullPath.includes('?')) {
    const path = to.fullPath.substr(0, to.fullPath.indexOf('?'))
    next(path);
    return;
  }

  if (to.fullPath.substr(0, 2) === "/#") {
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

var vm = new Vue({
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

global.vm = vm;