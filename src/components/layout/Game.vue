<template>
    <div class="container">
      <!--For published version, remove any components you aren't using -->
      <div v-if="!$route.params.roomID && $route.params.gSheetID">
        <app-gameLauncher :routeGSheetID="$route.params.gSheetID" :routeGameType="$route.params.gameType"></app-gameLauncher>
      </div>

      <div v-if="$route.params.roomID && $route.params.gSheetID">
        <app-timed :roomID="$route.params.roomID" :gSheetID="$route.params.gSheetID" v-if="$route.params.gameType=='Timed'"></app-timed>
        <app-shuffled ref="shuffled" :roomID="$route.params.roomID" :gSheetID="$route.params.gSheetID" :userRole="$route.params.userRole" v-if="$route.params.gameType=='Shuffled'"></app-shuffled>
        <app-monster :roomID="$route.params.roomID" :gSheetID="$route.params.gSheetID" v-if="$route.params.gameType=='Monster'"></app-monster>
        <app-secretCards :roomID="$route.params.roomID" :gSheetID="$route.params.gSheetID" v-if="$route.params.gameType=='SecretCards'"></app-secretCards>
        <app-slotMachine :roomID="$route.params.roomID" :gSheetID="$route.params.gSheetID" v-if="($route.params.gameType=='SlotMachine' || $route.params.gameType=='Composite')"></app-slotMachine>
        <app-phases :roomID="$route.params.roomID" :gSheetID="$route.params.gSheetID" v-if="$route.params.gameType=='Phases'"></app-phases>
        <app-generator :roomID="$route.params.roomID" :gSheetID="$route.params.gSheetID" v-if="$route.params.gameType=='Generator'"></app-generator>
        <app-hexflower :roomID="$route.params.roomID" :gSheetID="$route.params.gSheetID" v-if="$route.params.gameType=='Hexflower'"></app-hexflower>
        <app-gridmap :roomID="$route.params.roomID" :gSheetID="$route.params.gSheetID" v-if="$route.params.gameType=='Gridmap'"></app-gridmap>

        <app-sandbox :roomID="$route.params.roomID" :gSheetID="$route.params.gSheetID" v-if="$route.params.gameType=='Sandbox'"></app-sandbox>
      </div>

    </div>
</template>

<script>
export default {
  name: 'app-game',
  data: function() {
    return {
    };
  },
  components: {
    "app-gameLauncher": () => import('../launchers/GameLauncher.vue'),

    'app-timed': () => import('../formats/Timed.vue'),
    'app-shuffled': () => import('../formats/Shuffled.vue'),
    'app-monster': () => import('../formats/Monster.vue'),
    'app-secretCards': () => import('../formats/SecretCards.vue'),
    'app-slotMachine': () => import('../formats/SlotMachine.vue'),
    'app-phases': () => import('../formats/Phases.vue'),
    'app-generator': () => import('../formats/Generator.vue'),
    'app-gridmap': () => import('../formats/Gridmap.vue'),
    'app-hexflower': () => import('../formats/Hexflower.vue'),
    'app-sandbox': () => import('../formats/Sandbox.vue'),
  }
};
</script>

<style scoped>


</style>