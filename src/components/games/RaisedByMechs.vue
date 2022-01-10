<template>
  <div class="shuffled game-room container" v-if="roomInfo">
    <div class="full-page-background"></div>
    <div v-html="customOptions.style"></div>

    <!-- Menu Bar -->
    <div class="menu-bar mb-4 d-flex align-items-center">
      <button class="btn btn-outline-dark mr-auto border-0" v-b-modal.menuModal v-bind:style="{color: 'white'}"><b-icon-list></b-icon-list> Menu</button>
      <!-- <div v-if="customOptions.gameTitle" class="mx-auto align-middle text-center">{{customOptions.gameTitle}}</div> -->
      <app-roomLink class="d-none d-sm-block" :routeRoomID="$route.params.roomID" :color="'white'" v-if="dataReady && firebaseReady"></app-roomLink>
      
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
          <div class="row menu-row">
            <b-button
              v-on:click="nextDeck(); closeMenu();"
              variant="outline-dark"
              class="control-button-next-deck btn-lg btn-block"
              
              v-if="this.customOptions.showNextDeckButton && (!customOptions.facilitatorMode || userRole == 'facilitator')"
              :disabled="
                roomInfo.xCardIsActive ||
                  roomInfo.currentCardIndex >= roomInfo.locationOfLastCard
              "
              v-html="
                customOptions.showNextDeckButton
                  ? customOptions.showNextDeckButton
                  : 'Next Deck'
              "
            ></b-button>
          </div>
          <div v-if="!this.customOptions.showNextDeckButton && (!customOptions.facilitatorMode || userRole == 'facilitator') && (!customOptions.hideNavigationButtons)">
            <hr class='mb-4'/>
            <h6 class='text-center'>{{customOptions.lastCardLabel}} Options</h6>
            <div class="row menu-row">

              <b-button class="btn-block" v-on:click="lastCard(); closeMenu();"
              :disabled="
                roomInfo.xCardIsActive ||
                  roomInfo.currentCardIndex == gSheet.length - 1 ||
                  roomInfo.currentCardIndex == roomInfo.locationOfLastCard
              "
              >
                Go to {{customOptions.lastCardLabel}}
              </b-button>
              
              <b-button class="btn-block" v-on:click="shuffleLastCard('center'); closeMenu();"
              :disabled="
                roomInfo.xCardIsActive ||
                  roomInfo.currentCardIndex == gSheet.length - 1 ||
                  roomInfo.currentCardIndex == roomInfo.locationOfLastCard
              "
              >
                Shuffle near middle
              </b-button>
              
              <b-button class="btn-block" v-on:click="shuffleLastCard('end'); closeMenu();"
              :disabled="
                roomInfo.xCardIsActive ||
                  roomInfo.currentCardIndex == gSheet.length - 1 ||
                  roomInfo.currentCardIndex == roomInfo.locationOfLastCard
              ">
                Shuffle near end
              </b-button>
                  
            </div>
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
    <div class="" v-if="roomInfo">
      <div class="before-game-card">
        <!-- <div
          class="mb-4 game-meta d-none d-sm-block"
          v-if="
            !customOptions.hideTitleInSession &&
              (customOptions.gameTitle || customOptions.byline)
          "
        >
          <div class="row text-center" v-if="customOptions.gameTitle">
            <div class="col-sm">
              <h1 class="game-title">{{ customOptions.gameTitle }}</h1>
            </div>
          </div>

          <div class="row text-center" v-if="customOptions.byline">
            <div class="col-sm">
              <h4 class="game-byline">{{ customOptions.byline }}</h4>
            </div>
          </div>
        </div> -->

        <!-- TODO: Facilitator Notes
        <div class="facilitator-panel" v-if="userRole == 'facilitator' && customOptions.facilitatorMode">
          <h1>Faciliator</h1>
        </div>
        -->

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

        <!-- <div class="row card-navigation-buttons card-nav-above mb-4" v-if="(!customOptions.facilitatorMode || userRole == 'facilitator') && (!customOptions.lowerCardNavOnMobile) && (!customOptions.hideNavigationButtons || (parseInt(customOptions.hideNavigationButtons) > roomInfo.currentCardIndex))">
          <transition name="fade">
            <div class="btn-group col-sm" role="group" aria-label="Card Controls">
              <button
                class="btn btn-outline-dark control-button-previous-card"
                v-on:click="previousCard()"
                :disabled="
                  roomInfo.xCardIsActive || roomInfo.currentCardIndex == 0
                "
              >
                Previous Card
              </button>
              <button
                class="btn btn-outline-dark control-button-next-card"
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
        </div> -->

        <transition name="fade">
        <div class="fab-buttons container" v-if="(!customOptions.facilitatorMode || userRole == 'facilitator') && (!customOptions.hideNavigationButtons || (parseInt(customOptions.hideNavigationButtons) > roomInfo.currentCardIndex))">
            <button
              class="btn btn-outline-dark btn-fab btn-fab-left control-button-previous-card shadow"
              v-on:click="previousCard()"
              v-b-tooltip.hover title="Previous Card"
              :disabled="
                roomInfo.xCardIsActive || roomInfo.currentCardIndex == 0
              "
            >
              <!-- Previous Card -->
              <b-icon class="h1 mb-0" icon="chevron-left"></b-icon>
              <b-icon class="h1 mb-0 mr-2" icon="card-heading"></b-icon>
            </button>
            <button
              class="btn btn-outline-dark btn-fab btn-fab-right control-button-next-card shadow"
              v-b-tooltip.hover title="Next Card"
              v-on:click="nextCard()"
              :disabled="
                roomInfo.xCardIsActive ||
                  roomInfo.currentCardIndex >= roomInfo.locationOfLastCard
              "
            >
              <!-- Next Card -->
              <b-icon class="h1 mb-0 ml-2" icon="card-heading"></b-icon>
              <b-icon class="h1 mb-0" icon="chevron-right"></b-icon>              
            </button>
        </div>        
      </transition>

        <div class="row mb-3 game-meta card-counter" v-if="customOptions.displayCardCount && customOptions.displayCardCount - 1 <= roomInfo.currentCardIndex && roomInfo.currentCardIndex < roomInfo.locationOfLastCard">
          <div class="col-sm">
            <h2><span v-if="customOptions.displayCardCountLabel">{{customOptions.displayCardCountLabel}}</span><span v-else>Cards seen:</span> {{roomInfo.currentCardIndex - customOptions.displayCardCount + 1}}</h2>
          </div>
        </div>
      </div>

      <transition name="fade">
        <div
          class="card main-card d-flex shadow img-fluid mb-4"
          v-bind:class="{
            'bg-transparent':
              customOptions.coverImage && roomInfo.currentCardIndex == 0,
          }"
          v-if="gSheet[roomInfo.cardSequence[roomInfo.currentCardIndex]]"
        >
          <!-- card images -->
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


          <!-- Loading Visual -->
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
            class="row mt-4 mx-4"
            v-if="
              customOptions.instructionsProgressBar &&
                roomInfo.currentCardIndex < firstNonInstruction &&
                roomInfo.currentCardIndex != 0
            "
          >
            <div class="col-sm">
              <h3>Instructions</h3>
              <b-progress
                :value="roomInfo.currentCardIndex"
                :max="firstNonInstruction - 1"
                variant="dark"
              ></b-progress>
            </div>
          </div>

          <!-- Main Game Cards -->
          <div
            v-if="!customOptions.coverImage || roomInfo.currentCardIndex != 0"
            v-bind:class="gSheet[roomInfo.cardSequence[roomInfo.currentCardIndex]]
                      .deckNumberClass"
          >
            <div
              class="card-body justify-content-center d-flex align-items-center mt-4"
              style="white-space: pre-line"
              v-bind:class="{
                'card-img-overlay':
                  customOptions.cardBackgroundImage &&
                  !customOptions.cardBackgroundImageAlign,
              }"
              v-if="!roomInfo.xCardIsActive"
            >
              <div v-if="!roomInfo.showCardBack">
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
                <button class="btn btn-outline-dark" v-on:click="flipCard()" v-if="gSheet[roomInfo.cardSequence[roomInfo.currentCardIndex]].cardBack && customOptions.reversableCards">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-repeat" viewBox="0 0 16 16">
                    <path d="M11.534 7h3.932a.25.25 0 0 1 .192.41l-1.966 2.36a.25.25 0 0 1-.384 0l-1.966-2.36a.25.25 0 0 1 .192-.41zm-11 2h3.932a.25.25 0 0 0 .192-.41L2.692 6.23a.25.25 0 0 0-.384 0L.342 8.59A.25.25 0 0 0 .534 9z"/>
                    <path fill-rule="evenodd" d="M8 3c-1.552 0-2.94.707-3.857 1.818a.5.5 0 1 1-.771-.636A6.002 6.002 0 0 1 13.917 7H12.9A5.002 5.002 0 0 0 8 3zM3.1 9a5.002 5.002 0 0 0 8.757 2.182.5.5 0 1 1 .771.636A6.002 6.002 0 0 1 2.083 9H3.1z"/>
                  </svg>
                </button>
              </div>
              <div v-else>
                <div class="mt-4 mb-4" v-html="gSheet[roomInfo.cardSequence[roomInfo.currentCardIndex]].cardBack">
                </div> 
                <button class="btn btn-outline-dark" v-on:click="flipCard()" v-if="gSheet[roomInfo.cardSequence[roomInfo.currentCardIndex]].cardBack && customOptions.reversableCards">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-repeat" viewBox="0 0 16 16">
                    <path d="M11.534 7h3.932a.25.25 0 0 1 .192.41l-1.966 2.36a.25.25 0 0 1-.384 0l-1.966-2.36a.25.25 0 0 1 .192-.41zm-11 2h3.932a.25.25 0 0 0 .192-.41L2.692 6.23a.25.25 0 0 0-.384 0L.342 8.59A.25.25 0 0 0 .534 9z"/>
                    <path fill-rule="evenodd" d="M8 3c-1.552 0-2.94.707-3.857 1.818a.5.5 0 1 1-.771-.636A6.002 6.002 0 0 1 13.917 7H12.9A5.002 5.002 0 0 0 8 3zM3.1 9a5.002 5.002 0 0 0 8.757 2.182.5.5 0 1 1 .771.636A6.002 6.002 0 0 1 2.083 9H3.1z"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>
          <b-alert show class="mx-3" v-html="customOptions.lastCardReminderText" variant="info" v-if="customOptions.lastCardReminderText && customOptions.lastCardReminderFrequency && roomInfo.currentCardIndex > firstNonInstruction && ((roomInfo.currentCardIndex - firstNonInstruction) % customOptions.lastCardReminderFrequency == customOptions.lastCardReminderFrequency - 1)"></b-alert>

          <!-- Safety Card -->
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

          <!-- Card Image, Bottom -->
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


      <div class="after-game-card">
        <!-- <b-button-toolbar class="justify-content-between lower-buttons" v-if="!customOptions.facilitatorMode || userRole == 'facilitator'">
          <b-button-group class="game-meta-buttons" aria-role="Deck control" v-bind:class="{'d-flex w-100': !customOptions.lowerCardNavOnMobile}">
            <b-button
              v-b-modal.reshuffleConfirm
              class="control-button-restart"
              variant="outline-dark"
              :disabled="roomInfo.xCardIsActive"
              v-if="!customOptions.facilitatorMode || userRole == 'facilitator'"
              color="rgb(187, 138, 200)"
              >Restart</b-button
            >
            <b-button
              variant="outline-dark"
              class="control-button-safety-card"
              v-on:click="xCard()"
              v-html="
                customOptions.safetyCardButton
                  ? customOptions.safetyCardButton
                  : 'X-Card'
              "
              ></b-button>
            <b-button
              v-b-modal.modalNextDeckConfirm
              variant="outline-dark"
              class="control-button-next-deck"
              
              v-if="this.customOptions.showNextDeckButton && (!customOptions.facilitatorMode || userRole == 'facilitator')"
              :disabled="
                roomInfo.xCardIsActive ||
                  roomInfo.currentCardIndex >= roomInfo.locationOfLastCard
              "
              v-html="
                customOptions.showNextDeckButton
                  ? customOptions.showNextDeckButton
                  : 'Next Deck'
              "
            ></b-button>
            <b-dropdown
              variant="outline-dark"
              id="dropdown-1"
              class="control-button-last-card"
              v-bind:text="customOptions.lastCardLabel"
              :disabled="
                roomInfo.xCardIsActive ||
                  roomInfo.currentCardIndex == gSheet.length - 1 ||
                  roomInfo.currentCardIndex == roomInfo.locationOfLastCard
              "
              v-if="!this.customOptions.showNextDeckButton && (!customOptions.facilitatorMode || userRole == 'facilitator') && (!customOptions.hideNavigationButtons)"
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
          <b-button-group class="btn-group card-navigation-buttons card-nav-below" role="group" aria-label="Card Controls" v-if="customOptions.lowerCardNavOnMobile">
            <b-button
              class="btn btn-outline-dark control-button-previous-card"
              v-on:click="previousCard()"
              :disabled="
                roomInfo.xCardIsActive || roomInfo.currentCardIndex == 0
              "
            >
              &lsaquo;
            </b-button>
            <b-button
              class="btn btn-outline-dark control-button-next-card"
              v-on:click="nextCard()"
              :disabled="
                roomInfo.xCardIsActive ||
                  roomInfo.currentCardIndex >= roomInfo.locationOfLastCard
              "
            >
              &rsaquo;
            </b-button>
          </b-button-group>
        </b-button-toolbar> -->
        
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
  </div>
</template>

<script>
import { roomsCollection } from "../../firebase";
import axios from "axios";
import ExtensionManager from "../extensions/ExtensionManager.vue";
import RoomLink from '../layout/RoomLink.vue';

export default {
  name: "app-shuffled",
  components: {
    "app-extensionManager": ExtensionManager,
    'app-roomLink': RoomLink,
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
        }
      })
      .catch((error) => {
        console.log("error in loading: ", error);
      });
  },
  methods: {
    closeMenu(){
      this.$bvModal.hide("menuModal");
    },
    copyLinkToClipboard(){
      let currentUrl = location.hostname.toString() + "/" + this.$route.fullPath
      navigator.clipboard.writeText(currentUrl).then(function() {
        console.log('copied url')
      }, function() {
        console.log('copy failed')
      });
    },
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
        "https://sheets.googleapis.com/v4/spreadsheets/" +
        '1q5LuB6H5F9hxJEZovAS4LJZc6YS8mYs0tOFIcCUp4lA' +
        "?includeGridData=true&ranges=a1:aa100&key=" + process.env.VUE_APP_FIREBASE_API_KEY;

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
