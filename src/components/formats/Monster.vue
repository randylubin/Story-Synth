<template>
  <div class="monster game-room container" v-if="roomInfo">
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

    <div class="btn-container" style>
      <div class="row mb-4">
        <div class="btn-group col-sm" role="group" aria-label="Deck Controls">
          <button class="btn btn-outline-dark" v-on:click="previousCard()" :disabled="roomInfo.xCardIsActive || roomInfo.currentCardIndex == 0">Previous</button>
          <button class="btn btn-outline-dark" v-html="
                  customOptions.safetyCardButton
                    ? customOptions.safetyCardButton
                    : 'Pause'
                " v-on:click="xCard()" :disabled="roomInfo.currentCardIndex == 0">Pause</button>
          <button class="btn btn-outline-dark" v-on:click="nextCard()" :disabled="roomInfo.xCardIsActive || roomInfo.currentCardIndex == gSheet[gSheet.length-1].ordered">
            <span v-if="roomInfo.currentCardIndex == 0">Start</span>
            <span v-if="roomInfo.currentCardIndex !== 0">Next</span>
          </button>
        </div>
      </div>
    </div>

    <div class="row mb-4" v-if="customOptions.instructionsProgressBar && roomInfo.currentCardIndex <= customOptions.instructionsProgressBar && roomInfo.currentCardIndex != 0">
      <div class="col-sm">
        <h2>Instructions</h2>
        <b-progress :value="roomInfo.currentCardIndex" :max="customOptions.instructionsProgressBar" variant="dark"></b-progress>
      </div>
    </div>

    <!--<h1 class="">{{roomInfo.roundTitle}}</h1>-->
    <h3 class="mb-4">{{roomInfo.roundInfo}} <span class="">{{roomInfo.roundProgress}}</span></h3>


    <div v-if="roomInfo.xCardIsActive" class="mb-4">
      <transition name="fade">
        <div class="card d-flex align-items-center shadow">
          <div class="card-title">
            <h1 v-if="!customOptions.safetyCardText">Pause</h1>
          </div>
          <div class="card-body align-items-center d-flex justify-content-center" v-if="!customOptions.safetyCardText">
            <h4>
              Talk about the direction of story, or revise some content, or adjust the tone. Once everyone is on the same page, resume play.
            </h4>
          </div>
          <div
            class="safety-card-text"
            v-html="customOptions.safetyCardText"
            v-if="customOptions.safetyCardText"
          ></div>

          <button class="btn btn-outline-dark mb-5" style="width:100px;" type="button" v-on:click="xCard()" :disabled="roomInfo.currentCardIndex == 0">Continue</button>
        </div>
      </transition>
    </div>


    <div v-if="!roomInfo.xCardIsActive">
      <div class="card shadow" v-if="(!dataReady || !firebaseReady) && !error">
        <div class="card-body text-center">
          <h1 class="m-5">Loading</h1>
          <b-spinner class="m-5" style="width: 4rem; height: 4rem;" label="Busy"></b-spinner>
        </div>
      </div>

      <div v-for="(row, index) in gSheet" v-bind:key="index">
        <transition name="fade">
          <div class="row mb-4" v-if="row.ordered == roomInfo.currentCardIndex">
            <div class="col-sm">
              <div class="card shadow img-fluid" v-bind:class="{'bg-transparent': (customOptions.coverImage && roomInfo.currentCardIndex == 0)}" v-on:click="updateClickedCard(index)" style="cursor:pointer">
                <img v-bind:src="customOptions.coverImage" class="card-img-top" style="width:100%" v-if="customOptions.coverImage && roomInfo.currentCardIndex == 0">
                <img v-bind:src="customOptions.cardBackgroundImage" class="card-img-top card-background" style="width:100%" v-if="customOptions.cardBackgroundImage && (!customOptions.coverImage || roomInfo.currentCardIndex != 0)">
                <div class="card-body" v-if="!customOptions.coverImage || index != 0" v-bind:class="{'card-body': !customOptions.cardBackgroundImage, 'card-img-overlay': customOptions.cardBackgroundImage }">
                    <div class="card-title" style="white-space: pre-line" v-if="!row.subtitle">
                      <div v-if="index == 0">
                        <h1 class="mt-4">{{row.archetype}}</h1>
                        <div v-html="row.characterDetail"></div>
                      </div>

                      <div v-if="index !== 0">
                        <p class="mt-4" style="white-space: pre-line" v-html="row.archetype"></p>
                        <div class="text-left" style="white-space: pre-line" v-html="row.characterDetail">

                        </div>
                      </div>

                    </div>

                    <h4 class="card-title" style="white-space: pre-line" v-if="row.subtitle">
                      {{row.archetype}}
                    </h4>
                    <h5 class="card-subtitle mb-4 text-muted">{{row.subtitle}}</h5>

                    <div class="card-text text-left" v-if="clickedCard == index || roomInfo.currentCardIndex == gSheet[gSheet.length-1].ordered" style="white-space: pre-line">

                      <h5>{{row.characterQuestion}}</h5>
                      <div v-html="row.characterDetail">
                        {{row.characterDetail}}
                      </div>
                      <h5 class="mt-4">{{row.keyQuestion}}</h5>
                      <div v-html="row.keyDetails">
                        {{row.keyDetails}}
                      </div>
                    </div>

                    <svg v-if="clickedCard !== index && (row.characterQuestion || (row.subtitle && row.characterDetail))" width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-plus-circle" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                      <path fill-rule="evenodd" d="M8 15A7 7 0 1 0 8 1a7 7 0 0 0 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                      <path fill-rule="evenodd" d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"/>
                    </svg>


                </div>
              </div>
            </div>
          </div>
        </transition>
      </div>
    </div>

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
import { roomsCollection } from '../../firebase';
import axios from 'axios'
import ExtensionManager from "../extensions/ExtensionManager.vue";

export default {
  name: 'app-monster',
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
        cardSequence: [0,1,2],
        roundInfo: "",
        roundProgress: "",
        roundTitle: ""
      },
      dataReady: false,
      firebaseReady: false,
      tempExtensionData: { test: null },
      gSheet: [{text:"loading"}],
      orderedCards: [],
      unorderedCards: [],
      clickedCard: -1,
      instructionCardCount: 0,
      gameRoundCount: 6,
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

          roomsCollection.doc(this.roomID).set({currentCardIndex:0,extensionData: this.tempExtensionData,xCardIsActive: false, cardSequence:[0,1,2]})
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
      this.updateRoundInfo();
    },
    nextCard(){
      roomsCollection.doc(this.roomID).update({
        currentCardIndex: this.roomInfo.currentCardIndex += 1
      })
      this.updateRoundInfo();
    },
    updateRoundInfo(){
      var newRoundInfo = ""
      var newRoundProgress =""
/* For the published version, this section adds instruction headers
      if (this.roomInfo.currentCardIndex == 0 || this.roomInfo.currentCardIndex == (this.instructionCardCount + this.gameRoundCount + 1)){
        newRoundInfo = ""
      } else if (this.roomInfo.currentCardIndex <= this.instructionCardCount){
        newRoundInfo = "Instructions";
        newRoundProgress = (this.roomInfo.currentCardIndex) + " of " + this.instructionCardCount
      //} else if (this.roomInfo.currentCardIndex > this.instructionCardCount) {
        //newRoundInfo = "Round";
        //newRoundProgress = (this.roomInfo.currentCardIndex - this.instructionCardCount) + " of " + this.gameRoundCount
      } else {
        newRoundInfo = ""
      }
*/
      var newRoundTitle = ""
      /* For the published version, this section adds round titles

      if (this.roomInfo.currentCardIndex > this.instructionCardCount) {
        switch (this.roomInfo.currentCardIndex - this.instructionCardCount){
          case 1:
            newRoundTitle = "A Glimpse of Trouble"
            break;
          case 2:
            newRoundTitle = "A Clueless Public"
            break;
          case 3:
            newRoundTitle = "It's Here!"
            break;
          case 4:
            newRoundTitle = "Not Helping..."
            break;
          case 5:
            newRoundTitle = "Down to the Wire"
            break;
          case 6:
            newRoundTitle = "It's All Over"
            break;
        }
      } else {
        newRoundTitle = ""
      }
      */

      roomsCollection.doc(this.roomID).update({
        roundInfo: newRoundInfo,
        roundProgress: newRoundProgress,
        roundTitle: newRoundTitle
      })
    },
    xCard(){
      roomsCollection.doc(this.roomID).update({
        xCardIsActive: !this.roomInfo.xCardIsActive
      })
    },
    updateClickedCard(index){
      if(this.gSheet[index].subtitle !== undefined){
        if(this.clickedCard == index){
          this.clickedCard=-1
        } else if (index !== 0 && index > this.instructionCardCount) {
          this.clickedCard=index
        }
      }
    },
    syncExtension() {
      roomsCollection.doc(this.roomID).update({
        extensionData: this.roomInfo.extensionData,
      });
    },
    fetchAndCleanSheetData(sheetID){
      if (!sheetID || sheetID == 'demo') {
        sheetID = '1NgNHy7Qe1R8KhGR2cOmJwL2aOl2tocBemW2HIAKjrvI'
      }

      var getURL = 'https://sheets.googleapis.com/v4/spreadsheets/' + sheetID + '?includeGridData=true&ranges=a1:aa100&key='  + process.env.VUE_APP_FIREBASE_API_KEY

      axios.get(getURL)
      .then(response => {

        var cleanData = []
        var gRows = response.data.sheets[0].data[0].rowData

        // Transform Sheets API response into cleanData
        gRows.forEach((item, i) => {
          if (i !== 0 && item.values[0] && item.values[0].formattedValue){
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

            if (item.values[0].formattedValue !== "option" &&
                item.values[0].formattedValue !== "extension"){

              var rowInfo = {
                ordered: item.values[0].formattedValue,
                archetype: item.values[1].formattedValue,
                subtitle: item.values[2].formattedValue,
                characterQuestion: item.values[3].formattedValue,
                characterDetail: item.values[4].formattedValue,
                keyQuestion: item.values[5].formattedValue,
                keyDetails: item.values[6].formattedValue
              }

              cleanData.push(rowInfo)
            }
          }
        });

        this.gSheet = cleanData

        // Sort cleanData into ordered and unordered decks
        cleanData.forEach((item) => {
          //if (item.ordered == "1") {
            this.orderedCards.push(item)
          /*} else if (item.ordered == "0") {
            this.unorderedCards.push(item)
          }*/
        });

        // apply custom style to body
        let styleTemplate =
          "style-template-" + this.customOptions.styleTemplate;
        let body = document.getElementById("app"); // document.body;
        body.classList.add(styleTemplate);

        this.dataReady = true
        if (location.hostname.toString() !== 'localhost'){
          this.$mixpanel.track('Visit Game Session', {
            game_name: this.customOptions.gameTitle ?? 'untitled',
            session_url: location.hostname.toString() + this.$route.fullPath,
            format: 'Shuffled'
          });
        }

      }).catch(error => {
        this.gSheet = [{text:'Error loading Google Sheet'}]
        this.error = error
        console.log(error)
      })
    }

  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->

<style scoped>

  body {
    background: #50a958;  /* fallback for old browsers */
    background: -webkit-linear-gradient(to top, #50a958, #b1f1b7);  /* Chrome 10-25, Safari 5.1-6 */
    background: linear-gradient(to top, #50a958, #b1f1b7); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
    max-width: 600px;
    height: 100%;
    margin: auto;
    background-repeat: no-repeat;
    background-attachment: fixed;
    font-family: 'Arvo', serif;
  }

  .fade-enter-active {
    transition: opacity .5s;
  }
  .fade-enter /* .fade-leave-active below version 2.1.8 */ {
    opacity: 0;
  }

  .fade-leave-active {
    transition: opacity 0s;
  }
  .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
    opacity: 0;
  }

  li {
    list-style-type: disc;
    display: list-item;
    margin-left: 20px;
  }

  .card-body{
    min-height: 11em;
  }

  .btn-warning {
    color: #212529;
    background-color: #c5a55f;
    border-color: #422d00;
  }

  .btn-warning:focus,
  .btn-warning.focus {
    box-shadow: 0 0 0 .2rem rgba(86, 68, 29, 0.5)
  }

  .btn-warning:hover {
    background-color: #c39736;
    border-color: #422d00;
  }

  .monster{

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
</style>
