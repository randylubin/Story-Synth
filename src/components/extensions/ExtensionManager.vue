<template>
  <div class="">
      <div class="row">
        <div class="col-sm">
          <app-staticBox :staticBoxContent="extensionData.staticBoxContent" v-if="extensionData.staticBoxContent"></app-staticBox>
          <app-playerTurnOrder :playerTurnOrder="JSON.parse(extensionData.playerTurnOrder)" :currentCardIndex="roomInfo.currentCardIndex" @process-extension-update="processExtensionUpdate($event)" v-if="extensionList['playerTurnOrder']"></app-playerTurnOrder>
          <app-plusMinus :plusMinus="JSON.parse(extensionData.plusMinus)" :plusMinusTitle="extensionData.plusMinusTitle" @process-extension-update="processExtensionUpdate($event)" v-if="extensionList['plusMinus']"></app-plusMinus>
          <app-editableList :editableList="extensionData.editableList.split(',')" :editableListTitle="extensionData.editableListTitle" @process-extension-update="processExtensionUpdate($event)" v-if="extensionList['editableList']"></app-editableList>
          <app-diceRoller :diceResults="extensionData.diceRoller.split(',')" :diceRollerTitle="extensionData.diceRollerTitle" @process-extension-update="processExtensionUpdate($event)" v-if="extensionList['diceRoller']"></app-diceRoller>
          <app-standardDeck :standardDeck="JSON.parse(extensionData.standardDeck)" :standardDeckTitle="extensionData.standardDeckTitle" @process-extension-update="processExtensionUpdate($event)" v-if="extensionList['standardDeck']"></app-standardDeck>
        </div>
      </div>
  </div>
</template>

<script>
import PlayerTurnOrder from './PlayerTurnOrder'
import PlusMinus from './PlusMinus.vue'
import EditableList from './EditableList.vue'
import DiceRoller from './DiceRoller.vue'
import StaticBox from './StaticBox.vue'
import StandardDeck from './StandardDeck.vue'

export default {
  name: 'app-extensionManager',
  components: {
    'app-plusMinus': PlusMinus,
    'app-editableList': EditableList,
    'app-diceRoller': DiceRoller,
    'app-staticBox': StaticBox,
    'app-playerTurnOrder': PlayerTurnOrder,
    'app-standardDeck': StandardDeck,
  },
  props: {
    extensionData: Object,
    extensionList: Object,
    roomInfo: Object,
  },
  data: function() {
    return {
      
    };
  },
  mounted(){

  },
  methods: {
    processExtensionUpdate(newData){
      //console.log('new data',newData)
      this.$set(this.extensionData, newData[0], newData[1])
      this.$emit('sync-extension')
    },
  }
};
</script>

<style scoped>


</style>