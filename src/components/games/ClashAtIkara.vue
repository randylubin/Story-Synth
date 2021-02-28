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
              v-if="customOptions.coverImage && roomInfo.currentCardIndex == 0 && firebaseReady"
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
    fetchAndCleanSheetData() {
      
      let gRows = [
                    ["option","gameTitle","Clash at Ikara"  ],
                    ["option","byline","By Randy Lubin"  ],
                    ["option","gameBlurb","<i>By Randy Lubin</i>\n\n<div class=\"text-left\" style=\"white-space:normal\">\n<h2>Pitch</h2>\nPlay as a group of heroes who have agreed to protect the defenseless community of Ikara from an imminent bandit raid. First meet the heroes, then discover Ikara and its inhabitants, and finally see how they fare in a battle against the bandits.\n<br><br>\nInspired by Seven Samurai and For the Queen\n<br><br>\n<h2>Info</h2>\n<ul>\n  <li>2+ players</li>\n  <li>30-60 minutes</li>\n  <li>Genre: Flexible (fantasy or science fiction work well)</li>\n  <li>Tone: tense preparation, heroic sacrifice</li>\n  <li>Activities: tell quick vignettes that build the characters and the world</li>\n</ul>\n</div>"  ],
                    ["option","coverImage","https://diegeticgames.com/uploads/clash-at-ikara-cover.png"  ],
                    ["option","showNextDeckButton","Next Act"  ],
                    ["extension","playerTurnOrderHeader","The Heroes"  ],
                    ["extension","playerTurnOrderButtonLabel","Add Hero"  ],
                    ["extension","playerTurnOrderFirstVisible","10"  ],
                    ["extension","playerTurnOrder","{}"  ],
                    ["option","hideTitleInSession","TRUE"  ],
                    ["option","instructionsProgressBar","6"  ],
                    ["option","style","<link rel=\"preconnect\" href=\"https://fonts.gstatic.com\">\n<link href=\"https://fonts.googleapis.com/css2?family=Kelly+Slab&display=swap\" rel=\"stylesheet\">\n\n<style>\n\nh1, h2 { font-family: 'Kelly Slab', sans-serif; }\n\n.full-page-background {\n\nbackground: #23074d;  /* fallback for old browsers */\nbackground: -webkit-linear-gradient(to top, #cc5333, #23074d);  /* Chrome 10-25, Safari 5.1-6 */\nbackground: linear-gradient(to top, #cc5333, #23074d); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */\n\n}\n\n.game-meta {\n color: white;\n}\n\n.card {\n    background: url(https://www.toptal.com/designers/subtlepatterns/patterns/handmadepaper.png);\n    border: 0px;\n}\n\n\n</style>"  ],
                    ["0","Clash at Ikara","One player should hit NEXT CARD and then players should take turns reading each card aloud.\n<style> .main-card {filter:invert()}</style>"  ],
                    ["0","The Pitch","Play as a group of heroes who have agreed to protect the defenseless community of Ikara from an imminent bandit raid.\n\nOne player should hit NEXT CARD and then players should take turns reading each card aloud."  ],
                    ["0","Safety","If you need to pause the game for any reason, especially if you want to discuss, edit, or reverse any content decisions, just click the X-Card button."  ],
                    ["0","The Setting","The story centers on the defenseless community of Ikara but the broader setting is up to you. As a group, define <b>your</b> Ikara.\n<div class=\"text-left mx-5\">\n– An ancient archive, full of magical tomes\n– An ice mining station, in the asteroid belt\n– A scrapyard, in the slums of a cyberpunk dystopia\n– Or, make up your own setting\n</div>"  ],
                    ["0","The Story Arc","This game takes place over four Acts:\n<div class=\"text-left mx-5\">\nAct 1: Meet the heroes\nAct 2: Prepare the defenses\nAct 3: Fight the battle\nAct 4: Explore the aftermath\n</div>\n\nSome of the heroes may die – will their sacrifice be worth it?"  ],
                    ["0","The Prompts","In this game, you'll take turns advancing the story by answering prompts. You can always choose to redraw a prompt or to ask another player to answer one in your place.\n\nEach Act will contain its own short instructions which you will read before drawing the prompts.\n\nHit 'Next Card' to begin the story."  ],
                    ["1","Prelude","<style> .main-card {filter:invert()}</style>"  ],
                    ["2","Prelude","The community of Ikara is frequently harassed by bandits, who threaten violence unless Ikara hands over its scarce resources.\n\nAfter years of suffering, the residents of Ikara have said ENOUGH. They've sought the help of heroes to help ward off the bandit attack and secure the long term safety of the community."  ],
                    ["3","Act 1","In which we meet our heroes\n<style> .main-card {filter:invert()}</style>"  ],
                    ["4","Act 1","Instructions\n<style> .main-card {filter:invert()}</style>"  ],
                    ["5","Creating Heroes","In this act, you will take turns drawing hero cards. On your turn, you will read the hero's description and answer the question. Then, add the hero's archetype (e.g. The Veteran) to the list below (scroll down).\n\nDuring the game, you can refer to each hero by their archetype instead of giving them names."  ],
                    ["6","Number of Heroes","Each player will create at least one hero. If there are fewer than five players, each player should create two heroes.\n\nKeep clicking 'Next Card' until you're done creating heroes. Then, click 'Next Act' to proceed to Act 2."  ],
                    ["7","Hero Backgrounds","These heroes are not local to Ikara. All have answered the for help and are committed to helping the community.\n\nAs you introduce a hero, mention what relationships they have with the other heroes or with Ikara."  ],
                    ["8","Act 1","Scenes\n<style> .main-card {filter:invert()}</style>"  ],
                    ["9","The Veteran","You are a jaded veteran who has seen too much combat.\n\nWhy have you chosen to help Ikara?\n\n<small><em>Click Next Act when you have enough heroes (1-2 per player)</em></small>"  ],
                    ["9","The Untested","You are an untested youth, fully trained who has never seen combat.\n\nWhy have you chosen to help Ikara?\n\n<small><em>Click Next Act when you have enough heroes (1-2 per player)</em></small>"  ],
                    ["9","The Charmer","You lack any combat skills but make up for it with kindness and charm.\n\nWhy have you chosen to help Ikara?\n\n<small><em>Click Next Act when you have enough heroes (1-2 per player)</em></small>"  ],
                    ["9","The Virtuoso","You have dedicated your life to martial excellence and your skills are peerless.\n\nWhy have you chosen to help Ikara?\n\n<small><em>Click Next Act when you have enough heroes (1-2 per player)</em></small>"  ],
                    ["9","The Strategist","You are a genius when it comes to strategy, tactics, and traps.\n\nWhy have you chosen to help Ikara?\n\n<small><em>Click Next Act when you have enough heroes (1-2 per player)</em></small>"  ],
                    ["9","The Tinkerer","You are unparalleled at tinkering with devices and machinery.\n\nWhy have you chosen to help Ikara?\n\n<small><em>Click Next Act when you have enough heroes (1-2 per player)</em></small>"  ],
                    ["9","The Sage","Everyone values your wisdom and seeks out your advice.\n\nWhy have you chosen to help Ikara?\n\n<small><em>Click Next Act when you have enough heroes (1-2 per player)</em></small>"  ],
                    ["9","The Tagalong","The other heroes did not want you to join them but you came along anyway.\n\nWhy have you chosen to help Ikara?\n\n<small><em>Click Next Act when you have enough heroes (1-2 per player)</em></small>"  ],
                    ["9","The Returned","You were born in Ikara but you swore that you'd never return.\n\nWhy have you chosen to come back and help?\n\n<small><em>Click Next Act when you have enough heroes (1-2 per player)</em></small>"  ],
                    ["10","Act 2","In which the heroes help Ikara prepare for the bandit attack\n<style> .main-card {filter:invert()}</style>"  ],
                    ["11","Act 2","Instructions\n<style> .main-card {filter:invert()}</style>"  ],
                    ["12","Instructions","On your turn answer the prompt for the selected hero in the hero tracker.\n\nIf you don't want to answer a prompt, you can ask another player to answer it for their hero or you can choose to draw a different prompt.\n\nClicking on a hero in the tracker will set them to be the active hero."  ],
                    ["13","Instructions","You can respond to the prompt however you wish, though a short answer is always okay.\n\nOther players are welcome to ask follow-up questions and clarifications.\n\nWhen you're done exploring the heroes and Ikara, advance to Act 3 for the battle with the Bandits. For a 30 minute game, answer 2 cards per hero."  ],
                    ["14","Act 2","Scenes\n<style> .main-card {filter:invert()}</style>"  ],
                    ["15","The Preparations","Amid all the preparations you find time to unwind.\n\nWhat is the best way to relax in Ikara?"  ],
                    ["15","The Preparations","You skirmish with the bandit scouts and get the better of them.\n\nWhat do you learn from the encounter?"  ],
                    ["15","The Preparations","Wherever you look, Ikara bears the scars of past bandit raids.\n\nWhat scars are most notable?"  ],
                    ["15","The Preparations","The layout of Ikara has a natural weakness that makes it hard to defend.\n\nWhat is it and how do you attempt to strengthen it?"  ],
                    ["15","The Preparations","The layout of Ikara has a natural strong point that will help you during the attack.\n\nWhat is it and how will you take advantage of it?"  ],
                    ["15","The Preparations","You set up clever traps for when the bandits attack.\n\nWhat are they?"  ],
                    ["15","The Preparations","You improvise weapons out of local resources.\n\nWhat are they?"  ],
                    ["15","The Preparations","You hold drills with the locals who will help you during the battle.\n\nWhat tactics do you teach them?"  ],
                    ["15","The Preparations","You build defensive fortifications that will help you when the bandits attack.\n\nWhat are they?"  ],
                    ["15","The Preparations","You scout ahead and learn something about the bandits that will help you in battle.\n\nWhat is it?"  ],
                    ["15","The Preparations","You discover valuable weapons hidden in Ikara.\n\nWhat are they and how do you plan to use them?"  ],
                    ["15","The Preparations","In order to maximize your chance of success, part of Ikara must be risked or sacrificed.\n\nWhat is the sacrifice and how do the locals react?"  ],
                    ["15","The Preparations","One of the locals does not trust the heroes and wants them gone.\n\nWhat is their reason and how do you change their mind?"  ],
                    ["15","The Preparations","A younger local wants to fight alongside you but their family wants them to hide and stay safe.\n\nHow do you handle the situation?"  ],
                    ["15","The Preparations","One of the locals is falling in love with you.\n\nHow do you feel about them? Do you act on those feelings?"  ],
                    ["15","The Preparations","One of the locals is convinced that you are doomed to failure and they are trying to convince the others that surrender is the only option.\n\nHow do you handle the situation?"  ],
                    ["15","The Preparations","A community elder welcomes the heroes into their home.\n\nWhat is the traditional method of welcoming guests in Ikara?"  ],
                    ["15","The Preparations","A local makes an impassioned case for why you should settle in Ikara after the battle.\n\nWhat do they say and do you seriously consider it?"  ],
                    ["16","Act 3","In which the bandits attack and a terrible price is paid\n<style> .main-card {filter:invert()}</style>"  ],
                    ["17","Act 3","Instructions\n<style> .main-card {filter:invert()}</style>"  ],
                    ["18","Instructions","On your turn read the prompt and answer the question.\n\nSome of the prompts give you the option to sacrifice yourself to prevent a bad outcome; if you choose to do so, describe your hero going out in a blaze of glory. If you choose not to make the sacrifice, describe the cost of not intervening and mention different contribution you make to the battle.\n\nDepending on the tone of your game, you may want to have the sacrifice be a grevious injury instead of death."  ],
                    ["19","Instructions","Once every hero has answered a prompt, you may end the battle and move to Act 4: The Aftermath.\n\nIf you want to extend the battle, you may continue to draw Act 3 prompts until you're ready to end the act."  ],
                    ["20","Act 3","Scenes\n<style> .main-card {filter:invert()}</style>"  ],
                    ["21","The Battle","A bandit is poised to kill a beloved member of Ikara.\n\nDo you sacrifice yourself to save them?"  ],
                    ["21","The Battle","The bandits are about to destroy a massive portion of Ikara.\n\nDo you sacrifice yourself to save it?"  ],
                    ["21","The Battle","The bandits are about to wipe out a squad of locals.\n\nDo you sacrifice yourself to save them?"  ],
                    ["21","The Battle","You see an opportunity to the bandits' prisoners at the cost of your own life.\n\nDo you sacrifice yourself to save them?"  ],
                    ["21","The Battle","You save a fellow hero from certain death.\n\nWho was it and how did you save them?"  ],
                    ["21","The Battle","You strike recklessly at the Bandits and come out ahead.\n\nWhat happened?"  ],
                    ["21","The Battle","You catch some of the bandits with a pre-laid trap.\n\nWhat was it?"  ],
                    ["21","The Battle","You take out the bandit leader, dealing a heavy blow to their morale.\n\nHow did you do it?"  ],
                    ["21","The Battle","You undermine a key part of the Bandit assault.\n\nWhat is it and how do you do it?"  ],
                    ["22","Act 4","In which we learn the fate of Ikara and the Heroes\n<style> .main-card {filter:invert()}</style>"  ],
                    ["23","The Fate of Ikara","Did Ikara win the battle? Decide now, as a group."  ],
                    ["24","The Fate of the Heroes","Take turns creating epilogues for your characters.\n\nIf your character died in battle, add some details about the future of Ikara and its residents.\n\nOnce every hero has gone, the game is over."  ],
                    ["25","The End","<style> .main-card {filter:invert()}</style>"  ],
                    ["26","Credits","Designed by Randy Lubin, Diegetic Games\n\nInspired by Seven Samurai and <a href=\"https://forthequeengame.com/\">For The Queen</a>\n\nPowered by <a href=\"https://docs.google.com/spreadsheets/d/1FIWw_lyefEPF9dc-4C-cBwr9gg3D1QH5vkW89WxGu68/edit?usp=sharing\">this spreadsheet</a> via Story Synth\n<style> .main-card {filter:invert()}</style>"  ]
                  ]

      var cleanData = [];

      // Transform Sheets API response into cleanData
      gRows.forEach((item) => {
        // Handle options
        if (item[0] == "option") {
          this.customOptions[item[1]] =
            item[2];
          console.log(item[2]);
        }

        // Handle extensions
        if (item[0] == "extension") {
          this.tempExtensionData[item[1]] =
            item[2];

          console.log(
            "extension -",
            item[1],
            item[2]
          );
        }

        // Handle cards
        if (
          item[0] !== "option" &&
          item[0] !== "extension"
        ) {
          var rowInfo = {
            ordered: item[0],
            headerText: item[1],
            bodyText: item[2],
          };

          cleanData.push(rowInfo);

          if (rowInfo.ordered >= this.totalDecks) {
            this.totalDecks = parseInt(rowInfo.ordered) + 1;
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
