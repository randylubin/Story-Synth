<template>
  <div id="app">
    <!-- <router-view></router-view>-->
    <div v-if="$route.path !== '/about'">
      <div class="non-footer-content">
        <app-roomPicker :routeRoomID="$route.params.roomID" :routeGSheetID="$route.params.gSheetID" :routeGameType="$route.params.gameType"></app-roomPicker>

        <!-- Remove for published version any components you aren't using -->
        <app-timed :roomID="$route.params.roomID" :gSheetID="$route.params.gSheetID" v-if="$route.params.gameType=='Timed' && $route.params.roomID"></app-timed>
        <app-shuffled :roomID="$route.params.roomID" :gSheetID="$route.params.gSheetID" v-if="$route.params.gameType=='Shuffled' && $route.params.roomID"></app-shuffled>
        <app-monster :roomID="$route.params.roomID" :gSheetID="$route.params.gSheetID" v-if="$route.params.gameType=='Monster' && $route.params.roomID"></app-monster>
        <app-secretCards :roomID="$route.params.roomID" :gSheetID="$route.params.gSheetID" v-if="$route.params.gameType=='SecretCards' && $route.params.roomID"></app-secretCards>
        <app-slotMachine :roomID="$route.params.roomID" :gSheetID="$route.params.gSheetID" v-if="$route.params.gameType=='SlotMachine' && $route.params.roomID"></app-slotMachine>
        <app-phases :roomID="$route.params.roomID" :gSheetID="$route.params.gSheetID" v-if="$route.params.gameType=='Phases' && $route.params.roomID"></app-phases>
      </div>
      
      <app-footer v-if="$route.params.roomID"></app-footer>
    </div>
  </div>
</template>

<script>

  // Remove for published version any components you aren't using
  import Timed from './components/Timed.vue'
  import Shuffled from './components/Shuffled.vue'
  import Monster from './components/Monster.vue'
  import RoomPicker from './components/RoomPicker.vue'
  import SecretCards from './components/SecretCards.vue'
  import SlotMachine from './components/SlotMachine.vue'
  import Phases from './components/Phases.vue'
  import Footer from './components/Footer.vue'


  export default {
    name: 'app',
    components: { // Remove from published version any you aren't using
      'app-timed': Timed,
      'app-roomPicker': RoomPicker,
      'app-shuffled': Shuffled,
      'app-monster': Monster,
      'app-secretCards': SecretCards,
      'app-slotMachine': SlotMachine,
      'app-phases': Phases,
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
}

body {
    background: beige;
    // background: #3131bb;  /* fallback for old browsers */
    // background: -webkit-linear-gradient(to top, #3131bb, #97a5ff);  /* Chrome 10-25, Safari 5.1-6 */
    // background: linear-gradient(to top, #3131bb, #97a5ff); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
    max-width: 600px;
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
