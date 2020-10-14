<template>
  <div class="slot-machine game-room container" v-if="roomInfo">

    <div class="row mb-4">
      <transition name="fade">
        <div class="btn-group col-sm" role="group" aria-label="Card Controls">

          <button class="btn btn-outline-dark" v-on:click="previousCard()" :disabled="roomInfo.xCardIsActive || roomInfo.currentCardIndex == 0">Previous Card</button>
          <button class="btn btn-outline-primary" v-on:click="nextCard()" :disabled="roomInfo.xCardIsActive || roomInfo.currentCardIndex == gSheet.length - 1">Next Card</button>
        </div>
      </transition>
    </div>

    <div v-if="gSheet[roomInfo.cardSequence[roomInfo.currentCardIndex]]" class="mb-4">
      <transition name="fade">
        <div class="card d-flex shadow">

          <div class="card-body justify-content-center mt-4" style="white-space: pre-line" v-if="!roomInfo.xCardIsActive">
            <h1>{{ gSheet[roomInfo.cardSequence[roomInfo.currentCardIndex]].headerText }}</h1>
            <p class="mt-4 mb-4" v-html="gSheet[roomInfo.cardSequence[roomInfo.currentCardIndex]].bodyText"></p>
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
          <button class="btn btn-outline-dark" :disabled="roomInfo.currentCardIndex == gSheet.length - 1 || roomInfo.xCardIsActive" v-on:click="lastCard()">Last Card</button>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import { roomsCollection } from '../firebase';
import axios from 'axios'

export default {
  name: 'app-slotMachine',
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
      dataReady: false,
      gSheet: [{text:"loading"}],
      numberOfWheels: 0,
      wheels: [],
      orderedCards: [],
      unorderedCards: []
    }
  },
  mounted(){
    this.fetchAndCleanSheetData(this.gSheetID);

    this.$bind('roomInfo', roomsCollection.doc(this.roomID))
      .then(() => {
        this.dataReady = true
      })
      .then(() => {
        if (!this.roomInfo){
          console.log("new room!")

          roomsCollection.doc(this.roomID).set({currentCardIndex:0,xCardIsActive: false, cardSequence:[0,1,2]})

          this.shuffle();
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

      for (var i = 0; i < this.orderedCards.length; i++) {
        newCardSequence.push(i)
      }

      for (i = 0; i < this.unorderedCards.length; i++) {
        shuffledCards.push(i+this.orderedCards.length)
      }

      // Shuffle array
      for (i = shuffledCards.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [shuffledCards[i], shuffledCards[j]] = [shuffledCards[j], shuffledCards[i]];
      }

      // Add the final card
      shuffledCards.push(this.gSheet.length-1)

      // sync the shuffled array
      roomsCollection.doc(this.roomID).update({
        cardSequence: newCardSequence.concat(shuffledCards)
      })

    },
    fetchAndCleanSheetData(sheetID){

      // Remove for published version
      if (!sheetID || sheetID == 'demo') {
        sheetID = '1t5LRUQG9DzMJ3kd8E9DZV7_EbE8J5-Gqhz7TWQ4Y-uU'
      }

      // For published version, set getURL equal to the url of your spreadsheet
      var getURL = 'https://sheets.googleapis.com/v4/spreadsheets/' + sheetID + '?includeGridData=true&ranges=a1:aa100&key=AIzaSyDsIM5nJ3hNoVRCSd3kJXfrAL8_n9gwFdM'


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

            if (item.values[0]==0){
              var rowInfo = {
                ordered: item.values[0].formattedValue,
                headerText: item.values[1].formattedValue,
                bodyText: item.values[2].formattedValue
              }
              cleanData.push(rowInfo)
            }

            if (item.values[0] != 0){
              for (var j = 3; j < item.values.length; j++) {
                this.wheels[j-3].push(item.values[j])
              }
            }
          }
        });

        // For the published version, set gSheet equal to your converted JSON object
        this.gSheet = cleanData

      }).catch(error => {
        this.gSheet = [
          {
            ordered: 0,
            headerText: "Error",
            bodyText:'Error loading the Google Sheet. Please make sure that the link is correct and that it is publicly viewable'
          }
        ]

        this.orderedCards = this.gSheet
        console.log(error.message)
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
</style>
