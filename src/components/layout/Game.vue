<template>
    <div>
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