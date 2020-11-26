<template>
  <div id="app">
    <!-- <router-view></router-view>-->
    <div v-if="$route.path !== '/about'">
      <div class="non-footer-content">
        <app-header :routeRoomID="$route.params.roomID"></app-header>
        
        <div v-if="$route.fullPath == '/'">
          <app-gameMaker :routeRoomID="$route.params.roomID" :routeGSheetID="$route.params.gSheetID" :routeGameType="$route.params.gameType"></app-gameMaker>
        </div>
        
        <div v-if="!$route.params.roomID && $route.params.gSheetID">
          <app-gameLauncher :routeGSheetID="$route.params.gSheetID" :routeGameType="$route.params.gameType"></app-gameLauncher>
        </div>
        

        <div>
          <!--For published version, remove any components you aren't using -->
          <app-timed :roomID="$route.params.roomID" :gSheetID="$route.params.gSheetID" v-if="$route.params.gameType=='Timed' && $route.params.roomID"></app-timed>
          <app-shuffled :roomID="$route.params.roomID" :gSheetID="$route.params.gSheetID" v-if="$route.params.gameType=='Shuffled' && $route.params.roomID"></app-shuffled>
          <app-monster :roomID="$route.params.roomID" :gSheetID="$route.params.gSheetID" v-if="$route.params.gameType=='Monster' && $route.params.roomID"></app-monster>
          <app-secretCards :roomID="$route.params.roomID" :gSheetID="$route.params.gSheetID" v-if="$route.params.gameType=='SecretCards' && $route.params.roomID"></app-secretCards>
          <app-slotMachine :roomID="$route.params.roomID" :gSheetID="$route.params.gSheetID" v-if="$route.params.gameType=='SlotMachine' && $route.params.roomID"></app-slotMachine>
          <app-phases :roomID="$route.params.roomID" :gSheetID="$route.params.gSheetID" v-if="$route.params.gameType=='Phases' && $route.params.roomID"></app-phases>
        </div>
      </div>
      
      <app-footer v-if="$route.params.roomID"></app-footer>
    </div>
  </div>
</template>

<script>

  // Remove for published version any components you aren't using
  import GameMaker from './components/launchers/GameMaker.vue'
  import GameLauncher from './components/launchers/GameLauncher.vue'
  import Timed from './components/formats/Timed.vue'
  import Shuffled from './components/formats/Shuffled.vue'
  import Monster from './components/formats/Monster.vue'
  import SecretCards from './components/formats/SecretCards.vue'
  import SlotMachine from './components/formats/SlotMachine.vue'
  import Phases from './components/formats/Phases.vue'
  import Header from './components/layout/Header.vue'
  import Footer from './components/layout/Footer.vue'


  export default {
    name: 'app',
    components: { // Remove unused components from the published version
      'app-gameMaker': GameMaker,
      'app-gameLauncher': GameLauncher,
      'app-timed': Timed,
      'app-shuffled': Shuffled,
      'app-monster': Monster,
      'app-secretCards': SecretCards,
      'app-slotMachine': SlotMachine,
      'app-phases': Phases,
      'app-header': Header,
      'app-footer': Footer,
    },
    data () {
      return {
      }
    },
    mounted () {

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
  }

  h1, h2 {
    font-weight: normal;
  }

  ul {
    list-style-type: none;
    padding: 0;
  }

  li {
    display: inline-block;
    margin: 0 10px;
  }

  .non-footer-content {
    padding-bottom: 3rem;
  }

</style>
