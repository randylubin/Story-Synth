<template>
  <div class="extension-manager">
      <div class="row">
        <div class="col-sm">
          <app-hexflowerAsExtension class="extension"
            :hexflowerAsExtension="Boolean(extensionData.hexflowerAsExtension)"
            :gSheetForExtension="extensionData.hexflowerAsExtension"
            :gSheetID="extensionData.hexflowerAsExtension.substring(extensionData.hexflowerAsExtension.indexOf('/d/') + 3, extensionData.hexflowerAsExtension.indexOf('/edit'))"
            :sheetData="hexflowerSheetData"
            :roomID="$route.params.roomID + '-hexflower-extensions'" v-if="Boolean(extensionData.hexflowerAsExtension) && ((!extensionList.hexflowerAsExtensionLocation && extensionLocation == 'lower') || (extensionList.hexflowerAsExtensionLocation == extensionLocation))"></app-hexflowerAsExtension>
          <app-generatorAsExtension class="extension"
            :generatorAsExtension="Boolean(extensionData.generatorAsExtension)"
            :gSheetForExtension="extensionData.generatorAsExtension"
            :gSheetID="extensionData.generatorAsExtension.substring(extensionData.generatorAsExtension.indexOf('/d/') + 3, extensionData.generatorAsExtension.indexOf('/edit'))"
            :sheetData="generatorSheetData"
            :roomID="$route.params.roomID + '-generator-extensions'" v-if="Boolean(extensionData.generatorAsExtension) && ((!extensionList.generatorAsExtensionLocation && extensionLocation == 'lower') || (extensionList.generatorAsExtensionLocation == extensionLocation))"></app-generatorAsExtension>
          <app-staticBox class="extension" :staticBoxContent="extensionData.staticBoxContent" v-if="extensionData.staticBoxContent && ((!extensionList.staticBoxLocation && extensionLocation == 'lower') || (extensionList.staticBoxLocation == extensionLocation))"></app-staticBox>
          <app-playerTurnOrder class="extension" :playerTurnOrder="JSON.parse(extensionData.playerTurnOrder)" :playerTurnOrderHeader="extensionData.playerTurnOrderHeader" :playerTurnOrderButtonLabel="extensionData.playerTurnOrderButtonLabel" :playerTurnOrderFirstVisible="parseInt(extensionData.playerTurnOrderFirstVisible)" :currentCardIndex="roomInfo.currentCardIndex" @process-extension-update="processExtensionUpdate($event)" v-if="extensionList['playerTurnOrder'] && ((!extensionList.playerTurnOrderLocation && extensionLocation == 'lower') || (extensionList.playerTurnOrderLocation == extensionLocation))"></app-playerTurnOrder>
          <app-plusMinus class="extension" :plusMinus="JSON.parse(extensionData.plusMinus)" :plusMinusTitle="extensionData.plusMinusTitle" @process-extension-update="processExtensionUpdate($event)" v-if="extensionList['plusMinus'] && ((!extensionList.plusMinusLocation && extensionLocation == 'lower') || (extensionList.plusMinusLocation == extensionLocation))"></app-plusMinus>
          <app-editableList class="extension" 
            :editableList="extensionData.editableList.split(',')" 
            :editableListTitle="extensionData.editableListTitle" 
            @process-extension-update="processExtensionUpdate($event)" 
            v-if="(extensionList['editableList'] || extensionList.editableListFirstVisible || extensionList.editableListTitle) && (!extensionList.editableListFirstVisible || extensionList.editableListFirstVisible <= roomInfo.currentCardIndex ) && ((!extensionList.editableListLocation && extensionLocation == 'lower') || (extensionList.editableListLocation == extensionLocation))"></app-editableList>
          <app-multiEditableLists class="extension" 
            :multiEditableLists="JSON.parse(extensionData.multiEditableLists)" 
            @process-extension-update="processExtensionUpdate($event)" 
            v-if="extensionList['multiEditableLists'] && (!extensionList.multiEditableListsFirstVisible || extensionList.multiEditableListsFirstVisible <= roomInfo.currentCardIndex) && ((!extensionList.multiEditableListsLocation && extensionLocation == 'lower') || (extensionList.multiEditableListsLocation == extensionLocation))"></app-multiEditableLists>
          <app-diceRoller class="extension" :diceResults="extensionData.diceRoller.split(',')" :diceRollerTitle="extensionData.diceRollerTitle" @process-extension-update="processExtensionUpdate($event)" v-if="extensionList['diceRoller'] && ((!extensionList.diceRollerLocation && extensionLocation == 'lower') || (extensionList.diceRollerLocation == extensionLocation))"></app-diceRoller>
          <app-standardDeck class="extension" :standardDeck="JSON.parse(extensionData.standardDeck)" :standardDeckTitle="extensionData.standardDeckTitle" @process-extension-update="processExtensionUpdate($event)" v-if="extensionList['standardDeck'] && ((!extensionList.standardDeckLocation && extensionLocation == 'lower') || (extensionList.standardDeckLocation == extensionLocation))"></app-standardDeck>
          <app-journal class="extension"
            :journalEntries="JSON.parse(extensionData.journalEntries)"
            :journalUpperText="extensionData.journalUpperText"
            :journalOrder="extensionData.journalOrder"
            @process-extension-update="processExtensionUpdate($event)"
            v-if="(extensionList['journalEntries'] || extensionList.journalUpperText) && ((!extensionList.journalEntiresLocation && extensionLocation == 'lower') || (extensionList.journalEntriesLocation == extensionLocation)) && (!extensionList.journalFirstVisible || extensionList.journalFirstVisible <= roomInfo.currentCardIndex)"></app-journal>
          <app-currentPlayerHeader class="extension" :playerTurnOrder="JSON.parse(extensionData.playerTurnOrder)" :currentPlayerHeader="extensionList.currentPlayerHeader" :playerTurnOrderFirstVisible="parseInt(extensionData.playerTurnOrderFirstVisible)" :currentCardIndex="roomInfo.currentCardIndex" @process-extension-update="processExtensionUpdate($event)" v-if="extensionList['currentPlayerHeader'] && extensionList['playerTurnOrder'] && extensionLocation == 'upper'"></app-currentPlayerHeader>
          <app-embedWebsite class="extension" :hardcodedWebsiteURL="extensionData.hardcodedWebsiteURL" :selectedWebsiteURL="extensionData.selectedWebsiteURL" :embedWebsiteMessage="extensionData.embedWebsiteMessage" @process-extension-update="processExtensionUpdate($event)" v-if="(extensionList['hardcodedWebsiteURL'] || extensionList['embedWebsiteMessage']) && ((!extensionList.embededWebsiteLocation && extensionLocation == 'lower') || (extensionList.embededWebsiteLocation == extensionLocation))"></app-embedWebsite>
          <!-- <app-downloadExtensionData :extensionData="extensionData" :gameTitle="gameTitle" v-if="(extensionList['journalEntries'] || extensionList['multiEditableLists'] || extensionList['editableList']) && ((!extensionList.downloadExtensionDataLocation && extensionLocation == 'lower') || (extensionList.downloadExtensionDataLocation == extensionLocation))"></app-downloadExtensionData> -->
        </div>
      </div>
  </div>
</template>

<script>
import axios from 'axios'

// import DownloadExtensionData from './DownloadExtensionData.vue'

export default {
  name: 'app-extensionManager',
  components: {
    'app-currentPlayerHeader': () => import('./CurrentPlayerHeader.vue'),
    'app-diceRoller': () => import('./DiceRoller.vue'),
    'app-editableList': () => import('./EditableList.vue'),
    'app-embedWebsite': () => import('./EmbedWebsite.vue'),
    'app-generatorAsExtension': () => import('../formats/Generator.vue'),
    'app-hexflowerAsExtension': () => import('../formats/Hexflower.vue'),
    'app-journal': () => import('./Journal.vue'),
    'app-multiEditableLists': () => import('./MultiEditableLists.vue'),
    'app-playerTurnOrder': () => import('./PlayerTurnOrder'),
    'app-plusMinus': () => import('./PlusMinus.vue'),
    'app-standardDeck': () => import('./StandardDeck.vue'),
    'app-staticBox': () => import('./StaticBox.vue'),
    // 'app-downloadExtensionData': DownloadExtensionData,
  },
  props: {
    extensionData: Object,
    extensionList: Object,
    extensionLocation: String,
    roomInfo: Object,
    gameTitle: String,
  },
  data: function() {
    return {
      generatorSheetData: null,
      hexflowerSheetData: null,
    };
  },
  watch: {
    'extensionList.generatorAsExtension': function() {
      if (this.extensionData.generatorAsExtension){
        let sheetID = this.extensionData.generatorAsExtension.substring(this.extensionData.generatorAsExtension.indexOf('/d/') + 3, this.extensionData.generatorAsExtension.indexOf('/edit'))
        this.fetchDataForEmbeddedFormat(sheetID, 'generatorSheetData')
      }
    },
    'extensionList.hexflowerAsExtension': function() {
      if (this.extensionData.hexflowerAsExtension){
        let sheetID = this.extensionData.hexflowerAsExtension.substring(this.extensionData.hexflowerAsExtension.indexOf('/d/') + 3, this.extensionData.hexflowerAsExtension.indexOf('/edit'))
        this.fetchDataForEmbeddedFormat(sheetID, 'hexflowerSheetData')
      }
    },
  },
  mounted(){
    if (this.extensionData.generatorAsExtension){
      let sheetID = this.extensionData.generatorAsExtension.substring(this.extensionData.generatorAsExtension.indexOf('/d/') + 3, this.extensionData.generatorAsExtension.indexOf('/edit'))
      this.fetchDataForEmbeddedFormat(sheetID, 'generatorSheetData')
    }

    if (this.extensionData.hexflowerAsExtension){
      let sheetID = this.extensionData.hexflowerAsExtension.substring(this.extensionData.hexflowerAsExtension.indexOf('/d/') + 3, this.extensionData.hexflowerAsExtension.indexOf('/edit'))
      this.fetchDataForEmbeddedFormat(sheetID, 'hexflowerSheetData')
    }

  },
  methods: {
    processExtensionUpdate(newData){
      //console.log('new data',newData)
      this.$set(this.extensionData, newData[0], newData[1])
      this.$emit('sync-extension', this.extensionData)
    },
    fetchDataForEmbeddedFormat(sheetID, varName){
      // Remove for published version
      if (!sheetID || sheetID == "demo") {
        sheetID = "1N5eeyKTVWo5QeGcUV_zYtwtR0DikJCcvcj6w69UkC1w";
      }

      // For published version, set getURL equal to the url of your spreadsheet
      let getURL =
        "https://sheets.googleapis.com/v4/spreadsheets/" +
        sheetID +
        "?includeGridData=true&ranges=a1:aa400&key=" + process.env.VUE_APP_FIREBASE_API_KEY;

      axios
        .get(getURL)
        .then((response) => {
          console.log('DAAAAAAATA', response.data.sheets[0].data[0].rowData)
          this[varName] = response.data.sheets[0].data[0].rowData
        })
        .catch((error) => {
          console.log(error.message, error);
          this[varName] = error
        })
        
    }
  }
};
</script>

<style scoped>
.extension-manager {
  margin:auto;
  max-width: 600px;
  text-align: center;
}
</style>