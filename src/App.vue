<template>
  <div id="app">
    <!-- <router-view></router-view>-->
    <div v-if="$route.path !== '/about'">
      <div class="navbar">
        <app-header class=""></app-header>
      </div>
      <div class="non-footer-content">
        
        <app-roomLink class="d-none d-sm-block" :routeRoomID="$route.params.roomID"></app-roomLink>
        
        <div v-if="$route.fullPath == '/'">
          <app-homepage :routeRoomID="$route.params.roomID" :routeGSheetID="$route.params.gSheetID" :routeGameType="$route.params.gameType"></app-homepage>
        </div>

        <div v-if="$route.fullPath == '/Gallery/'">
          <app-gallery></app-gallery>
        </div>
        
        <div v-if="!['Games', 'Gallery'].includes($route.params.gameType)">
          <!--For published version, remove any components you aren't using -->
          <div v-if="!$route.params.roomID && $route.params.gSheetID">
            <app-gameLauncher :routeGSheetID="$route.params.gSheetID" :routeGameType="$route.params.gameType"></app-gameLauncher>
          </div>

          <app-timed :roomID="$route.params.roomID" :gSheetID="$route.params.gSheetID" v-if="$route.params.gameType=='Timed' && $route.params.roomID"></app-timed>
          <app-shuffled :roomID="$route.params.roomID" :gSheetID="$route.params.gSheetID" v-if="$route.params.gameType=='Shuffled' && $route.params.roomID"></app-shuffled>
          <app-monster :roomID="$route.params.roomID" :gSheetID="$route.params.gSheetID" v-if="$route.params.gameType=='Monster' && $route.params.roomID"></app-monster>
          <app-secretCards :roomID="$route.params.roomID" :gSheetID="$route.params.gSheetID" v-if="$route.params.gameType=='SecretCards' && $route.params.roomID"></app-secretCards>
          <app-slotMachine :roomID="$route.params.roomID" :gSheetID="$route.params.gSheetID" v-if="($route.params.gameType=='SlotMachine' || $route.params.gameType=='Composite') && $route.params.roomID"></app-slotMachine>
          <app-phases :roomID="$route.params.roomID" :gSheetID="$route.params.gSheetID" v-if="$route.params.gameType=='Phases' && $route.params.roomID"></app-phases>
          <app-generator :roomID="$route.params.roomID" :gSheetID="$route.params.gSheetID" v-if="$route.params.gameType=='Generator' && $route.params.roomID"></app-generator>
          <app-gridmap :roomID="$route.params.roomID" :gSheetID="$route.params.gSheetID" v-if="$route.params.gameType=='Gridmap' && $route.params.roomID"></app-gridmap>

          <app-sandbox :roomID="$route.params.roomID" :gSheetID="$route.params.gSheetID" v-if="$route.params.gameType=='Sandbox' && $route.params.roomID"></app-sandbox>
        </div>
        <div v-else-if="$route.params.gameType == 'Games'">
          <div v-if="!$route.params.roomID && $route.params.gSheetID">
            <app-customGameLauncher :routeGSheetID="$route.params.gSheetID" :routeGameType="$route.params.gameType"></app-customGameLauncher>
          </div>
          <app-customGameSessionManager :routeGSheetID="$route.params.gSheetID" v-if="$route.params.roomID"></app-customGameSessionManager>
        </div>
      </div>
      
      <app-footer v-if="$route.params.roomID"></app-footer>
    </div>
  </div>
</template>

<script>
  import firebase from 'firebase'

  // Remove for published version any components you aren't using
  import Header from './components/layout/Header.vue'
  import RoomLink from './components/layout/RoomLink.vue'
  import Footer from './components/layout/Footer.vue'

  import Homepage from './components/launchers/Homepage.vue'
  import GameLauncher from './components/launchers/GameLauncher.vue'
  import CustomGameLauncher from './components/games/CustomGameLauncher.vue'

  import Gallery from './components/launchers/Gallery.vue'

  import Timed from './components/formats/Timed.vue'
  import Shuffled from './components/formats/Shuffled.vue'
  import Monster from './components/formats/Monster.vue'
  import SecretCards from './components/formats/SecretCards.vue'
  import SlotMachine from './components/formats/SlotMachine.vue'
  import Phases from './components/formats/Phases.vue'
  import Generator from './components/formats/Generator.vue'
  import Gridmap from './components/formats/Gridmap.vue'
  import Sandbox from './components/formats/Sandbox.vue'
  import CustomGameSessionManager from './components/games/CustomGameSessionManager.vue'

  export default {
    name: 'app',
    components: { // Remove unused components from the published version
      'app-header': Header,
      'app-roomLink': RoomLink,
      'app-footer': Footer,
      'app-homepage': Homepage,
      'app-gameLauncher': GameLauncher,
      'app-gallery': Gallery,
      'app-timed': Timed,
      'app-shuffled': Shuffled,
      'app-monster': Monster,
      'app-secretCards': SecretCards,
      'app-slotMachine': SlotMachine,
      'app-phases': Phases,
      'app-generator': Generator,
      'app-gridmap': Gridmap,
      'app-sandbox': Sandbox,
      'app-customGameLauncher': CustomGameLauncher,
      'app-customGameSessionManager': CustomGameSessionManager,
      
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
  html {
    height: 100%;
  }

  .btn-outline-dark:not(:hover), .btn-outline-primary:not(:hover) {
    background-color:white;
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

  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: #000d1b;
    padding-top: 20px;
    
    position: relative;
    min-height: 100vh;
  }

  .game-room {
    text-align: center;
    max-width:600px;
  }

  body {
    background: beige;
    height: 100%;
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

  ul.navbar-nav {
    list-style-type: none;
  }

  li.nav-item {
    display: inline-block;
    margin: 0 10px;
  }

  .non-footer-content {
    padding-bottom: 3rem;
  }

</style>
