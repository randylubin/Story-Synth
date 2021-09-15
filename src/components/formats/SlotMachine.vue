<template>
  <div class="slot-machine game-room container" v-if="roomInfo">
    <div class="full-page-background"></div>
    <div v-html="customOptions.style"></div>

    <div class="game-meta">
      <div class="mb-4" v-if="customOptions.gameTitle || customOptions.byline">
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
          :extensionLocation="'upper'"
          class="extension-upper"
        ></app-extensionManager>
      </div>

    <div class="row mb-4">
      <transition name="fade">
        <div class="btn-group col-sm" role="group" aria-label="Card Controls">

          <button class="btn btn-outline-dark" v-on:click="previousCard()" :disabled="roomInfo.xCardIsActive || roomInfo.currentCardIndex == 0">Previous Card</button>
          <button class="btn btn-outline-primary" v-on:click="nextCard()" :disabled="roomInfo.xCardIsActive || roomInfo.currentCardIndex == gSheet.length - 1">Next Card</button>
        </div>
      </transition>
    </div>

    <div class="row mb-4" v-if="customOptions.instructionsProgressBar && roomInfo.currentCardIndex < firstNonInstruction && roomInfo.currentCardIndex != 0">
      <div class="col-sm">
        <h2>Instructions</h2>
        <b-progress :value="roomInfo.currentCardIndex" :max="firstNonInstruction - 1" variant="dark"></b-progress>
      </div>
    </div>

    <div v-if="gSheet[roomInfo.cardSequence[roomInfo.currentCardIndex]] || Object.prototype.toString.call(roomInfo.cardSequence[roomInfo.currentCardIndex]) === '[object Object]'" class="mb-4">
      <transition name="fade">
        <div class="card d-flex shadow img-fluid" v-bind:class="{'bg-transparent': (customOptions.coverImage && roomInfo.currentCardIndex == 0)}">
          <img v-bind:src="customOptions.coverImage" class="card-img-top" style="width:100%" v-if="customOptions.coverImage && roomInfo.currentCardIndex == 0">
          <img v-bind:src="customOptions.cardBackgroundImage" class="card-img-top card-background" style="width:100%" v-if="customOptions.cardBackgroundImage && (!customOptions.coverImage || roomInfo.currentCardIndex != 0)">
          <div class="card-body text-center" v-if="(!dataReady || !firebaseReady) && !error">
            <h1 class="m-5">Loading</h1>
            <b-spinner class="m-5" style="width: 4rem; height: 4rem;" label="Busy"></b-spinner>
          </div>

          <div class="card-body justify-content-center mt-4" style="white-space: pre-line" v-if="!roomInfo.xCardIsActive && (!customOptions.coverImage || roomInfo.currentCardIndex != 0)" v-bind:class="{'card-body': !customOptions.cardBackgroundImage, 'card-img-overlay': customOptions.cardBackgroundImage }">
            
            <div v-if="gSheet[roomInfo.cardSequence[roomInfo.currentCardIndex]]">
              <h1>{{ gSheet[roomInfo.cardSequence[roomInfo.currentCardIndex]].headerText }}</h1>
              <p class="mt-4 mb-4" v-html="gSheet[roomInfo.cardSequence[roomInfo.currentCardIndex]].bodyText"></p>
            </div>

            <div v-if="Object.prototype.toString.call(roomInfo.cardSequence[roomInfo.currentCardIndex]) === '[object Object]'">
              <div v-for="(index) in numberOfWheels" v-bind:key="index" v-html="wheels[index-1][roomInfo.cardSequence[roomInfo.currentCardIndex][index-1]]">
                
              </div>
            </div>
            
          </div>
          
          <div class="card-body align-items-center justify-content-center" v-if="roomInfo.xCardIsActive" v-bind:class="{'card-body': !customOptions.cardBackgroundImage, 'card-img-overlay': customOptions.cardBackgroundImage }">
            <div class="mt-5 pt-5 mb-5">
              <h1 v-if="!customOptions.safetyCardText">X-Card</h1>
              <div class="safety-card-tet" v-html="customOptions.safetyCardText" v-if="customOptions.safetyCardText"></div> 
            </div>
            <button class="btn btn-outline-dark mt-5" v-on:click="xCard()">Continue</button>
            <div class="" v-if="!customOptions.safetyCardText">
              <a class="x-card-text" href="http://tinyurl.com/x-card-rpg">About the X-Card</a>
            </div>
          </div>

        </div>
      </transition>
    </div>

    <div class="btn-container" style>
      <div class="row mb-4">
        <div class="btn-group col-sm" role="group" aria-label="Deck Controls">
          <button class="btn btn-outline-dark" :disabled="roomInfo.xCardIsActive" v-on:click="shuffle()" color="rgb(187, 138, 200)">Re-shuffle</button>
          <b-button variant="outline-dark" v-on:click="xCard()" v-html="customOptions.safetyCardButton ? customOptions.safetyCardButton : 'X-Card'">X-Card</b-button>
          <button class="btn btn-outline-dark" :disabled="roomInfo.currentCardIndex == gSheet.length - 1 || roomInfo.xCardIsActive" v-on:click="lastCard()">Last Card</button>
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

    <div class="row">
        <div class="btn-group col-sm" role="group" aria-label="Extra Info" v-if="customOptions.modalOneLabel || customOptions.modalTwoLabel">
          <b-button v-b-modal.modalOne variant="outline-dark" v-if="customOptions.modalOneLabel">{{customOptions.modalOneLabel}}</b-button>

          <b-modal id="modalOne" v-bind:title="customOptions.modalOneLabel" hide-footer>
            <div class="d-block text-left" v-html="customOptions.modalOneText">
              
            </div>
          </b-modal>

          <b-button v-b-modal.modalTwo variant="outline-dark" v-if="customOptions.modalTwoLabel">{{customOptions.modalTwoLabel}}</b-button>

          <b-modal id="modalTwo" v-bind:title="customOptions.modalTwoLabel" hide-footer>
            <div class="d-block text-left" v-html="customOptions.modalTwoText">
            </div>
          </b-modal>
        </div>
      </div> 

  </div>
</template>

<script>
import { roomsCollection } from '../../firebase';
import ExtensionManager from "../extensions/ExtensionManager.vue";
import axios from 'axios'

export default {
  name: 'app-slotMachine',
  components: {
    "app-extensionManager": ExtensionManager,
  },
  props: {
    roomID: String,
    gSheetID: String
  },
  data: function(){
    return {
      roomInfo: {
        currentCardIndex: 0,
        xCardIsActive: false,
        cardSequence: [0,1,2]
      },
      firstNonInstruction: 0,
      dataReady: false,
      firebaseReady: false,
      gSheet: [{text:"loading"}],
      numberOfWheels: 0,
      wheels: [],
      orderedCards: [],
      unorderedCards: [],
      customOptions: {},
      tempExtensionData: { test: null },
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

          roomsCollection.doc(this.roomID).set({extensionData: this.tempExtensionData, currentCardIndex:0,xCardIsActive: false, cardSequence:[0,1,2]})

          if(this.dataReady){this.shuffle();}
        }
      })
      .catch((error) => {
        console.log('error in loading: ', error)
      })
  },
  methods: {
    previousCard(){
      roomsCollection.doc(this.roomID).update({
        currentCardIndex: this.roomInfo.currentCardIndex -= 1
      })
    },
    nextCard(){
      if (this.roomInfo.cardSequence.length == 1){
        this.shuffle();
      }
      roomsCollection.doc(this.roomID).update({
        currentCardIndex: this.roomInfo.currentCardIndex += 1
      })
    },
    lastCard(){
      if (this.roomInfo.cardSequence.length == 1){
        this.shuffle();
      }

      roomsCollection.doc(this.roomID).update({
        currentCardIndex: this.gSheet.length -1
      })
    },
    xCard(){
      roomsCollection.doc(this.roomID).update({
        xCardIsActive: !this.roomInfo.xCardIsActive
      })
    },
    shuffle(){

      // reset card count
      roomsCollection.doc(this.roomID).update({
        currentCardIndex: 0
      })

      // Create a ordered array
      var newCardSequence = []
      var shuffledCards = []

      // add in the ordered cards
      for (var i = 0; i < this.gSheet.length; i++) {
        if (this.gSheet[i].ordered == 0){
          newCardSequence.push(i)
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

      // create an array of the wheel length
      var wheelsIndexArray = []
      
      for (var j = 0; j < this.wheels.length; j++) {
        wheelsIndexArray.push([])
        for (i = 0; i < this.wheels[0].length; i++){
          wheelsIndexArray[j].push(i);
        }
        wheelsIndexArray[j] = shuffleDeck(wheelsIndexArray[j])
      }

      var newEmptyCard
      for (i = 0; i < this.wheels[0].length; i++) {
        newEmptyCard = {};
        for (j = 0; j < this.numberOfWheels; j++){
          newEmptyCard[j] = wheelsIndexArray[j][i]
        }

        shuffledCards.push(newEmptyCard)
      }

      // add shuffled cards to array
      newCardSequence = newCardSequence.concat(shuffledCards)

      // add last cards
      for (var l = 0; l < this.gSheet.length; l++) {
        if (this.gSheet[l].ordered >= 2){
          newCardSequence.push(l)
        }
      }

      // sync the shuffled array
      roomsCollection.doc(this.roomID).update({
        cardSequence: newCardSequence,
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
        sheetID = '1t5LRUQG9DzMJ3kd8E9DZV7_EbE8J5-Gqhz7TWQ4Y-uU'
      }

      // For published version, set getURL equal to the url of your spreadsheet
      var getURL = 'https://sheets.googleapis.com/v4/spreadsheets/' + sheetID + '?includeGridData=true&ranges=a1:aa100&key=' + process.env.VUE_APP_FIREBASE_API_KEY


      // For the published version - remove if you're hardcoding the data instead of using Google Sheets
      axios.get(getURL)
      .then(response => {

        var cleanData = []
        var gRows = response.data.sheets[0].data[0].rowData

        this.numberOfWheels = gRows[0].values.length - 3
        
        for (var w = 0; w < this.numberOfWheels; w++) {
          this.wheels.push([])
        }

        // Transform Sheets API response into cleanData
        gRows.forEach((item, i) => {
          if (i !== 0 && item.values[0].formattedValue){

            // Handle options
            if (item.values[0].formattedValue == "option"){
              this.customOptions[item.values[1].formattedValue] = item.values[2].formattedValue
              console.log(item.values[2].formattedValue)
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

            if (item.values[0].formattedValue !== "option" && item.values[0].formattedValue !== "extension"){

              var rowInfo = {}
              if (item.values[0].formattedValue >= 0){
                rowInfo = {
                  ordered: item.values[0].formattedValue,
                  headerText: item.values[1].formattedValue,
                  bodyText: item.values[2].formattedValue
                }
                cleanData.push(rowInfo)

                if (item.values[0].formattedValue == 0){
                  this.firstNonInstruction += 1
                }

                if (item.values[0].formattedValue == 1){
                  for (var j = 3; j < item.values.length; j++) {
                    this.wheels[j-3].push(item.values[j].formattedValue)
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
        this.gSheet = cleanData

        console.log('done fetching and cleaning data')
        this.dataReady = true;

        if (location.hostname.toString() !== 'localhost'){
          this.$mixpanel.track('Visit Game Session', {
            game_name: this.customOptions.gameTitle ?? 'untitled',
            session_url: location.hostname.toString() + this.$route.fullPath,
            format: 'Slot Machine'
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

  .slot-machine{

    margin:auto;
    padding-top: 1em;
    padding-bottom: 1em;
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
  .x-card-text {
    font-size: .5em;
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
