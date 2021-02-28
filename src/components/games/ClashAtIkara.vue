<template>
  <div class="shuffled game-room container" v-if="roomInfo">
    <div class="full-page-background"></div>
    <div v-html="customOptions.style"></div>
    <b-alert show class="" variant="danger" v-if="firebaseCacheError">Warning: the length of the deck has changed since this room was first created. Click Restart to resync card data.</b-alert>
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

      

      <div class="row mb-4">
        <transition name="fade">
          <div class="btn-group col-sm" role="group" aria-label="Card Controls">
            <button
              class="btn btn-outline-dark"
              v-on:click="previousCard()"
              :disabled="
                roomInfo.xCardIsActive || roomInfo.currentCardIndex == 0
              "
            >
              Previous Card
            </button>
            <button
              class="btn btn-outline-primary"
              v-on:click="nextCard()"
              :disabled="
                roomInfo.xCardIsActive ||
                  roomInfo.currentCardIndex >= roomInfo.locationOfLastCard
              "
            >
              Next Card
            </button>
          </div>
        </transition>
      </div>

      <div
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
      </div>

      <div
        v-if="gSheet[roomInfo.cardSequence[roomInfo.currentCardIndex]]"
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
                      gSheet[roomInfo.cardSequence[roomInfo.currentCardIndex]]
                        .headerText
                    }}
                  </h1>
                  <p
                    class="mt-4 mb-4"
                    v-html="
                      gSheet[roomInfo.cardSequence[roomInfo.currentCardIndex]]
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
                  class="safety-card-tet"
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



      <div class="btn-container" style>
        <div class="row mb-4">
          <div class="col-sm">
            <b-button-group aria-role="Deck control" class="d-flex w-100">
              <b-button
                v-b-modal.reshuffleConfirm
                variant="outline-dark"
                :disabled="roomInfo.xCardIsActive"
                
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
              <b-button
                v-b-modal.modalNextDeckConfirm
                variant="outline-dark"
                
                v-if="this.customOptions.showNextDeckButton"
                :disabled="
                  roomInfo.xCardIsActive ||
                    roomInfo.currentCardIndex >= roomInfo.locationOfLastCard
                "
                v-html="
                  customOptions.showNextDeckButton
                    ? customOptions.showNextDeckButton
                    : 'Next Deck'
                "
              >
                Next Deck
              </b-button>
              <b-dropdown
                variant="outline-dark"
                id="dropdown-1"
                v-bind:text="customOptions.lastCardLabel"
                :disabled="
                  roomInfo.xCardIsActive ||
                    roomInfo.currentCardIndex == gSheet.length - 1 ||
                    roomInfo.currentCardIndex == roomInfo.locationOfLastCard
                "
                v-if="!this.customOptions.showNextDeckButton"
                right
              >
                <b-dropdown-item v-on:click="lastCard()"
                  >Go to {{customOptions.lastCardLabel}}</b-dropdown-item
                >
                <b-dropdown-item v-on:click="shuffleLastCard('center')"
                  >Shuffle near middle</b-dropdown-item
                >
                <b-dropdown-item v-on:click="shuffleLastCard('end')"
                  >Shuffle near end</b-dropdown-item
                >
              </b-dropdown>
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
        title="Restart and Reshuffle"
        hide-footer
      >
        <p>Do you want to reshuffle all of the prompts and restart the game?</p>
        <div
          class="text-center mb-3"
        >
          <b-button
            variant="dark"
            v-on:click="shuffleAndResetGame()"
            >Restart and Reshuffle</b-button
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
  name: "app-shuffled",
  components: {
    "app-extensionManager": ExtensionManager,
  },
  props: {
    roomID: String,
    gSheetID: String,
  },
  data: function() {
    return {
      roomInfo: {
        currentCardIndex: 0,
        xCardIsActive: false,
        cardSequence: [0, 1, 2],
        locationOfLastCard: 0,
      },
      firstNonInstruction: 0,
      tempExtensionData: { test: null },
      dataReady: false,
      firebaseReady: false,
      firebaseCacheError: false,
      gSheet: [{ text: "loading" }],
      orderedCards: [],
      currentDeck: 0,
      totalDecks: 0,
      unorderedDecks: {},
      customOptions: {
        lastCardLabel: "Last Card"
      },
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
              currentCardIndex: 0,
              xCardIsActive: false,
              cardSequence: [0, 1, 2],
            });

          if (this.dataReady) {
            this.shuffleAndResetGame();
          }
        } else if (this.roomInfo.cardSequence.length !== this.gSheet.length && this.dataReady){
          this.firebaseCacheError = true;
        } else if (this.dataReady){
          this.firebaseCacheError = false;
        }
      })
      .catch((error) => {
        console.log("error in loading: ", error);
      });
  },
  methods: {
    previousCard() {
      roomsCollection.doc(this.roomID).update({
        currentCardIndex: (this.roomInfo.currentCardIndex -= 1),
      });
    },
    nextCard() {
      if (this.roomInfo.cardSequence.length == 1) {
        this.shuffleAndResetGame();
      }
      roomsCollection.doc(this.roomID).update({
        currentCardIndex: (this.roomInfo.currentCardIndex += 1),
      });
    },
    lastCard() {
      if (this.roomInfo.cardSequence.length == 1) {
        this.shuffleAndResetGame();
      }

      roomsCollection.doc(this.roomID).update({
        currentCardIndex: this.roomInfo.locationOfLastCard,
      });
    },
    xCard() {
      roomsCollection.doc(this.roomID).update({
        xCardIsActive: !this.roomInfo.xCardIsActive,
      });
    },
    nextDeck() {
      this.$bvModal.hide("modalNextDeckConfirm")	
      let newCardIndex = this.roomInfo.currentCardIndex;
      let chapterIndexTracker = this.orderedCards.length;
      console.log("current:", newCardIndex);
      if (this.roomInfo.currentCardIndex < chapterIndexTracker) {
        newCardIndex = this.orderedCards.length;
      } else {
        for (var i = 0; i < this.unorderedDecks.length; i++) {
          chapterIndexTracker += this.unorderedDecks[i].length;
          console.log("new index:", chapterIndexTracker);
          if (this.roomInfo.currentCardIndex < chapterIndexTracker) {
            newCardIndex = chapterIndexTracker;
            break;
          }
        }
      }

      roomsCollection.doc(this.roomID).update({
        currentCardIndex: newCardIndex,
      });
    },
    shuffleLastCard(location) {
      var tempLastCardIndex = this.roomInfo.cardSequence.splice(
        this.roomInfo.locationOfLastCard,
        1
      );
      var tempNewLastCardLocation = 0;

      switch (location) {
        case "center":
          tempNewLastCardLocation =
            Math.floor(
              (this.roomInfo.cardSequence.length - this.orderedCards.length) / 2
            ) +
            this.orderedCards.length +
            Math.floor(Math.random() * 4 - 2);
          break;
        case "end":
          tempNewLastCardLocation =
            this.roomInfo.cardSequence.length - Math.floor(Math.random() * 4);
          break;
      }

      this.roomInfo.cardSequence.splice(
        tempNewLastCardLocation,
        0,
        tempLastCardIndex[0]
      );
      console.log(this.roomInfo.cardSequence);

      roomsCollection.doc(this.roomID).update({
        cardSequence: this.roomInfo.cardSequence,
        locationOfLastCard: tempNewLastCardLocation,
      });
    },
    shuffleAndResetGame() {
      console.log("shuffling");
      this.firebaseCacheError = false;
      this.$bvModal.hide("reshuffleConfirm")	

      // reset card count
      roomsCollection.doc(this.roomID).update({
        currentCardIndex: 0,
        locationOfLastCard: 0,
      });

      // Create a ordered array
      var newCardSequence = [];

      // Add the ordered cards first
      for (var i = 0; i < this.orderedCards.length; i++) {
        newCardSequence.push(i);
      }

      // Shuffle deck function
      var shuffleDeck = function(deck) {
        for (var n = deck.length - 1; n > 0; n--) {
          let j = Math.floor(Math.random() * (n + 1));
          [deck[n], deck[j]] = [deck[j], deck[n]];
        }
        return deck;
      };

      // Shuffle each deck (except the first) and add it to the sequence
      for (var k = 1; k < this.totalDecks; k++) {
        newCardSequence = newCardSequence.concat(
          shuffleDeck(this.unorderedDecks[k])
        );
      }

      // sync the shuffled array
      roomsCollection.doc(this.roomID).update({
        cardSequence: newCardSequence,
        locationOfLastCard: newCardSequence.length - 1,
      });
    },
    syncExtension() {
      roomsCollection.doc(this.roomID).update({
        extensionData: this.roomInfo.extensionData,
      });
    },
    fetchAndCleanSheetData(sheetID) {
      // Remove for published version
      if (!sheetID || sheetID == "demo") {
        sheetID = "1N5eeyKTVWo5QeGcUV_zYtwtR0DikJCcvcj6w69UkC1w";
      }

      // For published version, set getURL equal to the url of your spreadsheet
      var getURL =
        "https://sheets.googleapis.com/v4/spreadsheets/1FIWw_lyefEPF9dc-4C-cBwr9gg3D1QH5vkW89WxGu68/?includeGridData=true&ranges=a1:aa100&key=AIzaSyDsIM5nJ3hNoVRCSd3kJXfrAL8_n9gwFdM";

      // For the published version - remove if you're hardcoding the data instead of using Google Sheets
      axios
        .get(getURL)
        .then((response) => {
          var cleanData = [];
          var gRows = response.data.sheets[0].data[0].rowData;

          // Transform Sheets API response into cleanData
          gRows.forEach((item, i) => {
            if (i !== 0 && item.values[0].formattedValue) {
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

              // Handle cards
              if (
                item.values[0].formattedValue !== "option" &&
                item.values[0].formattedValue !== "extension"
              ) {
                var rowInfo = {
                  ordered: item.values[0].formattedValue,
                  headerText: item.values[1].formattedValue,
                  bodyText: item.values[2].formattedValue,
                };

                cleanData.push(rowInfo);

                if (rowInfo.ordered >= this.totalDecks) {
                  this.totalDecks = parseInt(rowInfo.ordered) + 1;
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

          this.unorderedDecks = [];
          for (var d = 0; d < this.totalDecks; d++) {
            this.unorderedDecks.push([]);
          }

          // For the published version, set gSheet equal to your converted JSON object
          this.gSheet = cleanData;

          // Sort cleanData into ordered and unordered decks
          cleanData.forEach((item, index) => {
            if (item.ordered == "0") {
              this.orderedCards.push(item);
              this.firstNonInstruction += 1;
            } else if (item.ordered !== "option") {
              this.unorderedDecks[item.ordered].push(index);
            }
          });

          console.log("done fetching and cleaning data");
          this.dataReady = true;

          if (location.hostname.toString() !== 'localhost'){
            this.$mixpanel.track('Visit Game Session', {
              game_name: this.customOptions.gameTitle ?? 'untitled',
              session_url: location.hostname.toString() + this.$route.fullPath,
              format: 'Shuffled'
            });
          }

          if (this.firebaseReady && this.roomInfo.cardSequence.length < 4) {
            this.shuffleAndResetGame();
          }

          else if (this.roomInfo.cardSequence.length !== this.gSheet.length && this.firebaseReady){
            this.firebaseCacheError = true;
          } else if (this.firebaseReady){
            this.firebaseCacheError = false;
          }
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
