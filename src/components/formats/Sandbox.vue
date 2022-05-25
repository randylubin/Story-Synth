<template>
  <div class="game-room sandbox">

    <app-menuBar
      :roomInfo="roomInfo"
      :tempExtensionData="tempExtensionData"
      :customOptions="customOptions"
      :monetizedByUser="monetizedByUser"
      :routeRoomID="$route.params.roomID"
      :dataReady="dataReady"
      :firebaseReady="firebaseReady"
      @roomMonetized="updateRoomMonetization"
    ></app-menuBar>

    <div class="row">
      <div class="col-sm">
        <b-alert show class="demoInfo" variant="info" v-if="customOptions.demoInfo">This demo is powered by <a :href="customOptions.demoInfo" target="_blank">this Google Sheet Template</a>. Copy the sheet and start editing it to design your own game!</b-alert>
        <h1 class="game-meta">Sandbox</h1>
        <div v-if="dataReady && firebaseReady && roomInfo && Object.keys(roomInfo.extensionData).length > 1">
          <app-extensionManager @sync-extension="syncExtension()" :gameTitle="customOptions.gameTitle" :extensionData="roomInfo.extensionData" :extensionList="tempExtensionData" :roomInfo="roomInfo"></app-extensionManager>
        </div>
      </div>
    </div>

    <link v-bind:href="selectedWallet">
  </div>
</template>

<script>
import ExtensionManager from '../extensions/ExtensionManager.vue'
import { roomsCollection } from '../../firebase';

export default {
  name: 'app-sandbox',
  components: {
    'app-extensionManager': ExtensionManager,
    'app-menuBar': () => import("../layout/MenuBar.vue"),
  },
  props: {
    gSheetID: String,
    roomID: String,
    sheetData: Array,
  },
  data: function() {
    return {
      customOptions: {
        gameTitle: undefined,
        byline: undefined,
        gameBlurb: undefined,
        password: undefined,
        wallet: undefined,
        revShare: 0.2,
      },
      roomInfo: {
        extensionData: {}
      },
      tempExtensionData: {test:null},
      dataReady: false,
      firebaseReady: false,
      selectedWallet: undefined,
      roomMonetized: null,
      monetizedByUser: false,
    };
  },
  metaInfo() {
    return {
      title: this.customOptions.gameTitle,
      meta: [
        {
          property: "description",
          content: this.customOptions.gameBlurb,
          vmid: "description",
        },
        {
          property: "og:title",
          content: this.customOptions.gameTitle,
          vmid: "og:title",
        },
        {
          property: "og:description",
          content: this.customOptions.gameBlurb,
          vmid: "og:description",
        },
        {
          property: "og:image",
          content: this.customOptions.ogImageSquare,
          vmid: "og:image",
        },
        {
          property: "og:url",
          content: "https://storysynth.org/#" + this.$route.fullPath,
          vmid: "og:url",
        },
        {
          property: "twitter:card",
          content: "summary",
          vmid: "twitter:card",
        },
        {
          property: "og:site_name",
          content: "Story Synth",
          vmid: "og:site_name",
        },
        {
          property: "twitter:image:alt",
          content: this.customOptions.gameTitle + " logo",
          vmid: "twitter:image:alt",
        },
        {
          name: "monetization",
          content: this.selectedWallet,
          vmid: "monetization",
        },
      ],
    };
  },
  watch: {
    sheetData: function(){
      this.processSheetData();
    },
  },
  mounted(){
    if (document.monetization?.state == "started") {
      this.monetizationStarted()
    }
    document.monetization?.addEventListener('monetizationstart', () => {
      this.monetizationStarted()
    })

    if (this.sheetData){
      this.processSheetData();
    }

    this.$bind('roomInfo', roomsCollection.doc(this.roomID))
      .then(() => {
        this.firebaseReady = true
        this.$emit('firebase-ready', true);
      })
      .then(() => {
        if (!this.roomInfo){
          console.log("new room!")

          roomsCollection.doc(this.roomID).set({
            extensionData: this.tempExtensionData,
            xCardIsActive: false,
          })
        }
      })
      .catch((error) => {
        console.log('error in loading: ', error)
      })
  },
  methods: {
    monetizationStarted() {
      console.log('monetizing')
      this.monetizedByUser = true;
    },
    updateRoomMonetization(monetizationValue){
      this.roomMonetized = monetizationValue;
      console.log("room is now monetizied")
    },
    syncExtension(){
      roomsCollection.doc(this.roomID).update({
        extensionData: this.roomInfo.extensionData,
        timeLastUpdated: Date.now(),
      })
    },
    processSheetData() {
      if (this.sheetData){
        this.sheetData.forEach((item, i) => {
      
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

        this.dataReady = true;
        
        if (location.hostname.toString() !== 'localhost'){
          this.$mixpanel.track('Visit Game Session', {
            game_name: this.customOptions.gameTitle ?? 'untitled-sandbox',
            session_url: location.hostname.toString() + this.$route.fullPath,
            format: 'Sandbox'
          });
        }

      }     
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

</style>