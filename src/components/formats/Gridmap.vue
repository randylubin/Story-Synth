<template>
  <div
    class="gridmap game-room container"
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
        class="card d-flex shadow img-fluid"
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

      <div
        class="mt-4 gridmap-main"
        v-if="dataReady && firebaseReady && !error"
      >
        <div class="regenerate-button my-4">
          <button v-on:click="shuffleAll()" class="btn btn-dark">
            Regenerate
          </button>
        </div>

        <div class="gridmap-map row mt-3" align="center">
          <div class="col">
            <div
              class="row gridmap-row"
              v-for="(row, rowIndex) in parseInt(customOptions.mapRows)"
              v-bind:key="rowIndex"
            >
              <div
                v-for="(col, colIndex) in parseInt(customOptions.mapColumns)"
                v-bind:key="colIndex"
                class="col gridmap-col"
              >
                <div class="my-4" style="white-space: pre-line">
                  <div
                    v-html="
                      originalGridmapData[
                        roomInfo.currentMapData[
                          rowIndex * parseInt(customOptions.mapColumns) +
                            colIndex
                        ]
                      ]
                    "
                    class="map-element mb-2"
                  ></div>

                  <button
                    v-on:click="shuffleOne(index)"
                    class="reroll-button btn btn-dark btn-sm"
                    v-if="customOptions.rerollButton"
                  >
                    Reroll
                  </button>
                </div>
              </div>
            </div>
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
  name: "app-gridmap",
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
        currentMapData: [0, 1, 2],
      },
      dataReady: false,
      firebaseReady: false,
      gSheet: [{ text: "loading" }],
      gridmapLayout: [],
      numberOfCategories: 0,
      categoryLabels: [],
      originalGridmapData: [],
      categoryData: [],
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
            currentMapData: [0, 1, 2],
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
    shuffleAll() {
      let newMapData = [];

      if (this.customOptions.gridmapMode === "unique") {
        newMapData = Array.from(Array(this.originalGridmapData.length).keys());
        //let mapSize = parseInt(this.customOptions.mapRows) * parseInt(this.customOptions.mapColumns)

        for (let i = newMapData.length - 1; i > 0; i--) {
          let j = Math.floor(Math.random() * (i + 1));
          [newMapData[i], newMapData[j]] = [newMapData[j], newMapData[i]];
        }
      }

      if (this.customOptions.gridmapMode === "replaced") {
        newMapData = Array.from(Array(this.originalGridmapData.length).keys());

        for (let i = 0; i < newMapData.length; i++) {
          newMapData[i] = Math.floor(Math.random() * newMapData.length);
        }
      }

      console.log("new map data:", newMapData);

      // sync the shuffled array
      roomsCollection.doc(this.roomID).update({
        currentMapData: newMapData,
      });
    },
    shuffleOne(index) {
      let newMapData = this.roomInfo.currentMapData;

      let newValueIndex = Math.floor(
        Math.random() * this.categoryData[index - 1].length
      );

      newMapData[index - 1] = newValueIndex;

      // sync the shuffled array
      roomsCollection.doc(this.roomID).update({
        currentMapData: newMapData,
      });
    },
    selectOne(index, optionIndex) {
      let newMapData = this.roomInfo.currentMapData;

      newMapData[index - 1] = optionIndex;

      // sync the shuffled array
      roomsCollection.doc(this.roomID).update({
        currentMapData: newMapData,
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
        "?includeGridData=true&ranges=a1:aa400&key=" + process.env.VUE_APP_FIREBASE_API_KEY;

      // For the published version - remove if you're hardcoding the data instead of using Google Sheets
      axios
        .get(getURL)
        .then((response) => {
          var cleanData = [];
          var gRows = response.data.sheets[0].data[0].rowData;

          // Transform Sheets API response into cleanData
          gRows.forEach((item, i) => {
            // grab labels
            if (i == 0) {
              for (let j = 3; j < item.values.length; j++) {
                this.categoryLabels.push(item.values[j].formattedValue);
              }
              console.log("labels:", this.categoryLabels);
            }

            if (i !== 0 && item.values[0].formattedValue) {
              // Handle options
              if (item.values[0].formattedValue == "option") {
                this.customOptions[item.values[1].formattedValue] =
                  item.values[2].formattedValue;
                console.log(item.values[2].formattedValue);
              }

              if (item.values[1].formattedValue == "gridmapLayout") {
                let rowLayout = this.customOptions.gridmapLayout.split(",");

                let bootstrapLayout = [];

                for (let j = 0; j < rowLayout.length; j++) {
                  let rowClass = "gridmap-row-" + (j + 1);
                  switch (rowLayout[j]) {
                    case "2":
                      bootstrapLayout.push("col-sm-6 gridmap-col " + rowClass);
                      bootstrapLayout.push("col-sm-6 gridmap-col " + rowClass);
                      break;
                    case "3":
                      bootstrapLayout.push("col-sm-4 gridmap-col " + rowClass);
                      bootstrapLayout.push("col-sm-4 gridmap-col " + rowClass);
                      bootstrapLayout.push("col-sm-4 gridmap-col " + rowClass);
                      break;
                    case "4":
                      bootstrapLayout.push("col-sm-3 gridmap-col " + rowClass);
                      bootstrapLayout.push("col-sm-3 gridmap-col " + rowClass);
                      bootstrapLayout.push("col-sm-3 gridmap-col " + rowClass);
                      bootstrapLayout.push("col-sm-3 gridmap-col " + rowClass);
                      break;
                    default:
                      bootstrapLayout.push("col-xs-12 gridmap-col " + rowClass);
                  }
                }

                this.customOptions.gridmapLayout = bootstrapLayout;
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
                let rowInfo = {};
                if (item.values[0].formattedValue >= 0) {
                  rowInfo = {
                    ordered: item.values[0].formattedValue,
                    headerText: item.values[1].formattedValue,
                    bodyText: item.values[2].formattedValue,
                  };
                  cleanData.push(rowInfo);

                  if (item.values[0].formattedValue == 0) {
                    this.firstNonInstruction += 1;
                  }

                  if (item.values[0].formattedValue == 1) {
                    this.originalGridmapData.push(
                      item.values[3].formattedValue
                    );
                  }
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
              format: "Gridmap",
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


<style scoped>
.style-template-red {
  color: red;
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

.gridmap-map {
  width: 100vw;
  position: relative;
  left: calc(-1 * (100vw - 100%) / 2);
  margin-left: 0px;
  min-width: 650px;
}
</style>
