<template>
  <div id="app">
    <!-- <router-view></router-view>-->
    <div v-if="route && path !== '/about'">

      <app-header class=""></app-header>

      <div class="non-footer-content">

        <div v-if="fullPath == '/'">
          <app-homepage :routeRoomID="$route.params.roomID" :routeGSheetID="$route.params.gSheetID"
            :routeGameType="$route.params.gameType"></app-homepage>
        </div>

        <div v-if="fullPath == '/Formats/'">
          <app-formatsAndExtensions></app-formatsAndExtensions>
        </div>

        <div v-if="fullPath == '/Gallery/'">
          <app-gallery></app-gallery>
        </div>

        <div v-if="fullPath == '/Microgrant-Gallery/'">
          <app-microgrant-gallery></app-microgrant-gallery>
        </div>

        <div v-if="fullPath == '/Grants/'">
          <app-grants></app-grants>
        </div>

        <div v-if="fullPath == '/CSS-Playground/'">
          <app-CSSPlayground></app-CSSPlayground>
        </div>

        <div v-if="fullPath == '/Upload/'">
          <app-uploadPage :routeRoomID="$route.params.roomID" :routeGSheetID="$route.params.gSheetID"
            :routeGameType="$route.params.gameType"></app-uploadPage>
        </div>

        <app-game
          v-if="firebaseAuth && routeParams?.gameType && !['CSS-Playground', 'Grants', 'Gallery', 'Formats', 'Upload'].includes($route.params.gameType)"
          :roomID="$route.params.roomID" :gSheetID="$route.params.gSheetID" :gameType="gameType"></app-game>

        <div
          v-if="!firebaseAuth && routeParams?.gameType && !['CSS-Playground', 'Grants', 'Gallery', 'Formats', 'Upload'].includes($route.params.gameType)"
          class="vw-100 vh-100 d-flex align-items-center justify-content-center"
          no-wrap>
          <div class="row">
            <div class="col">
              <h1>Loading
                <span class="spinner-border m-auto p-auto" role="status">
                  <span class="visually-hidden">Loading...</span>
                </span>
              </h1>
            </div>
          </div>
        </div>
      </div>

      <link rel="monetization" href="$ilp.uphold.com/WMbkRBiZFgbx"
        onmonetization="console.log('monetization event triggered')"
        v-if="['CSS-Playground', 'Grants', 'Gallery', 'Formats', 'Upload'].includes(routeParams?.gameType)">
    </div>
  </div>
</template>

<script>
import { defineAsyncComponent } from 'vue';
import { anonymousSignIn } from './firebase/auth.js';
import customGameData from './misc/customGameData'
import { useRoute } from 'vue-router';
import { computed, watch } from 'vue';

// import CustomGameSessionManager from './components/games/CustomGameSessionManager.vue' // TODO push this to components

export default {
  name: 'app',
  components: {
    'app-header': defineAsyncComponent(() => import('./components/layout/Header.vue')),

    'app-homepage': defineAsyncComponent(() => import('./components/other/Homepage.vue')),
    'app-gallery': defineAsyncComponent(() => import('./components/other/Gallery.vue')),
    'app-microgrant-gallery': defineAsyncComponent(() => import('./components/other/MicrograntGallery.vue')),
    'app-formatsAndExtensions': defineAsyncComponent(() => import('./components/other/FormatsAndExtensionsOverview.vue')),
    'app-grants': defineAsyncComponent(() => import('./components/other/Grants.vue')),
    'app-CSSPlayground': defineAsyncComponent(() => import('./components/other/CSSPlayground.vue')),

    'app-game': defineAsyncComponent(() => import('./components/layout/Game.vue')),
    'app-uploadPage': defineAsyncComponent(() => import('./components/launchers/UploadPage.vue')),
    // 'app-customGameLauncher': () => import('./components/games/CustomGameLauncher.vue'),
    // 'app-customGameSessionManager': CustomGameSessionManager,

  },
  data() {
    return {
      firebaseAuth: false,
    }
  },
  setup(){
    const route=useRoute();
    const path = computed(() => route.path)
    const fullPath = computed(() => route.fullPath)
    const routeParams = computed(() => route.params)
    return {
      route, path, fullPath, routeParams
    }
  },
  computed: {
    gameType: function () {
      if (this.$route.params.gameType != "Games") {
        return this.$route.params.gameType;
      } else {
        return customGameData[this.$route.params.gSheetID]?.gameType ?? "Custom";
      }
    }
  },
  metaInfo() {
    return {
      title: "Story Synth",
      meta: [
        {
          property: 'description',
          content: 'A platform for designing and playing storytelling games online. Free to use, open source, no coding knowledge needed.',
          vmid: 'description'
        },
        {
          property: 'og:title',
          content: 'Story Synth',
          vmid: 'og:title'
        },
        {
          property: 'og:description',
          content: 'A platform for designing and playing storytelling games online.',
          vmid: 'og:description'
        },
        {
          property: 'og:image',
          content: 'https://storysynth.org/img/story-synth-square-logo.png',
          vmid: 'og:image'
        },
        {
          property: 'og:url',
          content: 'https://storysynth.org/',
          vmid: 'og:url'
        },
        {
          property: 'twitter:card',
          content: 'summary',
          vmid: 'twitter:card'
        },
        {
          property: 'og:site_name',
          content: 'Story Synth',
          vmid: 'og:site_name'
        },
        {
          property: 'twitter:image:alt',
          content: 'The Story Synth Logo',
          vmid: 'twitter:image:alt'
        },
        {
          name: 'monetization',
          content: '$ilp.uphold.com/WMbkRBiZFgbx',
          vmid: 'monetization'
        },

      ]
    }
  },
  mounted() {
    anonymousSignIn()
      .then(() => {
        // console.log('anon auth')
        this.firebaseAuth = true;
      })
      .catch((error) => {
        var errorCode = error.code;
        var errorMessage = error.message;
        console.log(errorCode, errorMessage)
        // TODO display error message
      });

      // window.addEventListener('mouseup', function(){
        // document.getElementById('menu-bar-button').focus()
        // document.getElementById('menu-bar-button').blur()
      //   console.log("click!")
      // })

  },
  methods: {
  }
}
</script>

<style lang="scss">
a {
  color: #0071EB;
}

html {
  height: 100%;
}

.btn-outline-dark:not(:hover),
.btn-outline-primary:not(:hover) {
  background-color: white;
}

.menu-bar .btn-outline-dark:not(:hover),
.menu-bar .btn-outline-primary:not(:hover) {
  background-color: transparent;
}

.message {
  font-size: 2em;
  margin-top: 1em;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity .5s;
}

.fade-enter,
.fade-leave-to

/* .fade-leave-active below version 2.1.8 */
  {
  opacity: 0;
}

.app-main {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #000d1b;

  position: relative;
  min-height: 100vh;
}

.game-room {
  text-align: center;
  max-width: 600px;
}

body {
  background: var(--light);
  margin: auto;
  background-repeat: no-repeat;
  background-attachment: fixed;
  touch-action: manipulation;
}

h1,
h2 {
  font-weight: normal;
}

ul {
  padding: 0;
}

ul.dropdown-menu>li {
  list-style-type: none;
}

li {

  list-style-type: disc;
  display: list-item;
  margin-left: 1.2rem
}


.margin-between-sections {
  margin-bottom: 116px;
}

.padding-after-navbar {
  padding-top: 124px;
}

.navbar {
  backdrop-filter: blur(10px);
  width: 100%;
}

ul.navbar-nav {
  list-style-type: none;
}

li.nav-item {
  display: inline-block;
  margin: 0 10px;
}

.app-main .shadow {
  box-shadow:
    0 1px 1px hsl(0deg 0% 0% / 0.075),
    0 2px 2px hsl(0deg 0% 0% / 0.075),
    0 4px 4px hsl(0deg 0% 0% / 0.075),
    0 8px 8px hsl(0deg 0% 0% / 0.075),
    0 16px 16px hsl(0deg 0% 0% / 0.075) !important;
}

.extension h2 {
  font-size: 1.5rem;
}

.non-footer-content {
  padding-bottom: 8.5rem;
}

.demoInfo {
  a {
    color: black;
  }
}

// Utility classes  
:root {
  --ds-rounding: 14px;
}

.rounded-m {
  border-radius: var(--ds-rounding);
}

.clipped {
  overflow: hidden;
}

.card {
  border-radius: var(--ds-rounding);
  overflow: hidden;
}

.card-img {
  border-radius: 0;
}

.btn-fab.shadow {
  border-width: 0;
  box-shadow:
    0 1px 1px hsl(0deg 0% 0% / 0.075),
    0 2px 2px hsl(0deg 0% 0% / 0.075),
    0 4px 4px hsl(0deg 0% 0% / 0.075),
    0 8px 8px hsl(0deg 0% 0% / 0.075),
    0 16px 16px hsl(0deg 0% 0% / 0.075),
    0 0px 5px hsl(0deg 0% 0% / .15) !important;
}

.btn-fab:not(:hover):not(:focus) {
  background: white;
}

.btn-fab.btn-outline-dark:hover:not([disabled="disabled"]) {
  color: #fff;
  background-color: #343a40;
  border-color: #343a40;
}

.btn-fab.btn-outline-dark:focus {
  box-shadow: 0 0 0 0.2rem rgba(52, 58, 64, 0.5) !important;
}

.btn-fab svg {
  transition: transform 0.2s;
}

.btn-fab:hover:not([disabled="disabled"]) svg {
  transform: scale(1.1);
}

.btn-fab[disabled="disabled"] {
  background: white;

  svg {
    color: var(--secondary);
  }
}

@media (max-width: 800px) {
  .fab-buttons {
    position: fixed;
    width: calc(100vw - 30px);
    z-index: 100000;
    bottom: 48px;
  }

  .btn-fab {
    --fab-diameter: 90px;
    --fab-spacing: 28px;
    border-radius: var(--fab-diameter);
    width: var(--fab-diameter);
    height: var(--fab-diameter);

    // &.btn-fab-left {
    // 
    // }

    &.btn-fab-right {
      margin-left: var(--fab-spacing);
    }
  }
}

@media (min-width: 800px) {
  .fab-buttons {
    position: relative;
    width: 100%;
  }

  .btn-fab {
    --fab-diameter: 90px;
    border-radius: var(--fab-diameter);
    width: var(--fab-diameter);
    height: var(--fab-diameter);
    margin-top: 120px;
    position: absolute;

    &.btn-fab-left {
      left: calc(-20px - var(--fab-diameter));
    }

    &.btn-fab-right {
      right: calc(-20px - var(--fab-diameter));
    }
  }
}

.menu-row {
  justify-content: center;
  margin-bottom: 10px;
}

.demoInfo,
.alert-info {
  color: #0c5460;
  background-color: #d1ecf1;
  border-color: #bee5eb;
  text-shadow: none !important;

  a {
    color: #0071EB !important;
  }
}

.edit-button {
  border: none;
}

$dark-blue: #323c69;
$light-blue: #d9fcfd;

.navbar {
  transition: all 0.2s;
  z-index: 9999;
}
.navbar:not(.scrolledNavbar) {
  background-color: transparent !important;
}
.navbar-brand,
.nav-item,
.nav-link {
  color: $dark-blue !important;
  font-family: "Poppins", sans-serif !important;

  :hover {
    text-decoration: underline !important;
  }
}

.navbar.scrolledNavbar {
  background-color: $dark-blue !important;
  // animation: navbarFade 0.5s forwards;
}

// @keyframes navbarFade {
//   0% {
//     background-color: transparent !important;
//   }

//   100% {
//     background-color: $dark-blue !important;
//   }
// }

.scrolledNavbar {
  .navbar-brand,
  .nav-item,
  .nav-link {
    color: $light-blue !important;
    font-family: "Poppins", sans-serif !important;

    :hover {
      text-decoration: underline !important;
    }
  }
}

.navbar-toggler {
  font-weight: bold;
  background: #323c69;
  color: #d9fcfd;
}
</style>
