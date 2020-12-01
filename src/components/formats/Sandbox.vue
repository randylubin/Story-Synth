<template>
  <div class="container game-room">
      <div class="row">
        <div class="col-sm">
          <h1>Sandbox</h1>
          <div v-if="dataReady && firebaseReady && roomInfo && roomInfo.extensionData">
            <app-extensionManager @sync-extension="syncExtension()" :extensionData="roomInfo.extensionData" :extensionList="tempExtensionData" :roomInfo="roomInfo"></app-extensionManager>
          </div>
        </div>
      </div>
  </div>
</template>

<script>
import ExtensionManager from '../extensions/ExtensionManager.vue'
import axios from 'axios'
import { roomsCollection } from '../../firebase';

export default {
  name: 'app-sandbox',
  components: {
    'app-extensionManager': ExtensionManager,
  },
  props: {
    gSheetID: String,
    roomID: String,
  },
  data: function() {
    return {
      customOptions: {

      },
      roomInfo: {
        
      },
      tempExtensionData: {test:null},
      dataReady: false,
      firebaseReady: false,
    };
  },
  mounted(){
    this.fetchAndCleanSheetData(this.gSheetID);

    this.$bind('roomInfo', roomsCollection.doc(this.roomID))
      .then(() => {
        this.firebaseReady = true
      })
      .then(() => {
        if (!this.roomInfo){
          console.log("new room!")

          roomsCollection.doc(this.roomID).set({extensionData: this.tempExtensionData,currentCardIndex:0, xCardIsActive: false, cardSequence:[0,1,2], currentPhase: 0})
        }
      })
      .catch((error) => {
        console.log('error in loading: ', error)
      })
  },
  methods: {
    syncExtension(){
      roomsCollection.doc(this.roomID).update({
        extensionData: this.roomInfo.extensionData
      })
    },
    fetchAndCleanSheetData(sheetID){

      // Remove for published version
      if (!sheetID || sheetID == 'demo') {
        sheetID = '1N5eeyKTVWo5QeGcUV_zYtwtR0DikJCcvcj6w69UkC1w'
      }

      // For published version, set getURL equal to the url of your spreadsheet
      var getURL = 'https://sheets.googleapis.com/v4/spreadsheets/' + sheetID + '?includeGridData=true&ranges=a1:aa100&key=AIzaSyDsIM5nJ3hNoVRCSd3kJXfrAL8_n9gwFdM'


      // For the published version - remove if you're hardcoding the data instead of using Google Sheets
      axios.get(getURL)
      .then(response => {
        var gRows = response.data.sheets[0].data[0].rowData

        // Transform Sheets API response into cleanData
        gRows.forEach((item, i) => {
          if (i !== 0 && item.values[0].formattedValue){

            // Handle options
            if (item.values[0].formattedValue == "option"){
              this.$set(this.customOptions, item.values[1].formattedValue, item.values[2].formattedValue)
              console.log(item.values[1].formattedValue, item.values[2].formattedValue)
              console.log('options:', this.customOptions)
            }

            // Handle extensions
            if (item.values[0].formattedValue == "extension"){
              if(this.firebaseReady && this.roomInfo){
                this.tempExtensionData[item.values[1].formattedValue] = item.values[2].formattedValue
                this.$set(this.roomInfo.extensionData, item.values[1].formattedValue, item.values[2].formattedValue)
              } else {
                this.tempExtensionData[item.values[1].formattedValue] = item.values[2].formattedValue
              }
              console.log(item.values[1].formattedValue, item.values[2].formattedValue)
            }
          }
        });

        this.dataReady = true;

      }).catch(error => {
        console.log(error.message, error)
      })      
    }
  }
};
</script>

<style scoped>


</style>