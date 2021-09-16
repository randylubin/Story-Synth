<template>
  <div class="branching game-room container" v-if="roomInfo">
    <div class="full-page-background"></div>
    <div v-html="customOptions.style"></div>
    <div class="" v-if="roomInfo">
      <div
        class="mb-4 game-meta d-none d-sm-block"
        v-if="
          !customOptions.hideTitleInSession &&
            (customOptions.gameTitle || customOptions.byline)
        "
      >
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

      <!-- <div
        class="row mb-4 game-meta"
        v-if="
          customOptions.instructionsProgressBar &&
            roomInfo.currentCardIndex < firstNonInstruction &&
            roomInfo.currentCardIndex != 0
        "
      >
        <div class="col-sm">
          <h2>Instructions</h2>
          <b-progress
            :value="roomInfo.currentCardIndex"
            :max="firstNonInstruction - 1"
            variant="dark"
          ></b-progress>
        </div>
      </div> -->

      <!-- debug -->
      <!-- <div>
        cardHistory: {{roomInfo.cardHistory}}
      </div> -->
      <div>
        gameState: {{JSON.parse(roomInfo.gameVariables)}}
      </div>

      <div class="game-variables shadow card mb-4" v-if="roomInfo.gameVariables">
        <div class="my-3">
          <h2>Game State</h2>
          <div v-for="(variable, index) in JSON.parse(roomInfo.gameVariables).at(-1)" :key="index">
            {{variable.varLabel}}: {{variable.varValue}}
          </div>
        </div>
      </div>

      <div
        v-if="gSheet[roomInfo.currentCardIndex]"
        class="mb-4"
      >
        <transition name="fade">
          <div
            class="card main-card d-flex shadow img-fluid"
            v-bind:class="{
              'bg-transparent':
                customOptions.coverImage && roomInfo.currentCardIndex == 0,
            }"
          >
            <img
              v-bind:src="customOptions.coverImage"
              class="card-img-top"
              style="width:100%"
              v-if="customOptions.coverImage && roomInfo.currentCardIndex == 0"
            />
            <img
              v-bind:src="customOptions.cardBackgroundImage"
              class="card-img-top card-background"
              style="width:100%"
              v-if="
                customOptions.cardBackgroundImage &&
                  (!customOptions.coverImage ||
                    roomInfo.currentCardIndex != 0) &&
                  !customOptions.cardBackgroundImageAlign
              "
            />
            <b-card-img
              v-bind:src="customOptions.cardBackgroundImage"
              alt="Card Background image"
              top
              v-if="
                customOptions.cardBackgroundImageAlign == 'top' &&
                  roomInfo.currentCardIndex != 0
              "
            ></b-card-img>

            <div
              class="card-body text-center"
              v-if="(!dataReady || !firebaseReady) && !error"
            >
              <h1 class="m-5">Loading</h1>
              <b-spinner
                class="m-5"
                style="width: 4rem; height: 4rem;"
                label="Busy"
              ></b-spinner>

              <div v-if="customOptions.debugLoading == 'TRUE'">
                <div>Google Sheet ready: {{dataReady}}</div>
                <div>Firebase ready: {{firebaseReady}}</div>
                <div>Error: {{error}}</div>
              </div>
            </div>

            <div
              v-if="!customOptions.coverImage || roomInfo.currentCardIndex != 0"
            >
              <div
                class="card-body justify-content-center d-flex align-items-center mt-4"
                style="white-space: pre-line"
                v-bind:class="{
                  'card-body': !customOptions.cardBackgroundImage,
                  'card-img-overlay':
                    customOptions.cardBackgroundImage &&
                    !customOptions.cardBackgroundImageAlign,
                }"
                v-if="!roomInfo.xCardIsActive"
              >
                <div>
                  <h1 v-if="!customOptions.hideHeadersOnCards">
                    {{
                      gSheet[roomInfo.currentCardIndex]
                        .headerText
                    }}
                  </h1>
                  <p
                    class="mt-4 mb-4"
                    v-html="
                      gSheet[roomInfo.currentCardIndex]
                        .bodyText
                    "
                  ></p>
                </div>
              </div>
            </div>
            <b-alert show class="mx-3" v-html="customOptions.lastCardReminderText" variant="info" v-if="customOptions.lastCardReminderText && customOptions.lastCardReminderFrequency && roomInfo.currentCardIndex > firstNonInstruction && ((roomInfo.currentCardIndex - firstNonInstruction) % customOptions.lastCardReminderFrequency == customOptions.lastCardReminderFrequency - 1)"></b-alert>

            <div
              class="card-body align-items-center justify-content-center"
              v-if="roomInfo.xCardIsActive"
              v-bind:class="{
                'card-body': !customOptions.cardBackgroundImage,
                'card-img-overlay':
                  customOptions.cardBackgroundImage &&
                  !customOptions.cardBackgroundImageAlign,
              }"
            >
              <div class="mt-5 pt-5 mb-5">
                <h1 v-if="!customOptions.safetyCardText">X-Card</h1>
                <div
                  class="safety-card-text"
                  v-html="customOptions.safetyCardText"
                  v-if="customOptions.safetyCardText"
                ></div>
              </div>
              <button class="btn btn-outline-dark mt-5" v-on:click="xCard()">
                Continue
              </button>
              <div class="" v-if="!customOptions.safetyCardText">
                <a class="x-card-text" href="http://tinyurl.com/x-card-rpg"
                  >About the X-Card</a
                >
              </div>
            </div>

            <b-card-img
              v-bind:src="customOptions.cardBackgroundImage"
              alt="Card Background image"
              bottom
              v-if="
                customOptions.cardBackgroundImageAlign == 'bottom' &&
                  roomInfo.currentCardIndex != 0
              "
            ></b-card-img>
          </div>
        </transition>
      </div>



      <div class="btn-container" v-if="!customOptions.facilitatorMode || userRole == 'facilitator'">
        <div class="row mb-4">
          <div class="col-sm">
            <b-button-group aria-role="Deck control" class="d-flex w-100">
              <b-button
                variant="outline-dark"
                :disabled="roomInfo.xCardIsActive || roomInfo.cardHistory.length == 1"
                v-on:click="rewindOne()"
                v-if="!customOptions.facilitatorMode || userRole == 'facilitator'"
                >Back</b-button
              >
              <b-button
                v-b-modal.reshuffleConfirm
                variant="outline-dark"
                :disabled="roomInfo.xCardIsActive"
                v-if="!customOptions.facilitatorMode || userRole == 'facilitator'"
                color="rgb(187, 138, 200)"
                >Restart</b-button
              >
              <b-button
                variant="outline-dark"
                v-on:click="xCard()"
                v-html="
                  customOptions.safetyCardButton
                    ? customOptions.safetyCardButton
                    : 'X-Card'
                "
                >X-Card</b-button
              >
            </b-button-group>
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
        <div
          class="btn-group col-sm"
          role="group"
          aria-label="Extra Info"
          v-if="customOptions.modalOneLabel || customOptions.modalTwoLabel"
        >
          <b-button
            v-b-modal.modalOne
            variant="outline-dark"
            v-if="customOptions.modalOneLabel"
            >{{ customOptions.modalOneLabel }}</b-button
          >

          <b-modal
            id="modalOne"
            v-bind:title="customOptions.modalOneLabel"
            hide-footer
          >
            <div
              class="d-block text-left"
              v-html="customOptions.modalOneText"
            ></div>
          </b-modal>

          <b-button
            v-b-modal.modalTwo
            variant="outline-dark"
            v-if="customOptions.modalTwoLabel"
            >{{ customOptions.modalTwoLabel }}</b-button
          >

          <b-modal
            id="modalTwo"
            v-bind:title="customOptions.modalTwoLabel"
            hide-footer
          >
            <div
              class="d-block text-left"
              v-html="customOptions.modalTwoText"
            ></div>
          </b-modal>
        </div>
      </div>

      <b-modal
        id="modalNextDeckConfirm"
        title="Advance?"
        hide-footer
      >
        <p></p>
        <div
          class="text-center mb-3"
        >
          <b-button
            variant="dark"
            v-on:click="nextDeck()"
            >Advance to {{customOptions.showNextDeckButton
                        ? customOptions.showNextDeckButton
                        : 'Next Deck'}}</b-button
          >
        </div>
      </b-modal>
      <b-modal
        id="reshuffleConfirm"
        title="Restart the Game"
        hide-footer
      >
        <p>Are you sure you want to restart?</p>
        <div
          class="text-center mb-3"
        >
          <b-button
            variant="dark"
            v-on:click="restartGame()"
            >Restart</b-button
          >
        </div>
      </b-modal>

    </div>
  </div>
</template>

<script>
import { roomsCollection } from "../../firebase";
import axios from "axios";
import ExtensionManager from "../extensions/ExtensionManager.vue";

export default {
  name: "app-branching",
  components: {
    "app-extensionManager": ExtensionManager,
  },
  props: {
    roomID: String,
    gSheetID: String,
    userRole: String,
  },
  data: function() {
    return {
      roomInfo: {
        cardHistory: [],
        currentCardIndex: 0,
        xCardIsActive: false,
        cardSequence: [0, 1, 2],
        locationOfLastCard: 0,
        gameVariables: null
      },
      initialGameVariables: {},
      customOptions: {},
      tempExtensionData: { test: null },
      dataReady: false,
      firebaseReady: false,
      firebaseCacheError: false,
      gSheet: [{ text: "loading" }],
      listOfCardKeys: [],
      error: false,
    };
  },
  metaInfo() {
    return {
      title: this.customOptions.gameTitle,
      meta: [
        {
          property: "description",
          content: this.customOptions.gameBlurb,
          vmid: "description",
        },
        {
          property: "og:title",
          content: this.customOptions.gameTitle,
          vmid: "og:title",
        },
        {
          property: "og:description",
          content: this.customOptions.gameBlurb,
          vmid: "og:description",
        },
        {
          property: "og:image",
          content: this.customOptions.ogImageSquare,
          vmid: "og:image",
        },
        {
          property: "og:url",
          content: "https://storysynth.org/#" + this.$route.fullPath,
          vmid: "og:url",
        },
        {
          property: "twitter:card",
          content: "summary",
          vmid: "twitter:card",
        },
        {
          property: "og:site_name",
          content: "Story Synth",
          vmid: "og:site_name",
        },
        {
          property: "twitter:image:alt",
          content: this.customOptions.gameTitle + " logo",
          vmid: "twitter:image:alt",
        },
        {
          name: "monetization",
          content: this.customOptions.wallet,
          vmid: "monetization",
        },
      ],
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

          roomsCollection
            .doc(this.roomID)
            .set({
              extensionData: this.tempExtensionData,
              gameVariables: JSON.stringify([this.initialGameVariables]),
              currentCardIndex: 0,
              xCardIsActive: false,
              cardHistory: [],
            });

          if (this.dataReady) {
            this.restartGame();
          }
        }
      })
      .catch((error) => {
        console.log("error in loading: ", error);
      });
  },
  methods: {
    goToCard(cardKey, stateUpdate){
      let newCardHistory = this.roomInfo.cardHistory
      let nextKey = cardKey ?? newCardHistory.at(-1)
      let indexOfNextCard = this.listOfCardKeys.indexOf(nextKey)
      
      if (indexOfNextCard != -1){
        newCardHistory.push(nextKey)

        let newGameState = JSON.parse(this.roomInfo.gameVariables)
        newGameState.push(JSON.parse(JSON.stringify(newGameState.at(-1))))

        if(stateUpdate){
          let stateObject = this.parseStateChange(stateUpdate);
          
          console.log(stateObject); //TODO - update state in DRY way with following function

          let stateKeys = Object.keys(stateObject)
          for (let i = 0; i < stateKeys.length; i++){
            let stateUpdateObject = stateObject[stateKeys[i]]
            let newVariableState = newGameState.at(-1)[stateKeys[i]] ?? {};
            console.log('next state object', stateUpdateObject)

            // check for new label
            if (!newVariableState.varLabel){
              newVariableState.varLabel = stateUpdateObject.varLabel
            }

            // check which type of new value
            if (!["+","-","*","/"].includes(stateUpdateObject.varValue[0])){
              newVariableState.varValue = stateUpdateObject.varValue
            } else {
              newVariableState.varValue = String(eval(newVariableState.varValue.concat(stateUpdateObject.varValue)))
            }

            newGameState.at(-1)[stateKeys[i]] = newVariableState;
          }
        }

        // Handle state update on new card
        if (this.gSheet[indexOfNextCard].stateChangeOnView && (nextKey != newCardHistory.at(-2))){
          let stateKeys = Object.keys(this.gSheet[indexOfNextCard].stateChangeOnView)
          for (let i = 0; i < stateKeys.length; i++){
            let stateUpdateObject = this.gSheet[indexOfNextCard].stateChangeOnView[stateKeys[i]]
            let newVariableState = newGameState.at(-1)[stateKeys[i]] ?? {};

            // check for new label
            if (!newVariableState.varLabel){
              newVariableState.varLabel = stateUpdateObject.varLabel
            }

            // check which type of new value
            if (!["+","-","*","/"].includes(stateUpdateObject.varValue[0])){
              newVariableState.varValue = stateUpdateObject.varValue
            } else {
              newVariableState.varValue = String(eval(newVariableState.varValue.concat(stateUpdateObject.varValue)))
            }

            newGameState.at(-1)[stateKeys[i]] = newVariableState;
          }
        }

        roomsCollection.doc(this.roomID).update({
          cardHistory: newCardHistory,
          currentCardIndex: indexOfNextCard,
          gameVariables: JSON.stringify(newGameState),

        });
      } else {
        this.error = "Error: bad card key: " + nextKey; 
        console.log("Error: bad card key");
      }
    },
    rewindOne() {
      let newCardHistory = this.roomInfo.cardHistory
      newCardHistory.pop()

      let newGameState = JSON.parse(this.roomInfo.gameVariables)
      newGameState.pop()
      
      let indexOfNextCard = this.listOfCardKeys.indexOf(newCardHistory[newCardHistory.length - 1])
      
      roomsCollection.doc(this.roomID).update({
        cardHistory: newCardHistory,
        currentCardIndex: indexOfNextCard,
        gameVariables: JSON.stringify(newGameState),
      });
    },
    xCard() {
      roomsCollection.doc(this.roomID).update({
        xCardIsActive: !this.roomInfo.xCardIsActive,
      });
    },
    restartGame() {
      console.log("restarting");
      this.firebaseCacheError = false;
      this.$bvModal.hide("reshuffleConfirm")	

      // sync the shuffled array
      roomsCollection.doc(this.roomID).update({
        cardHistory: [this.gSheet[0].cardKey],
        currentCardIndex: 0,
        gameVariables: JSON.stringify([this.initialGameVariables]),
      });
    },
    syncExtension() {
      roomsCollection.doc(this.roomID).update({
        extensionData: this.roomInfo.extensionData,
      });
    },
    parseBodyText(rawText){
      // for card link
      let gotoLinkRE = /#\[[^\]]*\]\([^)]*\)/g
      // for state update
      let stateLinkRE = /\^\[[^\]]*\]\{[^}]*\}/g
      // for combined
      let combinedLinkRE = /&\[[^\]]*\]\([^)]*\)\{[^}]*\}/g

      let gotoLinkExpander = function(match){
        let shortLink = match

        let linkText = shortLink?.substring(shortLink.indexOf('[')+1,shortLink.indexOf(']('))
        let cardKey = shortLink?.substring(shortLink.indexOf('](')+2, shortLink.length-1)

        let fullLink = '<a href="#!" class="link-goToCard" onclick="vm.$children[0].$refs.branching.goToCard(\''+ cardKey + '\', null)">' + linkText + '</a>' 

        return fullLink
      }

      let stateLinkExpander = function(match){
        let shortLink = match

        let linkText = shortLink?.substring(shortLink.indexOf('[')+1,shortLink.indexOf(']{'))
        let stateObject = shortLink?.substring(shortLink.indexOf(']{')+2, shortLink.length-1)

        let fullLink = '<a href="#!" class="link-updateState" onclick="vm.$children[0].$refs.branching.goToCard(null,\''+ stateObject + '\')">' + linkText + '</a>' 

        return fullLink
      }

      let combinedLinkExpander = function(match){
        let shortLink = match
        console.log('matched combined update:', match)

        let linkText = shortLink?.substring(shortLink.indexOf('[')+1,shortLink.indexOf(']('))
        let cardKey = shortLink?.substring(shortLink.indexOf('](')+2, shortLink.indexOf('){'))
        let stateObject = shortLink?.substring(shortLink.indexOf('){')+2, shortLink.length-1)

        let fullLink = '<a href="#!" class="link-updateState" onclick="vm.$children[0].$refs.branching.goToCard(\''+ cardKey +'\',\''+ stateObject + '\')">' + linkText + '</a>' 

        return fullLink
      }

      let parsedText = rawText.replaceAll(gotoLinkRE, gotoLinkExpander).replaceAll(stateLinkRE, stateLinkExpander).replaceAll(combinedLinkRE, combinedLinkExpander)
      
      return parsedText
    },
    parseStateChange(rawState){
      let parsedState = {}
      let stateArray = rawState.split(',')
      
      for (let i = 0; i < stateArray.length; i++){
        let tempVar = stateArray[i].split(':');
        parsedState[tempVar[0]] = {'varValue': tempVar[1]};
        if (tempVar[2]){
          parsedState[tempVar[0]]['varLabel'] = tempVar[2];
        }
      }


      return parsedState
    },
    fetchAndCleanSheetData(sheetID) {
      // Remove for published version
      if (!sheetID || sheetID == "demo") {
        sheetID = "1N5eeyKTVWo5QeGcUV_zYtwtR0DikJCcvcj6w69UkC1w";
      }

      // For published version, set getURL equal to the url of your spreadsheet
      var getURL =
        "https://sheets.googleapis.com/v4/spreadsheets/" +
        sheetID +
        "?includeGridData=true&ranges=a1:aa100&key=" + process.env.VUE_APP_FIREBASE_API_KEY;

      // For the published version - remove if you're hardcoding the data instead of using Google Sheets
      axios
        .get(getURL)
        .then((response) => {
          var cleanData = [];
          var gRows = response.data.sheets[0].data[0].rowData;

          // Transform Sheets API response into cleanData
          gRows.forEach((item, i) => {
            if (i !== 0 && item?.values[0]?.formattedValue) {
              // Handle options
              if (item.values[0].formattedValue == "option") {
                this.customOptions[item.values[1].formattedValue] =
                  item.values[2].formattedValue;
                console.log(item.values[2].formattedValue);
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

              // Handle variables
              if (item.values[0].formattedValue == "variable"){
                let varName = item.values[1].formattedValue
                let varValue = item.values[2].formattedValue
                let varLabel = item.values[3].formattedValue
                this.initialGameVariables[varName] = {
                  'varValue': varValue,
                  'varLabel': varLabel,
                }
              }

              // Handle cards
              if (
                item.values[0].formattedValue !== "option" &&
                item.values[0].formattedValue !== "extension" &&
                item.values[0].formattedValue !== "variable"
              ) {
                
                let parsedBodyText = this.parseBodyText(item.values[2].formattedValue);
                let parsedStateChangeOnView = item.values[3]?.formattedValue ? this.parseStateChange(item.values[3]?.formattedValue) : null;
                
                var rowInfo = {
                  cardKey: item.values[0].formattedValue,
                  headerText: item.values[1].formattedValue,
                  bodyText: parsedBodyText,
                  stateChangeOnView: parsedStateChangeOnView,
                };

                cleanData.push(rowInfo);
                this.listOfCardKeys.push(rowInfo.cardKey);

              }
            }
          });

          // apply custom style to body
          let styleTemplate =
            "style-template-" + this.customOptions.styleTemplate;
          let body = document.getElementById("app"); // document.body;
          body.classList.add(styleTemplate);

          if (
            this.firebaseReady &&
            Object.keys(this.tempExtensionData).length > 1
          ) {
            roomsCollection
              .doc(this.roomID)
              .update({ extensionData: this.tempExtensionData });
          }

          if (
            this.firebaseReady && 
            Object.keys(this.initialGameVariables).length >= 1
          ) {
            roomsCollection
              .doc(this.roomID)
              .update({ gameVariables: JSON.stringify([this.initialGameVariables]) });
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

          if (location.hostname.toString() !== 'localhost'){
            this.$mixpanel.track('Visit Game Session', {
              game_name: this.customOptions.gameTitle ?? 'untitled',
              session_url: location.hostname.toString() + this.$route.fullPath,
              format: 'Shuffled'
            });
          }

          if (this.firebaseReady && this.roomInfo.cardHistory.length < 1) {
            this.restartGame();
          }

          // else if (this.roomInfo.cardSequence.length !== this.gSheet.length && this.firebaseReady){
          //   this.firebaseCacheError = true;
          // } else if (this.firebaseReady){
          //   this.firebaseCacheError = false;
          // }
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

          this.orderedCards = this.gSheet;
          this.error = error;
          console.log(error.message, error);
        });
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->

<style scoped>
.shuffled {
  margin: auto;
  padding-top: 1em;
  padding-bottom: 1em;
}

@media (max-width: 576px) {
  h1,
  h2 {
    font-size: 1.7em;
  }

  .card-body {
    font-size: 1.2em;
    min-height: 11em;
  }
}

@media (min-width: 576px) {
  .card-body {
    font-size: 1.5em;
    min-height: 11em;
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
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
