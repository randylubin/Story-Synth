<template>
  <div
    class="generator game-room container"
    v-if="roomInfo"
    v-bind:class="['style-template-' + customOptions.styleTemplate]"
  >
    <div class="full-page-background"></div>
    <div v-html="customOptions.style"></div>

    <!-- Menu Bar -->
    <div class="menu-bar mb-4 d-flex align-items-center">
      <button class="btn btn-outline-dark mr-auto border-0" v-b-modal.menuModal><b-icon-list></b-icon-list> Menu</button>
      <!-- <div v-if="customOptions.gameTitle" class="mx-auto align-middle text-center">{{customOptions.gameTitle}}</div> -->
      <app-roomLink class="d-none d-sm-block" :routeRoomID="$route.params.roomID" v-if="dataReady && firebaseReady"></app-roomLink>
      
      <b-modal
        id="menuModal"
        :title="customOptions.gameTitle ? customOptions.gameTitle : 'Menu'" 
        hide-footer
      >  
        <b-container>
          <div class="row menu-row">
            <b-button
              class="border-0 btn-lg btn-block"
              v-on:click="copyLinkToClipboard(); closeMenu();"
              @click="$bvToast.show('copyToast')"
            >
              <b-icon-link45deg></b-icon-link45deg> Copy URL 
            </b-button>
          </div>
        </b-container>
        <div class="" v-if="customOptions.modalOneLabel || customOptions.modalTwoLabel">
          <hr class='mb-4'/>
          <b-button
            v-b-modal.modalOne
            v-on:click="closeMenu();"
            variant="outline-dark"
            class="btn-block btn-lg"
            v-if="customOptions.modalOneLabel"
          >
            {{ customOptions.modalOneLabel }}
          </b-button>
          <b-button
            v-b-modal.modalTwo
            v-on:click="closeMenu();"
            variant="outline-dark"
            class="btn-block btn-lg"
            v-if="customOptions.modalTwoLabel"
            >{{ customOptions.modalTwoLabel }}</b-button
          >
        </div>
        <div class="row menu-row mt-4">
          <a href="https://storysynth.org" target="_blank">Powered by Story Synth</a>
        </div>
      </b-modal>
    </div>

    <b-alert show class="demoInfo" variant="info" v-if="customOptions.demoInfo">This demo is powered by <a :href="customOptions.demoInfo" target="_blank">this Google Sheet Template</a>. Copy the sheet and start editing it to design your own game!</b-alert>

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
        <!-- <b-button
          v-b-modal.modalOne
          variant="outline-dark"
          v-if="customOptions.modalOneLabel"
          >{{ customOptions.modalOneLabel }}</b-button
        > -->

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

        <!-- <b-button
          v-b-modal.modalTwo
          variant="outline-dark"
          v-if="customOptions.modalTwoLabel"
          >{{ customOptions.modalTwoLabel }}</b-button
        > -->

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
        <div class="game-title-on-card mt-4" v-if="customOptions.gameTitle && customOptions.showGameTitleOnCard">
          <h1>{{customOptions.gameTitle}}</h1>
        </div>
        <div class="regenerate-button my-4">
          <b-form inline class="justify-content-center">
            <b-button v-on:click="shuffleAll()" class="btn btn-dark mx-2 my-1">
              <span>Randomize All</span> <b-icon class='generator-cell-reroll-icon' icon="arrow-clockwise"></b-icon>
            </b-button>
            <b-form-select v-model="generatorView" class="mx-2 my-1" v-if="customOptions.showSummary || customOptions.showFullLists">
              <b-form-select-option value="Grid View">Grid View</b-form-select-option>
              <b-form-select-option value="Summary View" v-if="customOptions.showSummary">Summary View</b-form-select-option>
              <b-form-select-option value="Full View" v-if="customOptions.showFullLists">Full View</b-form-select-option>
            </b-form-select>
          </b-form>
        </div>

        
        <div class='pl-3 pr-3' v-if="generatorView == 'Grid View'">
          
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
                      v-bind:class="{'generator-cell-full-small': String(categoryData[index - 1][roomInfo.currentGeneratorSelection[index - 1]]).length >= 50}"
                    ></div>
                  <div class="generator-cell-reroll-button" v-if="categoryData[index - 1][
                          roomInfo.currentGeneratorSelection[index - 1]
                        ] && (categoryData[index-1].length > 1)">
                    <span>Reroll</span> <b-icon class='generator-cell-reroll-icon' icon="arrow-clockwise"></b-icon>
                  </div>
                </div>
              </transition>
            </button>
          </div>
        </div>

        <div class='pl-3 pr-3' v-if="generatorView == 'Summary View'">
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
                <transition-group name="reroll-list" mode="out-in">
                  <span
                    :key="
                      roomInfo.currentGeneratorSelection[index - 1]
                    "
                    v-html="
                      categoryData[index - 1][
                        roomInfo.currentGeneratorSelection[index - 1]
                      ]
                    "
                    class="summary-category-body font-weight-normal mb-2"
                  ></span>
                </transition-group>
                <b-icon v-on:click="shuffleOne(index)" class='ml-2 generator-cell-reroll-icon' icon="arrow-clockwise"></b-icon>
              </div>
            </div>
          </div>
        </div>

        <div class='pl-3 pr-3' v-if="generatorView == 'Full View'">
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
                  ></div>
                </div>
                <div
                  v-for="(option, optionIndex) in categoryData[index - 1]"
                  v-bind:key="option"
                >
                  <transition name="reroll-list" mode="out-in">
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
                      style="cursor: pointer;"
                      :key="roomInfo.currentGeneratorSelection[index - 1]"
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
        :extensionLocation="'lower'"
        class="extension-lower"
      ></app-extensionManager>
    </div>
  </div>
</template>

<script>
import { roomsCollection } from "../../firebase";
import ExtensionManager from "../extensions/ExtensionManager.vue";
import axios from "axios";
import RoomLink from '../layout/RoomLink.vue';

export default {
  name: "app-umberdredInstitute",
  components: {
    "app-extensionManager": ExtensionManager,
    'app-roomLink': RoomLink,
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
    closeMenu(){
      this.$bvModal.hide("menuModal");
    },
    copyLinkToClipboard(){
      let currentUrl = location.hostname.toString() + "/" + this.$route.fullPath
      navigator.clipboard.writeText(currentUrl).then(function() {
        console.log('copied url')
      }, function() {
        console.log('copy failed')
      });
    },
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
        "1-yrqoN7ZKeLHg0ynob9ZCpUbr64T24IrpX1RuSFUAwY" +
        "?includeGridData=true&ranges=a1:aa100&key=" + process.env.VUE_APP_FIREBASE_API_KEY;

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
<style scoped lang='scss'>

$base-color: rgb(33, 33, 33);

.game-room {
  padding-top: 20px;
}

.generator-main {
  font-weight: bold;  
  border-radius: 5px;
}

@media (max-width: 575px) {  
  .generator-cell-body {
    font-size:1rem !important;
    font-weight: 500 !important;  
  } /*1rem = 16px*/

  .generator-cell-reroll-button {
    display: none;
  }

}

select {
  width: auto;
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
  .generator-cell-full-small {
    font-size: 1.2em;
    font-weight: 600;
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
