<template>
  <div id="app">
    <!-- <router-view></router-view>-->
    <div v-if="$route.path !== '/about'">
      
      <app-header class=""></app-header>
      
      <div class="non-footer-content">
        
        <div v-if="$route.fullPath == '/'">
          <app-homepage :routeRoomID="$route.params.roomID" :routeGSheetID="$route.params.gSheetID" :routeGameType="$route.params.gameType"></app-homepage>
        </div>

        <div v-if="$route.fullPath == '/Gallery/'">
          <app-gallery></app-gallery>
        </div>

        <div v-if="$route.fullPath == '/Formats/'">
          <app-formatsAndExtensions></app-formatsAndExtensions>
        </div>
        
        <div v-if="!['Games', 'Gallery', 'Formats'].includes($route.params.gameType)">
          <!--For published version, remove any components you aren't using -->
          <div v-if="!$route.params.roomID && $route.params.gSheetID">
            <app-gameLauncher :routeGSheetID="$route.params.gSheetID" :routeGameType="$route.params.gameType"></app-gameLauncher>
          </div>

          <app-timed :roomID="$route.params.roomID" :gSheetID="$route.params.gSheetID" v-if="$route.params.gameType=='Timed' && $route.params.roomID"></app-timed>
          <app-shuffled ref="shuffled" :roomID="$route.params.roomID" :gSheetID="$route.params.gSheetID" :userRole="$route.params.userRole" v-if="$route.params.gameType=='Shuffled' && $route.params.roomID"></app-shuffled>
          <app-monster :roomID="$route.params.roomID" :gSheetID="$route.params.gSheetID" v-if="$route.params.gameType=='Monster' && $route.params.roomID"></app-monster>
          <app-secretCards :roomID="$route.params.roomID" :gSheetID="$route.params.gSheetID" v-if="$route.params.gameType=='SecretCards' && $route.params.roomID"></app-secretCards>
          <app-slotMachine :roomID="$route.params.roomID" :gSheetID="$route.params.gSheetID" v-if="($route.params.gameType=='SlotMachine' || $route.params.gameType=='Composite') && $route.params.roomID"></app-slotMachine>
          <app-phases :roomID="$route.params.roomID" :gSheetID="$route.params.gSheetID" v-if="$route.params.gameType=='Phases' && $route.params.roomID"></app-phases>
          <app-generator :roomID="$route.params.roomID" :gSheetID="$route.params.gSheetID" v-if="$route.params.gameType=='Generator' && $route.params.roomID"></app-generator>
          <app-hexflower :roomID="$route.params.roomID" :gSheetID="$route.params.gSheetID" v-if="$route.params.gameType=='Hexflower' && $route.params.roomID"></app-hexflower>
          <app-gridmap :roomID="$route.params.roomID" :gSheetID="$route.params.gSheetID" v-if="$route.params.gameType=='Gridmap' && $route.params.roomID"></app-gridmap>

          <app-sandbox :roomID="$route.params.roomID" :gSheetID="$route.params.gSheetID" v-if="$route.params.gameType=='Sandbox' && $route.params.roomID"></app-sandbox>
        </div>
        <div v-else-if="$route.params.gameType == 'Games'">
          <div v-if="!$route.params.roomID && $route.params.gSheetID">
            <app-customGameLauncher :routeGSheetID="$route.params.gSheetID" :routeGameType="$route.params.gameType"></app-customGameLauncher>
          </div>
          <app-customGameSessionManager :routeGSheetID="$route.params.gSheetID" v-if="$route.params.roomID" :userRole="$route.params.userRole"></app-customGameSessionManager>
        </div>
      </div>
      
      <app-footer v-if="$route.params.roomID && ['Timed', 'SecretCards'].includes($route.params.gameType)"></app-footer>
    </div>
  </div>
</template>

<script>
  import firebase from 'firebase'

  // Remove for published version any components you aren't using
  import Header from './components/layout/Header.vue'
  import Footer from './components/layout/Footer.vue'

  import Homepage from './components/launchers/Homepage.vue'
  import Gallery from './components/launchers/Gallery.vue'
  import FormatsAndExtensionsOverview from './components/launchers/FormatsAndExtensionsOverview.vue'

  import GameLauncher from './components/launchers/GameLauncher.vue'
  import CustomGameLauncher from './components/games/CustomGameLauncher.vue'
  import CustomGameSessionManager from './components/games/CustomGameSessionManager.vue'

  import Timed from './components/formats/Timed.vue'
  import Shuffled from './components/formats/Shuffled.vue'
  import Monster from './components/formats/Monster.vue'
  import SecretCards from './components/formats/SecretCards.vue'
  import SlotMachine from './components/formats/SlotMachine.vue'
  import Phases from './components/formats/Phases.vue'
  import Generator from './components/formats/Generator.vue'
  import Gridmap from './components/formats/Gridmap.vue'
  import Hexflower from './components/formats/Hexflower.vue'
  import Sandbox from './components/formats/Sandbox.vue'

  export default {
    name: 'app',
    components: { // Remove unused components from the published version
      'app-header': Header,
      'app-footer': Footer,
      'app-homepage': Homepage,
      'app-gallery': Gallery,
      'app-formatsAndExtensions': FormatsAndExtensionsOverview,
      'app-gameLauncher': GameLauncher,
      'app-customGameLauncher': CustomGameLauncher,
      'app-customGameSessionManager': CustomGameSessionManager,
      'app-timed': Timed,
      'app-shuffled': Shuffled,
      'app-monster': Monster,
      'app-secretCards': SecretCards,
      'app-slotMachine': SlotMachine,
      'app-phases': Phases,
      'app-generator': Generator,
      'app-gridmap': Gridmap,
      'app-hexflower': Hexflower,
      'app-sandbox': Sandbox,
      
    },
    data () {
      return {
      }
    },
    metaInfo () {
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
          content: 'https://storysynth.org/img/story-synth-square-logo.gif',
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
    mounted () {
      firebase.auth().signInAnonymously()
      .then(() => {
        //console.log('anon auth')
      })
      .catch((error) => {
        var errorCode = error.code;
        var errorMessage = error.message;
        console.log(errorCode, errorMessage)
        // ...
      });

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

  .btn-outline-dark:not(:hover), .btn-outline-primary:not(:hover) {
    background-color:white;
  }

  .menu-bar .btn-outline-dark:not(:hover), .menu-bar .btn-outline-primary:not(:hover) {
    background-color: transparent;
  }

  .message{
    font-size: 2em;
    margin-top: 1em;
  }

  .fade-enter-active, .fade-leave-active {
    transition: opacity .5s;
  }
  .fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
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
    max-width:600px;
  }

  body {
    background: var(--light);
    margin: auto;
    background-repeat: no-repeat;
    background-attachment: fixed;
    touch-action: manipulation;
  }

  h1, h2 {
    font-weight: normal;
  }

  ul {
    padding: 0;
  }

  ul.dropdown-menu > li{
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
      0 16px 16px hsl(0deg 0% 0% / 0.075) !important
    ;
  }

  .extension h2 {
    font-size: 1.5rem;
  }
  // .extension .extension-card {
  //   box-shadow:
  //     inset 0 1px 1px hsl(0deg 0% 0% / 0.075),
  //     inset 0 2px 2px hsl(0deg 0% 0% / 0.075),
  //     inset 0 4px 4px hsl(0deg 0% 0% / 0.075),
  //     inset 0 8px 8px hsl(0deg 0% 0% / 0.075),
  //     inset 0 16px 16px hsl(0deg 0% 0% / 0.075) !important
  //     ;

  //   border: 0px;
  //   border-radius: 5px;
  // }

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
      0 0px 5px hsl(0deg 0% 0% / .15) !important
    ;
}
.btn-fab:not(:hover) {
  background: white;
}
.btn-fab svg {
  transition: transform 0.2s;
}
.btn-fab:hover:not([disabled="disabled"]) svg {
  transform: scale(1.1);
}
.btn-fab[disabled="disabled"] {
  background: white;

  svg{
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

.demoInfo, .alert-info {
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

</style>
