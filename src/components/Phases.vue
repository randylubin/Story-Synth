<template>
  <div class="phases game-room container" v-if="roomInfo">

    <div class="row mb-4">
      <transition name="fade">
        <div class="btn-group col-sm" role="group" aria-label="Card Controls">

          <button class="btn btn-outline-dark" v-on:click="previousCard()" :disabled="roomInfo.xCardIsActive || roomInfo.currentCardIndex == 0">Previous Card</button>
          <button class="btn btn-outline-primary" v-on:click="nextCard()" :disabled="roomInfo.xCardIsActive || roomInfo.currentCardIndex == gSheet.length - 1 || (roomInfo.currentCardIndex == gSheet.length - 1 && roomInfo.currentPhase == numberOfPhases -1)">Next Card</button>
        </div>
      </transition>
    </div>

    <div v-if="gSheet[roomInfo.cardSequence[roomInfo.currentCardIndex]] || Object.prototype.toString.call(roomInfo.cardSequence[roomInfo.currentCardIndex]) === '[object Object]'" class="mb-4">
      <transition name="fade">
        <div class="card d-flex shadow">

          <div class="card-body justify-content-center mt-4" style="white-space: pre-line" v-if="!roomInfo.xCardIsActive">
            
            <div v-if="gSheet[roomInfo.cardSequence[roomInfo.currentCardIndex]]">
              <h1>{{ gSheet[roomInfo.cardSequence[roomInfo.currentCardIndex]].headerText }}</h1>
              <p class="mt-4 mb-4 text-left" v-html="gSheet[roomInfo.cardSequence[roomInfo.currentCardIndex]].bodyText"></p>
            </div>

            <div v-if="Object.prototype.toString.call(roomInfo.cardSequence[roomInfo.currentCardIndex]) === '[object Object]'">
              <!--<div v-for="(index) in numberOfPhases" v-bind:key="index" v-html="phaseData[index-1][roomInfo.cardSequence[roomInfo.currentCardIndex][index-1]]">
              </div>-->
              <h2>{{phaseNames[roomInfo.currentPhase]}}</h2>
              <div v-html="phaseData[roomInfo.currentPhase][roomInfo.cardSequence[roomInfo.currentCardIndex][roomInfo.currentPhase]]"></div>
            </div>
            
          </div>
          

          <div class="card-body align-items-center justify-content-center" v-if="roomInfo.xCardIsActive">
            <div class="mt-5 pt-5 mb-5">
              <h1>X-Card</h1>
            </div>
            <button class="btn btn-outline-dark mt-5" v-on:click="xCard()">Continue</button>
            <div class="">
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
          <button class="btn btn-outline-dark" v-on:click="xCard()">X-Card</button>
          <button class="btn btn-outline-dark" v-on:click="skipInstructions()" v-if="roomInfo.currentCardIndex < firstNonInstruction">Skip Instructions</button>
          <button class="btn btn-outline-dark" v-if="roomInfo.currentCardIndex >= firstNonInstruction" :disabled="roomInfo.currentCardIndex >= endingIndex || roomInfo.xCardIsActive" v-on:click="ending()">Ending</button>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import { roomsCollection } from '../firebase';
import axios from 'axios'

export default {
  name: 'app-phases',
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
        cardSequence: [0,1,2]
      },
      dataReady: false,
      firebaseReady: false,
      gSheet: [{text:"loading"}],
      numberOfPhases: 0,
      phaseNames: [],
      phaseData: [],
      orderedCards: [],
      unorderedCards: [],
      firstNonInstruction: 0,
      endingIndex: 0
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

          roomsCollection.doc(this.roomID).set({currentCardIndex:0, xCardIsActive: false, cardSequence:[0,1,2], currentPhase: 0})

          if(this.dataReady){this.shuffle();}
        }
      })
      .catch((error) => {
        console.log('error in loading: ', error)
      })
  },
  methods: {
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
      
      roomsCollection.doc(this.roomID).update({
        currentCardIndex: this.roomInfo.currentCardIndex,
        currentPhase: this.roomInfo.currentPhase
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

      roomsCollection.doc(this.roomID).update({
        currentCardIndex: this.roomInfo.currentCardIndex,
        currentPhase: this.roomInfo.currentPhase
      })
    },
    skipInstructions(){
      roomsCollection.doc(this.roomID).update({
        currentCardIndex: this.firstNonInstruction,
        currentPhase: 0
      })
    },
    ending(){
      if (this.roomInfo.cardSequence.length == 1){
        this.shuffle();
      }

      roomsCollection.doc(this.roomID).update({
        currentCardIndex: this.endingIndex
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
    fetchAndCleanSheetData(sheetID){

      // Remove for published version
      if (!sheetID || sheetID == 'demo') {
        sheetID = '1HataDfV2lrA4hfzmLgDjXH09dEMLQV6OT10tVH9G52A'
      }

      // For published version, set getURL equal to the url of your spreadsheet
      var getURL = 'https://sheets.googleapis.com/v4/spreadsheets/' + sheetID + '?includeGridData=true&ranges=a1:aa100&key=AIzaSyDsIM5nJ3hNoVRCSd3kJXfrAL8_n9gwFdM'


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

        // Transform Sheets API response into cleanData
        gRows.forEach((item, i) => {
          if (i !== 0 && item.values[0].formattedValue){
            
            // Get count of instruction cards
            if (item.values[0].formattedValue == 0){
              this.firstNonInstruction += 1
            }

            // Get ending index
            if (item.values[0].formattedValue == 2 && this.endingIndex == 0){
              this.endingIndex = i-1;
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

        // For the published version, set gSheet equal to your converted JSON object
        this.gSheet = cleanData

        console.log('done fetching and cleaning data')
        this.dataReady = true;
        
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
        console.log(error.message, error)
      })      
    }

  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->


<style scoped>
  body {
    background: #74ebd5;  /* fallback for old browsers */
    background: -webkit-linear-gradient(to top, #ACB6E5, #74ebd5);  /* Chrome 10-25, Safari 5.1-6 */
    background: linear-gradient(to top, #ACB6E5, #74ebd5); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
    max-width: 600px;
    margin:auto;
  }

  .phases{

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
</style>
