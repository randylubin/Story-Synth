<template>
  <div class="hexmap hexmap-game-room" v-if="roomInfo"
    v-bind:class="{ 'px-0': gameAsExtension, styleTemplate: styleTemplate }">

    <div id="zoom-buttons">
      <b-button-group>
        <b-button variant="dark" v-on:click="changeZoom(1.5)"><b-icon icon="zoom-in"></b-icon></b-button>
        <b-button variant="dark" :disabled="zoomScale < 0.5" v-on:click="changeZoom(0.666)"><b-icon icon="zoom-out"></b-icon></b-button>
      </b-button-group>
    </div>
    <div id="scrollbox" class="main-scrollbox">
      <div :style="{transform: 'scale(' + zoomScale + ')'}" class="mt-4 hexmap-main mb-4" v-if="firebaseReady && dataReady && !error">
        <div class="game-title-on-card mt-4" v-if="customOptions.gameTitle && customOptions.showGameTitleOnCard">
          <h1>{{ customOptions.gameTitle }}</h1>
        </div>
        
        <div class="col-sm" v-if="(Array.isArray(updatedHexMapRows) && updatedHexMapRows.length == 0 )">
          <h1>ERROR: the map sized has changed since creating this session, try creating a new session from the game launcher page</h1>
        </div>

        <div class="row">
          <div class="hexmap-body" v-bind:class="{
            'pointy-top': customOptions.hexOrientation == 'pointyTop',
            'hex-randomizing': roomInfo.playRandomizerAnimation === true,
            'hex-resetting': roomInfo.playResetAnimation === true,
            'looking-enabled': customOptions.lookBeforeMove,
          }"
          v-bind:style="{
            translate: zoomScaleOffset()
          }"
          >
            <template v-for="(hexRow, hexRowIndex) in updatedHexMapRows">
              <button class="hex-tile" v-for="(hex, hexIndex) in hexRow" v-on:click="lookOrMove(hex.hexID, false)"
                v-bind:key="`${hexIndex}_${hexRowIndex}`" v-bind:class="{
                  'hex-tile-active':
                    hex.hexID == roomInfo.currentLocation &&
                    !roomInfo.tempSameHex,
                  'hex-tile-previous-active':
                    hex.hexID == roomInfo.previousLocation,
                  'hex-tile-previously-visited':
                    roomInfo.visitedHexes && roomInfo.visitedHexes.includes(hex.hexID),
                  'hex-currently-viewed': 
                    hex.hexID == currentlyViewedHex && currentlyViewedHex != roomInfo.currentLocation
                }" v-bind:style="{
                  transform: `translate(${hexPosition(hexIndex, hexRowIndex)})`,
                }" :disabled="
                  (!hex.summary &&
                  !hex.fullContent &&
                  !hex.backgroundImage &&
                  hex.backgroundColor == 'transparent') ||
                  (!facilitatorMode && !roomInfo.hexesVisible[hex.hexID] && (!customOptions.lookIntoFog && !customOptions.moveIntoFog))
                "
                v-b-popover.hover="{content: hex.lookContent, html: true, disabled: ((customOptions.showLookOnHover !== 'TRUE') || (hex.hexID == roomInfo.currentLocation || !hex)), variant: 'light'}"
                >
                <transition appear name="reroll-current-hex" mode="out-in">
                  <div class="hex-tile-inner" :key="hex.hexID" v-bind:style="{
                    backgroundColor: hex.backgroundColor,
                    backgroundImage: hex.backgroundImage,
                  }" v-bind:class="{
                    'hex-tile-animate-randomization':
                      roomInfo.hexesToAnimate.includes(hex.hexID),
                    'hex-tile-foggy':
                      !facilitatorMode &&
                      ((customOptions.fogOfWar &&
                        roomInfo.hexesVisible[hex.hexID] == 0) ||
                      roomInfo.hexesMidreveal.includes(hex.hexID)),
                    'hex-tile-facilitator-visible-player-invisible':
                      facilitatorMode && 
                      ((customOptions.fogOfWar &&
                          roomInfo.hexesVisible[hex.hexID] == 0) ||
                        roomInfo.hexesMidreveal.includes(hex.hexID)),
                  }">
                    <!-- player-fog-indicator -->
                    <div class="player-foggy-icon" v-if="facilitatorMode && 
                      ((customOptions.fogOfWar &&
                          roomInfo.hexesVisible[hex.hexID] == 0) ||
                        roomInfo.hexesMidreveal.includes(hex.hexID))">
                      <b-icon-eye-slash-fill></b-icon-eye-slash-fill>
                    </div>

                    <!-- No Replacement Icon -->
                    <div class="hex-tile-inner-content" v-if="
                      (
                        (!customOptions.fogOfWar ||
                          roomInfo.hexesVisible[hex.hexID] !== 0 || facilitatorMode) &&
                        !roomInfo.hexesMidreveal.includes(hex.hexID)
                      ) && !(hex.hexID == roomInfo.currentLocation && !roomInfo.tempSameHex && customOptions.currentHexReplacementIcon)
                    " v-bind:class="{
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
                    }" v-dompurify-html="hex.summary"></div>

                    <!-- Replacement Icon -->
                    <div class="hex-tile-inner-content current-hex-replacement-icon" v-if="
                      hex.hexID == roomInfo.currentLocation && !roomInfo.tempSameHex && customOptions.currentHexReplacementIcon
                    " v-bind:class="{
                      'hex-tile-inner-content-lg':
                        countGraphemes(customOptions.currentHexReplacementIcon) == 1,
                      'hex-tile-inner-content-md':
                        countGraphemes(customOptions.currentHexReplacementIcon) >= 2 &&
                        countGraphemes(customOptions.currentHexReplacementIcon) < 5,
                      'hex-tile-inner-content-sm':
                        countGraphemes(customOptions.currentHexReplacementIcon) >= 5 &&
                        countGraphemes(customOptions.currentHexReplacementIcon) < 25,
                      'hex-tile-inner-content-xs':
                        countGraphemes(customOptions.currentHexReplacementIcon) >= 25,
                    }" v-dompurify-html="customOptions.currentHexReplacementIcon"></div>
                  </div>
                </transition>
              </button>
            </template>
          </div>
        </div>

      </div>
    </div>

    <div class="sidebar px-5">
      <div class="row">
        <div class="col-sm-12">

          <app-menuBar :roomInfo="roomInfo" :tempExtensionData="tempExtensionData" :customOptions="customOptions"
            :monetizedByUser="monetizedByUser" :routeRoomID="$route.params.roomID" :dataReady="dataReady"
            :firebaseReady="firebaseReady" @roomMonetized="$emit('roomMonetized', true)" v-if="!gameAsExtension">
            <div class="row menu-row">
              <b-button v-if="
                    customOptions.randomizeHexes == 'randomWithCopies' ||
                    customOptions.randomizeHexes == 'randomNoCopies'
                  " v-on:click="regenerateHexes()" class="btn-block btn-lg my-1">
                    <span>Regenerate Hexmap</span>
                  </b-button>
            </div>
            <div class="row menu-row">
              <b-button v-if="
                customOptions.facilitatorButton == 'TRUE'
                " :pressed="facilitatorMode" v-on:click="toggleFacilitatorMode()" class="btn-block btn-lg my-1">
                <span v-if="!facilitatorMode">Facilitator View</span>
                <span v-if="facilitatorMode">Player View</span>
              </b-button>
            </div>
          </app-menuBar>
      
          <b-alert show class="demoInfo" variant="info" v-if="customOptions.demoInfo">This demo is powered by
            <a :href="customOptions.demoInfo" target="_blank">this Google Sheet Template</a>. Copy the sheet and start editing
            it to design your own game!
          </b-alert>

          
          <div class="game-meta">
            <div class="" v-if="customOptions.gameTitle || customOptions.byline">
              <div class="row text-center" v-if="customOptions.gameTitle">
                <div class="col-sm">
                  <h1>{{ customOptions.gameTitle }}</h1>
                </div>
              </div>
              
              <div class="row text-center mt-4" v-if="customOptions.byline">
                <div class="col-sm">
                  <h4>{{ customOptions.byline }}</h4>
                </div>
              </div>
            </div>
          </div>
          
          <b-alert show variant="danger" v-if="error">{{ error }}</b-alert>
      
          <slot name="upper-extensions"> </slot>

          <div class="upper-text row" v-if="customOptions.upperText">
            <div class="col-sm" v-dompurify-html="customOptions.upperText"></div>
          </div>

          <div class="row ">
            <div class="col-sm-12">
              <hr color="white"/>
            </div>
          </div>

          <div class="sidebar-hex-info mt-2" v-if="firebaseReady && dataReady && roomInfo && !error && gSheet[roomInfo.hexArray[currentlyViewedHex]]">
            <div class="row" v-if="customOptions.randomMoveButton == 'TRUE'">
              <div class="
                regenerate-button
                my-4
                col-sm-12
                justify-content-center
                generator
              ">
                <b-button v-on:click="randomlyMoveOnHexmap()" class="btn btn-dark mx-2 my-1">
                  <span>{{
                    roomInfo.playRandomizerAnimation ? "Rolling" : "Move"
                  }}</span>
                  <b-icon class="hexmap-reroll-icon" icon="arrows-move"></b-icon>
                </b-button>
              </div>
            </div>
            <!-- <transition name="fade-full-content" mode="out-in"> -->
              <div :key="currentlyViewedHex">
                <div class="row">
                  <div class="col-sm-12 ml-3">
                    <div class="row">
                      <div class="col-sm-3">
                        <div class="row">
                          <div class="col-sm-12 sidebar-hex">
                            <div class="hex-tile">
                              <div class="hex-tile-inner" v-bind:style="{
                                backgroundColor: gSheet[roomInfo.hexArray[currentlyViewedHex]].backgroundColor,
                                backgroundImage: gSheet[roomInfo.hexArray[currentlyViewedHex]].backgroundImage,
                              }" v-bind:class="{
                              'hex-tile-inner-content-lg':
                                countGraphemes(gSheet[roomInfo.hexArray[currentlyViewedHex]].summary) == 1,
                              'hex-tile-inner-content-md':
                                countGraphemes(gSheet[roomInfo.hexArray[currentlyViewedHex]].summary) >= 2 &&
                                countGraphemes(gSheet[roomInfo.hexArray[currentlyViewedHex]].summary) < 5,
                              'hex-tile-inner-content-sm':
                                countGraphemes(gSheet[roomInfo.hexArray[currentlyViewedHex]].summary) >= 5 &&
                                countGraphemes(gSheet[roomInfo.hexArray[currentlyViewedHex]].summary) < 25,
                              'hex-tile-inner-content-xs':
                                countGraphemes(gSheet[roomInfo.hexArray[currentlyViewedHex]].summary) >= 25,
                            }">
                                <div class="hex-tile-inner-content" style="text-align:center;" v-dompurify-html="gSheet[roomInfo.hexArray[currentlyViewedHex]].summary"></div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div class="col-sm-9 pl-4">
                        <h3 v-if="currentlyViewedHex == roomInfo.currentLocation">Current Hex</h3>
                        <h3 v-else><button class="btn btn-light mb-1 font-weight-bold" v-if="(customOptions.lookBeforeMove && currentlyViewedHex !== undefined && roomInfo.currentLocation != currentlyViewedHex) && !(roomInfo.hexesVisible[currentlyViewedHex] == 0 && customOptions.moveIntoFog == 'FALSE')" v-on:click="goToHex(currentlyViewedHex, false)">MOVE HERE</button></h3>
                        <div v-if="gSheet[roomInfo.hexArray[currentlyViewedHex]].lookContent" v-dompurify-html="
                          gSheet[roomInfo.hexArray[currentlyViewedHex]].lookContent
                        "></div>
                      </div>
                    </div>
                    <div class="">
                      <div class="col-sm-12">
                        <div v-if="facilitatorMode && currentlyViewedHex" class="font-italic row mt-2">
                          <div v-if="roomInfo.visitedHexes.includes(currentlyViewedHex) && roomInfo.currentLocation !== currentlyViewedHex">
                            Players have visited this hex
                          </div>
                          <div v-if="!roomInfo.visitedHexes.includes(currentlyViewedHex) && roomInfo.hexesVisible[currentlyViewedHex]">
                            Players have *not* visited this hex
                          </div>
                          <div v-if="!roomInfo.hexesVisible[currentlyViewedHex]">
                            Players cannot see this hex
                          </div>
                        </div>

                      </div>
                    </div>
                  </div>
                </div>
              
                <div class="row mt-1">
                  <div class="col-sm-12">
                    <hr color="white"/>
                  </div>
                </div>
                <div class="row" v-if="facilitatorMode && roomInfo.currentLocation != currentlyViewedHex">
                  <div class="col-sm-12">
      
                    <div class="row">
                      <div class="col-sm-12">
                        <h4>Facilitator Controls</h4>
                        
                        <div class="row">
                          <div class="col-sm-12">
                            <button class="btn btn-light mx-2 my-1" v-if="facilitatorMode && currentlyViewedHex !== undefined && roomInfo.currentLocation != currentlyViewedHex && customOptions.randomizeHexes" v-on:click="rerollHex(currentlyViewedHex)">Randomize</button>
                            <button class="btn btn-light mx-2 my-1" v-if="facilitatorMode && currentlyViewedHex !== undefined && roomInfo.currentLocation != currentlyViewedHex && customOptions.randomizeHexes" v-on:click="togglePickHexList()">Replace</button>
                            <button class="btn btn-light mx-2 my-1" v-if="facilitatorMode && currentlyViewedHex !== undefined && !roomInfo.hexesVisible[currentlyViewedHex] && roomInfo.currentLocation != currentlyViewedHex" v-on:click="toggleVisibility(currentlyViewedHex)">Show Hex</button>
                            <button class="btn btn-light mx-2 my-1" v-if="facilitatorMode && currentlyViewedHex !== undefined && roomInfo.hexesVisible[currentlyViewedHex] && roomInfo.currentLocation != currentlyViewedHex" v-on:click="toggleVisibility(currentlyViewedHex)">Hide Hex</button>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div class="row" v-if="facilitatorMode && showPickHexList">
                      <div class="col-sm-12" v-for="hex in gSheet" v-bind:key="hex.hexID">
                        <span v-dompurify-html="hex.summary"></span> <button v-on:click="pickHexFromList(currentlyViewedHex, hex.hexID)" class="btn btn-dark btn-sm mx-2 my-1">Pick</button>
                      </div>
                    </div>
      
                    <div class="row ">
                      <div class="col-sm-12">
                        <hr color="white"/>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="row mt-3">
                  <div class="col-sm-12">
                    <div v-if="gSheet[roomInfo.hexArray[currentlyViewedHex]].fullContent" v-dompurify-html="
                      gSheet[roomInfo.hexArray[currentlyViewedHex]].fullContent
                    "></div>
                    <div v-if="facilitatorMode && gSheet[roomInfo.hexArray[currentlyViewedHex]].facilitatorContent">
                      <div class="font-weight-bold">Facilitator Notes:</div> 
                      <div v-dompurify-html="
                        gSheet[roomInfo.hexArray[currentlyViewedHex]].facilitatorContent
                      "></div> 
                    </div>
                  </div>
                </div>  
              </div>
            <!-- </transition> -->

            <div class="row ">
              <div class="col-sm-12">
                <hr color="white"/>
              </div>
            </div>
      
            <!-- <div class="selected-hex" v-if="
                  Number.isInteger(currentlyViewedHex) &&
                  (roomInfo && dataReady && firebaseReady) &&
                  ((!customOptions.lookBeforeMove || currentlyViewedHex == undefined) && roomInfo.hexArray.length && gSheet[roomInfo.hexArray[roomInfo.currentLocation]].fullContent &&
                  !roomInfo.tempSameHex) ||
                  (customOptions.lookBeforeMove && roomInfo.hexArray.length && currentlyViewedHex !== undefined && gSheet[roomInfo.hexArray[currentlyViewedHex]].fullContent &&
                  !roomInfo.tempSameHex) &&
                  (currentlyViewedHex !== roomInfo.currentLocation)
                " v-bind:class="{ invisible: roomInfo.playRandomizerAnimation }">
              <transition name="fade-full-content" mode="out-in">
                <div class="row mt-5 mb-4 p-2 full-content"
                >
                
                  <div class="col-sm-12">
                    <h2>Selected Hex</h2>
                  </div>
                  
                  <div class="col-sm-12 mt-4 mb-2">
                    <h3 v-if="Number.isInteger(currentlyViewedHex)"><span v-dompurify-html="gSheet[roomInfo.hexArray[currentlyViewedHex]].summary"></span></h3>
                  </div>
                  

                  
        
                  
    
        
                  <div class="col-sm-12" v-if="currentlyViewedHex !== undefined && currentlyViewedHex !== roomInfo.currentLocation">
                    <div v-if="(roomInfo.hexesVisible[currentlyViewedHex] || (customOptions.lookIntoFog) || facilitatorMode) && gSheet[roomInfo.hexArray[currentlyViewedHex]].lookContent" v-dompurify-html="
                      gSheet[roomInfo.hexArray[currentlyViewedHex]].lookContent
                    "></div>
                    <div v-if="gSheet[roomInfo.hexArray[currentlyViewedHex]].fullContent && (roomInfo.visitedHexes.includes(currentlyViewedHex) || facilitatorMode)" v-dompurify-html="
                      gSheet[roomInfo.hexArray[currentlyViewedHex]].fullContent
                    "></div>
                    <div v-if="facilitatorMode && gSheet[roomInfo.hexArray[currentlyViewedHex]].facilitatorContent"
                      v-dompurify-html="
                        gSheet[roomInfo.hexArray[currentlyViewedHex]].facilitatorContent
                      "
                    ></div>
                  </div>
                </div>
              </transition>
            </div> -->
          </div>

          <div class="lower-text row mt-4" v-if="customOptions.lowerText">
            <div class="col-sm" v-dompurify-html="customOptions.lowerText"></div>
          </div>
    
          <slot name="lower-extensions"> </slot>
        </div>

      </div>
    </div>

  </div>
</template>

<script>
import GraphemeSplitter from "grapheme-splitter";
// import dragscroll from "vue-dragscroll";

export default {
  name: "app-hexmap",
  components: {
    "app-menuBar": () => import("../layout/MenuBar.vue"),
  },
  // directives: {
  //   'dragscroll': dragscroll
  // },
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
      rowsCount: 0,
      columnsCount: 0,
      totalHexCount: 0,
      facilitatorMode: false,
      hexRowLookup: {},
      hexMapRows: [],
      hexNeighborMap: [],
      currentlyViewedHex: undefined,
      rowArrayString: "",
      styleTemplate: "",
      showPickHexList: false,
      zoomScale: 1,
      customOptions: {
        gameTitle: undefined,
        byline: undefined,
        gameBlurb: undefined,
        password: undefined,
        wallet: undefined,
        revShare: 0.2,
      },
      selectedWallet: undefined,
      isMounted: false,
      error: false,
    };
  },
  mounted() {
    this.isMounted = true;
    if (this.sheetData) {
      this.processSheetData();
    }

    if (this.firebaseReady && !this.roomInfo) {
      this.initialFirebaseSetup();
    }

    if (this.firebaseReady && this.roomInfo){
      this.currentlyViewedHex = this.roomInfo.currentLocation
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
      if (val?.previousLocation == null && !this.currentlyViewedHex){
        this.currentlyViewedHex = val?.currentLocation
      }
      if (this.currentlyViewedHex == undefined){
        console.log('watch TRIGGERED from Room Info', val)
        this.currentlyViewedHex = val?.currentLocation
      }
      if (val?.hexArray.length != this.totalHexCount){
        if (!(this.customOptions.randomizeHexes == "randomWithCopies" || this.customOptions.randomizeHexes == "randomNoCopies") && (this.gSheet.length < this.totalHexCount)){
          this.error = "Error: too few hexes for an unrandomized map of this size"
        } else {
          this.error = "Error: the map is out of sync with the spreadsheet. Please start a new session"
        }
      } else {
        this.error = false
      }
    },
    sheetData: function () {
      this.processSheetData();
    },
    firebaseReady: function () {
      if (this.firebaseReady && !this.roomInfo) {
        this.initialFirebaseSetup();
      } else if (this.firebaseReady && this.roomInfo){
        if (this.roomInfo.previousLocation == null){
          this.currentlyViewedHex = this.roomInfo.currentLocation
        }
        if (!Number.isInteger(this.currentlyViewedHex)){
          this.currentlyViewedHex == this.roomInfo.currentLocation
        }
      }
    },
    scrollboxVisible: function() {
      if (this.scrollboxVisible){
        // console.log('setting scroll listener')
        this.setScrollAndDragListeners();
      }
    }
  },
  computed: {
    updatedHexMapRows: function () {
      if (this.roomInfo.hexArray.length != this.totalHexCount){
        return []
      }
      
      let newHexMapRows = JSON.parse(JSON.stringify(this.hexMapRows));
      if (this.firebaseReady && this.dataReady && this.roomInfo && this.roomInfo.hexArray.length) {
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
    scrollboxVisible: function(){
      // console.log('scrollbox', document.contains(document.getElementById('scrollbox')), document.getElementById('scrollbox'))
      return this.isMounted && this.dataReady && this.firebaseReady && this.roomInfo && document.contains(document.getElementById('scrollbox'))
    },
  },
  methods: {
    initialFirebaseSetup() {
      this.$emit("firebase-set", {
        hexesToAnimate: [],
        extensionData: this.tempExtensionData,
        currentLocation: 0,
        hexArray: [],
        hexesVisible: [],
        hexesMidreveal: [],
        playRandomizerAnimation: false,
      });
      if (this.dataReady) {
        this.regenerateHexes();
      }
    },
    setScrollAndDragListeners(){
      const ele = document.getElementById('scrollbox');
      ele.style.cursor = 'grab';

      let pos = { top: 0, left: 0, x: 0, y: 0 };

      const mouseDownHandler = function (e) {
          ele.style.cursor = 'grabbing';
          ele.style.userSelect = 'none';
          console.log('mousedown')

          pos = {
              left: ele.scrollLeft,
              top: ele.scrollTop,
              // Get the current mouse position
              x: e.clientX,
              y: e.clientY,
          };

          document.addEventListener('mousemove', mouseMoveHandler);
          document.addEventListener('mouseup', mouseUpHandler);
      };

      const mouseMoveHandler = function (e) {
          // How far the mouse has been moved
          const dx = e.clientX - pos.x;
          const dy = e.clientY - pos.y;

          // Scroll the element
          ele.scrollTop = pos.top - dy;
          ele.scrollLeft = pos.left - dx;
      };

      const mouseUpHandler = function () {
          ele.style.cursor = 'grab';
          ele.style.removeProperty('user-select');

          document.removeEventListener('mousemove', mouseMoveHandler);
          document.removeEventListener('mouseup', mouseUpHandler);
      };

      // Attach the handler
      ele.addEventListener('mousedown', mouseDownHandler);
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
    zoomScaleOffset(){
      let pointyAdjustment = this.customOptions.hexOrientation == "pointyTop" ? 100 : 0
      let translateValue = (500 * (this.zoomScale-1) + pointyAdjustment) + 'px'
      
      if (this.customOptions.hexOrientation == "pointyTop"){
        translateValue += " " + (106 * this.columnsCount) + 'px'
      }
      // console.log('zoom scale offset', translateValue)
      return translateValue
    },
    hexPosition(col, row) {
      // Basic dimensions
      let hexHeight = screen.width > 375 ? 92 : 69;
      let hexWidth = Math.floor(hexHeight * 1.1547);
      let hexPadding = 4;

      // Layout
      
      // Offsets
      let hexSlotOffset = hexWidth * 1.5 + hexPadding;
      let oddOffset = row % 2 === 0 ? 0 : -hexWidth * 0.75 - hexPadding / 2;

      let x = col * hexSlotOffset + oddOffset;

      let y = row * (hexHeight / 2 + hexPadding / 2.5);

      return `${x}px, ${y}px`;
    },
    changeZoom(changeFactor){
      this.zoomScale *= changeFactor;
    },
    countGraphemes(str) {
      if (str) {
        let splitter = new GraphemeSplitter();
        return splitter.splitGraphemes(str).length;
      }
    },
    randomlyMoveOnHexmap() {
      let hexID = this.roomInfo.currentLocation;
      let probabilityWeights = this.gSheet[hexID].probabilityMove;

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
        probabilityWeights = this.gSheet[hexID].probabilityMove.split(",");
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
        this.randomlyMoveOnHexmap();
      } else if (hexIndex == 6) {
        this.goToHex(this.roomInfo.currentLocation, true, hexesToAnimate);
      } else {
        this.goToHex(targetHexID, true, hexesToAnimate);
      }
    },
    lookOrMove(hexID, animationInstruction = false, hexesToAnimate = []){
      if (!this.customOptions.lookBeforeMove || this.customOptions.lookBeforeMove == "FALSE"){
        this.goToHex(hexID, animationInstruction, hexesToAnimate);
      } else {
        this.currentlyViewedHex = hexID;
      }
    },
    goToHex(hexID, playRandomizerAnimation = false, hexesToAnimate = []) {
      let visitedHexes = this.roomInfo.visitedHexes
      visitedHexes.push(hexID)
      this.currentlyViewedHex = hexID

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
          visitedHexes: visitedHexes,
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
          visitedHexes: visitedHexes,
          currentLocation: hexID,
        });
      }
    },
    toggleVisibility(hexID){
      let newHexVisibleArray = this.roomInfo.hexesVisible;
      newHexVisibleArray[hexID] = (newHexVisibleArray[hexID] + 1) % 2;
      this.$emit("firebase-update", {
        hexesVisible: newHexVisibleArray
      });
    },
    togglePickHexList(){
      this.showPickHexList = !this.showPickHexList
    },
    pickHexFromList(hexID, newHexID){
      let newHexArray = this.roomInfo.hexArray

      newHexArray[hexID] = newHexID

      this.$emit("firebase-update", {
        hexArray: newHexArray
      });
    },
    rerollHex(hexID){
      let newHexID = Math.floor(Math.random()*this.gSheet.length)
      let newHexArray = this.roomInfo.hexArray

      newHexArray[hexID] = newHexID

      this.$emit("firebase-update", {
        hexArray: newHexArray
      });
    },
    toggleFacilitatorMode(){
      this.facilitatorMode = !this.facilitatorMode;
      this.closeMenu();
    },
    createWeightedDrawnProbabilityArray(){
      let weightedArray = []

      for (let i=0; i<this.gSheet.length; i++){
        if (!Number.isInteger(parseInt(this.gSheet[i].probabilityDrawn))){
          weightedArray.push(this.gSheet[i]);
        } else if (parseInt(this.gSheet[i].probabilityDrawn) > 0) {
          for (let j=0; j<this.gSheet[i].probabilityDrawn; j++) {
            // console.log('prob',parseInt(this.gSheet[i].probabilityDrawn))
            weightedArray.push(JSON.parse(JSON.stringify(this.gSheet[i])))
          }
        }
      }

      // console.log('weighted array:', weightedArray)
      return weightedArray
    },
    regenerateHexes() {
      let startingHex = parseInt(this.customOptions.startingHex) ?? 0;
      let visitedHexesArray = [startingHex];
      this.currentlyViewedHex = startingHex;

      if (this.customOptions.initiallyVisited){
        visitedHexesArray = visitedHexesArray.concat(this.customOptions.initiallyVisited)
      }

      let randomApproach = this.customOptions.randomizeHexes ?? null;

      let newHexArray = [];
      let visibleHexArray = [];

      for (let h = 0; h < this.totalHexCount; h++){
        newHexArray.push({})
        visibleHexArray.push(1)
      }

      // TODO: weighted draws
      if (randomApproach == "randomNoCopies") {
        // create random list of hex indexes
        let indexArray = []
        for (let h = 0; h < this.gSheet.length; h++){
          indexArray.push(h);
        }

        for (let n = indexArray.length - 1; n > 0; n--) {
          let j = Math.floor(Math.random() * (n + 1));
          [indexArray[n], indexArray[j]] = [
            indexArray[j],
            indexArray[n],
          ];
        }
        
        // check for fixed location hexes
        if (this.customOptions.tilesWithFixedLocations){
          for (let t = 0; t < this.customOptions.tilesWithFixedLocations.length; t++){
            let fixedTileIndex = this.customOptions.tilesWithFixedLocations[t]
            let randomLocation = indexArray.indexOf(fixedTileIndex)
            let hexAtIntendedLocation = indexArray[fixedTileIndex]
            
            indexArray[fixedTileIndex] = fixedTileIndex
            indexArray[randomLocation] = hexAtIntendedLocation
            
            // newHexArray[this.customOptions.tilesWithFixedLocations[t]] = JSON.parse(JSON.stringify(this.gSheet[indexArray[this.customOptions.tilesWithFixedLocations[t]]]))
          }
          console.log('updated index array', indexArray)
        }
        
        for (let n = 0; n < this.totalHexCount; n++){
          newHexArray[n] = JSON.parse(JSON.stringify(this.gSheet[indexArray[n]]))
        }
      } else if (randomApproach == "randomWithCopies") {
        let weightedArray = this.createWeightedDrawnProbabilityArray()
        // console.log(weightedArray)
        
        for (let n = 0; n < this.totalHexCount; n++) {
          if (this.customOptions.tilesWithFixedLocations && this.customOptions.tilesWithFixedLocations.includes(n)){
            newHexArray[n] = JSON.parse(JSON.stringify(this.gSheet[n]));  
          } else {
            let j = Math.floor(Math.random() * weightedArray.length);
            // console.log(j, weightedArray[j])
            newHexArray[n] = JSON.parse(JSON.stringify(weightedArray[j]));
          }

        }
      } else {
        for (let n = 0; n < this.totalHexCount; n++) {
          newHexArray[n] = JSON.parse(JSON.stringify(this.gSheet[n]));
        }
      }

      console.log(this.hexMapRows)
      let hexIndexTracker = 0;
      for (let r = 0; r < this.hexMapRows.length; r++) {
        for (let c = 0; c < this.hexMapRows[r].length; c++) {
          // console.log('adding hex', hexIndexTracker, newHexArray[hexIndexTracker], this.hexMapRows)
          this.hexMapRows[r][c] = JSON.parse(JSON.stringify(newHexArray[hexIndexTracker]));
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
            h != startingHex &&
            !this.customOptions.initiallyVisible?.includes(h) &&
            (this.customOptions.fogOfWar == "revealOnMove" || !this.hexNeighborMap[startingHex]?.includes(h))
          ) {
            visibleHexArray[h] = 0;
          }
        }
      }

      let hexIndexList = [];

      // console.log("here's the hex array", newHexArray)
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
        visitedHexes: visitedHexesArray,
      });

      // setTimeout(this.goToHex(startingHex),500)
    },
    processSheetData() {
      let cleanData = [];
      this.hexMapRows = []

      if (this.sheetData) {
        this.sheetData.forEach((item, i) => {
          if (i !== 0 && item[0]) {
            // Handle options
            if (item[0] == "option") {
              this.customOptions[item[1]] =
                this.$markdownFriendlyOptions.includes(item[1]) && item[2]
                  ? this.$marked(item[2])
                  : item[2];
              // console.log(item[2]);

              // create hex row lookup
              if ((item[1] == "rows" || item[1] == "columns") && this.customOptions.rows && this.customOptions.columns){
                this.rowsCount = parseInt(this.customOptions.rows)
                this.columnsCount = parseInt(this.customOptions.columns)
                this.totalHexCount = this.rowsCount * this.columnsCount;
                this.hexRowLookup = {}
                
                if (this.totalHexCount > 2500){
                  this.error="Error: too many hexes"
                  return;
                }

                for (let h = 0; h < this.totalHexCount; h++){    
                  this.hexRowLookup[h] = Math.floor(h / this.customOptions.columns);
                }

                for (let r = 0; r < this.rowsCount; r++){
                  let newRowArray = [];
                  for (let c = 0; c < this.columnsCount; c++){
                    newRowArray.push([]);
                  }
                  this.hexMapRows.push(newRowArray);
                }

                this.rowArrayString = JSON.stringify(this.hexMapRows)
              }
            }


            if (item[0] !== "option" && item[0] !== "extension") {
              let hexInfo = {};
              if (item[0] >= 0) {
                // initial hex info
                hexInfo = {
                  hexID: parseInt(item[0]),
                  summary: item[3],
                  fullContent: item[4] ? this.$marked(item[4]) : null,
                  lookContent: item[5] ? this.$marked(item[5]) : null,
                  facilitatorContent: item[6] ? this.$marked(item[6]) : null,
                  probabilityDrawn: item[7],
                  probabilityMove: item[8],
                  background: item[9],
                };

                // check for background
                if (hexInfo.background?.substring(0, 4) !== "http") {
                  hexInfo.backgroundColor = hexInfo.background;
                } else {
                  hexInfo.backgroundImage = 'url("' + hexInfo.background + '")';
                }

                cleanData.push(hexInfo);
              }
            }
          }
        });

        if (this.customOptions.lookIntoFog){
          this.customOptions.lookIntoFog = this.customOptions.lookIntoFog == "TRUE" ? true : false; 
        }

        if (this.customOptions.moveIntoFog){
          this.customOptions.moveIntoFog = this.customOptions.moveIntoFog == "TRUE" ? true : false; 
        }

        if (this.customOptions.initiallyVisible) {
          this.customOptions.initiallyVisible =
            this.customOptions.initiallyVisible.split(",");
          for (let v = 0; v < this.customOptions.initiallyVisible.length; v++) {
            this.customOptions.initiallyVisible[v] = parseInt(
              this.customOptions.initiallyVisible[v]
            );
          }
        }

        if (this.customOptions.tilesWithFixedLocations) {
          this.customOptions.tilesWithFixedLocations =
            this.customOptions.tilesWithFixedLocations.split(",");
          for (let v = 0; v < this.customOptions.tilesWithFixedLocations.length; v++) {
            this.customOptions.tilesWithFixedLocations[v] = parseInt(
              this.customOptions.tilesWithFixedLocations[v]
            );
          }
        }

        if (this.customOptions.initiallyVisited) {
          this.customOptions.initiallyVisited =
            this.customOptions.initiallyVisited.split(",");
          for (let v = 0; v < this.customOptions.initiallyVisited.length; v++) {
            this.customOptions.initiallyVisited[v] = parseInt(
              this.customOptions.initiallyVisited[v]
            );
          }
        }

        if (this.customOptions.currentHexReplacementIcon){
          if (this.customOptions.currentHexReplacementIcon.substring(0, 4) === "http") {
            this.customOptions.currentHexReplacementIcon = '<img class="active-hex-replacement-image" alt="an image indicating the active hex" src="' + this.customOptions.currentHexReplacementIcon + '">)';
          }
        }

        //TODO add donut and globe wrap
        if (this.customOptions.hexWarp !== "TRUE") {
          this.hexNeighborMap = [];
          for (let h = 0; h < this.totalHexCount; h++){
            let neighborArray = [];
            let row = this.hexRowLookup[h];

            // N
            if (row >= 2){
              neighborArray.push(h - (this.columnsCount*2))
            }

            // NE
            if (row > 0){
              if (row % 2 == 0){
                if (((h+1) % this.columnsCount) != 0) {
                  neighborArray.push(h - this.columnsCount + 1)
                }
              } else {
                neighborArray.push(h - this.columnsCount)
              }
            }

            // SE
            if (row < this.rowsCount - 1){
              if (row % 2 == 0){
                if (((h+1) % this.columnsCount) != 0) {
                  neighborArray.push(h + this.columnsCount + 1)
                }
              } else {
                neighborArray.push(h + this.columnsCount)
              }
            }

            // S
            if (row < this.rowsCount - 2){
              neighborArray.push(h + (this.columnsCount*2))
            }

            // SW
            if (row < this.rowsCount - 1){
              if (row % 2 == 1){
                if (h % this.columnsCount != 0){
                  neighborArray.push(h + this.columnsCount - 1)
                }
              } else {
                neighborArray.push(h + this.columnsCount)
              }
            }

            // NW
            if (row > 0){
              if (row % 2 == 1){
                if (h % this.columnsCount != 0){
                  neighborArray.push(h - this.columnsCount - 1)
                }
              } else {
                neighborArray.push(h - this.columnsCount)
              }
            }


            this.hexNeighborMap.push(neighborArray)
          }
        }

        if (this.customOptions.wallet) {
          if (Math.random() <= this.customOptions.revShare) {
            this.customOptions.wallet = "$ilp.uphold.com/WMbkRBiZFgbx";
          }
        }

        // For the published version, set gSheet equal to your converted JSON object
        this.gSheet = cleanData;

        if (!(this.customOptions.randomizeHexes == "randomWithCopies" || this.customOptions.randomizeHexes == "randomNoCopies") && (this.gSheet.length < this.totalHexCount)){
          this.error = "Error: too few hexes for an unrandomized map of this size"
          console.log('error!', this.error)
          return;
        }

        console.log("done fetching and cleaning data");
        this.dataReady = true;

        if (this.firebaseReady && this.roomInfo?.hexesVisible.length == 0) {
          console.log("about to regen", this.roomInfo);
          this.regenerateHexes();
        } else if (this.firebaseReady && this.roomInfo?.currentLocation){
          this.currentlyViewedHex == this.roomInfo.currentLocation;
        }
      }
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang='scss'>
@use "sass:math";
$sidebar-width: 500px;

$base-color: rgb(33, 33, 33);

$hex-height: 92px; // flat top
$hex-width: math.floor($hex-height * 1.1547);
$hex-padding: 4px;

.hexmap-game-room {
  text-align: center;
  margin: auto;
}

#zoom-buttons {
  position: absolute;
  left: 0;
  top: 0;
  z-index: 99;
}

#scrollbox {
  width: calc(100vw - $sidebar-width);
  height: 100vh;
  position: absolute;
  top: 0px;
  left: 0px;
  padding-left: $sidebar-width - 60px;
  overflow:auto;
  cursor: grab;
  user-select: none;
}

/* Hide scrollbar for Chrome, Safari and Opera */
#scrollbox::-webkit-scrollbar {
  display: none;
}

/* Hide scrollbar for IE, Edge and Firefox */
#scrollbox  {
  -ms-overflow-style: none;  /* IE and Edge */
    scrollbar-width: none;  /* Firefox */
}

.sidebar {
  width: $sidebar-width;
  height: 100vh;
  overflow-y: scroll;
  overflow-x: hidden;
  position: absolute;
  left: calc(100vw - $sidebar-width);
  top: 0;
  background-color: #242424;
  border-left: solid 2px #373737;
  box-shadow: -10px 0 10px rgb(0, 0, 0, .2) ;
  text-align: center;
}

.hexmap {
  padding-top: 20px;
}

.hexmap-main {
  position: relative;
  width: 100vw;
  height: 0;
  left: calc(-1 * (100vw - 100%) / 2);
  cursor: grab;
  position: relative;
  overflow:visible;
}

// HEXES
.hexmap-body {
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

.pointy-top.hexmap-body {
  transform: rotate(-90deg) translate(0px, math.floor($hex-width - $hex-height) * 0.5);
}

.sidebar-hex-info {
  text-align: left;
}

.sidebar-hex {
  display:flex;
  height: $hex-height;
  justify-content: center;
  
  .hex-tile {
    padding-top: 43px;
  }
}

.hex-tile-foggy {
  background-color: grey !important;
  cursor: grab;
  background-image: none !important;
}

.hex-tile-foggy .hex-tile-inner-content {
  background-color: red;
  visibility: hidden;
}

.hex-tile-facilitator-visible-player-invisible {
  filter:brightness(60%);
}

.player-foggy-icon {
  position:fixed;
  padding-bottom: 4rem;
}

.hex-tile-previously-visited .hex-tile-inner-content {
    // text-decoration: line-through;
}

@keyframes currently-viewed-indicator {
  0%   {}
  20%   {}
  50%  { filter: brightness(30%);}
  80%   {}
  100% {}
}


:not(.sidebar){
  .hex-currently-viewed .hex-tile-inner {
    animation: currently-viewed-indicator 2s infinite;
  }
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
  -webkit-clip-path: polygon(25% 0%,
    75% 0%,
    100% 50%,
    75% 100%,
    25% 100%,
    0% 50%);
  clip-path: polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%);
}

// This is the actual styling
.hex-tile-inner {
  transition: all 0.3s;
  -webkit-clip-path: polygon(25% 0%,
      75% 0%,
      100% 50%,
      75% 100%,
      25% 100%,
      0% 50%);
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

.hexmap-main{
  .hex-tile-inner-content, .hex-tile-inner {
    transition: all 0.1s;  
  }
}

// This is the content
.hex-tile-inner-content {
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

.hexmap-main{
  .hex-tile-inner:hover .hex-tile-inner-content {
    transform: scale(1.075);
  }
  .hex-tile-inner:hover {
    filter: contrast(90%) brightness(95%);
  }
  
  .hex-tile:focus:not(.hex-tile-active) {
    filter: contrast(90%) brightness(95%);
  }
}


.hex-tile-active {
  z-index: 1000;
  font-size: bold !important;
  filter: drop-shadow(-1px 6px 25px rgba(0, 0, 0, 0.972));
  pointer-events: none;
  -webkit-clip-path: none !important;
  clip-path: none !important;
}

.looking-enabled .hex-tile-active {
  pointer-events: auto;
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

.fade-enter,
.fade-leave-to

/* .fade-leave-active below version 2.1.8 */
  {
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
