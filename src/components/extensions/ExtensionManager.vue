<template>
  <div class="">
      <div class="row">
        <div class="col-sm">
          <app-hexflowerAsExtension class="extension" :hexflowerAsExtension="Boolean(extensionData.hexflowerAsExtension)" :gSheetForExtension="extensionData.hexflowerAsExtension" :gSheetID="extensionData.hexflowerAsExtension.substring(extensionData.hexflowerAsExtension.indexOf('/d/') + 3, extensionData.hexflowerAsExtension.indexOf('/edit'))" :roomID="$route.params.roomID + '-hexflower-extensions'" v-if="Boolean(extensionData.hexflowerAsExtension) && ((!extensionList.hexflowerAsExtensionLocation && extensionLocation == 'lower') || (extensionList.hexflowerAsExtensionLocation == extensionLocation))"></app-hexflowerAsExtension>
          <app-staticBox class="extension" :staticBoxContent="extensionData.staticBoxContent" v-if="extensionData.staticBoxContent && ((!extensionList.staticBoxLocation && extensionLocation == 'lower') || (extensionList.staticBoxLocation == extensionLocation))"></app-staticBox>
          <app-playerTurnOrder class="extension" :playerTurnOrder="JSON.parse(extensionData.playerTurnOrder)" :playerTurnOrderHeader="extensionData.playerTurnOrderHeader" :playerTurnOrderButtonLabel="extensionData.playerTurnOrderButtonLabel" :playerTurnOrderFirstVisible="parseInt(extensionData.playerTurnOrderFirstVisible)" :currentCardIndex="roomInfo.currentCardIndex" @process-extension-update="processExtensionUpdate($event)" v-if="extensionList['playerTurnOrder'] && ((!extensionList.playerTurnOrderLocation && extensionLocation == 'lower') || (extensionList.playerTurnOrderLocation == extensionLocation))"></app-playerTurnOrder>
          <app-plusMinus class="extension" :plusMinus="JSON.parse(extensionData.plusMinus)" :plusMinusTitle="extensionData.plusMinusTitle" @process-extension-update="processExtensionUpdate($event)" v-if="extensionList['plusMinus'] && ((!extensionList.plusMinusLocation && extensionLocation == 'lower') || (extensionList.plusMinusLocation == extensionLocation))"></app-plusMinus>
          <app-editableList class="extension" :editableList="extensionData.editableList.split(',')" :editableListTitle="extensionData.editableListTitle" @process-extension-update="processExtensionUpdate($event)" v-if="(extensionList['editableList'] || extensionList.editableListFirstVisible || extensionList.editableListTitle) && (!extensionList.editableListFirstVisible || extensionList.editableListFirstVisible <= roomInfo.currentCardIndex ) && ((!extensionList.editableListLocation && extensionLocation == 'lower') || (extensionList.editableListLocation == extensionLocation))"></app-editableList>
          <app-multiEditableLists class="extension" :multiEditableLists="JSON.parse(extensionData.multiEditableLists)" @process-extension-update="processExtensionUpdate($event)" v-if="extensionList['multiEditableLists'] && ((!extensionList.multiEditableListsLocation && extensionLocation == 'lower') || (extensionList.multiEditableListsLocation == extensionLocation))"></app-multiEditableLists>
          <app-diceRoller class="extension" :diceResults="extensionData.diceRoller.split(',')" :diceRollerTitle="extensionData.diceRollerTitle" @process-extension-update="processExtensionUpdate($event)" v-if="extensionList['diceRoller'] && ((!extensionList.diceRollerLocation && extensionLocation == 'lower') || (extensionList.diceRollerLocation == extensionLocation))"></app-diceRoller>
          <app-standardDeck class="extension" :standardDeck="JSON.parse(extensionData.standardDeck)" :standardDeckTitle="extensionData.standardDeckTitle" @process-extension-update="processExtensionUpdate($event)" v-if="extensionList['standardDeck'] && ((!extensionList.standardDeckLocation && extensionLocation == 'lower') || (extensionList.standardDeckLocation == extensionLocation))"></app-standardDeck>
          <app-journal class="extension" :journalEntries="JSON.parse(extensionData.journalEntries)" :journalUpperText="extensionData.journalUpperText" @process-extension-update="processExtensionUpdate($event)" v-if="(extensionList['journalEntries'] || extensionList.journalUpperText) && ((!extensionList.journalEntiresLocation && extensionLocation == 'lower') || (extensionList.journalEntriesLocation == extensionLocation))"></app-journal>
          <app-currentPlayerHeader class="extension" :playerTurnOrder="JSON.parse(extensionData.playerTurnOrder)" :currentPlayerHeader="extensionList.currentPlayerHeader" :playerTurnOrderFirstVisible="parseInt(extensionData.playerTurnOrderFirstVisible)" :currentCardIndex="roomInfo.currentCardIndex" @process-extension-update="processExtensionUpdate($event)" v-if="extensionList['currentPlayerHeader'] && extensionList['playerTurnOrder'] && extensionLocation == 'upper'"></app-currentPlayerHeader>
        </div>
      </div>
  </div>
</template>

<script>
import PlayerTurnOrder from './PlayerTurnOrder'
import CurrentPlayerHeader from './CurrentPlayerHeader.vue'
import PlusMinus from './PlusMinus.vue'
import EditableList from './EditableList.vue'
import MultiEditableLists from './MultiEditableLists.vue'
import DiceRoller from './DiceRoller.vue'
import StaticBox from './StaticBox.vue'
import StandardDeck from './StandardDeck.vue'
import Journal from './Journal.vue'
import Hexflower from '../formats/Hexflower.vue'

export default {
  name: 'app-extensionManager',
  components: {
    'app-plusMinus': PlusMinus,
    'app-editableList': EditableList,
    'app-multiEditableLists': MultiEditableLists,
    'app-diceRoller': DiceRoller,
    'app-staticBox': StaticBox,
    'app-playerTurnOrder': PlayerTurnOrder,
    'app-currentPlayerHeader': CurrentPlayerHeader,
    'app-standardDeck': StandardDeck,
    'app-journal': Journal,
    'app-hexflowerAsExtension': Hexflower,
  },
  props: {
    extensionData: Object,
    extensionList: Object,
    extensionLocation: String,
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