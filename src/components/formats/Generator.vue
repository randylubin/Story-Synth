<template>
  <div class="generator game-room" v-if="roomInfo"
    v-bind:class="{ 'px-0': gameAsExtension, styleTemplate: styleTemplate }">
    <app-menuBar :roomInfo="roomInfo" :tempExtensionData="tempExtensionData" :customOptions="customOptions"
      :monetizedByUser="monetizedByUser" :routeRoomID="$route.params.roomID" :dataReady="dataReady"
      :firebaseReady="firebaseReady" @roomMonetized="$emit('roomMonetized', true)" v-if="!gameAsExtension">
    </app-menuBar>

    <b-alert show class="demoInfo" variant="info" v-if="customOptions.demoInfo">This demo is powered by
      <a :href="customOptions.demoInfo" target="_blank">this Google Sheet Template</a>. Copy the sheet and start editing
      it to design your own game!
    </b-alert>

    <slot name="upper-extensions"> </slot>

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
      <div class="col-sm" v-dompurify-html="customOptions.upperText"></div>
    </div>

    <div class="mb-4">
      <div class="mt-4 generator-main card shadow mb-4">
        <div class="game-title-on-card mt-4" v-if="customOptions.gameTitle && customOptions.showGameTitleOnCard">
          <h1>{{ customOptions.gameTitle }}</h1>
        </div>
        <div class="regenerate-button my-4">
          <b-form inline class="justify-content-center">
            <b-button v-on:click="shuffleAll()" class="btn btn-dark mx-2 my-1">
              <span>Randomize All</span>
              <b-icon class="generator-cell-reroll-icon" icon="arrow-clockwise"></b-icon>
            </b-button>
            <b-form-select v-model="generatorView" class="mx-2 my-1"
              v-if="customOptions.showSummary || customOptions.showFullLists">
              <b-form-select-option value="Grid View">Grid View</b-form-select-option>
              <b-form-select-option value="Summary View" v-if="customOptions.showSummary">Summary View
              </b-form-select-option>
              <b-form-select-option value="Full View" v-if="customOptions.showFullLists">Full View
              </b-form-select-option>
            </b-form-select>
          </b-form>
        </div>

        <div class="pl-3 pr-3" v-if="generatorView == 'Grid View'">
          <div class="row generator-row">
            <button v-for="index in numberOfCategories" v-bind:key="index"
              v-bind:class="customOptions.generatorRowLayout[index - 1]" v-on:click="shuffleOne(index)" tabindex="0">
              <transition name="reroll" mode="out-in">
                <div class="mt-4 mb-3 generator-cell-contents" :key="
                  categoryData[index - 1][
                    roomInfo.currentGeneratorSelection[index - 1]
                  ]
                ">
                  <div class="mb-2">
                    <div v-dompurify-html="categoryLabels[index - 1]" v-if="!customOptions.hideLabels"
                      class="generator-cell-label px-2" style="cursor: pointer"></div>
                  </div>

                  <div :key="
                    categoryData[index - 1][
                      roomInfo.currentGeneratorSelection[index - 1]
                    ]
                  " v-dompurify-html="
                    categoryData[index - 1][
                      roomInfo.currentGeneratorSelection[index - 1]
                    ]
                  " class="generator-cell-body mb-2" v-bind:class="{
                    'generator-cell-full-small':
                      String(
                        categoryData[index - 1][
                          roomInfo.currentGeneratorSelection[index - 1]
                        ]
                      ).length >= 50,
                  }"></div>
                  <div class="generator-cell-reroll-button" v-if="
                    categoryData[index - 1][
                      roomInfo.currentGeneratorSelection[index - 1]
                    ] && categoryData[index - 1].length > 1
                  ">
                    <span>Reroll</span>
                    <b-icon class="generator-cell-reroll-icon" icon="arrow-clockwise"></b-icon>
                  </div>
                </div>
              </transition>
            </button>
          </div>
        </div>

        <div class="pl-3 pr-3" v-if="generatorView == 'Summary View'">
          <div class="row generator-summary text-left my-5">
            <div v-for="index in numberOfCategories" v-bind:key="index" class="col-12">
              <div v-on:click="shuffleOne(index)" class="" style="cursor: pointer">
                <span v-dompurify-html="categoryLabels[index - 1] + ':'" v-if="!customOptions.hideLabels"
                  class="summary-category-label px-2 font-weight-bold"></span>
                <transition-group name="reroll-list" mode="out-in">
                  <span :key="roomInfo.currentGeneratorSelection[index - 1]" v-dompurify-html="
                    categoryData[index - 1][
                      roomInfo.currentGeneratorSelection[index - 1]
                    ]
                  " class="summary-category-body font-weight-normal mb-2"></span>
                </transition-group>
                <b-icon v-on:click="shuffleOne(index)" class="ml-2 generator-cell-reroll-icon" icon="arrow-clockwise">
                </b-icon>
              </div>
            </div>
          </div>
        </div>

        <div class="pl-3 pr-3" v-if="generatorView == 'Full View'">
          <div class="row generator-row generator-full">
            <div v-for="index in numberOfCategories" v-bind:key="index"
              v-bind:class="customOptions.generatorRowLayout[index - 1]">
              <div class="my-4 generator-cell-contents">
                <div class="mb-2">
                  <div v-dompurify-html="categoryLabels[index - 1]" v-on:click="shuffleOne(index)"
                    v-if="!customOptions.hideLabels" class="generator-cell-label px-2"></div>
                </div>
                <div v-for="(option, optionIndex) in categoryData[index - 1]" v-bind:key="option">
                  <transition name="reroll-list" mode="out-in">
                    <span v-dompurify-html="option" v-on:click="selectOne(index, optionIndex)"
                      class="font-weight-normal" v-bind:class="{
                        'font-weight-bolder':
                          option ==
                          categoryData[index - 1][
                            roomInfo.currentGeneratorSelection[index - 1]
                          ],
                      }" style="cursor: pointer" :key="roomInfo.currentGeneratorSelection[index - 1]"></span>
                  </transition>
                </div>
                <div v-on:click="shuffleOne(index)" class="generator-cell-reroll-button"
                  v-if="customOptions.rerollButton">
                  <span>Random</span>
                  <b-icon class="generator-cell-reroll-icon" icon="arrow-clockwise"></b-icon>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="lower-text row mt-4" v-if="customOptions.lowerText">
        <div class="col-sm" v-dompurify-html="customOptions.lowerText"></div>
      </div>

      <slot name="lower-extensions"> </slot>
    </div>
  </div>
</template>

<script>
export default {
  name: "app-generator",
  components: {
    "app-menuBar": () => import("../layout/MenuBar.vue"),
  },
  props: {
    roomID: String,
    gSheetID: String,
    sheetData: Array,
    gameAsExtension: Boolean,
    roomInfo: Object,
    tempExtensionData: Object,
    firebaseReady: Boolean,
    roomMonetized: Boolean,
    monetizedByUser: Boolean,
  },
  data: function () {
    return {
      dataReady: false,
      gSheet: [{ text: "loading" }],
      generatorLayout: [],
      generatorView: "Grid View",
      numberOfCategories: 0,
      categoryLabels: [],
      categoryData: [],
      customOptions: {
        gameTitle: undefined,
        byline: undefined,
        gameBlurb: undefined,
        password: undefined,
        wallet: undefined,
        revShare: 0.2,
      },
      styleTemplate: "",
      selectedWallet: undefined,
      error: false,
    };
  },
  watch: {
    sheetData: function () {
      this.processSheetData();
    },
    firebaseReady: function () {
      if (this.firebaseReady && !this.roomInfo) {
        this.initialFirebaseSetup();
      }
    },
  },
  mounted() {
    if (this.sheetData) {
      this.processSheetData();
    }

    if (this.firebaseReady && !this.roomInfo) {
      this.initialFirebaseSetup();
    }
  },
  methods: {
    initialFirebaseSetup() {
      this.$emit("firebase-set", {
        extensionData: this.tempExtensionData,
        currentGeneratorSelection: [0, 1, 2],
      });
      if (this.dataReady) {
        if (!this.customOptions.defaultSelections) {
          this.shuffleAll();
        } else {
          this.$emit("firebase-update", {
            currentGeneratorSelection: this.customOptions.defaultSelections.split(','),
          });
        }
      }
    },
    closeMenu() {
      this.$bvModal.hide("menuModal");
    },
    copyLinkToClipboard() {
      let currentUrl = location.hostname.toString() + this.$route.fullPath;
      navigator.clipboard.writeText(currentUrl).then(
        function () {
          console.log("copied url");
        },
        function () {
          console.log("copy failed");
        }
      );
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
      this.$emit("firebase-update", {
        currentGeneratorSelection: newGeneratorSelection,
      });
    },
    shuffleOne(index) {
      let newGeneratorSelection = this.roomInfo.currentGeneratorSelection;

      let newValueIndex = Math.floor(
        Math.random() * this.categoryData[index - 1].length
      );

      if (newGeneratorSelection[index - 1] == newValueIndex) {
        newGeneratorSelection[index - 1] = "";
        this.$emit("firebase-update", {
          currentGeneratorSelection: newGeneratorSelection,
        });
      }

      newGeneratorSelection[index - 1] = newValueIndex;

      // sync the shuffled array
      this.$emit("firebase-update", {
        currentGeneratorSelection: newGeneratorSelection,
      });
    },
    selectOne(index, optionIndex) {
      let newGeneratorSelection = this.roomInfo.currentGeneratorSelection;

      newGeneratorSelection[index - 1] = optionIndex;

      // sync the shuffled array
      this.$emit("firebase-update", {
        currentGeneratorSelection: newGeneratorSelection,
      });
    },
    processSheetData() {
      let cleanData = [];

      if (this.sheetData) {
        this.numberOfCategories = this.sheetData[0].length - 3;

        for (var w = 0; w < this.numberOfCategories; w++) {
          this.categoryData.push([]);
        }

        this.sheetData.forEach((item, i) => {
          // grab labels
          if (i == 0) {
            for (let j = 3; j < item.length; j++) {
              this.categoryLabels.push(item[j]);
            }
            console.log("labels:", this.categoryLabels);
          }

          if (i !== 0 && item[0]) {
            // Handle options
            if (item[0] == "option") {
              this.customOptions[item[1]] =
                this.$markdownFriendlyOptions.includes(item[1]) && item[2]
                  ? this.$marked(item[2])
                  : item[2];
              console.log(item[2]);
            }

            if (item[1] == "generatorRowLayout") {
              let rowLayout = this.customOptions.generatorRowLayout.split(",");

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

            if (item[0] !== "option" && item[0] !== "extension") {
              var rowInfo = {};
              if (item[0] >= 0) {
                rowInfo = {
                  ordered: item[0],
                  headerText: item[1],
                  bodyText: item[2] ? this.$marked(item[2]) : null,
                };
                cleanData.push(rowInfo);

                if (item[0] == 0) {
                  this.firstNonInstruction += 1;
                }

                if (item[0] == 1) {
                  for (var j = 3; j < item.length; j++) {
                    if (item[j] && this.categoryData[j - 3]) {
                      this.categoryData[j - 3].push(
                        this.$marked(item[j] ?? null)
                      );
                    }
                  }
                }
              }
            }
          }
        });

        // check for empty cols
        this.categoryData = this.categoryData.filter(
          (col) => col != undefined && col.length != 0
        );
        this.categoryLabels = this.categoryLabels.filter(
          (col) => col != undefined && col.length != 0
        );
        this.numberOfCategories = this.categoryData.length;
        this.generatorRowLayout = this.generatorLayout.filter(
          (row) => row > this.numberOfCategories
        );

        if (this.customOptions.wallet) {
          if (Math.random() <= this.customOptions.revShare) {
            this.customOptions.wallet = "$ilp.uphold.com/WMbkRBiZFgbx";
          }
        }

        // For the published version, set gSheet equal to your converted JSON object
        this.gSheet = cleanData;

        console.log("done fetching and cleaning data");
        this.dataReady = true;

        if (this.firebaseReady && this.currentGeneratorSelection == [0, 1, 2]) {
          if (!this.customOptions.defaultSelections) {
            this.shuffleAll();
          } else {
            this.$emit("firebase-update", {
              currentGeneratorSelection: this.customOptions.defaultSelections.split(','),
            });
          }
        }
      }
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang='scss'>
$base-color: rgb(33, 33, 33);

.game-room {
  padding-top: 20px;
  margin: auto;
}

.generator-main {
  font-weight: bold;
  border-radius: 5px;
}

@media (max-width: 575px) {
  .generator-cell-body {
    font-size: 1rem !important;
    font-weight: 500 !important;
  }

  /*1rem = 16px*/

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
  display: inline-flex;
  /* keep the inline nature of buttons */
  align-items: stretch;
  /* this is default */
  font-family: inherit;
  font-size: 100%;
  background: inherit;
  color: inherit;
  transition: background-color 0.2s;
  transition: all 0.3s;
  // white-space: nowrap;
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

.fade-enter,
.fade-leave-to

/* .fade-leave-active below version 2.1.8 */
  {
  opacity: 0;
}

// Reroll transition
.reroll-enter-active,
.reroll-leave-active {
  transition: all 0.5s;
}

.reroll-enter,
.reroll-leave-to

/* .fade-leave-active below version 2.1.8 */
  {
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
    transform: rotate(360deg);
  }
}

.reroll-list-enter-active {
  transition: all 0.5s;
}

.reroll-list-leave-active {
  transition: all 0s;
}

.reroll-list-enter,
.reroll-list-leave-to

/* .list-leave-active below version 2.1.8 */
  {
  opacity: 0;
}

.reroll-list-move {
  transition: transform 1s;
}

.x-card-text {
  font-size: 0.5em;
  text-decoration: underline;
}
</style>
