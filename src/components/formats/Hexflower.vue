<template>
  <div
    class="hexflower game-room container"
    v-if="roomInfo"
    v-bind:class="{'px-0': hexflowerAsExtension, styleTemplate: styleTemplate}"
  >
    <div class="full-page-background"></div>
    <div v-html="customOptions.style"></div>

    <div class="game-meta">
      <div class="mb-4" v-if="customOptions.gameTitle || customOptions.byline">
        <div class="row text-center" v-if="customOptions.gameTitle">
          <div class="col-sm">
            <h1>{{ customOptions.gameTitle }}</h1>
          </div>
        </div>

        <div class="row text-center" v-if="customOptions.byline">
          <div class="col-sm">
            <h4>{{ customOptions.byline }}</h4>
          </div>
        </div>
      </div>
    </div>

    <div class="upper-text row" v-if="customOptions.upperText">
      <div
        class="col-sm"
        style="white-space: pre-line"
        v-html="customOptions.upperText"
      ></div>
    </div>

    <div
        v-if="
          dataReady &&
            firebaseReady &&
            roomInfo &&
            Object.keys(roomInfo.extensionData).length > 1
        "
      >
        <app-extensionManager
          @sync-extension="syncExtension()"
          :extensionData="roomInfo.extensionData"
          :extensionList="tempExtensionData"
          :roomInfo="roomInfo"
          :extensionLocation="'upper'"
          class="extension-upper"
        ></app-extensionManager>
      </div>

    <div class="row">
      <div
        class="btn-group col-sm"
        role="group"
        aria-label="Extra Info"
        v-if="customOptions.modalOneLabel || customOptions.modalTwoLabel"
      >
        <b-button
          v-b-modal.modalOne
          variant="outline-dark"
          v-if="customOptions.modalOneLabel"
          >{{ customOptions.modalOneLabel }}</b-button
        >

        <b-modal
          id="modalOne"
          v-bind:title="customOptions.modalOneLabel"
          hide-footer
        >
          <div
            class="d-block text-left"
            style="white-space: pre-line"
            v-html="customOptions.modalOneText"
          ></div>
        </b-modal>

        <b-button
          v-b-modal.modalTwo
          variant="outline-dark"
          v-if="customOptions.modalTwoLabel"
          >{{ customOptions.modalTwoLabel }}</b-button
        >

        <b-modal
          id="modalTwo"
          v-bind:title="customOptions.modalTwoLabel"
          hide-footer
        >
          <div
            class="d-block text-left"
            style="white-space: pre-line"
            v-html="customOptions.modalTwoText"
          ></div>
        </b-modal>
      </div>
    </div>

    <div class="mb-4">
      <div
        class="d-flex shadow img-fluid"
        v-if="(!dataReady || !firebaseReady) && !error"
      >
        <div class="card-body text-center">
          <h1 class="m-5">Loading</h1>
          <b-spinner
            class="m-5"
            style="width: 4rem; height: 4rem"
            label="Busy"
          ></b-spinner>
        </div>
      </div>

      <div class="mt-4 hexflower-main card shadow mb-4" v-if="firebaseReady && dataReady && !error">
        <div class="game-title-on-card mt-4" v-if="customOptions.gameTitle && customOptions.showGameTitleOnCard">
          <h1>{{customOptions.gameTitle}}</h1>
        </div>

        <div class="row">
          <div class="regenerate-button my-4 col-sm-12 justify-content-center generator">
              <b-button v-on:click="randomlyMoveOnHexflower()" class="btn btn-dark mx-2 my-1">
                <span>{{ roomInfo.playRandomizerAnimation ? 'Rolling' : 'Move' }}</span> <b-icon class='hexflower-reroll-icon' icon="arrows-move"></b-icon>
              </b-button>              
              <b-button v-if="customOptions.randomizeHexes == 'randomWithCopies' || customOptions.randomizeHexes == 'randomNoCopies'" v-on:click="regenerateHexes()" class="btn btn-dark mx-2 my-1">
                <span>Regenerate</span> <b-icon class='hexflower-reroll-icon' icon="arrow-clockwise"></b-icon>
              </b-button>
          </div>
        </div>

        <div class="row justify-content-center">
          <div 
            class='hexflower-body' 
            v-bind:class="{
              'pointy-top':customOptions.hexOrientation == 'pointyTop',
              'hex-randomizing': roomInfo.playRandomizerAnimation === true,
              'hex-resetting': roomInfo.playResetAnimation === true,              
            }"
          >
            <template
              v-for="(hexRow, hexRowIndex) in updatedHexMapRows"
            >
              <button
                class="hex-tile"
                v-for="(hex, hexIndex) in hexRow"
                v-on:click="goToHex(hex.hexID, false)"
                v-bind:key="`${hexIndex}_${hexRowIndex}`"
                v-bind:class="{
                  'hex-tile-active': (hex.hexID == roomInfo.currentLocation && !roomInfo.tempSameHex),
                  'hex-tile-previous-active': (hex.hexID == roomInfo.previousLocation),
                }"
                v-bind:style="{
                  transform: `translate(${hexPosition(hexIndex, hexRowIndex)})`                  
                }"
              >
                <transition appear name="reroll-current-hex" mode="out-in">
                  <div 
                    class="hex-tile-inner"
                    :key="hex.hexID"
                    v-bind:style="{
                        backgroundColor: hex.backgroundColor, 
                        backgroundImage: hex.backgroundImage,
                    }"
                    v-bind:class="{
                      'hex-tile-animate-randomization': (roomInfo.hexesToAnimate.includes(hex.hexID)),
                      'hex-tile-foggy': ((customOptions.fogOfWar && roomInfo.hexesVisible[hex.hexID] == 0) || roomInfo.hexesMidreveal.includes(hex.hexID))
                    }"
                  >
                    <div 
                      class="hex-tile-inner-content"
                      v-if="!((customOptions.fogOfWar && roomInfo.hexesVisible[hex.hexID] == 0) || roomInfo.hexesMidreveal.includes(hex.hexID))"
                      v-bind:class="{
                        'hex-tile-inner-content-lg': countGraphemes(hex.summary) == 1,
                        'hex-tile-inner-content-md': countGraphemes(hex.summary) >= 2 && countGraphemes(hex.summary) < 5,
                        'hex-tile-inner-content-sm': countGraphemes(hex.summary) >= 5 && countGraphemes(hex.summary) < 25,
                        'hex-tile-inner-content-xs': countGraphemes(hex.summary) >= 25
                      }"
                      v-html="hex.summary"
                    >
                    </div>
                  </div>
                </transition>
              </button>
            </template>
          </div>
        </div>

        <transition name="fade-full-content" mode="out-in"><!--TODO fix this-->
          <div 
            class="row mt-4 mb-4 p-2 full-content" 
            :key="gSheet[roomInfo.hexArray[roomInfo.currentLocation]].fullContent"
            v-if="gSheet[roomInfo.hexArray[roomInfo.currentLocation]].fullContent && !roomInfo.tempSameHex"
            v-bind:class="{'invisible':roomInfo.playRandomizerAnimation}"
          >
            <div class="col-sm-12" v-html="gSheet[roomInfo.hexArray[roomInfo.currentLocation]].fullContent">
            </div>
          </div>
        </transition>

      </div>
      

      <div class="lower-text row mt-4" v-if="customOptions.lowerText">
        <div class="col-sm" v-html="customOptions.lowerText"></div>          
      </div>

    </div>

    <div
      v-if="
        dataReady &&
        firebaseReady &&
        roomInfo &&
        Object.keys(roomInfo.extensionData).length > 1
      "
    >
      <app-extensionManager
        @sync-extension="syncExtension()"
        :extensionData="roomInfo.extensionData"
        :extensionList="tempExtensionData"
        :roomInfo="roomInfo"
        :extensionLocation="'lower'"
        class="extension-lower"
      ></app-extensionManager>
    </div>
  </div>
</template>

<script>
import { roomsCollection } from "../../firebase";
import axios from "axios";
import GraphemeSplitter from 'grapheme-splitter';

export default {
  name: "app-hexflower",
  components: {
    "app-extensionManager": () => import("../extensions/ExtensionManager.vue"),
  },
  props: {
    roomID: String,
    gSheetID: String,
    hexflowerAsExtension: Boolean,
    gSheetForExtension: String,
  },
  data: function () {
    return {
      roomInfo: {
        currentLocation: null,
        playRandomizerAnimation: false,
        hexesToAnimate: [],
        hexesVisible: [],
        hexesMidreveal: [],
      },
      dataReady: false,
      firebaseReady: false,
      gSheet: [{ text: "loading" }],
      hexMapRows: [[],[],[],[],[],[],[],[],[]],
      hexNeighborMap: [
        [null, null, 2, 4, 1, null],
        [null, 0, 4, 6, 3, null], [null, null, 5, 7, 4, 0],
        [null,1,6,8,null,null],[0,2,7,9,6,1],[null,null,null,10,7,2],
        [1,4,9,11,8,3],[2,5,10,12,9,4],
        [3,6,11,13,null,null],[4,7,12,14,11,6],[5,null,null,15,12,7],
        [6,9,14,16,13,8],[7,10,15,17,14,9],
        [8,11,16,null,null,null],[9,12,17,18,16,11],[10,null,null,null,17,12],
        [11,14,18,null,null,13],[12,15,null,null,18,14],
        [14,17,null,null,null,16],
      ],
      // hexNeighborMap: [
      //   [null, null, 3, 5, 2, null],
      //   [null, 1, 5, 4, null, null], [null, null, 6, 8, 5, 1],
      //   [null,2,7,9,null,null],[1,3,8,10,7,2],[null,null,null,11,8,3],
      //   [2,5,10,12,9,4],[3,6,11,13,10,5],
      //   [4,7,12,14,null,null],[5,8,13,15,12,7],[6,null,null,16,13,8],
      //   [7,10,15,17,14,9],[8,11,16,18,15,10],
      //   [9,12,17,null,null,null],[10,13,18,19,17,12],[11,null,null,null,18,13],
      //   [12,15,19,null,null,14],[13,16,null,null,19,15],
      //   [15,18,null,null,null,17],
      // ],
      styleTemplate: "",
      customOptions: {},
      tempExtensionData: { test: null },
      error: false,
    };
  },
  mounted() {
    this.fetchAndCleanSheetData(this.gSheetID);

    this.$bind("roomInfo", roomsCollection.doc(this.roomID))
      .then(() => {
        this.firebaseReady = true;
      })
      .then(() => {
        if (!this.roomInfo) {
          console.log("new room! dataReady", this.dataReady);

          roomsCollection.doc(this.roomID).set({
            hexesToAnimate: [],
            extensionData: this.tempExtensionData,
            currentLocation: 9,
            hexArray: [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18],
            hexesVisible: [],
            hexesMidreveal: [],
            playRandomizerAnimation: false,
          });

          if (this.dataReady) {
            this.regenerateHexes();
          }
        }
      })
      .catch((error) => {
        console.log("error in loading: ", error);
      });
  },
  watch: {
    roomInfo: function (val) {
      if (val?.playRandomizerAnimation === true) {
        setTimeout(() => {
            this.roomInfo.playRandomizerAnimation = false;
            this.roomInfo.hexesMidreveal = [];
          }
        , 1500)
      } else if (val?.hexesMidreveal){
        this.roomInfo.hexesMidreveal = [];
      }
      if (val?.playResetAnimation === true) {
        setTimeout(() => {
            this.roomInfo.playResetAnimation = false;
          }
        , 1000)
      }
    }
  },
  computed: {
    updatedHexMapRows: function() {
      let newHexMapRows = JSON.parse(JSON.stringify(this.hexMapRows))
      if (this.firebaseReady && this.dataReady){
        let hexIndexTracker = 0;
          for (let r = 0; r < newHexMapRows.length; r++){
            for (let c = 0; c < newHexMapRows[r].length; c++){
              newHexMapRows[r][c] = JSON.parse(JSON.stringify(this.gSheet[this.roomInfo.hexArray[hexIndexTracker]]))
              newHexMapRows[r][c].hexID = hexIndexTracker
              hexIndexTracker += 1;
            }
          }
      }
      return newHexMapRows
    }
  },
  methods: {
    hexPosition(col, row) {

      // Basic dimensions
      let hexHeight = screen.width > 375 ? 92 : 69;
      let hexWidth = Math.floor(hexHeight * 1.1547);
      let hexPadding = 4;

      // Layout
      let offset = [0, 0, -1, 0, -1, 0, -1, 0, 0];

      // Offsets
      let hexSlotOffset = (hexWidth * 1.5 + hexPadding);
      let oddOffset = (row%2 === 0) ? 0 : -hexWidth * 0.75 - hexPadding/2;      

      let x = col * hexSlotOffset 
            + oddOffset
            + offset[row] * hexSlotOffset;
      
      let y = row * (hexHeight/2 + hexPadding/2.5);

      return `${x}px, ${y}px`;
    },
    countGraphemes(str) {
      if (str){
        let splitter = new GraphemeSplitter();
        return splitter.splitGraphemes(str).length;
      }
    },
    randomlyMoveOnHexflower(){
      let hexID = this.roomInfo.currentLocation
      let probabilityWeights = this.gSheet[hexID].probability

      if (probabilityWeights == undefined){
        probabilityWeights = []
        for (let neighbor = 0; neighbor < this.hexNeighborMap[hexID].length; neighbor++){
          if (this.hexNeighborMap[hexID][neighbor] != null){
            probabilityWeights.push(1)
          } else {
            probabilityWeights.push(0)
          }
        }
      } else {
        probabilityWeights = this.gSheet[hexID].probability.split(',')
      }

      let probabilityDistribution = {}

      let hexIndex, probabilitySum = 0
      for (hexIndex in probabilityWeights){
        probabilitySum += parseInt(probabilityWeights[hexIndex])
      }
      hexIndex = 0
      for (hexIndex in probabilityWeights){
        probabilityDistribution[hexIndex] = probabilityWeights[hexIndex] / probabilitySum 
      }

      // console.log(this.hexNeighborMap[this.roomInfo.currentLocation], probabilityDistribution)

      let i, sum=0, r=Math.random();
      for (i in probabilityDistribution) {
        sum += probabilityDistribution[i];
        if (r <= sum) {
          hexIndex = i;   
          break;
        }
      }

      let targetHexID = this.hexNeighborMap[this.roomInfo.currentLocation][hexIndex] ?? hexIndex

      // RANDOMIZER ANIMATION
      // Compute which hexes to take into account for the animation
      let hexesToAnimate = this.hexNeighborMap[this.roomInfo.currentLocation].filter((neighbor, index) => {
        return neighbor !== null && probabilityDistribution[index] !== 0
      })
      // Add the current hex if it was specified in the spreadsheet
      // as a seventh value in the "Probability"
      if (probabilityDistribution[6] !== undefined &&  probabilityDistribution[6] !== 0) {
        hexesToAnimate.push(hexID)
      }

      if (targetHexID == null || targetHexID == -1){
        this.randomlyMoveOnHexflower()
      } else if (hexIndex == 6){
        this.goToHex(this.roomInfo.currentLocation, true, hexesToAnimate)
      } else {
        this.goToHex(targetHexID, true, hexesToAnimate)
      }
      
    },
    goToHex(hexID, playRandomizerAnimation = false, hexesToAnimate = []){
      
      // fog of war
      let hexesMidreveal = []
      if (this.customOptions.fogOfWar == "revealOnMove"){
        this.roomInfo.hexesVisible[hexID] = 1;
        hexesMidreveal.push(hexID)
      } else if (this.customOptions.fogOfWar == "revealNeighbors") {
        this.roomInfo.hexesVisible[hexID] = 1;
        for (let n = 0; n < this.hexNeighborMap[hexID].length; n++){
          let neighborHex = this.hexNeighborMap[hexID][n]
          if (neighborHex != null){
            if (this.roomInfo.hexesVisible[neighborHex] == 0){
              hexesMidreveal.push(neighborHex)
              this.roomInfo.hexesVisible[neighborHex] = 1;
            }
          }
        }
      }

      // check if moving to self
      if (this.roomInfo.currentLocation == hexID){
        roomsCollection.doc(this.roomID).update({
          previousLocation: this.roomInfo.currentLocation,
          currentLocation: hexID,
          playRandomizerAnimation: playRandomizerAnimation,
          playResetAnimation: false,
          hexesToAnimate: hexesToAnimate,
          hexesVisible: this.roomInfo.hexesVisible,
          hexesMidreveal: hexesMidreveal,
          tempSameHex: true,
        });
        setTimeout(() =>
          roomsCollection.doc(this.roomID).update({
            tempSameHex: false,
          }), 200
        )
      } else {
        roomsCollection.doc(this.roomID).update({
          previousLocation: this.roomInfo.currentLocation,
          playRandomizerAnimation: playRandomizerAnimation,
          playResetAnimation: false,
          hexesToAnimate: hexesToAnimate,
          hexesVisible: this.roomInfo.hexesVisible,
          hexesMidreveal: hexesMidreveal,
          currentLocation: hexID,
        });
      }
    },
    regenerateHexes(){
      let startingHex = parseInt(this.customOptions.startingHex) ?? 9

      let randomApproach = this.customOptions.randomizeHexes ?? null
      
      let newHexArray = []
      let visibleHexArray = []
      for (let n = 0; n < this.gSheet.length; n++){
       newHexArray[n] = JSON.parse(JSON.stringify(this.gSheet[n]))
       visibleHexArray[n] = 1
      }

      if (randomApproach == "randomNoCopies"){
        for (let n = newHexArray.length - 1; n > 0; n--) {
          let j = Math.floor(Math.random() * (n + 1));
          [newHexArray[n], newHexArray[j]] = [JSON.parse(JSON.stringify(newHexArray[j])), JSON.parse(JSON.stringify(newHexArray[n]))];
        }
        if (this.customOptions.startingHexFixedTile == "TRUE"){
          let oldIndex = startingHex;
          for (let h = 0; h < newHexArray.length; h++){
            if (newHexArray[h].fullContent == this.gSheet[startingHex].fullContent){
              oldIndex = h;
            }
          }
          [newHexArray[oldIndex], newHexArray[startingHex]] = [newHexArray[startingHex], newHexArray[oldIndex]];

        }
      } else if (randomApproach == "randomWithCopies") {
        for (let n = 0; n < this.gSheet.length; n++) {
          let j = Math.floor(Math.random() * this.gSheet.length);
          newHexArray[n] = JSON.parse(JSON.stringify(this.gSheet[j]));
        }
        if (this.customOptions.startingHexFixedTile == "TRUE"){
          newHexArray[startingHex] = JSON.parse(JSON.stringify(this.gSheet[startingHex]));
        }
      }

      let hexIndexTracker = 0;
      for (let r = 0; r < this.hexMapRows.length; r++){
        for (let c = 0; c < this.hexMapRows[r].length; c++){
          this.hexMapRows[r][c] = JSON.parse(JSON.stringify(newHexArray[hexIndexTracker]))
          this.hexMapRows[r][c].hexID = hexIndexTracker
          hexIndexTracker += 1;
        }
      }

      if (this.customOptions.fogOfWar != undefined && this.customOptions.fogOfWar != "FALSE"){
        for (let h = 0; h < visibleHexArray.length; h++){
          if (!this.customOptions.initiallyVisible?.includes(h) && h != startingHex){
            visibleHexArray[h] = 0;
          }
        }
      }

      let hexIndexList = [];

      for (let hexIndex = 0; hexIndex < newHexArray.length; hexIndex++){
        hexIndexList.push(newHexArray[hexIndex].hexID)
      }

      roomsCollection.doc(this.roomID).update({
        previousLocation: null,
        playRandomizerAnimation: false,
        playResetAnimation: true,
        hexArray: hexIndexList,
        currentLocation: startingHex,
        hexesVisible: visibleHexArray,
      });

    },
    syncExtension() {
      roomsCollection.doc(this.roomID).update({
        extensionData: this.roomInfo.extensionData,
      });
    },
    fetchAndCleanSheetData(sheetID) {
      // Remove for published version
      if (!sheetID || sheetID == "demo") {
        sheetID = "1t5LRUQG9DzMJ3kd8E9DZV7_EbE8J5-Gqhz7TWQ4Y-uU";
      }

      // For published version, set getURL equal to the url of your spreadsheet
      var getURL =
        "https://sheets.googleapis.com/v4/spreadsheets/" +
        sheetID +
        "?includeGridData=true&ranges=a1:aa100&key=" + process.env.VUE_APP_FIREBASE_API_KEY;

      // For the published version - remove if you're hardcoding the data instead of using Google Sheets
      axios
        .get(getURL)
        .then((response) => {
          var cleanData = [];
          var gRows = response.data.sheets[0].data[0].rowData;

          // Transform Sheets API response into cleanData
          gRows.forEach((item, i) => {
            //console.log(i)
            if (i !== 0 && item.values[0].formattedValue) {
              // Handle options
              if (item.values[0].formattedValue == "option") {
                this.customOptions[item.values[1].formattedValue] =
                  item.values[2].formattedValue;
                console.log(item.values[2].formattedValue);
              }

              // Handle extensions
              if (item.values[0].formattedValue == "extension") {
                this.tempExtensionData[item.values[1].formattedValue] =
                  item.values[2].formattedValue;

                console.log(
                  "extension -",
                  item.values[1].formattedValue,
                  item.values[2].formattedValue
                );
              }

              if (
                item.values[0].formattedValue !== "option" &&
                item.values[0].formattedValue !== "extension"
              ) {
                let hexInfo = {};
                if (item.values[0].formattedValue >= 0) {
                  // initial hex info
                  hexInfo = {
                    hexID: parseInt(item.values[0].formattedValue),
                    summary: item.values[3].formattedValue,
                    fullContent: item.values[4]?.formattedValue,
                    probability: item.values[5]?.formattedValue,
                    background: item.values[6]?.formattedValue,
                  };

                  // check for background
                  if (hexInfo.background?.substring(0, 4) !== "http"){
                    hexInfo.backgroundColor = hexInfo.background;
                  } else {
                    hexInfo.backgroundImage = 'url("'+ hexInfo.background + '")';
                  }

                  // organize into rows
                  let hexRowLookup = {0:0,1:1,2:1,3:2,4:2,5:2,6:3,7:3,8:4,9:4,10:4,11:5,12:5,13:6,14:6,15:6,16:7,17:7,18:8}
                  this.hexMapRows[hexRowLookup[hexInfo.hexID]].push(hexInfo);

                  cleanData.push(hexInfo);
                }
              }
            }
          });

          if (this.customOptions.initiallyVisible){
            this.customOptions.initiallyVisible = this.customOptions.initiallyVisible.split(',')
            for (let v = 0; v < this.customOptions.initiallyVisible.length; v++){
              this.customOptions.initiallyVisible[v] = parseInt(this.customOptions.initiallyVisible[v])
            }
          }

          if (this.customOptions.hexWarp == "TRUE"){
            this.hexNeighborMap = [
              [18, 3, 2, 4, 1, 5],
              [16, 0, 4, 6, 3, 10], [17, 8, 5, 7, 4, 0],
              [13,1,6,8,0,15],[0,2,7,9,6,1],[15,13,0,10,7,2],
              [1,4,9,11,8,3],[2,5,10,12,9,4],
              [3,6,11,13,2,17],[4,7,12,14,11,6],[5,16,1,15,12,7],
              [6,9,14,16,13,8],[7,10,15,17,14,9],
              [8,11,16,3,5,18],[9,12,17,18,16,11],[10,18,3,5,17,12],
              [11,14,18,1,10,13],[12,15,8,2,18,14],
              [14,17,13,0,15,16],
            ]
          }

          if (
            this.firebaseReady &&
            Object.keys(this.tempExtensionData).length > 1
          ) {
            roomsCollection
              .doc(this.roomID)
              .update({ extensionData: this.tempExtensionData });
          }

          if (this.customOptions.wallet) {
            if (Math.random() <= this.customOptions.revShare) {
              this.customOptions.wallet = "$ilp.uphold.com/WMbkRBiZFgbx";
            }
          }

          // apply custom style to body
          let styleTemplate =
            "style-template-" + this.customOptions.styleTemplate;
          let body = document.getElementById("app"); // document.body;
          body.classList.add(styleTemplate);
          this.styleTemplate = styleTemplate

          // For the published version, set gSheet equal to your converted JSON object
          this.gSheet = cleanData;

          console.log("done fetching and cleaning data");
          this.dataReady = true;

          if (location.hostname.toString() !== "localhost") {
            this.$mixpanel.track("Visit Game Session", {
              game_name: this.customOptions.gameTitle ?? "untitled",
              session_url: location.hostname.toString() + this.$route.fullPath,
              format: "Hexflower",
            });
          }

          if (this.firebaseReady && this.roomInfo.hexesVisible.length == 0) {
            console.log('about to regen', this.roomInfo)
            this.regenerateHexes();
          }
        })
        .catch((error) => {
          this.gSheet = [
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

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang='scss'>
@use "sass:math";
$base-color: rgb(33, 33, 33);

$hex-height: 92px; // flat top
$hex-width: math.floor($hex-height * 1.1547);
$hex-padding: 4px;

// HEXES
.hexflower-body {
  // padding-bottom: $hex-height * 5.3;
  height: $hex-height * 5.2;
  width: $hex-height * 5.2;
  @media (max-width: 375px) {
    height: $hex-height * 5.2 * .75;
    width: $hex-height * 5.2 * .75;
  }
  margin-top: 10px;
  // margin-left: 7.5px;
  color:black;
  display: flex;
  justify-content: center;  
  filter: drop-shadow(0px 0px 1px rgba(50, 50, 0, 0.7));  
}

.pointy-top {
  transform: rotate(-90deg);
  
}

.pointy-top.hexflower-body {
 transform: rotate(-90deg) translate(0px, math.floor($hex-width - $hex-height)/2);
}

.hex-tile-foggy {
  background-color: grey !important;
}

.hex-tile-foggy .hex-tile-inner-content {
  background-color: red;
  visibility: hidden;
}

.pointy-top .hex-tile-inner-content {
  transform: rotate(90deg);
}

.pointy-top .hex-tile-inner:hover .hex-tile-inner-content {
  transform: scale(1.075) rotate(90deg);
}
.pointy-top .hex-tile-inner:hover(.hex-tile-active) {
  filter: contrast(90%) brightness(95%);
}
.pointy-top .hex-tile:focus:not(.hex-tile-active) {
  filter: contrast(90%) brightness(95%);
}

.hex-tile:first-child {
  margin-left: 0px !important;
}

// This is just for positioning
.hex-tile {
  position: absolute;
  background: none;
  width: $hex-width;
  height: $hex-height;
  @media (max-width: 375px) {
    height: $hex-height * .75;
    width: $hex-width * .75;
  }
  border: 0;
  padding: 0;
  -webkit-clip-path: polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%);
  clip-path: polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%);  
}

// This is the actual styling
.hex-tile-inner {
  transition: all 0.3s;
  -webkit-clip-path: polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%);
  clip-path: polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%);
  background: white;
  position: absolute;
  margin-top: -$hex-height/2;
  height: $hex-height;
  width: $hex-width;
  @media (max-width: 375px) {
    margin-top: -$hex-height * .75 / 2;
    height: $hex-height * .75;
    width: $hex-width * .75 ;
    background-size: ($hex-width * .75) ($hex-height * .75);
  }
  display: flex;
  align-items: center;
  justify-content: center;  
}

// This is the content
.hex-tile-inner-content {
  transition: all 0.1s;
  padding: $hex-height / 4; 
  @media (max-width: 375px) {
    padding: $hex-height * .75 / 4; 
  }
}
.hex-tile-inner-content-xs { 
  font-size: $hex-height / 8;
  @media (max-width: 375px) {
    font-size: $hex-height * .75 / 8;
  }
}
.hex-tile-inner-content-sm { 
  font-size: $hex-height / 6;
  @media (max-width: 375px) {
    font-size: $hex-height * .75 / 6;
  }
}
.hex-tile-inner-content-md {
  font-size: $hex-height / 4;
  @media (max-width: 375px) {
    font-size: $hex-height * .75 / 4;
  }
}
.hex-tile-inner-content-lg {
  font-size: $hex-height / 2;
  @media (max-width: 375px) {
    font-size: $hex-height * .75 / 2;
  }
}

.hex-tile:focus {
  outline: transparent;
  // outline: solid transparent;
  // box-shadow: 0 0 0 1px #fff, 0 0 0 3px #f5a;
}

.hex-tile-inner:hover .hex-tile-inner-content {
  transform: scale(1.075);
}
.hex-tile-inner:hover {
  filter: contrast(90%) brightness(95%);
}
.hex-tile:focus:not(.hex-tile-active) {
  filter: contrast(90%) brightness(95%);
}


.hex-tile-active {
  z-index: 1000;
  font-size: bold !important;
  filter: drop-shadow(-1px 6px 15px rgba(0, 0, 0, 0.372));
  pointer-events: none;
  -webkit-clip-path: none !important;
  clip-path: none !important;
}

.hex-tile-active .hex-tile-inner  {
  transform: scale(1.1);
}

/////////////////////////////////////////////
// Reset Animation
/////////////////////////////////////////////
.hex-resetting .hex-tile-inner {
  transform: rotateY(90deg) !important;
}
.hex-resetting .hex-tile-inner .hex-tile-inner-content {
  display: none;
}
@for $i from 0 through 17 {
  .hex-resetting .hex-tile:nth-child(#{$i}) .hex-tile-inner {
    transition-delay: #{$i/36}s;
  }
}

/////////////////////////////////////////////
// Randomizer Animation
/////////////////////////////////////////////
.hex-randomizing .hex-tile-previous-active {
  filter: drop-shadow(-1px 6px 15px rgba(0, 0, 0, 0.372));
  -webkit-clip-path: none !important;
  clip-path: none !important;
  z-index: 1001;
}
.hex-randomizing .hex-tile-previous-active .hex-tile-inner  {
  transform: scale(1.1);
}

.hex-randomizing .hex-tile-active,
.hex-randomizing .hex-tile-active .hex-tile-inner
{
  transition-delay: 1.5s;
}
.hex-randomizing .hex-tile-animate-randomization {
  animation-duration: 0.75s;
  animation-name: tile-randomizing;  
  animation-iteration-count: infinite;
}
@keyframes tile-randomizing {
  0% {
    filter: contrast(100%) brightness(100%);
  }

  50% {
    filter: contrast(40%) brightness(55%);
  }

  100% {
    filter: contrast(100%) brightness(100%);
  }  
}


/////////

.fade-full-content-enter-active,
.fade-full-content-leave-active {
  transition: opacity .3s;
}
.fade-full-content-enter, .fade-leave-to {
  opacity: 0;
}
//


.slot-machine {
  margin: auto;
  padding-top: 1em;
  padding-bottom: 1em;
}

.card-body {
  font-size: 1.5em;
  min-height: 11em;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}

// Reroll transition reroll-full-content and reroll-current-hex
.reroll-enter-active,
.reroll-leave-active {
  transition: all .5s;
}

.reroll-current-hex-enter {
  transform: scale(0);
}

.reroll-list-enter-active {
  transition: all .5s;
}
.reroll-list-leave-active {
 transition: all 0s;
}

.reroll-list-enter, .reroll-list-leave-to /* .list-leave-active below version 2.1.8 */ {
  opacity: 0;
}

.reroll-list-move {
  transition: transform 1s;
}

.x-card-text {
  font-size: 0.5em;
  text-decoration: underline;
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
