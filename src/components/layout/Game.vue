<template>
  <div class="container game-container">
    <!-- Loading Spinner -->
    <b-overlay :show="(!dataReady || (!firebaseReady && $route.params.roomID)) && !error" no-wrap>
      <template #overlay>
        <h1>Loading</h1>
        <div v-if="customOptions.debugLoading == 'TRUE'">
          <div>Google Sheet ready: {{dataReady}}</div>
          <div>Firebase ready: {{firebaseReady}}</div>
          <div>Error: {{error}}</div>
        </div>
        <b-spinner class="m-5" style="width: 4rem; height: 4rem;" label="Busy"></b-spinner>
      </template>
    </b-overlay>

    <app-gameLauncher :routeGSheetID="gSheetID" :routeGameType="gameType" :customOptions="customOptions"
       v-if="dataReady && !roomID && gSheetID && !gameAsExtension">
    </app-gameLauncher>

    <!-- <app-customGameLauncher :routeGSheetID="$route.params.gSheetID" :routeGameType="$route.params.gameType"
      :customOptions="customOptions" v-if="dataReady && !roomID && !gameAsExtension && (gameType == 'Custom')">
    </app-customGameLauncher> -->

    <div v-if="roomID && gSheetID">
      <div class="full-page-background"></div>
      <div v-dompurify-html="customOptions.style"></div>
      <app-monetization :customOptions="customOptions" :roomMonetized="roomMonetized"></app-monetization>

      <div v-if="
            dataReady &&
            firebaseReady &&
            roomInfo &&
            Object.keys(roomInfo.extensionData) != 0
          ">
        <app-extensionManager @sync-extension="syncExtension($event)" :extensionData="roomInfo.extensionData"
          :extensionList="tempExtensionData" :roomInfo="roomInfo" :extensionLocation="'upper'" class="extension-upper">
        </app-extensionManager>
      </div>

      <!-- The Main Format Component -->
      <component :is="formatInfo.componentName" :roomID="roomID" :roomInfo="roomInfo" :sheetData="sheetData"
        :gSheetID="gSheetID" :gameType="gameType" :userRole="$route.params.userRole" :gameAsExtension="gameAsExtension"
        :tempExtensionData="tempExtensionData" :firebaseReady="firebaseReady" @firebase-update="firebaseUpdate($event)"
        @firebase-set="firebaseSet($event)" v-if="gameType != 'Custom' && dataReady && firebaseReady && sheetData"></component>

      <!-- Custom Game Sessions -->
      <!-- <app-customGameSessionManager :roomID="roomID" :roomInfo="roomInfo" :sheetData="sheetData" :gSheetID="gSheetID"
        :routeGSheetID="gSheetID" :gameType="gameType" :userRole="$route.params.userRole"
        :gameAsExtension="gameAsExtension" :tempExtensionData="tempExtensionData" :firebaseReady="firebaseReady"
        @firebase-update="firebaseUpdate($event)" @firebase-set="firebaseSet($event)"
        v-if="gameType == 'Custom' && dataReady && firebaseReady"></app-customGameSessionManager> -->

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

      <div v-if="
            dataReady &&
            firebaseReady &&
            roomInfo &&
            Object.keys(roomInfo.extensionData) != 0
          " class="extension-container">
        <app-extensionManager @sync-extension="syncExtension($event)" :extensionData="roomInfo.extensionData"
          :extensionList="tempExtensionData" :roomInfo="roomInfo" :extensionLocation="'lower'" class="extension-lower">
        </app-extensionManager>
      </div>
    </div>

  </div>
</template>

<script>
import axios from "axios";
import { getRoom, updateRoom, onRoomUpdate, setRoom } from '../../firebase/models/rooms.js';
import VanityLookup from "../../misc/VanityLookup.js";
import customGameData from "../../misc/customGameData.js";

export default {
  name: 'app-game',
  props: {
    roomID: String,
    gSheetID: String,
    gameAsExtension: Boolean,
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
      tempExtensionData: {},
      gameType: null,
      error: null,
      sheetData: null,
      dataReady: null,
      firebaseReady: null,
      selectedWallet: null,
      roomMonetized: null,
      vanityLookup: VanityLookup,
      customGameData: customGameData,
      componentList: {
        'Timed': 'app-timed',
        'Shuffled': 'app-shuffled',
        'Monster': 'app-monster',
        'SecretCards': 'app-secretCards',
        'SlotMachine': 'app-slotMachine',
        'Phases': 'app-phases',
        'Generator': 'app-generator',
        //'Gridmap': 'app-gridmap',
        'Hexflower': 'app-hexflower',
        'Sandbox': 'app-sandbox',
      },
      unsubscribeFromFirebase: null,
    };
  },
  components: {
    'app-gameLauncher': () => import('../launchers/GameLauncher.vue'),
    'app-customGameLauncher': () => import('../games/CustomGameLauncher.vue'),
    'app-customGameSessionManager': () => import('../games/CustomGameSessionManager.vue'),

    'app-timed': () => import('../formats/Timed.vue'),
    'app-shuffled': () => import('../formats/Shuffled.vue'),
    'app-monster': () => import('../formats/Monster.vue'),
    'app-secretCards': () => import('../formats/SecretCards.vue'),
    'app-slotMachine': () => import('../formats/SlotMachine.vue'),
    'app-phases': () => import('../formats/Phases.vue'),
    'app-generator': () => import('../formats/Generator.vue'),
    //'app-gridmap': () => import('../formats/Gridmap.vue'),
    'app-hexflower': () => import('../formats/Hexflower.vue'),
    'app-sandbox': () => import('../formats/Sandbox.vue'),

    'app-monetization': () => import('../layout/Monetization.vue'),
    'app-extensionManager': () => import('../extensions/ExtensionManager.vue'),
  },
  computed: {
    formatInfo: function(){
      let info = {
        componentName: this.componentList[this.gameType]
      }

      return info
    },
  },
  watch: {
    roomID: function(){
      if (this.roomID){
        this.bindFirebaseToRoomInfo();
        if (this.dataReady) {
          this.logAnalytics()
        }
      } else {
        this.firebaseIsReady(false)
        this.unsubscribeFromFirebase && this.unsubscribeFromFirebase()
      }
    }
  },
  mounted() {
    this.fetchAndCleanSheetData(this.gSheetID);
    if (this.roomID) {
      this.bindFirebaseToRoomInfo()
    }

    if (this.$route.params.gameType != "Games") {
      this.gameType = this.$route.params.gameType;
    } else {
      this.gameType = this.customGameData[this.gSheetID]?.gameType ?? "Custom";
    }
  },
  methods: {
    bindFirebaseToRoomInfo(){
      if(this.roomID){
        getRoom(this.roomID)
          .then(room => {
            if(!room){
              // setRoom(this.roomID, this.createDefaultRoom())
              // .then(() => {
              //   console.log("setRoom ok")
              //   // if (this.gameType != 'Games') {  
              //   //   this.fetchAndCleanSheetData(this.gSheetID);
              //   // }
              // })
              // .catch(err => {
              //   if (err.code == "permission-denied"){
              //     this.permissionDenied = true
              //   }
              // });
            } else {
              // We must do this before setting the room other wise things break. Yay.
              // We found that once we introduce auth, it can get in an infinite loop when a client isn't authorised.
              // if (this.gameType != 'Games') {
              //   this.fetchAndCleanSheetData(this.gSheetID);
              // }
              this.setComponentRoom(room);
            }
          });
        this.unsubscribeFromFirebase = onRoomUpdate(this.roomID, this.setComponentRoom );
      }
      // else {
      //   this.fetchAndCleanSheetData(this.gSheetID);
      // }
    },
    // createDefaultRoom(){
    //   return {
    //     extensionData: {},
    //     currentCardIndex: 0,
    //     xCardIsActive: false,
    //     cardSequence: [0, 1, 2],
    //     locationOfLastCard: 0,
    //     timeBegan: null, 
    //     timeStopped: null, 
    //     stoppedDuration: 0, 
    //     running: false,
    //     roundInfo: "",
    //     roundProgress: "",
    //     roundTitle: "",
    //     currentPhase: 0,
    //     skipToEnding: false,
    //     lastSeenRound: 0,
    //     lastSeenPhase: 0,
    //     currentLocation: null,
    //     playRandomizerAnimation: false,
    //     hexesToAnimate: [],
    //     hexesVisible: [],
    //     hexesMidreveal: [],
    //     currentGeneratorSelection: [0, 1, 2],
    //   }
    // },

    setComponentRoom(room) {
      this.roomInfo = room;
      this.firebaseIsReady(true);
    },
    
    firebaseIsReady(value){
      this.firebaseReady = value;
    },
    // Sets the firebase doc
    firebaseSet(values){
      setRoom(this.roomID, values)
        .then(() => {
          console.log("setRoom ok")
        })
        .catch(err => {
          if (err.code == "permission-denied") {
            this.permissionDenied = true
          }
        });
    },
    firebaseUpdate(values) {
      console.log('UPDATING FB: old values', this.roomInfo, 'new values', values)
      updateRoom(this.roomID, values)
    },
    syncExtension(newData) {
      console.log('sync extension')
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

      // Vanity look up for custom named games with format in URL
      if (this.vanityLookup[sheetID]) {
        console.log('setting vanity sheetID')
        sheetID = this.vanityLookup[sheetID];
      }

      // Look for sheet ID for game at /Games/ 
      if (this.$route.params.gameType == "Games" && this.customGameData[this.gSheetID] && this.customGameData[this.gSheetID].sheetID) {
        console.log('set custom game sheet to fetch')
        sheetID = this.customGameData[this.gSheetID].sheetID;
      }

      if (this.$route.params.gameType == "Games" && this.customGameData[this.gSheetID] && this.customGameData[this.gSheetID].sheetData) {
        console.log('processing hardcoded sheet')
        this.sheetData = this.customGameData[this.gSheetID].sheetData;
        this.processSheetData();
      } else {

        // For published version, set getURL equal to the url of your spreadsheet
        let getURL =
          "https://sheets.googleapis.com/v4/spreadsheets/" +
          sheetID +
          "?includeGridData=true&ranges=a1:aa400&key=" + process.env.VUE_APP_FIREBASE_API_KEY;

        axios
          .get(getURL)
          .then((response) => {
            let rawSheetData = response.data.sheets[0].data[0].rowData;
            let cleanData = []

            rawSheetData.forEach((item, i) => {
              cleanData.push([])
              if (item.values[0]) {
                for (let v = 0; v < item.values.length; v++){
                  if (item.values[v] && item.values[v].formattedValue) {
                    cleanData[i].push(item.values[v].formattedValue)
                  } else {
                    cleanData[i].push(null)
                  }
                }
              }
            });

            this.sheetData = cleanData;

            this.processSheetData()
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
      }
    },
    processSheetData() {
      if (this.sheetData) {
        for (let i = 0; i < this.sheetData.length; i++){
          let row = this.sheetData[i]

          // Handle options
          if (row[0] && row[0] == "option" && row[1] && row[2]) {
            this.customOptions[row[1]] =
            this.$markdownFriendlyOptions.includes(row[1]) ? this.$marked(row[2]) : row[2];
          }

          // Handle extensions
          if (row[0] && row[0] == "extension" && row[1] && row[2]) {
            this.tempExtensionData[row[1]] =
              row[2];
          }


        }

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

        if (this.customOptions?.style) {
          if (this.customOptions.style.substring(0, 7) != "<style>" && this.customOptions.style.substring(0, 5) != "<link") {
            console.log('adding style tags')
            this.customOptions.style = "<style>" + this.customOptions.style + "</style>"
          } else {
            console.log('adding div wrapper')
            this.customOptions.style = "<div>" + this.customOptions.style + "</div>"
          }
        }

        console.log("done fetching and cleaning data");
        this.dataReady = true;

        document.dispatchEvent(new Event("x-app-rendered"));

        this.logAnalytics();
      }
    },
    logAnalytics() {
      if (location.hostname.toString() !== "localhost" && !this.gameAsExtension) {
        if (this.$route.params.roomID) {
          this.$mixpanel.track("Visit Game Session", {
            game_name: this.customOptions.gameTitle ?? "untitled",
            session_url: location.hostname.toString() + this.$route.fullPath,
            format: this.$route.params.gameType,
          });
        } else {
          this.$mixpanel.track("Visit Game Launcher", {
            game_name: this.customOptions.gameTitle ?? "untitled",
            format: this.$route.params.gameType,
            launcher_url: location.hostname.toString() + this.$route.fullPath,
          });
        }
      }
    },
  },
  metaInfo() {
    if (!this.gameAsExtension) {
      return {
        title: this.customOptions?.gameTitle,
        meta: [
          {
            property: "description",
            content: this.customGameData[this.gSheetID]?.gameBlurb ?? this.customOptions?.metaDescription ?? this.customOptions?.gameBlurb,
            vmid: "description",
          },
          {
            property: "og:title",
            content: this.customOptions.gameTitle,
            vmid: "og:title",
          },
          {
            property: "og:description",
            content: this.customGameData[this.gSheetID]?.gameBlurb ?? this.customOptions?.metaDescription ?? this.customOptions?.gameBlurb,
            vmid: "og:description",
          },
          {
            property: "og:image",
            content: this.customOptions.ogImageSquare,
            vmid: "og:image",
          },
          {
            property: "og:url",
            content: location.hostname.toString() + "/#" + this.$route.fullPath,
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
            content: this.customOptions?.gameTitle + " logo",
            vmid: "twitter:image:alt",
          },
          {
            name: "monetization",
            content: this.selectedWallet,
            vmid: "monetization",
          },
        ],
      };
    }
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
