<template>
  <div
    class="generator game-room container"
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

      <div class="mt-4 generator-main">
        <div class="regenerate-button my-4">
          <button v-on:click="shuffleAll()" class="btn btn-dark">
            Regenerate
          </button>
        </div>

        <b-tabs pills dark content-class="mt-3" align="center">
          <b-tab title="Grid" active>
            <div class="row generator-row">
              <div
                v-for="index in numberOfCategories"
                v-bind:key="index"
                v-bind:class="customOptions.generatorRowLayout[index - 1]"
              >
                <div class="my-4" style="white-space: pre-line">
                  <div class="mb-2">
                    <span
                      v-html="categoryLabels[index - 1]"
                      v-on:click="shuffleOne(index)"
                      v-if="!customOptions.hideLabels"
                      class="generator-cell-label px-2"
                      style="cursor: pointer"
                    ></span>
                  </div>
                  <transition name="fade" mode="out-in">
                    <div
                      :key="
                        categoryData[index - 1][
                          roomInfo.currentGeneratorSelection[index - 1]
                        ]
                      "
                      v-html="
                        categoryData[index - 1][
                          roomInfo.currentGeneratorSelection[index - 1]
                        ]
                      "
                      class="generator-cell-body mb-2"
                    ></div>
                  </transition>
                  <button
                    v-on:click="shuffleOne(index)"
                    class="generator-cell-reroll-button btn btn-dark btn-sm"
                    v-if="customOptions.rerollButton"
                  >
                    Reroll
                  </button>
                </div>
              </div>
            </div>
          </b-tab>

          <b-tab title="Summary">
            <div class="row generator-summary text-left">
              <div
                v-for="index in numberOfCategories"
                v-bind:key="index"
                class="col-12"
              >
                <div class="" style="white-space: pre-line">
                  <span
                    v-html="categoryLabels[index - 1] + ':'"
                    v-on:click="shuffleOne(index)"
                    v-if="!customOptions.hideLabels"
                    class="summary-category-label px-2 font-weight-bold"
                    style="cursor: pointer"
                  ></span>
                  <transition name="fade" mode="out-in">
                    <span
                      :key="
                        categoryData[index - 1][
                          roomInfo.currentGeneratorSelection[index - 1]
                        ]
                      "
                      v-html="
                        categoryData[index - 1][
                          roomInfo.currentGeneratorSelection[index - 1]
                        ]
                      "
                      class="summary-category-body mb-2"
                    ></span>
                  </transition>
                </div>
              </div>
            </div>
          </b-tab>

          <b-tab title="Full">
            <div class="row generator-row generator-full">
              <div
                v-for="index in numberOfCategories"
                v-bind:key="index"
                v-bind:class="customOptions.generatorRowLayout[index - 1]"
              >
                <div class="my-4" style="white-space: pre-line">
                  <div class="mb-2">
                    <span
                      v-html="categoryLabels[index - 1]"
                      v-on:click="shuffleOne(index)"
                      v-if="!customOptions.hideLabels"
                      class="generator-cell-label px-2"
                      style="cursor: pointer"
                    ></span>
                  </div>
                  <div
                    v-for="(option, optionIndex) in categoryData[index - 1]"
                    v-bind:key="option"
                  >
                    <transition name="fade" mode="out-in">
                      <span
                        v-html="option"
                        v-on:click="selectOne(index, optionIndex)"
                        v-bind:class="{
                          'font-weight-bold':
                            option ==
                            categoryData[index - 1][
                              roomInfo.currentGeneratorSelection[index - 1]
                            ],
                        }"
                        :key="
                          categoryData[index - 1][
                            roomInfo.currentGeneratorSelection[index - 1]
                          ]
                        "
                        style="cursor: pointer"
                      ></span>
                    </transition>
                  </div>
                  <button
                    v-on:click="shuffleOne(index)"
                    class="reroll-button btn btn-dark btn-sm mt-2"
                    v-if="customOptions.rerollButton"
                  >
                    Reroll
                  </button>
                </div>
              </div>
            </div>
            <!-- LIST FORM
            <div
              v-for="index in numberOfCategories"
              v-bind:key="index"
              class="generator-full col-12 my-3 text-left"
            >
              <div>
                <span
                  v-html="categoryLabels[index - 1]"
                  v-on:click="shuffleOne(index)"
                  v-if="!customOptions.hideLabels"
                  class="summary-category-label font-weight-bold"
                  style="cursor: pointer; white-space: pre-line"
                ></span>
                <button
                  v-on:click="shuffleOne(index)"
                  class="reroll-button btn btn-dark btn-sm ml-2"
                  v-if="customOptions.rerollButton"
                >
                  Reroll
                </button>
              </div>
              <div>
                <div
                  v-for="(option, optionIndex) in categoryData[index - 1]"
                  v-bind:key="option"
                >
                  <span
                    v-html="option"
                    v-on:click="selectOne(index, optionIndex)"
                    v-bind:class="{
                      'font-weight-bold':
                        option ==
                        categoryData[index - 1][
                          roomInfo.currentGeneratorSelection[index - 1]
                        ],
                    }"
                    style="cursor: pointer"
                  ></span>
                </div>
              </div>
            </div>
            -->
          </b-tab>
        </b-tabs>
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
  name: "app-generator",
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
        currentGeneratorSelection: [0, 1, 2],
      },
      dataReady: false,
      firebaseReady: false,
      gSheet: [{ text: "loading" }],
      generatorLayout: [],
      numberOfCategories: 0,
      categoryLabels: [],
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
            currentGeneratorSelection: [0, 1, 2],
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
      let newGeneratorSelection = [];

      for (let i = 0; i < this.numberOfCategories; i++) {
        newGeneratorSelection.push(
          Math.floor(Math.random() * this.categoryData[i].length)
        );
      }

      console.log("new generator picks:", newGeneratorSelection);

      // sync the shuffled array
      roomsCollection.doc(this.roomID).update({
        currentGeneratorSelection: newGeneratorSelection,
      });
    },
    shuffleOne(index) {
      let newGeneratorSelection = this.roomInfo.currentGeneratorSelection;

      let newValueIndex = Math.floor(
        Math.random() * this.categoryData[index - 1].length
      );

      newGeneratorSelection[index - 1] = newValueIndex;

      // sync the shuffled array
      roomsCollection.doc(this.roomID).update({
        currentGeneratorSelection: newGeneratorSelection,
      });
    },
    selectOne(index, optionIndex) {
      let newGeneratorSelection = this.roomInfo.currentGeneratorSelection;

      newGeneratorSelection[index - 1] = optionIndex;

      // sync the shuffled array
      roomsCollection.doc(this.roomID).update({
        currentGeneratorSelection: newGeneratorSelection,
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
        "?includeGridData=true&ranges=a1:aa100&key=AIzaSyDsIM5nJ3hNoVRCSd3kJXfrAL8_n9gwFdM";

      // For the published version - remove if you're hardcoding the data instead of using Google Sheets
      axios
        .get(getURL)
        .then((response) => {
          var cleanData = [];
          var gRows = response.data.sheets[0].data[0].rowData;

          this.numberOfCategories = gRows[0].values.length - 3;

          for (var w = 0; w < this.numberOfCategories; w++) {
            this.categoryData.push([]);
          }

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

              if (item.values[1].formattedValue == "generatorRowLayout") {
                let rowLayout =
                  this.customOptions.generatorRowLayout.split(",");

                let bootstrapLayout = [];

                for (let j = 0; j < rowLayout.length; j++) {
                  let rowClass = "generator-row-" + (j + 1);
                  switch (rowLayout[j]) {
                    case "2":
                      bootstrapLayout.push(
                        "col-sm-6 generator-row-one-half generator-cell " +
                          rowClass
                      );
                      bootstrapLayout.push(
                        "col-sm-6 generator-row-one-half generator-cell " +
                          rowClass
                      );
                      break;
                    case "3":
                      bootstrapLayout.push(
                        "col-sm-4 generator-row-one-third generator-cell " +
                          rowClass
                      );
                      bootstrapLayout.push(
                        "col-sm-4 generator-row-one-third generator-cell " +
                          rowClass
                      );
                      bootstrapLayout.push(
                        "col-sm-4 generator-row-one-third generator-cell " +
                          rowClass
                      );
                      break;
                    case "4":
                      bootstrapLayout.push(
                        "col-sm-3 generator-row-one-quarter generator-cell " +
                          rowClass
                      );
                      bootstrapLayout.push(
                        "col-sm-3 generator-row-one-quarter generator-cell " +
                          rowClass
                      );
                      bootstrapLayout.push(
                        "col-sm-3 generator-row-one-quarter generator-cell " +
                          rowClass
                      );
                      bootstrapLayout.push(
                        "col-sm-3 generator-row-one-quarter generator-cell " +
                          rowClass
                      );
                      break;
                    default:
                      bootstrapLayout.push(
                        "col-sm-12 generator-row-full generator-cell " +
                          rowClass
                      );
                  }
                }

                this.customOptions.generatorRowLayout = bootstrapLayout;
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
                var rowInfo = {};
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
                    for (var j = 3; j < item.values.length; j++) {
                      if (item.values[j].formattedValue) {
                        this.categoryData[j - 3].push(
                          item.values[j].formattedValue
                        );
                      }
                    }
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
              format: "Generator",
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

<style>
.style-template-light {
  color: rgb(0, 0, 0) !important;
  background-color: rgb(255, 255, 255) !important;
}

.style-template-dark {
  color: white;
  background-color: black;
}

.style-template-cyberpunk {
  color: rgb(0, 0, 0);
  background-color: rgb(255, 0, 217);
  font-family: "Courier New", Courier, monospace;
}

.style-template-fantasy {
  color: rgb(40, 28, 2);
  background-color: rgb(244, 239, 229);
  font-family: Garamond, serif;
}
</style>


<style scoped>
.generator-main {
}
.generator-row {
}
.generator-row-full .generator-cell-body {
  font-size: 2em;
}
.generator-row-half {
}
.generator-row-one-third {
}
.generator-row-one-quarter .generator-cell-body {
  font-size: 0.8em;
}
.generator-cell {
}
.generator-cell-label {
  font-size: 0.8em;
}
.generator-cell-body {
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
</style>
