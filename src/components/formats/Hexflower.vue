<template>
  <div
    class="hexflower game-room container"
    v-if="roomInfo"
    v-bind:class="['style-template-' + customOptions.styleTemplate]"
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

      <div class="mt-4 hexflower-main card shadow mb-4">
        <div class="game-title-on-card mt-4" v-if="customOptions.gameTitle && customOptions.showGameTitleOnCard">
          <h1>{{customOptions.gameTitle}}</h1>
        </div>

        <transition name="reroll-full-content" mode="out-in">
          <div class="row mt-4" v-if="gSheet[roomInfo.currentLocation].fullContent">
            <div class="col-sm-12" v-html="gSheet[roomInfo.currentLocation].fullContent">
            </div>
          </div>
        </transition>

        <div class="row">
          <div class="regenerate-button my-4 col-sm-12 justify-content-center">
              <b-button v-on:click="randomlyMoveOnHexflower()" class="btn btn-dark mx-2 my-1">
                <span>Roll</span> <b-icon class='hexflower-reroll-icon' icon="arrow-clockwise"></b-icon>
              </b-button>
          </div>
        </div>
        
        <div class='hexflower-body'>
          <div
            class="hex-row"
            v-for="(hexRow, hexRowIndex) in hexMapRows"
            v-bind:key="hexRowIndex"
            v-bind:class="{'hex-row-even': (hexRowIndex %2 == 0), 'hex-row-odd': (hexRowIndex %2 == 1)}"
          >
            <button
              v-for="(hex, hexIndex) in hexRow"
              v-on:click="goToHex(hex.hexID)"
              v-bind:key="hexIndex"
            >
              <transition name="reroll-current-hex" mode="out-in">
                <div 
                  class="hex-tile"
                  :key="hex.hexID"
                  v-bind:class="{'hex-tile-active': (hex.hexID == roomInfo.currentLocation)}"
                >
                  {{hex.summary}}
                </div>
              </transition>
            </button>
          </div>
        </div>
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
      ></app-extensionManager>
    </div>
  </div>
</template>

<script>
import { roomsCollection } from "../../firebase";
import ExtensionManager from "../extensions/ExtensionManager.vue";
import axios from "axios";

export default {
  name: "app-hexflower",
  components: {
    "app-extensionManager": ExtensionManager,
  },
  props: {
    roomID: String,
    gSheetID: String,
  },
  data: function () {
    return {
      roomInfo: {
        currentLocation: 0,
      },
      dataReady: false,
      firebaseReady: false,
      gSheet: [{ text: "loading" }],
      hexMapRows: [[],[],[],[],[],[],[],[],[]],
      hexNeighborMap: [
        [null, null, 3, 5, 2, null],
        [null, 1, 5, 4, null, null], [null, null, 6, 8, 5, 1],
        [null,2,7,9,null,null],[1,3,8,10,7,2],[null,null,null,11,8,3],
        [2,5,10,12,9,4],[3,6,11,13,10,5],
        [4,7,12,14,null,null],[5,8,13,15,12,7],[6,null,null,16,13,8],
        [7,10,15,17,14,9],[8,11,16,18,15,10],
        [9,12,17,null,null,null],[10,13,18,19,17,12],[11,null,null,null,18,13],
        [12,15,19,null,null,14],[13,16,null,null,19,15],
        [15,18,null,null,null,17],
      ],
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
          console.log("new room!");

          roomsCollection.doc(this.roomID).set({
            extensionData: this.tempExtensionData,
            currentLocation: 0,
          });

          if (this.dataReady) {
            this.shuffleAll();
          }
        }
      })
      .catch((error) => {
        console.log("error in loading: ", error);
      });
  },
  methods: {
    randomlyMoveOnHexflower(){
      let hexID = this.roomInfo.currentLocation
      console.log(this.gSheet[hexID].probability == undefined)
      if (this.gSheet[hexID].probability == undefined){
        let diceResult = Math.floor(Math.random()*6)
        let newHexID = this.hexNeighborMap[hexID][diceResult]
        if (newHexID !== null){
          this.goToHex(newHexID-1);
        } else {
          this.randomlyMoveOnHexflower();
        }
      } else {
        let probabilityWeights = this.gSheet[hexID].probability.split(',')
        let probabilityDistribution = {}

        let hexIndex, probabilitySum = 0
        for (hexIndex in probabilityWeights){
          probabilitySum += parseInt(probabilityWeights[hexIndex])
        }
        hexIndex = 0
        for (hexIndex in probabilityWeights){
          probabilityDistribution[hexIndex] = probabilityWeights[hexIndex] / probabilitySum 
        }

        let i, sum=0, r=Math.random();
        for (i in probabilityDistribution) {
          sum += probabilityDistribution[i];
          if (r <= sum) {
            hexIndex = i;   
            break;
          }
        }

        if (hexIndex == 6){
          this.goToHex(this.roomInfo.currentLocation)
        } else {
          this.goToHex(this.hexNeighborMap[this.roomInfo.currentLocation][hexIndex]-1)
        }
      }
    },
    goToHex(hexID){
      roomsCollection.doc(this.roomID).update({
        currentLocation: hexID,
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
            console.log(i)
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
                    background: item.values[5]?.formattedValue,
                  };

                  // check for background
                  if (hexInfo.background?.charAt(0) == "#"){
                    hexInfo.backgroundColor = hexInfo.background;
                  } else if (hexInfo.background?.charAt(0) == "h"){
                    hexInfo.backgroundImage = hexInfo.background;
                  }

                  // organize into rows
                  let hexRowLookup = {0:0,1:1,2:1,3:2,4:2,5:2,6:3,7:3,8:4,9:4,10:4,11:5,12:5,13:6,14:6,15:6,16:7,17:7,18:8}
                  this.hexMapRows[hexRowLookup[hexInfo.hexID]].push(hexInfo); 

                  cleanData.push(hexInfo);
                }
              }
            }
          });

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

          if (this.firebaseReady && this.categoryData) {
            this.shuffleAll();
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

$base-color: rgb(33, 33, 33);

// HEXES
.hex-row {
  background-color:grey;
}

.hex-row-even {
  background-color: beige;
}

.hex-row-odd {
  background-color: grey;
}

.hex-tile {
  color:black;
}

.hex-tile-active {
  color:red;
}


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
.reroll-enter, .reroll-leave-to /* .fade-leave-active below version 2.1.8 */ {

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
