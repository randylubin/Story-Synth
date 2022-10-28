<template>

  <div class="shuffled game-room" v-if="roomInfo">
    <app-menuBar :roomInfo="roomInfo" :tempExtensionData="tempExtensionData" :customOptions="customOptions"
      :monetizedByUser="monetizedByUser" :routeRoomID="$route.params.roomID" :dataReady="dataReady"
      :firebaseReady="firebaseReady" @roomMonetized="$emit('roomMonetized', true)">
      <div class="row menu-row" v-if="!customOptions.facilitatorMode || userRole == 'facilitator'">
        <b-button v-b-modal.reshuffleConfirm v-on:click="closeMenu()" class="btn-lg btn-block control-button-restart"
          variant="outline-dark" :disabled="roomInfo.xCardIsActive" color="rgb(187, 138, 200)">Restart</b-button>
      </div>
      <div class="row menu-row" v-if="!roomInfo.xCardIsActive">
        <b-button variant="outline-dark" class="btn-lg btn-block control-button-safety-card"
          v-on:click="xCard(); closeMenu();">{{ customOptions.safetyCardButton
          ? customOptions.safetyCardButton
          : 'X-Card'
          }}</b-button>
      </div>
      <div class="row menu-row">
        <b-button v-on:click="
          nextDeck();
          closeMenu();
        " variant="outline-dark" class="control-button-next-deck btn-lg btn-block" v-if="
          this.customOptions.showNextDeckButton &&
          (!customOptions.facilitatorMode || userRole == 'facilitator')
        " :disabled="
          roomInfo.xCardIsActive ||
          roomInfo.currentCardIndex >= roomInfo.locationOfLastCard
        ">{{ customOptions.showNextDeckButton
        ? customOptions.showNextDeckButton
        : 'Next Deck'
        }}</b-button>
      </div>
      <div v-if="customOptions.treatLastCardAsLastDeck"
        :disabled="roomInfo.currentCardIndex >= roomInfo.locationOfLastCard" class="row menu-row">
        <b-button variant="outline-dark" class="control-button-last-deck btn-lg btn-block" v-on:click="
          lastCard();
          closeMenu();
        " :disabled="
          roomInfo.xCardIsActive ||
          roomInfo.currentCardIndex == gSheet.length - 1 ||
          roomInfo.currentCardIndex == roomInfo.locationOfLastCard
        ">
          Go to {{ customOptions.lastCardLabel }}
        </b-button>
      </div>
      <div v-if="
        !customOptions.treatLastCardAsLastDeck &&
        !this.customOptions.showNextDeckButton &&
        (!customOptions.facilitatorMode || userRole == 'facilitator') &&
        !customOptions.hideNavigationButtons
      ">
        <hr class="mb-4" v-if="(!customOptions.hideLastCardOptions || renderChapterNavigation)" />
        <h6 class="text-center" v-if="!customOptions.hideLastCardOptions">{{ customOptions.lastCardLabel }} Options</h6>
        <div class="row menu-row" v-if="!customOptions.hideLastCardOptions">
          <b-button class="btn-block" v-on:click="
            lastCard();
            closeMenu();
          " :disabled="
            roomInfo.xCardIsActive ||
            roomInfo.currentCardIndex == gSheet.length - 1 ||
            roomInfo.currentCardIndex == roomInfo.locationOfLastCard
          ">
            Go to {{ customOptions.lastCardLabel }}
          </b-button>

          <b-button class="btn-block" v-on:click="
            shuffleLastCard('center');
            closeMenu();
          " :disabled="
            roomInfo.xCardIsActive ||
            roomInfo.currentCardIndex == gSheet.length - 1 ||
            roomInfo.currentCardIndex == roomInfo.locationOfLastCard
          ">
            Shuffle near middle
          </b-button>

          <b-button class="btn-block" v-on:click="
            shuffleLastCard('end');
            closeMenu();
          " :disabled="
            roomInfo.xCardIsActive ||
            roomInfo.currentCardIndex == gSheet.length - 1 ||
            roomInfo.currentCardIndex == roomInfo.locationOfLastCard
          ">
            Shuffle near end
          </b-button>
        </div>
      </div>
      <div class="mb-4" v-if="
        renderChapterNavigation &&
        (!customOptions.facilitatorMode || userRole == 'facilitator')
      ">
        <h6 class="text-center" v-if="customOptions.chapterNavHeader">
          {{ customOptions.chapterNavHeader }}
        </h6>

        <div class="row menu-row" v-for="chapter in chapterNavLabels" :key="chapter.label">
          <b-button class="btn-block" v-on:click="
            goToCard(parseInt(deckIndex[chapter.deckNumber]));
          closeMenu();" :disabled="roomInfo.xCardIsActive">
            {{ chapter.label }}
          </b-button>
        </div>
      </div>
    </app-menuBar>

    <b-alert show class="" variant="danger" v-if="firebaseCacheError">Warning: the length of the deck has changed since
      this room was first
      created. Click Restart to resync card data.</b-alert>
    <b-alert show class="demoInfo" variant="info" v-if="customOptions.demoInfo">This demo is powered by
      <a :href="customOptions.demoInfo" target="_blank">this Google Sheet Template</a>. Copy the sheet and start editing
      it to design your own game!
    </b-alert>

    <slot name="upper-extensions">
    </slot>

    <div class="" v-if="roomInfo">
      <div class="before-game-card">
        <!-- TODO: Facilitator Notes
        <div class="facilitator-panel" v-if="userRole == 'facilitator' && customOptions.facilitatorMode">
          <h1>Faciliator</h1>
        </div>
        -->

        <transition name="fade">
          <div class="fab-buttons container" v-if="
            (!customOptions.facilitatorMode || userRole == 'facilitator') &&
            (!customOptions.hideNavigationButtons ||
              parseInt(customOptions.hideNavigationButtons) >
              roomInfo.currentCardIndex)
          ">
            <!-- Previous Card -->
            <button class="btn btn-outline-dark btn-fab btn-fab-left control-button-previous-card shadow"
              v-on:click="previousCard()" v-b-tooltip.hover title="Previous Card" :disabled="
                roomInfo.xCardIsActive || roomInfo.currentCardIndex == 0 ||
                (roomInfo.extensionData && (roomInfo.extensionData.interruptsReplaceMainCards || roomInfo.extensionData.interruptsPauseNavigation) && roomInfo.extensionData.currentInterrupt)
              ">
              <b-icon class="h1 mb-0" icon="chevron-left"></b-icon>
              <b-icon class="h1 mb-0 mr-2" icon="card-heading"></b-icon>
            </button>
            <!-- Next Card -->
            <button class="btn btn-outline-dark btn-fab btn-fab-right control-button-next-card shadow" v-b-tooltip.hover
              title="Next Card" v-on:click="nextCard()" :disabled="
                roomInfo.xCardIsActive ||
                roomInfo.currentCardIndex >= roomInfo.locationOfLastCard ||
                (customOptions.treatLastCardAsLastDeck &&
                  this.roomInfo.cardSequence.indexOf(
                    this.unorderedDecks[this.unorderedDecks.length - 1][0]
                  ) == this.roomInfo.currentCardIndex) ||
                (roomInfo.extensionData && (roomInfo.extensionData.interruptsReplaceMainCards || roomInfo.extensionData.interruptsPauseNavigation) && roomInfo.extensionData.currentInterrupt)
              ">
              <div v-if="roomInfo.currentCardIndex == 0">
                <b-icon class="h1 mb-0 ml-2" animation="fade" icon="card-heading"></b-icon>
                <b-icon class="h1 mb-0" animation="fade" icon="chevron-right"></b-icon>
              </div>
              <div v-else>
                <b-icon class="h1 mb-0 ml-2" icon="card-heading"></b-icon>
                <b-icon class="h1 mb-0" icon="chevron-right"></b-icon>
              </div>
            </button>
          </div>
        </transition>

        <div class="row mb-3 game-meta card-counter" v-if="
          customOptions.displayCardCount &&
          customOptions.displayCardCount - 1 <= roomInfo.currentCardIndex &&
          roomInfo.currentCardIndex < roomInfo.locationOfLastCard
        ">
          <div class="col-sm">
            <h2>
              <span v-if="customOptions.displayCardCountLabel">{{
              customOptions.displayCardCountLabel
              }}</span><span v-else>Cards seen:</span>
              {{
              roomInfo.currentCardIndex - customOptions.displayCardCount + 1
              }}
            </h2>
          </div>
        </div>
      </div>

      <!-- Safety Card -->
      <div class="card main-card d-flex shadow img-fluid mb-4" v-if="roomInfo.xCardIsActive">
        <div class="card-body align-items-center justify-content-center" v-bind:class="{
          'card-body': !customOptions.cardBackgroundImage,
          'card-img-overlay':
            customOptions.cardBackgroundImage &&
            !customOptions.cardBackgroundImageAlign,
        }">
          <div class="mt-5 pt-5 mb-5">
            <h1 v-if="!customOptions.safetyCardText">X-Card</h1>
            <div class="safety-card-text" v-dompurify-html="customOptions.safetyCardText"
              v-if="customOptions.safetyCardText">
            </div>
          </div>
          <button class="btn btn-outline-dark mt-5" v-on:click="xCard()">
            Continue
          </button>
          <div class="" v-if="!customOptions.safetyCardText">
            <a class="x-card-text" href="http://tinyurl.com/x-card-rpg">About the X-Card</a>
          </div>
        </div>

        <!-- Card Image, Bottom -->
        <b-card-img v-bind:src="customOptions.cardBackgroundImage" alt="Card Background image" bottom v-if="
          customOptions.cardBackgroundImageAlign == 'bottom' &&
          roomInfo.currentCardIndex != 0
        "></b-card-img>
      </div>

      <!-- Main Card -->
      <div v-for="(card, cardIndex) in roomInfo.cardSequence" v-bind:key="cardIndex">
        <!-- <transition name="fade out-in"> -->
        <div class="card main-card d-flex shadow img-fluid mb-4" v-bind:class="{
          'bg-transparent':
            customOptions.coverImage &&
            !customOptions.noCoverImageInSession &&
            cardIndex == 0,
        }" v-if="
          gSheet[roomInfo.cardSequence[roomInfo.currentCardIndex]] &&
          cardIndex == roomInfo.currentCardIndex &&
          (!roomInfo.extensionData || !(roomInfo.extensionData.interruptsReplaceMainCards && roomInfo.extensionData.currentInterrupt)) &&
          !roomInfo.xCardIsActive
        ">
          <!-- card images -->
          <img v-bind:src="customOptions.coverImage" class="card-img-top" style="width: 100%" v-if="
            customOptions.coverImage &&
            !customOptions.noCoverImageInSession &&
            roomInfo.currentCardIndex == 0
          " />
          <img v-bind:src="customOptions.cardBackgroundImage" class="card-img-top card-background" style="width: 100%"
            v-if="
              customOptions.cardBackgroundImage &&
              (!customOptions.coverImage ||
                roomInfo.currentCardIndex != 0 ||
                customOptions.noCoverImageInSession) &&
              !customOptions.cardBackgroundImageAlign
            " />
          <b-card-img v-bind:src="customOptions.cardBackgroundImage" alt="Card Background image" top v-if="
            customOptions.cardBackgroundImageAlign == 'top' &&
            roomInfo.currentCardIndex != 0
          "></b-card-img>

          <div class="row mt-4 mx-4 game-meta" v-if="
            customOptions.instructionsProgressBar &&
            roomInfo.currentCardIndex < firstNonInstruction &&
            roomInfo.currentCardIndex != 0
          ">
            <div class="col-sm">
              <h3>Instructions</h3>
              <b-progress :value="roomInfo.currentCardIndex" :max="firstNonInstruction - 1" variant="dark"></b-progress>
            </div>
          </div>

          <!-- Main Game Cards -->
          <div v-if="
            !customOptions.coverImage ||
            roomInfo.currentCardIndex != 0 ||
            customOptions.noCoverImageInSession
          " v-bind:class="gSheet[roomInfo.cardSequence[roomInfo.currentCardIndex]].deckNumberClass">
            <div class="card-body justify-content-center d-flex align-items-center mt-4" v-bind:class="{
              'card-img-overlay':
                customOptions.cardBackgroundImage &&
                !customOptions.cardBackgroundImageAlign,
            }">
              <div v-if="!roomInfo.showCardBack">
                <h1 v-if="!customOptions.hideHeadersOnCards" class="main-card-header-text">
                  {{
                  gSheet[roomInfo.cardSequence[roomInfo.currentCardIndex]]
                  .headerText
                  }}
                </h1>
                <div class="mt-4 mb-4 main-card-body-text" v-dompurify-html="
                  gSheet[roomInfo.cardSequence[roomInfo.currentCardIndex]]
                    .bodyText
                "></div>
                <button class="btn btn-outline-dark" v-on:click="flipCard()" v-if="
                  gSheet[roomInfo.cardSequence[roomInfo.currentCardIndex]]
                    .cardBack && customOptions.reversableCards
                ">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                    class="bi bi-arrow-repeat" viewBox="0 0 16 16">
                    <path
                      d="M11.534 7h3.932a.25.25 0 0 1 .192.41l-1.966 2.36a.25.25 0 0 1-.384 0l-1.966-2.36a.25.25 0 0 1 .192-.41zm-11 2h3.932a.25.25 0 0 0 .192-.41L2.692 6.23a.25.25 0 0 0-.384 0L.342 8.59A.25.25 0 0 0 .534 9z" />
                    <path fill-rule="evenodd"
                      d="M8 3c-1.552 0-2.94.707-3.857 1.818a.5.5 0 1 1-.771-.636A6.002 6.002 0 0 1 13.917 7H12.9A5.002 5.002 0 0 0 8 3zM3.1 9a5.002 5.002 0 0 0 8.757 2.182.5.5 0 1 1 .771.636A6.002 6.002 0 0 1 2.083 9H3.1z" />
                  </svg>
                </button>
              </div>
              <div v-else>
                <div class="mt-4 mb-4" v-dompurify-html="
                  gSheet[roomInfo.cardSequence[roomInfo.currentCardIndex]]
                    .cardBack
                "></div>
                <button class="btn btn-outline-dark" v-on:click="flipCard()" v-if="
                  gSheet[roomInfo.cardSequence[roomInfo.currentCardIndex]]
                    .cardBack && customOptions.reversableCards
                ">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                    class="bi bi-arrow-repeat" viewBox="0 0 16 16">
                    <path
                      d="M11.534 7h3.932a.25.25 0 0 1 .192.41l-1.966 2.36a.25.25 0 0 1-.384 0l-1.966-2.36a.25.25 0 0 1 .192-.41zm-11 2h3.932a.25.25 0 0 0 .192-.41L2.692 6.23a.25.25 0 0 0-.384 0L.342 8.59A.25.25 0 0 0 .534 9z" />
                    <path fill-rule="evenodd"
                      d="M8 3c-1.552 0-2.94.707-3.857 1.818a.5.5 0 1 1-.771-.636A6.002 6.002 0 0 1 13.917 7H12.9A5.002 5.002 0 0 0 8 3zM3.1 9a5.002 5.002 0 0 0 8.757 2.182.5.5 0 1 1 .771.636A6.002 6.002 0 0 1 2.083 9H3.1z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
          <b-alert show class="mx-3" v-dompurify-html="customOptions.lastCardReminderText" variant="info" v-if="
            customOptions.lastCardReminderText &&
            customOptions.lastCardReminderFrequency &&
            roomInfo.currentCardIndex > firstNonInstruction &&
            (roomInfo.currentCardIndex - firstNonInstruction) %
            customOptions.lastCardReminderFrequency ==
            customOptions.lastCardReminderFrequency - 1
          ">
          </b-alert>
        </div>
        <!-- </transition> -->
      </div>

      <!-- TODO: Consider cleaner way to manage the v-if using renderChapterNavigation -->
      <div class="after-game-card">
        <div class="mb-4 extension" v-if="
          renderChapterNavigation && customOptions.showChapterNavOnPage &&
          (!customOptions.facilitatorMode || userRole == 'facilitator')
        ">
          <div class="row">
            <div class="col-sm">
              <div class="card d-flex">
                <div class="card-body">
                  <h2 v-if="customOptions.chapterNavHeader">
                    {{ customOptions.chapterNavHeader }}
                  </h2>
                  <div v-for="chapter in chapterNavLabels" :key="chapter.label">
                    <b-button class="btn-block btn-default my-2 chapter-nav-button"
                      @click="goToCard(parseInt(deckIndex[chapter.deckNumber]))" :disabled="roomInfo.xCardIsActive">
                      {{ chapter.label }}
                    </b-button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <slot name="lower-extensions">
        </slot>
        <b-modal id="modalNextDeckConfirm" title="Advance?" hide-footer>
          <p></p>
          <div class="text-center mb-3">
            <b-button variant="dark" v-on:click="nextDeck()">Advance to
              {{
              customOptions.showNextDeckButton
              ? customOptions.showNextDeckButton
              : "Next Deck"
              }}</b-button>
          </div>
        </b-modal>
        <b-modal id="reshuffleConfirm" title="Restart and Reshuffle" hide-footer>
          <p>
            Do you want to reshuffle all of the prompts and restart the game?
          </p>
          <div class="text-center mb-3">
            <b-button variant="dark" v-on:click="shuffleAndResetGame()">Restart and Reshuffle</b-button>
          </div>
        </b-modal>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "app-shuffled",
  components: {
    "app-menuBar": () => import("../layout/MenuBar.vue"),
  },
  props: {
    roomID: String,
    gSheetID: String,
    userRole: String,
    sheetData: Array,
    roomInfo: Object,
    tempExtensionData: Object,
    firebaseReady: Boolean,
    roomMonetized: Boolean,
    monetizedByUser: Boolean,
  },
  data: function () {
    return {
      firstNonInstruction: 0,
      dataReady: false,
      gSheet: [{ text: "loading" }],
      orderedCards: [],
      currentDeck: 0,
      totalDecks: 0,
      deckIndex: [0],
      unorderedDecks: {},
      customOptions: {
        gameTitle: undefined,
        byline: undefined,
        gameBlurb: undefined,
        password: undefined,
        wallet: undefined,
        revShare: 0.2,
        lastCardLabel: "Last Card",
      },
      deckTransitionArray: null,
      selectedWallet: undefined,
      error: false,
      renderChapterNavigation: false,
      chapterNavLabels: []
    };
  },
  computed: {
    firebaseCacheError: function () {
      if (
        this.roomInfo &&
        this.roomInfo?.cardSequence?.length !== this.gSheet.length
      ) {
        return true;
      } else {
        return false;
      }
    },
  },
  watch: {
    sheetData: function () {
      this.processSheetData();
    },
    roomInfo: function () {
      if (
        this.firebaseReady &&
        this.dataReady &&
        this.roomInfo?.cardSequence.length < 4
      ) {
        this.shuffleAndResetGame();
      }
    },
  },
  mounted() {
    if (this.sheetData) {
      this.processSheetData();
    }

    if (this.firebaseReady && !this.roomInfo) {
      this.initialFirebaseSetup();
    }
  },
  methods: {
    initialFirebaseSetup() {
      this.$emit("firebase-set", {
        extensionData: this.tempExtensionData,
        xCardIsActive: false,
        currentCardIndex: 0,
        cardSequence: [0, 1, 2],
      });
    },
    goToCard(index) {
      let updatedPreviousCardsArray = this.roomInfo.previousCardsArray;
      updatedPreviousCardsArray.push(index);

      this.$emit("firebase-update", {
        currentCardIndex: index,
        previousCardsArray: updatedPreviousCardsArray,
        showCardBack: false,
      });
    },
    previousCard() {
      let updatedPreviousCardsArray = this.roomInfo.previousCardsArray
      updatedPreviousCardsArray.pop()
      let nextCard = updatedPreviousCardsArray[updatedPreviousCardsArray.length - 1]

      this.$emit('firebase-update', {
        previousCardsArray: updatedPreviousCardsArray,
        currentCardIndex: nextCard,
        showCardBack: false,
      });
    },
    nextCard() {
      // make sure there's a deck
      if (this.roomInfo.cardSequence.length == 1) {
        this.shuffleAndResetGame();
      }

      // default to one more than the current card
      let destinationCard = this.roomInfo.currentCardIndex + 1;

      if (this.deckTransitionArray) {
        console.log(this.roomInfo.currentCardIndex, this.firstNonInstruction);
        if (
          this.deckTransitionArray.includes(this.roomInfo.currentCardIndex + 1)
        ) {
          destinationCard = null;
          this.nextDeck();
        }
      }

      if (destinationCard) {
        let updatedPreviousCardsArray = this.roomInfo.previousCardsArray
        updatedPreviousCardsArray.push(destinationCard)
        this.$emit('firebase-update', {
          previousCardsArray: updatedPreviousCardsArray,
          currentCardIndex: destinationCard,
          showCardBack: false,
        });
      }
    },
    lastCard() {
      if (this.roomInfo.cardSequence.length == 1) {
        this.shuffleAndResetGame();
      }

      let tempLastCardLocation = this.roomInfo.locationOfLastCard;

      if (this.customOptions.treatLastCardAsLastDeck) {
        tempLastCardLocation = this.roomInfo.cardSequence.indexOf(this.unorderedDecks[this.unorderedDecks.length - 1][0])
      }

      let updatedPreviousCardsArray = this.roomInfo.previousCardsArray
      updatedPreviousCardsArray.push(tempLastCardLocation)

      this.$emit('firebase-update', {
        previousCardsArray: updatedPreviousCardsArray,
        currentCardIndex: tempLastCardLocation,
        locationOfLastCard: tempLastCardLocation,
        showCardBack: false,
      });
    },
    xCard() {
      this.$emit("firebase-update", {
        xCardIsActive: !this.roomInfo.xCardIsActive,
      });
    },
    closeMenu() {
      this.$bvModal.hide("menuModal");
    },
    copyLinkToClipboard() {
      let currentUrl = location.hostname.toString() + this.$route.fullPath;
      navigator.clipboard.writeText(currentUrl).then(
        function () {
          console.log("copied url");
        },
        function () {
          console.log("copy failed");
        }
      );
    },
    nextDeck() {
      this.$bvModal.hide("modalNextDeckConfirm");
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

      let updatedPreviousCardsArray = this.roomInfo.previousCardsArray
      updatedPreviousCardsArray.push(newCardIndex)

      this.$emit('firebase-update', {
        previousCardsArray: updatedPreviousCardsArray,
        currentCardIndex: newCardIndex,
        showCardBack: false,
      });
    },
    shuffleLastCard(location, cardSequence, fromReshuffle = false) {
      if (!cardSequence) {
        cardSequence = this.roomInfo.cardSequence;
      }

      var tempNewLastCardLocation = cardSequence.length - 1;

      switch (location) {
        case "center":
          tempNewLastCardLocation =
            Math.floor((cardSequence.length - this.orderedCards.length) / 2) +
            this.orderedCards.length +
            Math.floor(Math.random() * 4 - 2);
          break;
        case "end":
          tempNewLastCardLocation =
            cardSequence.length - Math.floor(Math.random() * 4) - 1;
          break;
        default:
          if (Number.isInteger(location)) {
            tempNewLastCardLocation = location;
          }
      }
      console.log("last card", tempNewLastCardLocation);

      let oldLastCardLocation = cardSequence.length - 1;

      if (
        this.roomInfo.locationOfLastCard == 0 ||
        !this.roomInfo.locationOfLastCard || fromReshuffle
      ) {
        oldLastCardLocation = cardSequence.length - 1;
      } else {
        oldLastCardLocation = this.roomInfo.locationOfLastCard;
      }

      console.log('old last card location', oldLastCardLocation)

      let lastCardNumber = cardSequence[oldLastCardLocation];

      // remove the last card from the sequence
      let newCardSequence = cardSequence;
      console.log('updated sequence', newCardSequence, tempNewLastCardLocation)

      newCardSequence.splice(oldLastCardLocation, 1);

      console.log('updated sequence', newCardSequence, tempNewLastCardLocation)
      // add it back in
      newCardSequence.splice(tempNewLastCardLocation, 0, lastCardNumber);

      console.log('updated sequence', newCardSequence, tempNewLastCardLocation)

      this.$emit("firebase-update", {
        cardSequence: newCardSequence,
        locationOfLastCard: tempNewLastCardLocation,
        showCardBack: false,
      });
    },
    flipCard() {
      let tempShowCardBack = true;
      if (this.roomInfo.showCardBack) {
        tempShowCardBack = false;
      }

      this.$emit("firebase-update", {
        showCardBack: tempShowCardBack,
      });
    },
    shuffleAndResetGame() {
      console.log(
        "shuffling and resetting",
        this.orderedCards,
        this.unorderedDecks
      );
      this.$bvModal.hide("reshuffleConfirm");
      this.$bvModal.hide("menuModal");

      // Create a ordered array
      let newCardSequence = [];

      // Add the ordered cards first
      for (var i = 0; i < this.orderedCards.length; i++) {
        newCardSequence.push(i);
      }

      // Shuffle deck function
      let shuffleDeck = function (deck) {
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

      // check for set last card location
      let tempLastCardIndex = newCardSequence.length - 1;
      let lastLocation = parseFloat(this.customOptions.setLastCardLocation);
      let lengthOfUnorderedDecks = [].concat.apply(
        [],
        this.unorderedDecks
      ).length;

      if (lastLocation) {
        if (lastLocation >= 1) {
          tempLastCardIndex = lastLocation + this.orderedCards.length;
        } else if (lastLocation > 0) {
          let maxLoc = newCardSequence.length;
          let minLoc =
            newCardSequence.length -
            Math.floor(lengthOfUnorderedDecks * lastLocation) -
            1;
          tempLastCardIndex = Math.floor(
            Math.random() * (maxLoc - minLoc) + minLoc
          );
          // console.log('new location:', tempLastCardIndex, maxLoc, minLoc, lengthOfUnorderedDecks, this.orderedCards.length)
        } else {
          tempLastCardIndex = newCardSequence.length + lastLocation - 1;
        }
      }

      // sync the shuffled array
      this.$emit('firebase-update', {
        previousCardsArray: [0],
        cardSequence: newCardSequence,
        currentCardIndex: 0,
        locationOfLastCard: newCardSequence.length - 1,
        extensionData: this.tempExtensionData,
      });

      console.log('last location', !Number.isNaN(lastLocation))
      if (!Number.isNaN(lastLocation)) {
        this.shuffleLastCard(tempLastCardIndex, newCardSequence, true);
      }
    },
    setupChapterNavigation() {
      this.chapterNavLabels = this.parseChaptersFromCustomOptions();
      if (this.chapterNavLabels.length > 0) {
        this.renderChapterNavigation = true;
      }
    },
    parseChaptersFromCustomOptions() {
      const regex = /^chapter-(\d+)-(\w+)$/;

      return Object.entries(this.customOptions)
        .filter(([key]) => regex.test(key))
        .reduce((arr, [key, value]) => {
          const match = key.match(regex);

          // The chapter numbers are 1 based because it should be human readable in the gsheet, but we need to subtract one to make them 0 based for the array
          const index = Number.parseInt(match[1]) - 1;
          const chapterKey = match[2];

          if (!arr[index]) {
            arr[index] = {};
          }
          arr[index][chapterKey] = value;

          return arr;
        }, []);
    },

    processSheetData() {
      let cleanData = [];

      if (this.sheetData) {
        for (let i = 1; i < this.sheetData.length; i++) {
          let row = this.sheetData[i];
          if (row[0]) {
            // Handle options
            if (row[0] == "option" && row[1] && row[2]) {
              // console.log('parsing options', row[2])
              this.customOptions[row[1]] =
                this.$markdownFriendlyOptions.includes(row[1])
                  ? this.$marked(row[2])
                  : row[2];
            }

            // Handle cards
            if (row[0] !== "option" && row[0] !== "extension") {
              if (row[2]) {
                row[2] = row[2] ?? "";
              } else {
                row[2] = "";
              }

              if (row[3]) {
                row[3] = row[3] ?? "";
              } else {
                row[3] = "";
              }

              var rowInfo = {
                ordered: row[0],
                deckNumberClass: "deck-number-" + row[0],
                headerText: row[1] ?? "",
                bodyText: this.$marked(row[2] ?? ""),
              };

              if (row[3] && row[3]) {
                rowInfo.cardBack = this.$marked(row[3]);
              }

              cleanData.push(rowInfo);

              if (rowInfo.ordered >= this.totalDecks) {
                this.totalDecks = parseInt(rowInfo.ordered) + 1;
              }
            }
          }
        }

        this.unorderedDecks = [];
        for (var d = 0; d < this.totalDecks; d++) {
          this.unorderedDecks.push([]);
        }

        // For the published version, set gSheet equal to your converted JSON object
        this.gSheet = cleanData;

        // Sort cleanData into ordered and unordered decks
        cleanData.forEach((row, index) => {
          // console.log('row:', row)
          if (row.ordered == "0") {
            this.orderedCards.push(row);
            this.firstNonInstruction += 1;
          } else if (row.ordered !== "option") {
            this.unorderedDecks[row.ordered].push(index);
          }
        });

        // check for next deck transitions
        if (this.customOptions.cardsDrawnPerDeck) {
          this.deckTransitionArray = [];

          let temporaryDeckTransitionArray =
            this.customOptions.cardsDrawnPerDeck.split(",");
          let deckTransitionIndexTracking = this.firstNonInstruction;

          for (let i = 0; i < temporaryDeckTransitionArray.length; i++) {
            deckTransitionIndexTracking += this.unorderedDecks[i].length;
            this.deckTransitionArray.push(
              deckTransitionIndexTracking +
              parseInt(temporaryDeckTransitionArray[i])
            );
          }
        }

        // Create an index of the different decks
        this.deckIndex = [0];
        if (this.unorderedDecks) {
          let deckIndexTracker = this.orderedCards.length;
          this.deckIndex.push(deckIndexTracker);

          for (var i = 1; i < this.unorderedDecks.length; i++) {
            deckIndexTracker += this.unorderedDecks[i].length;
            console.log("new index:", deckIndexTracker);
            this.deckIndex.push(deckIndexTracker);
          }
        }

        this.setupChapterNavigation();

        console.log(
          "done fetching and cleaning data",
          "FB: ",
          this.firebaseReady
        );
        this.dataReady = true;
        if (this.firebaseReady && this.roomInfo?.cardSequence.length < 4) {
          this.shuffleAndResetGame();
        }
      }
    },
  },
};
</script>

s component only -->

<style lang="scss" scoped>
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

.fade-enter,
.fade-leave-to

/* .fade-leave-active below version 2.1.8 */
  {
  opacity: 0;
}

.x-card-text {
  font-size: 0.5em;
  text-decoration: underline;
}
</style>
