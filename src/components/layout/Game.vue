<template>
    <div class="container game-container">
      <!--For published version, remove any components you aren't using -->
      <div v-if="!$route.params.roomID && $route.params.gSheetID">
        <app-gameLauncher :routeGSheetID="$route.params.gSheetID" :routeGameType="$route.params.gameType" @firebase-ready="firebaseIsReady($event)"></app-gameLauncher>
      </div>

      <div v-if="$route.params.roomID && $route.params.gSheetID">
        <div class="full-page-background"></div>
        <div v-dompurify-html="customOptions.style"></div> 
        <app-monetization :customOptions="customOptions" :roomMonetized="roomMonetized"></app-monetization>
        
        <!-- Loading Spinner -->
        <b-overlay :show="(!dataReady || !firebaseReady) && !error" no-wrap>
          <template #overlay>
            <h1>Loading</h1>
            <div v-if="customOptions.debugLoading == 'TRUE'">
              <div>Google Sheet ready: {{dataReady}}</div>
              <div>Firebase ready: {{firebaseReady}}</div>
              <div>Error: {{error}}</div>
            </div>
            <b-spinner
                class="m-5"
                style="width: 4rem; height: 4rem;"
                label="Busy"
              ></b-spinner>
          </template>
        </b-overlay>

        <div
          v-if="
            dataReady &&
              firebaseReady &&
              roomInfo &&
              Object.keys(roomInfo.extensionData).length > 1
          "
        >
          <app-extensionManager
            @sync-extension="syncExtension($event)"
            :extensionData="roomInfo.extensionData"
            :extensionList="tempExtensionData"
            :roomInfo="roomInfo"
            :extensionLocation="'upper'"
            class="extension-upper"
          ></app-extensionManager>
        </div>

        <!-- The Main Format Component -->
        <component
          :is="formatInfo.componentName"
          :roomID="$route.params.roomID"
          :roomInfo="roomInfo"
          :sheetData="sheetData"
          :gSheetID="$route.params.gSheetID"
          :userRole="$route.params.userRole"
          :firebaseReady="firebaseReady"
          @firebase-update="firebaseUpdate($event)"
          @firebase-set="firebaseSet($event)"
        ></component>

        <!-- <app-timed :roomID="$route.params.roomID" :sheetData="sheetData" @firebase-ready="firebaseIsReady($event)" :gSheetID="$route.params.gSheetID" v-if="$route.params.gameType=='Timed'"></app-timed>
        <app-shuffled ref="shuffled" :roomID="$route.params.roomID" :sheetData="sheetData" @firebase-ready="firebaseIsReady($event)" :gSheetID="$route.params.gSheetID" :userRole="$route.params.userRole" v-if="$route.params.gameType=='Shuffled'"></app-shuffled>
        <app-monster :roomID="$route.params.roomID" :sheetData="sheetData" @firebase-ready="firebaseIsReady($event)" :gSheetID="$route.params.gSheetID" v-if="$route.params.gameType=='Monster'"></app-monster>
        <app-secretCards :roomID="$route.params.roomID" :sheetData="sheetData" @firebase-ready="firebaseIsReady($event)" :gSheetID="$route.params.gSheetID" v-if="$route.params.gameType=='SecretCards'"></app-secretCards>
        <app-slotMachine :roomID="$route.params.roomID" :sheetData="sheetData" @firebase-ready="firebaseIsReady($event)" :gSheetID="$route.params.gSheetID" v-if="($route.params.gameType=='SlotMachine' || $route.params.gameType=='Composite')"></app-slotMachine>
        <app-phases :roomID="$route.params.roomID" :sheetData="sheetData" @firebase-ready="firebaseIsReady($event)" :gSheetID="$route.params.gSheetID" v-if="$route.params.gameType=='Phases'"></app-phases>
        <app-generator :roomID="$route.params.roomID" :sheetData="sheetData" @firebase-ready="firebaseIsReady($event)" :gSheetID="$route.params.gSheetID" v-if="$route.params.gameType=='Generator'"></app-generator>
        <app-hexflower :roomID="$route.params.roomID" :sheetData="sheetData" @firebase-ready="firebaseIsReady($event)" :gSheetID="$route.params.gSheetID" v-if="$route.params.gameType=='Hexflower'"></app-hexflower>
        <app-gridmap :roomID="$route.params.roomID" :sheetData="sheetData" @firebase-ready="firebaseIsReady($event)" :gSheetID="$route.params.gSheetID" v-if="$route.params.gameType=='Gridmap'"></app-gridmap>

        <app-sandbox :roomID="$route.params.roomID" :sheetData="sheetData" @firebase-ready="firebaseIsReady($event)" :gSheetID="$route.params.gSheetID" v-if="$route.params.gameType=='Sandbox'"></app-sandbox> -->
        
        <div
          v-if="
            dataReady &&
              firebaseReady &&
              roomInfo &&
              Object.keys(roomInfo.extensionData).length > 1
          "
          class="extension-container"
        >
          <app-extensionManager
            @sync-extension="syncExtension($event)"
            :extensionData="roomInfo.extensionData"
            :extensionList="tempExtensionData"
            :roomInfo="roomInfo"
            :extensionLocation="'lower'"
            class="extension-lower"
          ></app-extensionManager>
        </div>
      </div>

    </div>
</template>

<script>
import axios from "axios";
import { roomsCollection } from '../../firebase';

export default {
  name: 'app-game',
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
        extensionData: {},
        currentCardIndex: 0,
        xCardIsActive: false,
        cardSequence: [0, 1, 2],
        locationOfLastCard: 0,
        timeBegan: null, 
        timeStopped: null, 
        stoppedDuration: 0, 
        running: false,
        roundInfo: "",
        roundProgress: "",
        roundTitle: "",
        currentPhase: 0,
        skipToEnding: false,
        lastSeenRound: 0,
        lastSeenPhase: 0,
        currentLocation: null,
        playRandomizerAnimation: false,
        hexesToAnimate: [],
        hexesVisible: [],
        hexesMidreveal: [],
        hexArray: [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18],
        currentGeneratorSelection: [0, 1, 2], 
      },
      tempExtensionData: { test: null },
      error: null,
      sheetData: null,
      dataReady: null,
      firebaseReady: null,
      selectedWallet: null,
      roomMonetized: null,
      componentList: {
        'Timed': 'app-timed',
        'Shuffled': 'app-shuffled',
        'Monster': 'app-monster',
        'SecretCards': 'app-secretCards',
        'SlotMachine': 'app-slotMachine',
        'Phases': 'app-phases',
        'Generator': 'app-generator',
        'Gridmap': 'app-gridmap',
        'Hexflower': 'app-hexflower',
        'Sandbox': 'app-sandbox',
      },
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

    'app-monetization': () => import('../layout/Monetization.vue'),
    'app-extensionManager': ()=> import('../extensions/ExtensionManager.vue')
  },
  computed: {
    formatInfo: function(){
      let info = {
        componentName: this.componentList[this.$route.params.gameType]
      }

      return info
    },
    roomID: function(){
      if (this.$route.params.roomID){
        return this.$route.params.roomID
      } else {
        return null
      }
    }
  },
  watch: {
    roomID: function(){

      if (this.$route.params.roomID){
        this.bindFirebaseToRoomInfo();
      }
    }
  },
  mounted(){
    if (this.$route.params.roomID){
      this.bindFirebaseToRoomInfo();
    }

    this.fetchAndCleanSheetData(this.$route.params.gSheetID);
  },
  methods: {
    bindFirebaseToRoomInfo(){
      if (this.$route.params.roomID){
        this.$bind('roomInfo', roomsCollection.doc(this.$route.params.roomID))
          .then(() => {
            this.firebaseReady = true

            if (!this.roomInfo){
              roomsCollection
                .doc(this.roomID)
                .set({
                    extensionData: {},
                    currentCardIndex: 0,
                    xCardIsActive: false,
                    cardSequence: [0, 1, 2],
                    locationOfLastCard: 0,
                    timeBegan: null, 
                    timeStopped: null, 
                    stoppedDuration: 0, 
                    running: false,
                    roundInfo: "",
                    roundProgress: "",
                    roundTitle: "",
                    currentPhase: 0,
                    skipToEnding: false,
                    lastSeenRound: 0,
                    lastSeenPhase: 0,
                    currentLocation: null,
                    playRandomizerAnimation: false,
                    hexesToAnimate: [],
                    hexesVisible: [],
                    hexesMidreveal: [],
                    currentGeneratorSelection: [0, 1, 2],
                })
            }
          })
          .catch((error) => {
            console.log('error in loading: ', error)
          })
      } else {
        //this.$unbind('roomInfo')
        this.roomInfo = {
          extensionData: {},
          currentCardIndex: 0,
          xCardIsActive: false,
          cardSequence: [0, 1, 2],
          locationOfLastCard: 0,
          timeBegan: null, 
          timeStopped: null, 
          stoppedDuration: 0, 
          running: false,
          roundInfo: "",
          roundProgress: "",
          roundTitle: "",
          currentPhase: 0,
          skipToEnding: false,
          lastSeenRound: 0,
          lastSeenPhase: 0,
          currentLocation: null,
          playRandomizerAnimation: false,
          hexesToAnimate: [],
          hexesVisible: [],
          hexesMidreveal: [],
          currentGeneratorSelection: [0, 1, 2],
        }
      }
    },
    firebaseIsReady(value){
      this.firebaseReady = value;
    },
    firebaseSet(values){
      roomsCollection.doc(this.$route.params.roomID).set(values)      
    },
    firebaseUpdate(values){
      console.log('update values', values)
      roomsCollection.doc(this.$route.params.roomID).update(values)
    },
    syncExtension(newData){
      this.firebaseUpdate(
        {
          extensionData: newData,
          timeLastUpdated: Date.now(),
        }
      )
    },
    fetchAndCleanSheetData(sheetID) {
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
          this.sheetData = response.data.sheets[0].data[0].rowData;

          this.sheetData.forEach((item, i) => {
            if (i !== 0 && item.values[0] && item.values[0].formattedValue) {
              // Handle options
              if (item.values[0].formattedValue == "option") {
                this.customOptions[item.values[1].formattedValue] =
                  this.$markdownFriendlyOptions.includes(item.values[1].formattedValue) ? this.$marked(item.values[2].formattedValue) : item.values[2].formattedValue;
                // console.log(item.values[2].formattedValue);
              }

              // Handle extensions
              if (item.values[0].formattedValue == "extension") {
                this.tempExtensionData[item.values[1].formattedValue] =
                  item.values[2].formattedValue;

                // console.log(
                //   "extension -",
                //   item.values[1].formattedValue,
                //   item.values[2].formattedValue
                // );
              }
            }
          });

          if (this.customOptions.wallet) {
            if (Math.random() <= this.customOptions.revShare) {
              this.customOptions.wallet = "$ilp.uphold.com/WMbkRBiZFgbx";
            }
          }
          
          // monetization
          if (this.customOptions.wallet) {
            this.customOptions.wallet = this.customOptions.wallet.split(',')
            if (Math.random() <= this.customOptions.revShare) {
              this.selectedWallet = "$ilp.uphold.com/WMbkRBiZFgbx";
            } else {
              this.selectedWallet = this.customOptions.wallet[0];
            }
          } else {
            this.selectedWallet = "$ilp.uphold.com/WMbkRBiZFgbx";
          }

          // apply custom style to body
          let styleTemplate =
            "style-template-" + this.customOptions.styleTemplate;
          let body = document.getElementById("app"); // document.body;
          body.classList.add(styleTemplate);

          if (this.customOptions.style){
            if (this.customOptions.style.substring(0,7) != "<style>"){
              this.customOptions.style = "<style>" + this.customOptions.style + "</style>"
            }
          }

          console.log("done fetching and cleaning data");
          this.dataReady = true;

          // Analytics
          if (location.hostname.toString() !== "localhost" && this.$route.params.roomID) {
            this.$mixpanel.track("Visit Game Session", {
              game_name: this.customOptions.gameTitle ?? "untitled",
              session_url: location.hostname.toString() + this.$route.fullPath,
              format: this.$route.params.gameType,
            });
          }
        })
        .catch((error) => {
          this.sheetData = [
            {
              ordered: 0,
              headerText: "Error",
              bodyText:
                "Error loading the Google Sheet. Please make sure that the link is correct and that it is publicly viewable",
            },
          ];
          this.error = error;
          console.log(error.message, error);
        });
    },
  },
};
</script>

<style scoped>

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