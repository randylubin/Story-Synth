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

      <div class="mt-4 generator-main card shadow mb-4">
        <div class="regenerate-button my-4">
          <b-form inline class="justify-content-center">
            <b-button v-on:click="shuffleAll()" class="btn btn-dark">
              <span>Randomize All</span> <b-icon class='generator-cell-reroll-icon' icon="arrow-clockwise"></b-icon>
            </b-button>
            <b-form-select v-model="generatorView" class="ml-3" v-if="customOptions.showSummary || customOptions.showFullLists">
              <b-form-select-option value="Grid View">Grid View</b-form-select-option>
              <b-form-select-option value="Summary View" v-if="customOptions.showSummary">Summary View</b-form-select-option>
              <b-form-select-option value="Full View" v-if="customOptions.showFullLists">Full View</b-form-select-option>
            </b-form-select>
          </b-form>
        </div>

        
        <div title="Grid" class='pl-3 pr-3' v-if="generatorView == 'Grid View'">
          
          <div class="row generator-row">
            <button
              v-for="index in numberOfCategories"
              v-bind:key="index"
              v-bind:class="customOptions.generatorRowLayout[index - 1]"
              v-on:click="shuffleOne(index)"
              tabindex="0"
            >
              <transition name="reroll" mode="out-in">
                <div 
                  class="mt-4 mb-3 generator-cell-contents"
                  :key="
                    categoryData[index - 1][
                      roomInfo.currentGeneratorSelection[index - 1]
                    ]
                  "
                >
                  <div class="mb-2">
                    <div
                      v-html="categoryLabels[index - 1]"
                      v-if="!customOptions.hideLabels"
                      class="generator-cell-label px-2"
                      style="cursor: pointer"
                    ></div>
                  </div>
                  
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
                  <div class="generator-cell-reroll-button" v-if="categoryData[index - 1][
                          roomInfo.currentGeneratorSelection[index - 1]
                        ]">
                    <span>Reroll</span> <b-icon class='generator-cell-reroll-icon' icon="arrow-clockwise"></b-icon>
                  </div>
                </div>
              </transition>
            </button>
          </div>
        </div>

        <div title="Summary" class='pl-3 pr-3' v-if="generatorView == 'Summary View'">
          <div class="row generator-summary text-left my-5">
            <div
              v-for="index in numberOfCategories"
              v-bind:key="index"
              class="col-12"
            >
              <div v-on:click="shuffleOne(index)" class="" style="white-space: pre-line; cursor: pointer">
                <span
                  v-html="categoryLabels[index - 1] + ':'"
                  v-if="!customOptions.hideLabels"
                  class="summary-category-label px-2 font-weight-bold"
                ></span>
                <transition name="reroll" mode="out-in">
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
                    class="summary-category-body font-weight-normal mb-2"
                  ></span>
                </transition>
                <b-icon v-on:click="shuffleOne(index)" class='ml-2 generator-cell-reroll-icon' icon="arrow-clockwise"></b-icon>
              </div>
            </div>
          </div>
        </div>

        <div title="Full" class='pl-3 pr-3' v-if="generatorView == 'Full View'">
          <div class="row generator-row generator-full">
            <div
              v-for="index in numberOfCategories"
              v-bind:key="index"
              v-bind:class="customOptions.generatorRowLayout[index - 1]"
            >
              <div class="my-4 generator-cell-contents">
                <div class="mb-2">
                  <div
                    v-html="categoryLabels[index - 1]"
                    v-on:click="shuffleOne(index)"
                    v-if="!customOptions.hideLabels"
                    class="generator-cell-label px-2"
                    style="cursor: pointer"
                  ></div>
                </div>
                <div
                  v-for="(option, optionIndex) in categoryData[index - 1]"
                  v-bind:key="option"
                >
                  <transition name="reroll" mode="out-in">
                    <span
                      v-html="option"
                      v-on:click="selectOne(index, optionIndex)"
                      class="font-weight-normal"
                      v-bind:class="{
                        'font-weight-bolder':
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
                <div
                  v-on:click="shuffleOne(index)"
                  class="generator-cell-reroll-button"
                  v-if="customOptions.rerollButton"
                >
                  <span>Random</span> <b-icon class='generator-cell-reroll-icon' icon="arrow-clockwise"></b-icon>
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
      generatorView: 'Grid View',
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

      if (newGeneratorSelection[index - 1] == newValueIndex){
        newGeneratorSelection[index - 1] = ''
        roomsCollection.doc(this.roomID).update({
          currentGeneratorSelection: newGeneratorSelection,
        });
      }      

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
                        "col-sm-6 generator-cell-one-half generator-cell " +
                          rowClass
                      );
                      bootstrapLayout.push(
                        "col-sm-6 generator-cell-one-half generator-cell generator-cell-row-end " +
                          rowClass
                      );
                      break;
                    case "3":
                      bootstrapLayout.push(
                        "col-sm-4 generator-cell-one-third generator-cell " +
                          rowClass
                      );
                      bootstrapLayout.push(
                        "col-sm-4 generator-cell-one-third generator-cell " +
                          rowClass
                      );
                      bootstrapLayout.push(
                        "col-sm-4 generator-cell-one-third generator-cell generator-cell-row-end " +
                          rowClass
                      );
                      break;
                    case "4":
                      bootstrapLayout.push(
                        "col-sm-3 generator-cell-one-quarter generator-cell " +
                          rowClass
                      );
                      bootstrapLayout.push(
                        "col-sm-3 generator-cell-one-quarter generator-cell " +
                          rowClass
                      );
                      bootstrapLayout.push(
                        "col-sm-3 generator-cell-one-quarter generator-cell " +
                          rowClass
                      );
                      bootstrapLayout.push(
                        "col-sm-3 generator-cell-one-quarter generator-cell generator-cell-row-end " +
                          rowClass
                      );
                      break;
                    default:
                      bootstrapLayout.push(
                        "col-sm-12 generator-cell-full generator-cell generator-cell-row-end " +
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

<style lang='scss'>
@import url('https://fonts.googleapis.com/css2?family=Share+Tech+Mono&display=swap');

.style-template-light {
  background-color: var(--light);
}

.style-template-dark {
  $base-color: var(--light);
  $dark-color: rgb(36, 36, 36);

  color: $base-color;
  .full-page-background {
    background: $dark-color !important;    
  }

  .card {
    background: var(--dark) !important;
  }
  .generator-cell {
    border-top: 1px solid $dark-color !important;
  }
  .generator-cell:not(.generator-cell-row-end) {    
    border-right: 1px solid $dark-color !important;
  }  

  .btn, select {
    border: none;
    background: $dark-color !important;
    color: white !important;
  }
  .btn:hover {
    background: rgba($dark-color, 0.8) !important;
  }  

  .generator-cell-label {
    background: none !important;
    color: rgba(255,255,255, 0.7) !important;
    padding-bottom: 4px !important;
    text-transform: uppercase;
    padding-top: 4px !important;
    box-shadow: 0px 0px 15px rgba($base-color, 0.3);
  }

  .generator-cell-body {
    text-shadow: 0px 0px 8px rgba($base-color, 0.9);
  }

  .generator-cell:hover {
    background-color: rgba($dark-color, 0.3);
    box-shadow: 0px 0px 8px rgba($base-color, 0.25);
  }
}

.style-template-cyberpunk {
  
  // Base styles
  $base-color: rgb(0, 255, 123);
  font-family: 'Share Tech Mono', monospace;
  color: $base-color;
  text-shadow: 0px 0px 8px rgba($base-color, 0.9);

  .full-page-background {
    background: linear-gradient(#170000, #000321);
  }

  .btn, select {
    border: none !important;
    background: $base-color !important;
    color: black !important;  
    .btn:hover {
      background: rgba($base-color, 0.8) !important;
    }  
  }

  // Card and divider styles
  .card {
    background: transparent;
    box-shadow: 0px 0px 48px rgba($base-color, 0.15), 
                inset 0px 0px 48px rgba($base-color, 0.15) !important;
    border: 1px solid rgba($base-color, 0.5) !important;
  }
  
  .generator-cell {
    border-top: 1px solid rgba($base-color, 0.5) !important;
  }
  .generator-cell:not(.generator-cell-row-end) {    
    border-right: 1px solid rgba($base-color, 0.5) !important;
  }  

  // Make the labels fill full card width
  .generator-cell-contents {
    align-items: normal !important;
  }

  // Label styles
  .generator-cell-label {
    background: $base-color !important;
    color: black !important;
    text-transform: uppercase;
    padding-top: 4px !important;
    box-shadow: 0px 0px 15px rgba($base-color, 0.3);
  }
    
  // Main body
  .generator-cell-body {
      text-shadow: 0px 0px 8px rgba($base-color, 0.9);
  }

  // Cool hover effect
  .generator-cell:hover {
    background-color: rgba($base-color, 0.3);
    box-shadow: 0px 0px 8px rgba($base-color, 0.25);
  }
}

@import url('https://fonts.googleapis.com/css2?family=MedievalSharp&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Cardo:ital,wght@0,400;0,700;1,400&display=swap');
.style-template-fantasy {

  font-family: 'Cardo', Garamond, serif !important;
  font-size: 1.1em !important;
  $base-color: rgb(55, 10, 0);
  $label-text: rgb(92, 0, 71);
  $label-bg: rgb(206, 131, 0);
  $card-bg: rgb(92, 0, 71);

  color: $base-color;

  .btn, select {
    border: none !important;
    background: $base-color !important;
    color: white !important;  
    .btn:hover {
      background: rgba($base-color, 0.8) !important;
    }  
  }

  .full-page-background {
    background-color: #ffe8b8;
    background-blend-mode: multiply;
    background-image: url(https://www.toptal.com/designers/subtlepatterns/patterns/handmadepaper.png);
  }

  h1, h2, h3 {
    font-family: 'MedievalSharp', cursive !important;    
    text-shadow:  1px 0 $label-bg, 
                  0 1px $label-bg, 
                  1px 0 $label-bg, 
                  0 1px $label-bg;  
  }
  .generator-cell-label {
    font-family: 'MedievalSharp', cursive !important;
    background: none !important;
    color: $label-text !important;
    text-shadow: -0.5px 0 $label-bg, 
                  0 0.5px $label-bg, 
                  0.5px 0 $label-bg, 
                  0 -0.5px $label-bg;
    text-transform: uppercase;
  }


  .card {
    background: linear-gradient(rgb(233, 173, 70), rgb(255, 232, 175));
    border: 1px solid $card-bg;
    color: $base-color;
  }
  
}

// @import url('https://fonts.googleapis.com/css2?family=MedievalSharp&family=Tinos:ital,wght@0,400;0,700;1,400;1,700&display=swap');
// @import url('https://fonts.googleapis.com/css2?family=MedievalSharp&family=Pacifico&family=Tinos:ital,wght@0,400;0,700;1,400;1,700&display=swap');

.style-template-vaporwave {
  font-family: 'Arial', sans-serif !important;
  font-size: 1.1em !important;
  $base-color: rgb(255, 255, 255);
  $contrast-color: rgb(29, 29, 29);
  $label-text: #6EFCBB;
  $label-bg: rgb(206, 131, 0);
  $card-bg: rgb(92, 0, 71);

  color: $base-color;

  .full-page-background {
    background: linear-gradient(rgb(55, 0, 255), rgb(255, 0, 162));
    color: $label-text !important;
    text-shadow: 4px 4px 0px #4AB18E;
    text-transform: uppercase;
  }

  .btn, select {
    border: none !important;
    background: $label-text !important;
    color: $contrast-color !important;  
    .btn:hover {
      background: rgba($base-color, 0.8) !important;
    }  
  }

  .card {
    background: linear-gradient(rgba(55, 0, 255, 0.694), rgba(205, 0, 223, 0.502));
    border: 1px solid $card-bg;
    color: $base-color;
  }
  

  h1 {
    font-weight: 700;
    color: $label-text !important;
    text-shadow: 4px 4px 0px #4AB18E;
  }
  .generator-cell-label {
    font-weight: 700;
    background: none !important;
    color: $label-text !important;
    text-shadow: 1px 1px 0px #4AB18E;
    text-transform: uppercase;
  }

  .generator-cell-body {
    text-shadow: 0px 0px 10px rgb(255, 0, 195) !important;
    transform: rotate(-3deg);
  }  


  
}

</style>


<style scoped lang='scss'>

$base-color: rgb(33, 33, 33);

.generator-main {
  font-weight: bold;  
  border-radius: 5px;
}

// CELL
.generator-cell {
  border-top: 1px solid rgba($base-color, 0.1);
  border-right: 0px;
  border-left: 0px;
  border-bottom: 0px;
  display: inline-flex; /* keep the inline nature of buttons */
  align-items: stretch; /* this is default */  
  font-family: inherit;
  font-size: 100%;
  background: inherit;
  color: inherit;
  transition: background-color 0.2s;
  transition: all 0.3s;  
  white-space: nowrap;
  overflow: hidden;
  outline-offset: -1px;
}

.generator-cell:not(.generator-cell-row-end) {    
  border-right: 1px solid rgba($base-color, 0.1);
}  

.generator-cell:hover {
  cursor: pointer;

  .generator-cell-contents {
    transform: scale(1.04);
  }

  .generator-cell-reroll-button {
    opacity: 0.5;
  }
}

.generator-cell:focus {
  outline: 1px solid rgba(255, 255, 255, 0.25);
  outline-offset: -1px;
  .generator-cell-reroll-button {
    opacity: 0.5;
  }  
}

.generator-cell-contents {
  width: 100%;
  white-space: pre-line;
  display: flex;
  align-items: center;
  flex-direction: column;
  transition: all 0.3s;  
}

// CELL LABEL
.generator-cell-label {
  // background: var(--dark);
  // color: white;  
  background: var(--yellow);
  // border-bottom: 4px solid var(--dark);
  text-transform: uppercase;
  padding-top: 2px;
  padding-bottom: 2px;
  transition: all 0.2s;
  font-size: 0.8em;
  font-weight: bold;
}

// CELL BODY
.generator-cell-body {
  flex-grow: 1;
  transition: all 0.2s;
  font-weight: 500;
}

.generator-cell-full {
  .generator-cell-body {
    font-size: 2em; 
  }
}
.generator-cell-one-half {
  .generator-cell-body {
    font-size: 1.1em;
    font-weight: 600;
  }
}
.generator-cell-one-third {
  .generator-cell-body {
    font-size: 1.1em;
    font-weight: 600;
  }  
}
.generator-cell-one-quarter {  
  .generator-cell-body {
    font-size: 0.9em;
    font-weight: 600;
  }
}


// CELL REROLL BUTTON
.generator-cell-reroll-button {
  margin-top: 8px;
  text-transform: uppercase;
  font-size: 0.8em;
  transition: opacity 0.25s;
  opacity: 0;
}

////////////////////////////////

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

// Reroll transition
.reroll-enter-active,
.reroll-leave-active {
  transition: all .5s;

}
.reroll-enter, .reroll-leave-to /* .fade-leave-active below version 2.1.8 */ {

  .generator-cell-label {
    // transform: scale(1.025);
    transition: transform 0.5s;
    transform: translateY(0px) scale(1.05);
  }

  .generator-cell-body {
    // transition-delay: 0.25s;
    opacity: 0;
    transform: scale(0.9);
  }

  .generator-cell-reroll-button {
    transition: transform 0.5s;
    transform: scale(1.1);
  }

  .generator-cell-reroll-icon {
    transition: transform 0.5s;
    transform: rotate(360deg)
  }

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
