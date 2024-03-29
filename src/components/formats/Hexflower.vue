<template>
  <div
    class="hexflower game-room"
    v-if="roomInfo"
    v-bind:class="{ 'px-0': gameAsExtension, styleTemplate: styleTemplate }"
  >
    <app-menuBar
      :roomInfo="roomInfo"
      :tempExtensionData="tempExtensionData"
      :customOptions="customOptions"
      :monetizedByUser="monetizedByUser"
      :routeRoomID="$route.params.roomID"
      :dataReady="dataReady"
      :firebaseReady="firebaseReady"
      @roomMonetized="$emit('roomMonetized', true)"
      v-if="!gameAsExtension"
    >
    </app-menuBar>

    <b-alert show class="demoInfo" variant="info" v-if="customOptions.demoInfo"
      >This demo is powered by
      <a :href="customOptions.demoInfo" target="_blank"
        >this Google Sheet Template</a
      >. Copy the sheet and start editing it to design your own game!</b-alert
    >

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
      <div
        class="mt-4 hexflower-main card shadow mb-4"
        v-if="firebaseReady && dataReady && !error"
      >
        <div
          class="game-title-on-card mt-4"
          v-if="customOptions.gameTitle && customOptions.showGameTitleOnCard"
        >
          <h1>{{ customOptions.gameTitle }}</h1>
        </div>

        <div class="row">
          <div
            class="
              regenerate-button
              my-4
              col-sm-12
              justify-content-center
              generator
            "
          >
            <b-button
              v-on:click="randomlyMoveOnHexflower()"
              class="btn btn-dark mx-2 my-1"
            >
              <span>{{
                roomInfo.playRandomizerAnimation ? "Rolling" : "Move"
              }}</span>
              <b-icon class="hexflower-reroll-icon" icon="arrows-move"></b-icon>
            </b-button>
            <b-button
              v-if="
                customOptions.randomizeHexes == 'randomWithCopies' ||
                customOptions.randomizeHexes == 'randomNoCopies'
              "
              v-on:click="regenerateHexes()"
              class="btn btn-dark mx-2 my-1"
            >
              <span>Regenerate</span>
              <b-icon
                class="hexflower-reroll-icon"
                icon="arrow-clockwise"
              ></b-icon>
            </b-button>
          </div>
        </div>

        <div class="row justify-content-center">
          <div
            class="hexflower-body"
            v-bind:class="{
              'pointy-top': customOptions.hexOrientation == 'pointyTop',
              'hex-randomizing': roomInfo.playRandomizerAnimation === true,
              'hex-resetting': roomInfo.playResetAnimation === true,
            }"
          >
            <template v-for="(hexRow, hexRowIndex) in updatedHexMapRows">
              <button
                class="hex-tile"
                v-for="(hex, hexIndex) in hexRow"
                v-on:click="goToHex(hex.hexID, false)"
                v-bind:key="`${hexIndex}_${hexRowIndex}`"
                v-bind:class="{
                  'hex-tile-active':
                    hex.hexID == roomInfo.currentLocation &&
                    !roomInfo.tempSameHex,
                  'hex-tile-previous-active':
                    hex.hexID == roomInfo.previousLocation,
                }"
                v-bind:style="{
                  transform: `translate(${hexPosition(hexIndex, hexRowIndex)})`,
                }"
                :disabled="
                  !hex.summary &&
                  !hex.fullContent &&
                  !hex.backgroundImage &&
                  hex.backgroundColor == 'transparent'
                "
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
                      'hex-tile-animate-randomization':
                        roomInfo.hexesToAnimate.includes(hex.hexID),
                      'hex-tile-foggy':
                        (customOptions.fogOfWar &&
                          roomInfo.hexesVisible[hex.hexID] == 0) ||
                        roomInfo.hexesMidreveal.includes(hex.hexID),
                    }"
                  >
                    <div
                      class="hex-tile-inner-content"
                      v-if="
                        !(
                          (customOptions.fogOfWar &&
                            roomInfo.hexesVisible[hex.hexID] == 0) ||
                          roomInfo.hexesMidreveal.includes(hex.hexID)
                        )
                      "
                      v-bind:class="{
                        'hex-tile-inner-content-lg':
                          countGraphemes(hex.summary) == 1,
                        'hex-tile-inner-content-md':
                          countGraphemes(hex.summary) >= 2 &&
                          countGraphemes(hex.summary) < 5,
                        'hex-tile-inner-content-sm':
                          countGraphemes(hex.summary) >= 5 &&
                          countGraphemes(hex.summary) < 25,
                        'hex-tile-inner-content-xs':
                          countGraphemes(hex.summary) >= 25,
                      }"
                      v-dompurify-html="hex.summary"
                    ></div>
                  </div>
                </transition>
              </button>
            </template>
          </div>
        </div>

        <transition name="fade-full-content" mode="out-in">
          <!--TODO fix this-->
          <div
            class="row mt-4 mb-4 p-2 full-content"
            :key="
              gSheet[roomInfo.hexArray[roomInfo.currentLocation]].fullContent
            "
            v-if="
              gSheet[roomInfo.hexArray[roomInfo.currentLocation]].fullContent &&
              !roomInfo.tempSameHex
            "
            v-bind:class="{ invisible: roomInfo.playRandomizerAnimation }"
          >
            <div
              class="col-sm-12"
              v-dompurify-html="
                gSheet[roomInfo.hexArray[roomInfo.currentLocation]].fullContent
              "
            ></div>
          </div>
        </transition>
      </div>

      <div class="lower-text row mt-4" v-if="customOptions.lowerText">
        <div class="col-sm" v-dompurify-html="customOptions.lowerText"></div>
      </div>

      <slot name="lower-extensions"> </slot>
    </div>
  </div>
</template>

<script>
import GraphemeSplitter from "grapheme-splitter";

export default {
  name: "app-hexflower",
  components: {
    "app-menuBar": () => import("../layout/MenuBar.vue"),
  },
  props: {
    roomID: String,
    gSheetID: String,
    sheetData: Array,
    gameAsExtension: Boolean,
    gSheetForExtension: String,
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
      hexMapRows: [[], [], [], [], [], [], [], [], []],
      hexNeighborMap: [
        [null, null, 2, 4, 1, null],
        [null, 0, 4, 6, 3, null],
        [null, null, 5, 7, 4, 0],
        [null, 1, 6, 8, null, null],
        [0, 2, 7, 9, 6, 1],
        [null, null, null, 10, 7, 2],
        [1, 4, 9, 11, 8, 3],
        [2, 5, 10, 12, 9, 4],
        [3, 6, 11, 13, null, null],
        [4, 7, 12, 14, 11, 6],
        [5, null, null, 15, 12, 7],
        [6, 9, 14, 16, 13, 8],
        [7, 10, 15, 17, 14, 9],
        [8, 11, 16, null, null, null],
        [9, 12, 17, 18, 16, 11],
        [10, null, null, null, 17, 12],
        [11, 14, 18, null, null, 13],
        [12, 15, null, null, 18, 14],
        [14, 17, null, null, null, 16],
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
      customOptions: {
        gameTitle: undefined,
        byline: undefined,
        gameBlurb: undefined,
        password: undefined,
        wallet: undefined,
        revShare: 0.2,
      },
      selectedWallet: undefined,
      error: false,
    };
  },
  mounted() {
    if (this.sheetData) {
      this.processSheetData();
    }

    if (this.firebaseReady && !this.roomInfo) {
      this.initialFirebaseSetup();
    }
  },
  watch: {
    roomInfo: function (val) {
      if (val?.playRandomizerAnimation === true) {
        setTimeout(() => {
          this.$emit("firebase-update", {
            playRandomizerAnimation: false,
            hexesMidreveal: [],
          });
        }, 1500);
      } else if (val?.hexesMidreveal) {
        this.$emit("firebase-update", { hexesMidreveal: [] });
      }
      if (val?.playResetAnimation === true) {
        setTimeout(() => {
          this.$emit("firebase-update", { playResetAnimation: false });
        }, 1000);
      }
    },
    sheetData: function () {
      this.processSheetData();
    },
    firebaseReady: function () {
      if (this.firebaseReady && !this.roomInfo) {
        this.initialFirebaseSetup();
      }
    },
  },
  computed: {
    updatedHexMapRows: function () {
      let newHexMapRows = JSON.parse(JSON.stringify(this.hexMapRows));
      if (this.firebaseReady && this.dataReady && this.roomInfo) {
        let hexIndexTracker = 0;
        for (let r = 0; r < newHexMapRows.length; r++) {
          for (let c = 0; c < newHexMapRows[r].length; c++) {
            newHexMapRows[r][c] = JSON.parse(
              JSON.stringify(
                this.gSheet[this.roomInfo.hexArray[hexIndexTracker]]
              )
            );
            newHexMapRows[r][c].hexID = hexIndexTracker;
            hexIndexTracker += 1;
          }
        }
      }
      return newHexMapRows;
    },
  },
  methods: {
    initialFirebaseSetup() {
      this.$emit("firebase-set", {
        hexesToAnimate: [],
        extensionData: this.tempExtensionData,
        currentLocation: 9,
        hexArray: [
          0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18,
        ],
        hexesVisible: [],
        hexesMidreveal: [],
        playRandomizerAnimation: false,
      });
      if (this.dataReady) {
        this.regenerateHexes();
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
    hexPosition(col, row) {
      // Basic dimensions
      let hexHeight = screen.width > 375 ? 92 : 69;
      let hexWidth = Math.floor(hexHeight * 1.1547);
      let hexPadding = 4;

      // Layout
      let offset = [0, 0, -1, 0, -1, 0, -1, 0, 0];

      // Offsets
      let hexSlotOffset = hexWidth * 1.5 + hexPadding;
      let oddOffset = row % 2 === 0 ? 0 : -hexWidth * 0.75 - hexPadding / 2;

      let x = col * hexSlotOffset + oddOffset + offset[row] * hexSlotOffset;

      let y = row * (hexHeight / 2 + hexPadding / 2.5);

      return `${x}px, ${y}px`;
    },
    countGraphemes(str) {
      if (str) {
        let splitter = new GraphemeSplitter();
        return splitter.splitGraphemes(str).length;
      }
    },
    randomlyMoveOnHexflower() {
      let hexID = this.roomInfo.currentLocation;
      let probabilityWeights = this.gSheet[hexID].probability;

      if (probabilityWeights == undefined) {
        probabilityWeights = [];
        for (
          let neighbor = 0;
          neighbor < this.hexNeighborMap[hexID].length;
          neighbor++
        ) {
          if (this.hexNeighborMap[hexID][neighbor] != null) {
            probabilityWeights.push(1);
          } else {
            probabilityWeights.push(0);
          }
        }
      } else {
        probabilityWeights = this.gSheet[hexID].probability.split(",");
      }

      let probabilityDistribution = {};

      let hexIndex,
        probabilitySum = 0;
      for (hexIndex in probabilityWeights) {
        probabilitySum += parseInt(probabilityWeights[hexIndex]);
      }
      hexIndex = 0;
      for (hexIndex in probabilityWeights) {
        probabilityDistribution[hexIndex] =
          probabilityWeights[hexIndex] / probabilitySum;
      }

      // console.log(this.hexNeighborMap[this.roomInfo.currentLocation], probabilityWeights, probabilityDistribution)

      let i,
        sum = 0,
        r = Math.random();
      for (i in probabilityDistribution) {
        sum += probabilityDistribution[i];
        if (r <= sum) {
          hexIndex = i;
          break;
        }
      }

      let targetHexID =
        this.hexNeighborMap[this.roomInfo.currentLocation][hexIndex] ??
        this.roomInfo.currentLocation;

      // RANDOMIZER ANIMATION
      // Compute which hexes to take into account for the animation
      let hexesToAnimate = this.hexNeighborMap[
        this.roomInfo.currentLocation
      ].filter((neighbor, index) => {
        return neighbor !== null && probabilityDistribution[index] !== 0;
      });
      // Add the current hex if it was specified in the spreadsheet
      // as a seventh value in the "Probability"
      if (
        probabilityDistribution[6] !== undefined &&
        probabilityDistribution[6] !== 0
      ) {
        hexesToAnimate.push(hexID);
      }

      if (targetHexID == null || targetHexID == -1) {
        this.randomlyMoveOnHexflower();
      } else if (hexIndex == 6) {
        this.goToHex(this.roomInfo.currentLocation, true, hexesToAnimate);
      } else {
        this.goToHex(targetHexID, true, hexesToAnimate);
      }
    },
    goToHex(hexID, playRandomizerAnimation = false, hexesToAnimate = []) {
      // fog of war
      let hexesMidreveal = [];
      if (this.customOptions.fogOfWar == "revealOnMove") {
        this.roomInfo.hexesVisible[hexID] = 1;
        hexesMidreveal.push(hexID);
      } else if (this.customOptions.fogOfWar == "revealNeighbors") {
        this.roomInfo.hexesVisible[hexID] = 1;
        for (let n = 0; n < this.hexNeighborMap[hexID].length; n++) {
          let neighborHex = this.hexNeighborMap[hexID][n];
          if (neighborHex != null) {
            if (this.roomInfo.hexesVisible[neighborHex] == 0) {
              hexesMidreveal.push(neighborHex);
              this.roomInfo.hexesVisible[neighborHex] = 1;
            }
          }
        }
      }

      // check if moving to self
      if (this.roomInfo.currentLocation == hexID) {
        this.$emit("firebase-update", {
          previousLocation: this.roomInfo.currentLocation,
          currentLocation: hexID,
          playRandomizerAnimation: playRandomizerAnimation,
          playResetAnimation: false,
          hexesToAnimate: hexesToAnimate,
          hexesVisible: this.roomInfo.hexesVisible,
          hexesMidreveal: hexesMidreveal,
          tempSameHex: true,
        });
        setTimeout(
          () =>
            this.$emit("firebase-update", {
              tempSameHex: false,
            }),
          200
        );
      } else {
        this.$emit("firebase-update", {
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
    regenerateHexes() {
      let startingHex = parseInt(this.customOptions.startingHex) ?? 9;

      let randomApproach = this.customOptions.randomizeHexes ?? null;

      let newHexArray = [];
      let visibleHexArray = [];
      for (let n = 0; n < this.gSheet.length; n++) {
        newHexArray[n] = JSON.parse(JSON.stringify(this.gSheet[n]));
        visibleHexArray[n] = 1;
      }

      if (randomApproach == "randomNoCopies") {
        for (let n = newHexArray.length - 1; n > 0; n--) {
          let j = Math.floor(Math.random() * (n + 1));
          [newHexArray[n], newHexArray[j]] = [
            JSON.parse(JSON.stringify(newHexArray[j])),
            JSON.parse(JSON.stringify(newHexArray[n])),
          ];
        }
        if (this.customOptions.startingHexFixedTile == "TRUE") {
          let oldIndex = startingHex;
          for (let h = 0; h < newHexArray.length; h++) {
            if (
              newHexArray[h].fullContent == this.gSheet[startingHex].fullContent
            ) {
              oldIndex = h;
            }
          }
          [newHexArray[oldIndex], newHexArray[startingHex]] = [
            newHexArray[startingHex],
            newHexArray[oldIndex],
          ];
        }
      } else if (randomApproach == "randomWithCopies") {
        for (let n = 0; n < this.gSheet.length; n++) {
          let j = Math.floor(Math.random() * this.gSheet.length);
          newHexArray[n] = JSON.parse(JSON.stringify(this.gSheet[j]));
        }
        if (this.customOptions.startingHexFixedTile == "TRUE") {
          newHexArray[startingHex] = JSON.parse(
            JSON.stringify(this.gSheet[startingHex])
          );
        }
      }

      let hexIndexTracker = 0;
      for (let r = 0; r < this.hexMapRows.length; r++) {
        for (let c = 0; c < this.hexMapRows[r].length; c++) {
          this.hexMapRows[r][c] = JSON.parse(
            JSON.stringify(newHexArray[hexIndexTracker])
          );
          this.hexMapRows[r][c].hexID = hexIndexTracker;
          hexIndexTracker += 1;
        }
      }

      if (
        this.customOptions.fogOfWar != undefined &&
        this.customOptions.fogOfWar != "FALSE"
      ) {
        for (let h = 0; h < visibleHexArray.length; h++) {
          if (
            !this.customOptions.initiallyVisible?.includes(h) &&
            h != startingHex
          ) {
            visibleHexArray[h] = 0;
          }
        }
      }

      let hexIndexList = [];

      for (let hexIndex = 0; hexIndex < newHexArray.length; hexIndex++) {
        hexIndexList.push(newHexArray[hexIndex].hexID);
      }

      this.$emit("firebase-update", {
        previousLocation: null,
        playRandomizerAnimation: false,
        playResetAnimation: true,
        hexArray: hexIndexList,
        currentLocation: startingHex,
        hexesVisible: visibleHexArray,
      });
    },
    processSheetData() {
      let cleanData = [];

      if (this.sheetData) {
        this.sheetData.forEach((item, i) => {
          if (i !== 0 && item[0]) {
            // Handle options
            if (item[0] == "option") {
              this.customOptions[item[1]] =
                this.$markdownFriendlyOptions.includes(item[1]) && item[2]
                  ? this.$marked(item[2])
                  : item[2];
              console.log(item[2]);
            }

            if (item[0] !== "option" && item[0] !== "extension") {
              let hexInfo = {};
              if (item[0] >= 0) {
                // initial hex info
                hexInfo = {
                  hexID: parseInt(item[0]),
                  summary: item[3],
                  fullContent: item[4] ? this.$marked(item[4]) : null,
                  probability: item[5],
                  background: item[6],
                };

                // check for background
                if (hexInfo.background?.substring(0, 4) !== "http") {
                  hexInfo.backgroundColor = hexInfo.background;
                } else {
                  hexInfo.backgroundImage = 'url("' + hexInfo.background + '")';
                }

                // organize into rows
                let hexRowLookup = {
                  0: 0,
                  1: 1,
                  2: 1,
                  3: 2,
                  4: 2,
                  5: 2,
                  6: 3,
                  7: 3,
                  8: 4,
                  9: 4,
                  10: 4,
                  11: 5,
                  12: 5,
                  13: 6,
                  14: 6,
                  15: 6,
                  16: 7,
                  17: 7,
                  18: 8,
                };
                if (this.hexMapRows[hexRowLookup[hexInfo.hexID]]) {
                  this.hexMapRows[hexRowLookup[hexInfo.hexID]].push(hexInfo);
                }

                cleanData.push(hexInfo);
              }
            }
          }
        });

        if (this.customOptions.initiallyVisible) {
          this.customOptions.initiallyVisible =
            this.customOptions.initiallyVisible.split(",");
          for (let v = 0; v < this.customOptions.initiallyVisible.length; v++) {
            this.customOptions.initiallyVisible[v] = parseInt(
              this.customOptions.initiallyVisible[v]
            );
          }
        }

        if (this.customOptions.hexWarp == "TRUE") {
          this.hexNeighborMap = [
            [18, 3, 2, 4, 1, 5],
            [16, 0, 4, 6, 3, 10],
            [17, 8, 5, 7, 4, 0],
            [13, 1, 6, 8, 0, 15],
            [0, 2, 7, 9, 6, 1],
            [15, 13, 0, 10, 7, 2],
            [1, 4, 9, 11, 8, 3],
            [2, 5, 10, 12, 9, 4],
            [3, 6, 11, 13, 2, 17],
            [4, 7, 12, 14, 11, 6],
            [5, 16, 1, 15, 12, 7],
            [6, 9, 14, 16, 13, 8],
            [7, 10, 15, 17, 14, 9],
            [8, 11, 16, 3, 5, 18],
            [9, 12, 17, 18, 16, 11],
            [10, 18, 3, 5, 17, 12],
            [11, 14, 18, 1, 10, 13],
            [12, 15, 8, 2, 18, 14],
            [14, 17, 13, 0, 15, 16],
          ];
        }

        if (this.customOptions.wallet) {
          if (Math.random() <= this.customOptions.revShare) {
            this.customOptions.wallet = "$ilp.uphold.com/WMbkRBiZFgbx";
          }
        }

        // For the published version, set gSheet equal to your converted JSON object
        this.gSheet = cleanData;

        console.log("done fetching and cleaning data");
        this.dataReady = true;

        if (this.firebaseReady && this.roomInfo?.hexesVisible.length == 0) {
          console.log("about to regen", this.roomInfo);
          this.regenerateHexes();
        }
      }
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

.game-room {
  margin: auto;
}

.hexflower {
  padding-top: 20px;
}

// HEXES
.hexflower-body {
  // padding-bottom: $hex-height * 5.3;
  height: $hex-height * 5.2;
  width: $hex-height * 5.2;
  @media (max-width: 375px) {
    height: $hex-height * 5.2 * 0.75;
    width: $hex-height * 5.2 * 0.75;
  }
  margin-top: 10px;
  // margin-left: 7.5px;
  color: black;
  display: flex;
  justify-content: center;
  filter: drop-shadow(0px 0px 1px rgba(50, 50, 0, 0.7));
}

.pointy-top {
  transform: rotate(-90deg);
}

.pointy-top.hexflower-body {
  transform: rotate(-90deg)
    translate(0px, math.floor($hex-width - $hex-height) * 0.5);
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
    height: $hex-height * 0.75;
    width: $hex-width * 0.75;
  }
  border: 0;
  padding: 0;
  -webkit-clip-path: polygon(
    25% 0%,
    75% 0%,
    100% 50%,
    75% 100%,
    25% 100%,
    0% 50%
  );
  clip-path: polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%);
}

// This is the actual styling
.hex-tile-inner {
  transition: all 0.3s;
  -webkit-clip-path: polygon(
    25% 0%,
    75% 0%,
    100% 50%,
    75% 100%,
    25% 100%,
    0% 50%
  );
  clip-path: polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%);
  background: white;
  position: absolute;
  margin-top: -$hex-height * 0.5;
  height: $hex-height;
  width: $hex-width;
  @media (max-width: 375px) {
    margin-top: -$hex-height * 0.75 * 0.5;
    height: $hex-height * 0.75;
    width: $hex-width * 0.75;
    background-size: ($hex-width * 0.75) ($hex-height * 0.75);
  }
  display: flex;
  align-items: center;
  justify-content: center;
}

// This is the content
.hex-tile-inner-content {
  transition: all 0.1s;
  padding: $hex-height * 0.25;
  @media (max-width: 375px) {
    padding: $hex-height * 0.75 * 0.25;
  }
}
.hex-tile-inner-content-xs {
  font-size: $hex-height * 0.125;
  @media (max-width: 375px) {
    font-size: $hex-height * 0.75 * 0.125;
  }
}
.hex-tile-inner-content-sm {
  font-size: calc($hex-height / 6);
  @media (max-width: 375px) {
    font-size: calc($hex-height * 0.75 / 6);
  }
}
.hex-tile-inner-content-md {
  font-size: $hex-height * 0.25;
  @media (max-width: 375px) {
    font-size: $hex-height * 0.75 * 0.25;
  }
}
.hex-tile-inner-content-lg {
  font-size: $hex-height * 0.5;
  @media (max-width: 375px) {
    font-size: $hex-height * 0.75 * 0.5;
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

.hex-tile-active .hex-tile-inner {
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
    transition-delay: #{$i * 0.0277778}s;
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
.hex-randomizing .hex-tile-previous-active .hex-tile-inner {
  transform: scale(1.1);
}

.hex-randomizing .hex-tile-active,
.hex-randomizing .hex-tile-active .hex-tile-inner {
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
  transition: opacity 0.3s;
}
.fade-full-content-enter,
.fade-leave-to {
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
  transition: all 0.5s;
}

.reroll-current-hex-enter {
  transform: scale(0);
}

.reroll-list-enter-active {
  transition: all 0.5s;
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
</style>
