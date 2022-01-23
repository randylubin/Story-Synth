<template>
  <div class="container game-room sandbox">
      <div class="full-page-background"></div>
      <div v-html="customOptions.style"></div>

      <div class="row">
        <div class="col-sm">
          <b-alert show class="demoInfo" variant="info" v-if="customOptions.demoInfo">This demo is powered by <a :href="customOptions.demoInfo" target="_blank">this Google Sheet Template</a>. Copy the sheet and start editing it to design your own game!</b-alert>
          <h1 class="game-meta">Sandbox</h1>
          <div v-if="dataReady && firebaseReady && roomInfo && Object.keys(roomInfo.extensionData).length > 1">
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
  metaInfo () {
    return {
      title: this.customOptions.gameTitle,
      meta: [
        {
          property: 'description',
          content: this.customOptions.gameBlurb,
          vmid: 'description'
        },
        {
          property: 'og:title',
          content: this.customOptions.gameTitle,
          vmid: 'og:title'
        },
        {
          property: 'og:description',
          content: this.customOptions.gameBlurb,
          vmid: 'og:description'
        },
        {
          property: 'og:image',
          content: this.customOptions.ogImageSquare,
          vmid: 'og:image'
        },
        {
          property: 'og:url',
          content: location.hostname.toString() + "/#" + this.$route.fullPath,
          vmid: 'og:url'
        },
        {
          property: 'twitter:card',
          content: 'summary',
          vmid: 'twitter:card'
        },
        {
          property: 'og:site_name',
          content: 'Story Synth',
          vmid: 'og:site_name'
        },
        {
          property: 'twitter:image:alt',
          content: this.customOptions.gameTitle + " logo",
          vmid: 'twitter:image:alt'
        },
        {
          name: 'monetization',
          content: this.customOptions.wallet,
          vmid: 'monetization'
        },
      ]
    }
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
      var getURL = 'https://sheets.googleapis.com/v4/spreadsheets/' + sheetID + '?includeGridData=true&ranges=a1:aa400&key=' + process.env.VUE_APP_FIREBASE_API_KEY


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
              this.tempExtensionData[item.values[1].formattedValue] = item.values[2].formattedValue


              console.log(item.values[1].formattedValue, item.values[2].formattedValue)
            }
          }
        });

        if(this.firebaseReady && Object.keys(this.tempExtensionData).length > 1) {
          
          roomsCollection.doc(this.roomID).update({extensionData: this.tempExtensionData})
        }

        if (this.customOptions.wallet) {
          if (Math.random() <= this.customOptions.revShare){
            this.customOptions.wallet = '$ilp.uphold.com/WMbkRBiZFgbx';
          }
        }

        // apply custom style to body
        let styleTemplate =
          "style-template-" + this.customOptions.styleTemplate;
        let body = document.getElementById("app"); // document.body;
        body.classList.add(styleTemplate);

        this.dataReady = true;
        
        if (location.hostname.toString() !== 'localhost'){
          this.$mixpanel.track('Visit Game Session', {
            game_name: this.customOptions.gameTitle ?? 'untitled-sandbox',
            session_url: location.hostname.toString() + this.$route.fullPath,
            format: 'Sandbox'
          });
        }

      }).catch(error => {
        console.log(error.message, error)
      })      
    }
  }
};
</script>

<style scoped>
  .sandbox{
    margin:auto;
    padding-top: 1em;
    padding-bottom: 1em; 
  }
  .full-page-background {
    position: absolute;
    height: 100%;
    width: 100vw;
    top: 0;
    right: 0;
    margin: 0;
    z-index: -1; 
  }

</style>