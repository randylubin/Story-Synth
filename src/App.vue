<template>
  <div id="app">
    <!-- <router-view></router-view>-->
    <app-roomPicker :routeGSheetID="$route.params.gSheetID" :routeGameType="$route.params.gameType"></app-roomPicker>

    <app-timed :roomID="$route.params.roomID" :gSheetID="$route.params.gSheetID" v-if="$route.params.gameType=='Timed' && $route.params.roomID"></app-timed>
    <app-DFTQ :roomID="$route.params.roomID" :gSheetID="$route.params.gSheetID" v-if="$route.params.gameType=='DFTQ' && $route.params.roomID"></app-DFTQ>
    <app-monster :roomID="$route.params.roomID" :gSheetID="$route.params.gSheetID" v-if="$route.params.gameType=='Monster' && $route.params.roomID"></app-monster>
    <app-secretCards :roomID="$route.params.roomID" :gSheetID="$route.params.gSheetID" v-if="$route.params.gameType=='SecretCards' && $route.params.roomID"></app-secretCards>
  </div>
</template>

<script>
  import Timed from './components/Timed.vue'
  import DFTQ from './components/DFTQ.vue'
  import Monster from './components/Monster.vue'
  import RoomPicker from './components/RoomPicker.vue'
  import SecretCards from './components/SecretCards.vue'


  export default {
    name: 'app',
    components: {
      'app-timed': Timed,
      'app-roomPicker': RoomPicker,
      'app-DFTQ': DFTQ,
      'app-monster': Monster,
      'app-secretCards': SecretCards
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
  text-align: center;
  color: #000d1b;
  padding-top: 20px;
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

a {
  color: #3c3c3c;
}
</style>
