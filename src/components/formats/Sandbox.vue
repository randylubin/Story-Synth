<template>
  <div class="container game-room">
      <div class="row">
        <div class="col-sm">
          <h1>Sandbox</h1>
          <div v-if="dataReady && firebaseReady && roomInfo && roomInfo.toolkitData">
            <app-toolkit @sync-toolkit="syncToolkit()" :customOptions="roomInfo.toolkitData"></app-toolkit>
          </div>
        </div>
      </div>
  </div>
</template>

<script>
import Toolkit from '../toolkit/Toolkit.vue'
import axios from 'axios'
import { roomsCollection } from '../../firebase';

export default {
  name: 'app-sandbox',
  components: {
    'app-toolkit': Toolkit,
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
      tempToolkitData: {test:null},
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

          roomsCollection.doc(this.roomID).set({toolkitData: this.tempToolkitData,currentCardIndex:0, xCardIsActive: false, cardSequence:[0,1,2], currentPhase: 0})
        }
      })
      .catch((error) => {
        console.log('error in loading: ', error)
      })
  },
  methods: {
    syncToolkit(){
      roomsCollection.doc(this.roomID).update({
        toolkitData: this.roomInfo.toolkitData
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

            // Handle toolkit
            if (item.values[0].formattedValue == "toolkit"){
              if(this.firebaseReady && this.roomInfo){
                this.$set(this.roomInfo.toolkitData, item.values[1].formattedValue, item.values[2].formattedValue)
              } else {
                this.tempToolkitData[item.values[1].formattedValue] = item.values[2].formattedValue
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