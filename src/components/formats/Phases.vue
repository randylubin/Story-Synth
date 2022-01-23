<template>
  <div class="phases">
    <div class="full-page-background"></div>
    <div v-html="customOptions.style"></div>

    <div class="game-room container" v-if="roomInfo">
      
      <!-- Menu Bar -->
      <div class="menu-bar mb-4 d-flex align-items-center">
        <button class="btn btn-outline-dark mr-auto border-0" v-b-modal.menuModal v-bind:style="{color: customOptions.menuColor}"><b-icon-list></b-icon-list> Menu</button>
        <!-- <div v-if="customOptions.gameTitle" class="mx-auto align-middle text-center">{{customOptions.gameTitle}}</div> -->
        <app-roomLink class="d-none d-sm-block" :routeRoomID="$route.params.roomID" :color="customOptions.menuColor" v-if="dataReady && firebaseReady"></app-roomLink>
        
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
            <div class="row menu-row">
              <b-button
                v-b-modal.reshuffleConfirm
                v-on:click="closeMenu();"
                class="control-button-restart btn-lg btn-block"
                variant="outline-dark"
                :disabled="roomInfo.xCardIsActive"
                v-if="!customOptions.facilitatorMode || userRole == 'facilitator'"
                color="rgb(187, 138, 200)"
                >Restart</b-button
              >
            </div>
            <div class="row menu-row">
              <b-button
                variant="outline-dark"
                class="control-button-safety-card btn-lg btn-block"
                v-on:click="xCard(); closeMenu();"
                v-html="
                  customOptions.safetyCardButton
                    ? customOptions.safetyCardButton
                    : 'X-Card'
                "
                ></b-button>
            </div>
            <div class="row menu-row" v-if="roomInfo.currentCardIndex < firstNonInstruction">
              <b-button
                variant="outline-dark"
                class="btn-lg btn-block"
                v-on:click="skipInstructions(); closeMenu();" 
                >
                  Skip Instructions
                </b-button>
            </div>
            <div class="row menu-row" v-if="roomInfo.currentCardIndex >= firstNonInstruction">
              <b-button
                variant="outline-dark"
                class="btn-lg btn-block"
                :disabled="roomInfo.currentCardIndex >= endingIndex || roomInfo.xCardIsActive" v-on:click="ending(); closeMenu();">
                Ending
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
      
      <!-- <div class="mb-4 game-meta" v-if="customOptions.gameTitle || customOptions.byline">
        <div class="row text-center" v-if="customOptions.gameTitle">
          <div class="col-sm">
            <h1>{{customOptions.gameTitle}}</h1>
          </div>
        </div>

        <div class="row text-center" v-if="customOptions.byline">
          <div class="col-sm">
            <h4>{{customOptions.byline}}</h4>
          </div>
        </div>
      </div> -->

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

      <!-- <div class="row mb-4">
        <div class="btn-group col-sm" role="group" aria-label="Card Controls">
          <button class="btn btn-outline-dark" v-on:click="previousCard()" :disabled="roomInfo.xCardIsActive || roomInfo.currentCardIndex == 0">Previous Card</button>
          <button class="btn btn-outline-primary" v-on:click="nextCard()" :disabled="roomInfo.xCardIsActive || roomInfo.currentCardIndex == gSheet.length - 1 || (roomInfo.currentCardIndex == gSheet.length - 1 && roomInfo.currentPhase == numberOfPhases -1)">Next Card</button>
        </div>
      </div> -->

      <transition name="fade">
        <div class="fab-buttons container" v-if="(!customOptions.facilitatorMode || userRole == 'facilitator') && (!customOptions.lowerCardNavOnMobile) && (!customOptions.hideNavigationButtons || (parseInt(customOptions.hideNavigationButtons) > roomInfo.currentCardIndex))">
            <button
              class="btn btn-outline-dark btn-fab btn-fab-left control-button-previous-card shadow"
              v-on:click="previousCard()"
              v-b-tooltip.hover title="Previous Card"
              :disabled="roomInfo.xCardIsActive || roomInfo.currentCardIndex == 0"
            >
              <!-- Previous Card -->
              <b-icon class="h1 mb-0" icon="chevron-left"></b-icon>
              <b-icon class="h1 mb-0 mr-2" icon="card-heading"></b-icon>
            </button>
            <button
              class="btn btn-outline-dark btn-fab btn-fab-right control-button-next-card shadow"
              v-b-tooltip.hover title="Next Card"
              v-on:click="nextCard()"
              :disabled="roomInfo.xCardIsActive || roomInfo.currentCardIndex == gSheet.length - 1 || (roomInfo.currentCardIndex == gSheet.length - 1 && roomInfo.currentPhase == numberOfPhases -1)"
            >
              <!-- Next Card -->
              <b-icon class="h1 mb-0 ml-2" icon="card-heading"></b-icon>
              <b-icon class="h1 mb-0" icon="chevron-right"></b-icon>              
            </button>
        </div>        
      </transition>



      <div v-if="gSheet[roomInfo.cardSequence[roomInfo.currentCardIndex]] || Object.prototype.toString.call(roomInfo.cardSequence[roomInfo.currentCardIndex]) === '[object Object]'" class="mb-4">
        
          <div class="card d-flex shadow img-fluid" v-bind:class="{'bg-transparent': (customOptions.coverImage && roomInfo.currentCardIndex == 0)}">
            
            <img v-bind:src="customOptions.coverImage" class="card-img-top" style="width:100%" v-if="customOptions.coverImage && roomInfo.currentCardIndex == 0">
            <img v-bind:src="customOptions.cardBackgroundImage" class="card-img-top card-background" style="width:100%" v-if="customOptions.cardBackgroundImage && (!customOptions.coverImage || roomInfo.currentCardIndex != 0) && (!customOptions.cardBackgroundImageAlign)">
            <b-card-img v-bind:src="customOptions.cardBackgroundImage" alt="Card Background image" top v-if="customOptions.cardBackgroundImageAlign == 'top' && roomInfo.currentCardIndex != 0"></b-card-img>

            <div class="card-body text-center" v-if="(!dataReady || !firebaseReady) && !error">
              <h1 class="m-5">Loading</h1>
              <b-spinner class="m-5" style="width: 4rem; height: 4rem;" label="Busy"></b-spinner>
            </div>


            <div class="card-body justify-content-center mt-4 mx-4" style="white-space: pre-line" v-if="!roomInfo.xCardIsActive && dataReady && firebaseReady && (!customOptions.coverImage || roomInfo.currentCardIndex != 0)" v-bind:class="{'card-body': !customOptions.cardBackgroundImage, 'card-img-overlay': (customOptions.cardBackgroundImage && (!customOptions.cardBackgroundImageAlign))}">
              <div class="row mb-4" v-if="customOptions.instructionsProgressBar && roomInfo.currentCardIndex < firstNonInstruction && roomInfo.currentCardIndex != 0">
                <div class="col-sm">
                  <h2>Instructions</h2>
                  <b-progress :value="roomInfo.currentCardIndex" :max="firstNonInstruction -1" variant="dark"></b-progress>
                </div>
              </div>
              
              <div v-if="gSheet[roomInfo.cardSequence[roomInfo.currentCardIndex]]">
                <h2 class="card-header-text">{{ gSheet[roomInfo.cardSequence[roomInfo.currentCardIndex]].headerText }}</h2>
                
                <p v-if="gSheet[roomInfo.cardSequence[roomInfo.currentCardIndex]].bodyText" v-bind:class="{ 'text-left': gSheet[roomInfo.cardSequence[roomInfo.currentCardIndex]].bodyText.length > 60 }" class="my-4" v-html="gSheet[roomInfo.cardSequence[roomInfo.currentCardIndex]].bodyText"></p>
              </div>

              <div v-if="Object.prototype.toString.call(roomInfo.cardSequence[roomInfo.currentCardIndex]) === '[object Object]'">
                <!--<div v-for="(index) in numberOfPhases" v-bind:key="index" v-html="phaseData[index-1][roomInfo.cardSequence[roomInfo.currentCardIndex][index-1]]">
                </div>-->
                <h2 class="card-header-text">{{phaseNames[roomInfo.currentPhase]}}</h2>
                <div v-html="phaseData[roomInfo.currentPhase][roomInfo.cardSequence[roomInfo.currentCardIndex][roomInfo.currentPhase]]"></div>
                <div v-if="Array.isArray(customOptions.phaseHelpText)" class="my-4">
                  <p class="phase-help-text">
                    <i class="">{{customOptions.phaseHelpText[roomInfo.currentPhase]}}</i>
                  </p>
                </div>
              </div>
              
            </div>
            

            <div class="card-body align-items-center justify-content-center" v-if="roomInfo.xCardIsActive" v-bind:class="{'card-body': !customOptions.cardBackgroundImage, 'card-img-overlay': customOptions.cardBackgroundImage && !customOptions.cardBackgroundImageAlign }">
              <div class="mt-5 pt-5 mb-5">
                <h1 v-if="!customOptions.safetyCardText">X-Card</h1>
                <div class="safety-card-tet" v-html="customOptions.safetyCardText" v-if="customOptions.safetyCardText"></div> 
              </div>
              <button class="btn btn-outline-dark mt-5" v-on:click="xCard()">Continue</button>
              <div class="" v-if="!customOptions.safetyCardText">
                <a class="x-card-text" href="http://tinyurl.com/x-card-rpg">About the X-Card</a>
              </div>
            </div>

            <b-card-img v-bind:src="customOptions.cardBackgroundImage" alt="Card Background image" bottom v-if="customOptions.cardBackgroundImageAlign == 'bottom' && roomInfo.currentCardIndex != 0"></b-card-img>

          </div>
        
      </div>

      <!-- <div class="btn-container" style>
        <div class="row mb-4">
          <div class="btn-group col-sm" role="group" aria-label="Deck Controls">
            <button class="btn btn-outline-dark" :disabled="roomInfo.xCardIsActive" v-on:click="shuffle()" color="rgb(187, 138, 200)">Re-shuffle</button>
            <b-button variant="outline-dark" v-on:click="xCard()" v-html="customOptions.safetyCardButton ? customOptions.safetyCardButton : 'X-Card'"></b-button>
            <button class="btn btn-outline-dark" v-on:click="skipInstructions()" v-if="roomInfo.currentCardIndex < firstNonInstruction">Skip Instructions</button>
            <button class="btn btn-outline-dark" v-if="roomInfo.currentCardIndex >= firstNonInstruction" :disabled="roomInfo.currentCardIndex >= endingIndex || roomInfo.xCardIsActive" v-on:click="ending()">Ending</button>
          </div>
        </div>
      </div> -->

      <b-modal
        id="reshuffleConfirm"
        title="Restart and Reshuffle"
        hide-footer
      >
        <p>Do you want to reshuffle all of the prompts and restart the game?</p>
        <div
          class="text-center mb-3"
        >
          <b-button
            variant="dark"
            v-on:click="shuffle();"
            >Restart and Reshuffle</b-button
          >
        </div>
      </b-modal>

      <div class="row">
        <div class="btn-group col-sm" role="group" aria-label="Extra Info" v-if="customOptions.modalOneLabel || customOptions.modalTwoLabel">
          <!-- <b-button v-b-modal.modalOne variant="outline-dark" v-if="customOptions.modalOneLabel">{{customOptions.modalOneLabel}}</b-button> -->

          <b-modal id="modalOne" v-bind:title="customOptions.modalOneLabel" hide-footer>
            <div class="d-block text-left" v-html="customOptions.modalOneText">
              
            </div>
          </b-modal>

          <!-- <b-button v-b-modal.modalTwo variant="outline-dark" v-if="customOptions.modalTwoLabel">{{customOptions.modalTwoLabel}}</b-button> -->

          <b-modal id="modalTwo" v-bind:title="customOptions.modalTwoLabel" hide-footer>
            <div class="d-block text-left" v-html="customOptions.modalTwoText">
            </div>
          </b-modal>
        </div>
      </div> 

      <div v-if="Array.isArray(customOptions.showPastPrompts) && roomInfo.currentCardIndex >= firstNonInstruction">

        <div class="itinerary mb-5 card d-flex shadow"> <!-- style="display: flex; flex-direction: column-reverse;-->
          <div class="card-body justify-content-center">
            <div class="row my-2">
              <div class="col-sm game-meta">
                <h2 v-html="customOptions.pastPromptHeader ? customOptions.pastPromptHeader : 'Past Prompts'"></h2>
              </div>
            </div>
            <div class="row">
              <div class="col-sm" v-html="customOptions.pastPromptPrecursor ? customOptions.pastPromptPrecursor : null">
              </div>
            </div>
            <div v-for="(round, roundIndex) in roomInfo.cardSequence" v-bind:key="roundIndex">
              <div v-if="Object.prototype.toString.call(round) === '[object Object]' && phaseData.length>0 && roundIndex <= roomInfo.currentCardIndex">
                <div class="row" v-for="(phase, phaseIndex) in numberOfPhases" v-bind:key="phaseIndex">
                  <div class="col-sm" v-if="roundIndex < roomInfo.lastSeenRound || (roundIndex==roomInfo.lastSeenRound && phaseIndex < roomInfo.lastSeenPhase)">
                    <div v-if="customOptions.showPastPrompts[phaseIndex]==1" style="font-size: .8em;">
                      {{phaseData[phaseIndex][round[phaseIndex]]}}
                      <br>|
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="row" v-if="roomInfo.currentCardIndex >= endingIndex">
              <div class="col-sm" v-html="customOptions.pastPromptCoda ? customOptions.pastPromptCoda : null">
              </div>
            </div>
          </div>
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
  </div>
</template>

<script>
import { roomsCollection } from '../../firebase';
import axios from 'axios'
import ExtensionManager from "../extensions/ExtensionManager.vue";
import RoomLink from '../layout/RoomLink.vue';

export default {
  name: 'app-phases',
  components: {
    "app-extensionManager": ExtensionManager,
    'app-roomLink': RoomLink,
  },
  props: {
    roomID: String,
    gSheetID: String
  },
  data: function(){
    return {
      roomInfo: {
        currentCardIndex: 0,
        currentPhase: 0,
        xCardIsActive: false,
        cardSequence: [0,1,2],
        skipToEnding: false,
        lastSeenRound: 0,
        lastSeenPhase: 0, 
      },
      customOptions: {},
      dataReady: false,
      firebaseReady: false,
      tempExtensionData: { test: null },
      gSheet: [{text:"loading"}],
      numberOfPhases: 0,
      phaseNames: [],
      phaseData: [],
      orderedCards: [],
      unorderedCards: [],
      firstNonInstruction: 0,
      endingIndex: 0,
      error: false,
    }
  },
  mounted(){
    this.fetchAndCleanSheetData(this.gSheetID);

    this.$bind('roomInfo', roomsCollection.doc(this.roomID))
      .then(() => {
        this.firebaseReady = true
      })
      .then(() => {
        if (!this.roomInfo){
          console.log("new room!")

          roomsCollection.doc(this.roomID).set({currentCardIndex:0, xCardIsActive: false,extensionData: this.tempExtensionData, cardSequence:[0,1,2], currentPhase: 0, skipToEnding: false, lastSeenRound: 0, lastSeenPhase: 0})

          if(this.dataReady){this.shuffle();}
        }
      })
      .catch((error) => {
        console.log('error in loading: ', error)
      })
  },
  methods: {
    closeMenu(){
      this.$bvModal.hide("menuModal");
    },
    copyLinkToClipboard(){
      let currentUrl = location.hostname.toString() + this.$route.fullPath
      navigator.clipboard.writeText(currentUrl).then(function() {
        console.log('copied url')
      }, function() {
        console.log('copy failed')
      });
    },
    previousCard(){
      if (Number.isInteger(this.roomInfo.cardSequence[this.roomInfo.currentCardIndex])){
        if (this.roomInfo.cardSequence[this.roomInfo.currentCardIndex] >= this.phaseData[0].length){
          this.roomInfo.currentCardIndex -= 1
          this.roomInfo.currentPhase = this.numberOfPhases - 1
        } else {
          this.roomInfo.currentCardIndex -= 1
          this.roomInfo.currentPhase = 0
        }
      } else if (this.roomInfo.currentPhase == 0){      
        this.roomInfo.currentPhase = this.numberOfPhases - 1
        this.roomInfo.currentCardIndex -= 1
      } else {
        this.roomInfo.currentPhase -= 1
      }

      let lastSeenRound = (this.roomInfo.currentCardIndex > this.endingIndex) ? this.roomInfo.lastSeenRound : this.roomInfo.currentCardIndex
      let lastSeenPhase = (this.roomInfo.currentCardIndex > this.endingIndex) ? this.roomInfo.lastSeenPhase : this.roomInfo.currentPhase
      
      roomsCollection.doc(this.roomID).update({
        currentCardIndex: this.roomInfo.currentCardIndex,
        lastSeenRound: lastSeenRound,
        currentPhase: this.roomInfo.currentPhase,
        lastSeenPhase: lastSeenPhase,
      })
    },
    nextCard(){
      if (this.roomInfo.cardSequence.length == 1){
        this.shuffle();
      }

      if (Number.isInteger(this.roomInfo.cardSequence[this.roomInfo.currentCardIndex])){
        this.roomInfo.currentCardIndex += 1
        this.roomInfo.currentPhase = 0
      } else if (this.roomInfo.currentPhase < this.numberOfPhases - 1){
        this.roomInfo.currentPhase += 1
      } else {
        this.roomInfo.currentPhase = 0;
        this.roomInfo.currentCardIndex += 1
      }

      let lastSeenRound = (this.roomInfo.currentCardIndex > this.endingIndex) ? this.roomInfo.lastSeenRound : this.roomInfo.currentCardIndex
      let lastSeenPhase = (this.roomInfo.currentCardIndex > this.endingIndex) ? this.roomInfo.lastSeenPhase : this.roomInfo.currentPhase

      roomsCollection.doc(this.roomID).update({
        currentCardIndex: this.roomInfo.currentCardIndex,
        lastSeenRound: lastSeenRound,
        currentPhase: this.roomInfo.currentPhase,
        lastSeenPhase: lastSeenPhase,
      })
    },
    skipInstructions(){
      roomsCollection.doc(this.roomID).update({
        currentCardIndex: this.firstNonInstruction,
        lastSeenRound: this.firstNonInstruction,
        currentPhase: 0,
        lastSeenPhase: 0
      })
    },
    ending(){
      if (this.roomInfo.cardSequence.length == 1){
        this.shuffle();
      }

      roomsCollection.doc(this.roomID).update({
        lastSeenRound: this.roomInfo.currentCardIndex,
        lastSeenPhase: this.roomInfo.currentPhase,
        currentCardIndex: this.endingIndex,
        skipToEnding: true
      })
    },
    xCard(){
      roomsCollection.doc(this.roomID).update({
        xCardIsActive: !this.roomInfo.xCardIsActive
      })
    },
    shuffle(){
      this.$bvModal.hide('reshuffleConfirm')

      // reset card count
      roomsCollection.doc(this.roomID).update({
        currentCardIndex: 0,
        currentPhase: 0
      })

      // Create a ordered array
      var initialCardSequence = []
      var finalCardSequence = []
      var shuffledCards = []

      // add in the ordered cards
      for (var i = 0; i < this.gSheet.length; i++) {
        if (this.gSheet[i].ordered == 0){
          initialCardSequence.push(i)
        } else if (this.gSheet[i].ordered == 2) {
          finalCardSequence.push(i)
        }
      }

      // Shuffle deck function
      var shuffleDeck = function (deck){
        for (var n = deck.length - 1; n > 0; n--) {
          let j = Math.floor(Math.random() * (n + 1));
          [deck[n], deck[j]] = [deck[j], deck[n]];
        }
        return deck
      }

      // create an array of the number of rounds
      var numberOfRounds = []
      
      for (var j = 0; j < this.phaseData.length; j++) {
        numberOfRounds.push([])
        for (i = 0; i < this.phaseData[0].length; i++){
          numberOfRounds[j].push(i);
        }
        numberOfRounds[j] = shuffleDeck(numberOfRounds[j])
      }

      var newEmptyCard
      for (i = 0; i < this.phaseData[0].length; i++) {
        newEmptyCard = {};
        for (j = 0; j < this.numberOfPhases; j++){
          newEmptyCard[j] = numberOfRounds[j][i]
        }

        shuffledCards.push(newEmptyCard)
      }



      // sync the shuffled array
      roomsCollection.doc(this.roomID).update({
        cardSequence: initialCardSequence.concat(shuffledCards).concat(finalCardSequence)
      })

    },
    syncExtension() {
      roomsCollection.doc(this.roomID).update({
        extensionData: this.roomInfo.extensionData,
      });
    },
    fetchAndCleanSheetData(sheetID){

      // Remove for published version
      if (!sheetID || sheetID == 'demo') {
        sheetID = '1HataDfV2lrA4hfzmLgDjXH09dEMLQV6OT10tVH9G52A'
      }

      // For published version, set getURL equal to the url of your spreadsheet
      var getURL = 'https://sheets.googleapis.com/v4/spreadsheets/' + sheetID + '?includeGridData=true&ranges=a1:aa400&key='  + process.env.VUE_APP_FIREBASE_API_KEY


      // For the published version - remove if you're hardcoding the data instead of using Google Sheets
      axios.get(getURL)
      .then(response => {

        var cleanData = []
        var gRows = response.data.sheets[0].data[0].rowData

        this.numberOfPhases = gRows[0].values.length - 3
        
        for (var w = 0; w < this.numberOfPhases; w++) {
          this.phaseData.push([])
          this.phaseNames.push(gRows[0].values[w+3].formattedValue)
        }

        var newEndingIndex = 0

        // Transform Sheets API response into cleanData
        gRows.forEach((item, i) => {
          if (i !== 0 && item.values[0].formattedValue){
            
            // Handle options
            if (item.values[0].formattedValue == "option"){
              this.customOptions[item.values[1].formattedValue] = item.values[2].formattedValue
              if (item.values[1].formattedValue == "phaseHelpText"){
                this.customOptions.phaseHelpText = this.customOptions.phaseHelpText.split('|')
              } else if (item.values[1].formattedValue == "showPastPrompts") {
                this.customOptions.showPastPrompts = this.customOptions.showPastPrompts.split(',')
              }
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

            // Get count of instruction cards
            if (item.values[0].formattedValue == 0){
              this.firstNonInstruction += 1
            }

            // Get ending index
            if ((item.values[0].formattedValue == 0 || item.values[0].formattedValue == 1) && this.endingIndex == 0){
              newEndingIndex += 1
            }

            var rowInfo = {}
            if (item.values[0].formattedValue >= 0){
              rowInfo = {
                ordered: item.values[0].formattedValue,
                headerText: item.values[1].formattedValue,
                bodyText: item.values[2].formattedValue
              }
              cleanData.push(rowInfo)
            }

            if (item.values[0].formattedValue == 1){
              for (var j = 3; j < item.values.length; j++) {
                this.phaseData[j-3].push(item.values[j].formattedValue)
              }
            }
          }
        });

        this.endingIndex = newEndingIndex;

        // apply custom style to body
        let styleTemplate =
          "style-template-" + this.customOptions.styleTemplate;
        let body = document.getElementById("app"); // document.body;
        body.classList.add(styleTemplate);

        // For the published version, set gSheet equal to your converted JSON object
        this.gSheet = cleanData

        console.log('done fetching and cleaning data')
        this.dataReady = true;

        if (location.hostname.toString() !== 'localhost'){
          this.$mixpanel.track('Visit Game Session', {
            game_name: this.customOptions.gameTitle ?? 'untitled',
            session_url: location.hostname.toString() + this.$route.fullPath,
            format: 'Phases'
          });
        }
        
        if(this.firebaseReady && this.roomInfo.cardSequence.length < 4){this.shuffle();}

      }).catch(error => {
        this.gSheet = [
          {
            ordered: 0,
            headerText: "Error",
            bodyText:'Error loading the Google Sheet. Please make sure that the link is correct and that it is publicly viewable'
          }
        ]

        this.orderedCards = this.gSheet
        this.error = error
        console.log(error.message, error)
      })      
    }

  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->


<style scoped>

  .phases{
    margin:auto;
    padding-top: 1em;
    padding-bottom: 1em;
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

  .card-body{
    font-size: 1.5em;
    min-height: 11em;
  }

  .fade-enter-active, .fade-leave-active {
    transition: opacity .5s;
  }
  .fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
    opacity: 0;
  }
  .phase-help-text {
    font-size: 1rem;
    line-height: 1.5;    
  }
  .x-card-text {
    font-size: .5em;
    text-decoration: underline;
  }
</style>
