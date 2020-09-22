<template>
  <div id="app">
    <!-- <router-view></router-view>-->
    <app-roomPicker :routeGSheetID="$route.params.gSheetID" :routeGameType="$route.params.gameType"></app-roomPicker>

    <app-clock :roomID="$route.params.roomID" :gSheetID="$route.params.gSheetID" v-if="$route.params.gameType=='FFF' && $route.params.roomID"></app-clock>
    <app-DFTQ :roomID="$route.params.roomID" :gSheetID="$route.params.gSheetID" v-if="$route.params.gameType=='DFTQ' && $route.params.roomID"></app-DFTQ>
    <app-monster :roomID="$route.params.roomID" :gSheetID="$route.params.gSheetID" v-if="$route.params.gameType=='Monster' && $route.params.roomID"></app-monster>
  </div>
</template>

<script>
  import Clock from './components/Clock.vue'
  import DFTQ from './components/DFTQ.vue'
  import Monster from './components/Monster.vue'
  import RoomPicker from './components/RoomPicker.vue'


  export default {
    name: 'app',
    components: {
      'app-clock': Clock,
      'app-roomPicker': RoomPicker,
      'app-DFTQ': DFTQ,
      'app-monster': Monster,
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
