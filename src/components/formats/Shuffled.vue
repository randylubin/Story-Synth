<template>
  <div class="shuffled game-room container" v-if="roomInfo">
    <div v-html="customOptions.style"></div>

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

    <div class="row mb-4">
      <transition name="fade">
        <div class="btn-group col-sm" role="group" aria-label="Card Controls">

          <button class="btn btn-outline-dark" v-on:click="previousCard()" :disabled="roomInfo.xCardIsActive || roomInfo.currentCardIndex == 0">Previous Card</button>
          <button class="btn btn-outline-primary" v-on:click="nextCard()" :disabled="roomInfo.xCardIsActive || roomInfo.currentCardIndex >= roomInfo.locationOfLastCard">Next Card</button>
        </div>
      </transition>
    </div>

    <div v-if="gSheet[roomInfo.cardSequence[roomInfo.currentCardIndex]]" class="mb-4">
      <transition name="fade">
        <div class="card d-flex shadow">
          <div class="card-body text-center" v-if="(!dataReady || !firebaseReady) && !error">
            <h1 class="m-5">Loading</h1>
            <b-spinner class="m-5" style="width: 4rem; height: 4rem;" label="Busy"></b-spinner>
          </div>

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
        <div class="col-sm">
          <b-button-group aria-role="Deck control" class="d-flex w-100">
            <b-button variant="outline-dark" :disabled="roomInfo.xCardIsActive" v-on:click="shuffleAndResetGame()" color="rgb(187, 138, 200)">Re-shuffle</b-button>
            <b-button variant="outline-dark" v-on:click="xCard()">X-Card</b-button>
            <!--<b-button variant="outline-dark" v-on:click="nextDeck()">Next Deck</b-button>-->
            <b-dropdown variant="outline-dark" id="dropdown-1" text="Last Card" :disabled="roomInfo.xCardIsActive || roomInfo.currentCardIndex == gSheet.length - 1 || roomInfo.currentCardIndex == roomInfo.locationOfLastCard" right>
              <b-dropdown-item v-on:click="lastCard()">Go to last card</b-dropdown-item>
              <b-dropdown-item v-on:click="shuffleLastCard('center')">Shuffle near center</b-dropdown-item>
              <b-dropdown-item v-on:click="shuffleLastCard('end')">Shuffle near end</b-dropdown-item>
            </b-dropdown>
          </b-button-group>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import { roomsCollection } from '../../firebase';
import axios from 'axios'

export default {
  name: 'app-shuffled',
  props: {
    roomID: String,
    gSheetID: String
  },
  data: function(){
    return {
      roomInfo: {
        currentCardIndex: 0,
        xCardIsActive: false,
        cardSequence: [0,1,2],
        locationOfLastCard: 0,
      },
      dataReady: false,
      firebaseReady: false,
      gSheet: [{text:"loading"}],
      orderedCards: [],
      currentDeck: 0,
      totalDecks: 0,
      unorderedDecks: {},
      customOptions: {},
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

          roomsCollection.doc(this.roomID).set({currentCardIndex:0,xCardIsActive: false, cardSequence:[0,1,2]})

          if(this.dataReady){this.shuffleAndResetGame();}
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
        this.shuffleAndResetGame();
      }
      roomsCollection.doc(this.roomID).update({
        currentCardIndex: this.roomInfo.currentCardIndex += 1
      })
    },
    lastCard(){
      if (this.roomInfo.cardSequence.length == 1){
        this.shuffleAndResetGame();
      }

      roomsCollection.doc(this.roomID).update({
        currentCardIndex: this.roomInfo.locationOfLastCard
      })
    },
    xCard(){
      roomsCollection.doc(this.roomID).update({
        xCardIsActive: !this.roomInfo.xCardIsActive
      })
    },
    nextDeck(){
      //TODO
    },
    shuffleLastCard(location){
      
      var tempLastCardIndex = this.roomInfo.cardSequence.splice(this.roomInfo.locationOfLastCard,1)
      var tempNewLastCardLocation = 0
      
      switch(location){
        case "center":
          tempNewLastCardLocation = Math.floor((this.roomInfo.cardSequence.length - this.orderedCards.length)/2) + this.orderedCards.length + Math.floor((Math.random()*4)-2)
          break;
        case "end":
          tempNewLastCardLocation = this.roomInfo.cardSequence.length - Math.floor(Math.random()*4)
          break;
      }
      
      this.roomInfo.cardSequence.splice(tempNewLastCardLocation,0,tempLastCardIndex[0])
      console.log(this.roomInfo.cardSequence)
      
      roomsCollection.doc(this.roomID).update({
        cardSequence: this.roomInfo.cardSequence,
        locationOfLastCard: tempNewLastCardLocation,
      })

    },
    shuffleAndResetGame(){
      console.log('shuffling')
      
      // reset card count
      roomsCollection.doc(this.roomID).update({
        currentCardIndex: 0,
        locationOfLastCard:0
      })

      // Create a ordered array
      var newCardSequence = []

      // Add the ordered cards first
      for (var i = 0; i < this.orderedCards.length; i++) {
        newCardSequence.push(i)
      }

      // Shuffle deck function
      var shuffleDeck = function (deck){
        for (var n = deck.length - 1; n > 0; n--) {
          let j = Math.floor(Math.random() * (n + 1));
          [deck[n], deck[j]] = [deck[j], deck[n]];
        }
        return deck
      }

      // Shuffle each deck (except the first) and add it to the sequence
      for (var k = 1; k < this.totalDecks; k++){
        newCardSequence = newCardSequence.concat(shuffleDeck(this.unorderedDecks[k]))
      }

      // sync the shuffled array
      roomsCollection.doc(this.roomID).update({
        cardSequence: newCardSequence,
        locationOfLastCard: newCardSequence.length - 1,
      })

    },
    fetchAndCleanSheetData(sheetID){

      // Remove for published version
      if (!sheetID || sheetID == 'demo') {
        sheetID = '1N5eeyKTVWo5QeGcUV_zYtwtR0DikJCcvcj6w69UkC1w'
      }

      // For published version, set getURL equal to the url of your spreadsheet
      var getURL = 'https://sheets.googleapis.com/v4/spreadsheets/' + sheetID + '?includeGridData=true&ranges=a1:aa100&key=AIzaSyDsIM5nJ3hNoVRCSd3kJXfrAL8_n9gwFdM'


      // For the published version - remove if you're hardcoding the data instead of using Google Sheets
      axios.get(getURL)
      .then(response => {

        var cleanData = []
        var gRows = response.data.sheets[0].data[0].rowData

        // Transform Sheets API response into cleanData
        gRows.forEach((item, i) => {
          if (i !== 0 && item.values[0].formattedValue){

            var rowInfo = {
              ordered: item.values[0].formattedValue,
              headerText: item.values[1].formattedValue,
              bodyText: item.values[2].formattedValue
            }

            cleanData.push(rowInfo)

            if (rowInfo.ordered >= this.totalDecks) {
              this.totalDecks = parseInt(rowInfo.ordered) + 1;
            }

          }
        });

        this.unorderedDecks = [];
        for (var d = 0; d < this.totalDecks; d++){
          this.unorderedDecks.push([])
        }

        // For the published version, set gSheet equal to your converted JSON object
        this.gSheet = cleanData

        // Sort cleanData into ordered and unordered decks
        cleanData.forEach((item, index) => {
          if (item.ordered == "0") {
            this.orderedCards.push(item)
          } else {
            this.unorderedDecks[item.ordered].push(index)
          }
        });

        console.log('done fetching and cleaning data')
        this.dataReady = true;

        if(this.firebaseReady  && this.roomInfo.cardSequence.length < 4){this.shuffleAndResetGame();}

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
  body {
    background: #74ebd5;  /* fallback for old browsers */
    background: -webkit-linear-gradient(to top, #ACB6E5, #74ebd5);  /* Chrome 10-25, Safari 5.1-6 */
    background: linear-gradient(to top, #ACB6E5, #74ebd5); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
    max-width: 600px;
    margin:auto;
  }

  .shuffled{

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
