<template>
  <div class="phases game-room" v-if="roomInfo">
    <app-menuBar :roomInfo="roomInfo" :tempExtensionData="tempExtensionData" :customOptions="customOptions"
      :monetizedByUser="monetizedByUser" :routeRoomID="$route.params.roomID" :dataReady="dataReady"
      :firebaseReady="firebaseReady" @roomMonetized="$emit('roomMonetized', true)">
      <div class="row menu-row">
        <b-button v-b-modal.reshuffleConfirm v-on:click="closeMenu();" class="control-button-restart btn-lg btn-block"
          variant="outline-dark" :disabled="roomInfo.xCardIsActive"
          v-if="!customOptions.facilitatorMode || userRole == 'facilitator'" color="rgb(187, 138, 200)">Restart
        </b-button>
      </div>
      <div class="row menu-row">
        <b-button variant="outline-dark" class="control-button-safety-card btn-lg btn-block"
          v-on:click="xCard(); closeMenu();" v-dompurify-html="
            customOptions.safetyCardButton
              ? customOptions.safetyCardButton
              : 'X-Card'
          "></b-button>
      </div>
      <div class="row menu-row" v-if="roomInfo.currentCardIndex < firstNonInstruction">
        <b-button variant="outline-dark" class="btn-lg btn-block" v-on:click="skipInstructions(); closeMenu();">
          Skip Instructions
        </b-button>
      </div>
      <div class="row menu-row" v-if="roomInfo.currentCardIndex >= firstNonInstruction">
        <b-button variant="outline-dark" class="btn-lg btn-block"
          :disabled="roomInfo.currentCardIndex >= endingIndex || roomInfo.xCardIsActive"
          v-on:click="ending(); closeMenu();">
          Ending
        </b-button>
      </div>
    </app-menuBar>

    <b-alert show class="demoInfo" variant="info" v-if="customOptions.demoInfo">This demo is powered by <a
        :href="customOptions.demoInfo" target="_blank">this Google Sheet Template</a>. Copy the sheet and start editing
      it to design your own game!</b-alert>

    <slot name="upper-extensions">
    </slot>

    <!-- <div class="mb-4 game-meta" v-if="customOptions.gameTitle || customOptions.byline">
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
    </div> -->

    <!-- <div class="row mb-4">
      <div class="btn-group col-sm" role="group" aria-label="Card Controls">
        <button class="btn btn-outline-dark" v-on:click="previousCard()" :disabled="roomInfo.xCardIsActive || roomInfo.currentCardIndex == 0">Previous Card</button>
        <button class="btn btn-outline-primary" v-on:click="nextCard()" :disabled="roomInfo.xCardIsActive || roomInfo.currentCardIndex == gSheet.length - 1 || (roomInfo.currentCardIndex == gSheet.length - 1 && roomInfo.currentPhase == numberOfPhases -1)">Next Card</button>
      </div>
    </div> -->

    <transition name="fade">
      <div class="fab-buttons container"
        v-if="(!customOptions.facilitatorMode || userRole == 'facilitator') && (!customOptions.lowerCardNavOnMobile) && (!customOptions.hideNavigationButtons || (parseInt(customOptions.hideNavigationButtons) > roomInfo.currentCardIndex))">
        <button class="btn btn-outline-dark btn-fab btn-fab-left control-button-previous-card shadow"
          v-on:click="previousCard()" v-b-tooltip.hover title="Previous Card"
          :disabled="roomInfo.xCardIsActive || roomInfo.currentCardIndex == 0">
          <!-- Previous Card -->
          <b-icon class="h1 mb-0" icon="chevron-left"></b-icon>
          <b-icon class="h1 mb-0 mr-2" icon="card-heading"></b-icon>
        </button>
        <button class="btn btn-outline-dark btn-fab btn-fab-right control-button-next-card shadow" v-b-tooltip.hover
          title="Next Card" v-on:click="nextCard()"
          :disabled="roomInfo.xCardIsActive || roomInfo.currentCardIndex == gSheet.length - 1 || (roomInfo.currentCardIndex == gSheet.length - 1 && roomInfo.currentPhase == numberOfPhases - 1)">
          <!-- Next Card -->
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



    <div
      v-if="gSheet[roomInfo.cardSequence[roomInfo.currentCardIndex]] || Object.prototype.toString.call(roomInfo.cardSequence[roomInfo.currentCardIndex]) === '[object Object]'"
      class="mb-4">

      <div class="card d-flex shadow img-fluid" v-bind:class="classObject">

        <img v-bind:src="customOptions.coverImage" class="card-img-top" style="width:100%"
          v-if="customOptions.coverImage && roomInfo.currentCardIndex == 0">
        <img v-bind:src="customOptions.cardBackgroundImage" class="card-img-top card-background" style="width:100%"
          v-if="customOptions.cardBackgroundImage && (!customOptions.coverImage || roomInfo.currentCardIndex != 0) && (!customOptions.cardBackgroundImageAlign)">
        <b-card-img v-bind:src="customOptions.cardBackgroundImage" alt="Card Background image" top
          v-if="customOptions.cardBackgroundImageAlign == 'top' && roomInfo.currentCardIndex != 0"></b-card-img>

        <div class="card-body justify-content-center mt-4 mx-4"
          v-if="!roomInfo.xCardIsActive && dataReady && firebaseReady && (!customOptions.coverImage || roomInfo.currentCardIndex != 0)"
          v-bind:class="{ 'card-body': !customOptions.cardBackgroundImage, 'card-img-overlay': (customOptions.cardBackgroundImage && (!customOptions.cardBackgroundImageAlign)) }">
          <div class="row mb-4"
            v-if="customOptions.instructionsProgressBar && roomInfo.currentCardIndex < firstNonInstruction && roomInfo.currentCardIndex != 0">
            <div class="col-sm">
              <h2>Instructions</h2>
              <b-progress :value="roomInfo.currentCardIndex" :max="firstNonInstruction - 1" variant="dark"></b-progress>
            </div>
          </div>

          <div v-if="gSheet[roomInfo.cardSequence[roomInfo.currentCardIndex]]">
            <h2 class="card-header-text">{{ gSheet[roomInfo.cardSequence[roomInfo.currentCardIndex]].headerText }}</h2>

            <p v-if="gSheet[roomInfo.cardSequence[roomInfo.currentCardIndex]].bodyText"
              v-bind:class="{ 'text-left': gSheet[roomInfo.cardSequence[roomInfo.currentCardIndex]].bodyText.length > 60 }"
              class="my-4" v-dompurify-html="gSheet[roomInfo.cardSequence[roomInfo.currentCardIndex]].bodyText"></p>
          </div>

          <div
            v-if="Object.prototype.toString.call(roomInfo.cardSequence[roomInfo.currentCardIndex]) === '[object Object]'">
            <!--<div v-for="(index) in numberOfPhases" v-bind:key="index" v-dompurify-html="phaseData[index-1][roomInfo.cardSequence[roomInfo.currentCardIndex][index-1]]">
              </div>-->
            <h2 class="card-header-text">{{ phaseNames[roomInfo.currentPhase] }}</h2>
            <div
              v-dompurify-html="phaseData[roomInfo.currentPhase][roomInfo.cardSequence[roomInfo.currentCardIndex][roomInfo.currentPhase]]">
            </div>
            <div v-if="Array.isArray(customOptions.phaseHelpText)" class="my-4">
              <p class="phase-help-text">
                <i class="">{{ customOptions.phaseHelpText[roomInfo.currentPhase] }}</i>
              </p>
            </div>
          </div>

        </div>


        <div class="card-body align-items-center justify-content-center" v-if="roomInfo.xCardIsActive"
          v-bind:class="{ 'card-body': !customOptions.cardBackgroundImage, 'card-img-overlay': customOptions.cardBackgroundImage && !customOptions.cardBackgroundImageAlign }">
          <div class="mt-5 pt-5 mb-5">
            <h1 v-if="!customOptions.safetyCardText">X-Card</h1>
            <div class="safety-card-tet" v-dompurify-html="customOptions.safetyCardText"
              v-if="customOptions.safetyCardText"></div>
          </div>
          <button class="btn btn-outline-dark mt-5" v-on:click="xCard()">Continue</button>
          <div class="" v-if="!customOptions.safetyCardText">
            <a class="x-card-text" href="http://tinyurl.com/x-card-rpg">About the X-Card</a>
          </div>
        </div>

        <b-card-img v-bind:src="customOptions.cardBackgroundImage" alt="Card Background image" bottom
          v-if="customOptions.cardBackgroundImageAlign == 'bottom' && roomInfo.currentCardIndex != 0"></b-card-img>

      </div>

    </div>

    <!-- <div class="btn-container" style>
      <div class="row mb-4">
        <div class="btn-group col-sm" role="group" aria-label="Deck Controls">
          <button class="btn btn-outline-dark" :disabled="roomInfo.xCardIsActive" v-on:click="shuffle()" color="rgb(187, 138, 200)">Re-shuffle</button>
          <b-button variant="outline-dark" v-on:click="xCard()" v-dompurify-html="customOptions.safetyCardButton ? customOptions.safetyCardButton : 'X-Card'"></b-button>
          <button class="btn btn-outline-dark" v-on:click="skipInstructions()" v-if="roomInfo.currentCardIndex < firstNonInstruction">Skip Instructions</button>
          <button class="btn btn-outline-dark" v-if="roomInfo.currentCardIndex >= firstNonInstruction" :disabled="roomInfo.currentCardIndex >= endingIndex || roomInfo.xCardIsActive" v-on:click="ending()">Ending</button>
        </div>
      </div>
    </div> -->

    <b-modal id="reshuffleConfirm" title="Restart and Reshuffle" hide-footer>
      <p>Do you want to reshuffle all of the prompts and restart the game?</p>
      <div class="text-center mb-3">
        <b-button variant="dark" v-on:click="shuffle();">Restart and Reshuffle</b-button>
      </div>
    </b-modal>

    <div v-if="Array.isArray(customOptions.showPastPrompts) && roomInfo.currentCardIndex >= firstNonInstruction">

      <div class="itinerary mb-5 card d-flex shadow">
        <!-- style="display: flex; flex-direction: column-reverse;-->
        <div class="card-body justify-content-center">
          <div class="row my-2">
            <div class="col-sm game-meta">
              <h2 v-dompurify-html="customOptions.pastPromptHeader ? customOptions.pastPromptHeader : 'Past Prompts'">
              </h2>
            </div>
          </div>
          <div class="row">
            <div class="col-sm"
              v-dompurify-html="customOptions.pastPromptPrecursor ? customOptions.pastPromptPrecursor : null">
            </div>
          </div>
          <div v-for="(round, roundIndex) in roomInfo.cardSequence" v-bind:key="roundIndex">
            <div
              v-if="Object.prototype.toString.call(round) === '[object Object]' && phaseData.length > 0 && roundIndex <= roomInfo.currentCardIndex">
              <div class="row" v-for="(phase, phaseIndex) in numberOfPhases" v-bind:key="phaseIndex">
                <div class="col-sm"
                  v-if="roundIndex < roomInfo.lastSeenRound || (roundIndex == roomInfo.lastSeenRound && phaseIndex < roomInfo.lastSeenPhase)">
                  <div v-if="customOptions.showPastPrompts[phaseIndex] == 1" style="font-size: .8em;"
                    v-dompurify-html="phaseData[phaseIndex][round[phaseIndex]]">
                  </div>
                  <p v-if="customOptions.showPastPrompts[phaseIndex] == 1" style="font-size: .8em;">
                    |
                  </p>

                </div>
              </div>
            </div>
          </div>
          <div class="row" v-if="roomInfo.currentCardIndex >= endingIndex">
            <div class="col-sm" v-dompurify-html="customOptions.pastPromptCoda ? customOptions.pastPromptCoda : null">
            </div>
          </div>
        </div>
      </div>
    </div>
    <slot name="lower-extensions">
    </slot>
  </div>
</template>

<script>
export default {
  name: 'app-phases',
  components: {
    'app-menuBar': () => import("../layout/MenuBar.vue"),
  },
  props: {
    roomID: String,
    gSheetID: String,
    sheetData: Array,
    roomInfo: Object,
    tempExtensionData: Object,
    firebaseReady: Boolean,
    roomMonetized: Boolean,
    monetizedByUser: Boolean,
  },
  data: function () {
    return {
      customOptions: {
        gameTitle: undefined,
        byline: undefined,
        gameBlurb: undefined,
        password: undefined,
        wallet: undefined,
        revShare: 0.2,
      },
      dataReady: false,
      gSheet: [{ text: "loading" }],
      numberOfPhases: 0,
      phaseNames: [],
      phaseData: [],
      orderedCards: [],
      unorderedCards: [],
      firstNonInstruction: 0,
      endingIndex: 0,
      selectedWallet: undefined,
      error: false,
    }
  },
  computed: {
    classObject: function () {
      if (this.roomInfo && this.roomInfo.currentCardIndex) {
        return {
          'bg-transparent': this.customOptions.coverImage && this.roomInfo.currentCardIndex == 0,
          'phases-deck-0': this.roomInfo.currentCardIndex < this.firstNonInstruction,
          'phases-deck-1': this.roomInfo.currentPhase == 0 && this.roomInfo.currentCardIndex >= this.firstNonInstruction && this.roomInfo.currentCardIndex < this.endingIndex,
          'phases-deck-2': this.roomInfo.currentPhase == 1 && this.roomInfo.currentCardIndex >= this.firstNonInstruction && this.roomInfo.currentCardIndex < this.endingIndex,
          'phases-deck-3': this.roomInfo.currentPhase == 2 && this.roomInfo.currentCardIndex >= this.firstNonInstruction && this.roomInfo.currentCardIndex < this.endingIndex,
          'phases-deck-4': this.roomInfo.currentPhase == 3 && this.roomInfo.currentCardIndex >= this.firstNonInstruction && this.roomInfo.currentCardIndex < this.endingIndex,
          'phases-deck-5': this.roomInfo.currentPhase == 4 && this.roomInfo.currentCardIndex >= this.firstNonInstruction && this.roomInfo.currentCardIndex < this.endingIndex,
          'phases-deck-6': this.roomInfo.currentPhase == 5 && this.roomInfo.currentCardIndex >= this.firstNonInstruction && this.roomInfo.currentCardIndex < this.endingIndex,
          'phases-deck-ending': this.roomInfo.currentCardIndex >= this.endingIndex,

        }
      } else {
        return {}
      }
    }
  },
  watch: {
    sheetData: function () {
      this.processSheetData();
    },
    firebaseReady: function () {
      if (this.firebaseReady && !this.roomInfo) {
        this.initialFirebaseSetup()
      }
    },
  },
  mounted() {
    if (this.sheetData) {
      this.processSheetData();
    }

    if (this.firebaseReady && !this.roomInfo) {
      this.initialFirebaseSetup()
    }
  },
  methods: {
    initialFirebaseSetup() {
      this.$emit('firebase-set',
        { currentCardIndex: 0, xCardIsActive: false, extensionData: this.tempExtensionData, cardSequence: [0, 1, 2], currentPhase: 0, skipToEnding: false, lastSeenRound: 0, lastSeenPhase: 0 }
      )
      if (this.dataReady) {
        this.shuffle();
      }
    },
    closeMenu() {
      this.$bvModal.hide("menuModal");
    },
    copyLinkToClipboard() {
      let currentUrl = location.hostname.toString() + this.$route.fullPath
      navigator.clipboard.writeText(currentUrl).then(function () {
        console.log('copied url')
      }, function () {
        console.log('copy failed')
      });
    },
    previousCard() {
      if (Number.isInteger(this.roomInfo.cardSequence[this.roomInfo.currentCardIndex])) {
        if (this.roomInfo.cardSequence[this.roomInfo.currentCardIndex] >= this.phaseData[0].length) {
          this.roomInfo.currentCardIndex -= 1
          this.roomInfo.currentPhase = this.numberOfPhases - 1
        } else {
          this.roomInfo.currentCardIndex -= 1
          this.roomInfo.currentPhase = 0
        }
      } else if (this.roomInfo.currentPhase == 0) {
        this.roomInfo.currentPhase = this.numberOfPhases - 1
        this.roomInfo.currentCardIndex -= 1
      } else {
        this.roomInfo.currentPhase -= 1
      }

      let lastSeenRound = (this.roomInfo.currentCardIndex > this.endingIndex) ? this.roomInfo.lastSeenRound : this.roomInfo.currentCardIndex
      let lastSeenPhase = (this.roomInfo.currentCardIndex > this.endingIndex) ? this.roomInfo.lastSeenPhase : this.roomInfo.currentPhase

      this.$emit('firebase-update', {
        currentCardIndex: this.roomInfo.currentCardIndex,
        lastSeenRound: lastSeenRound,
        currentPhase: this.roomInfo.currentPhase,
        lastSeenPhase: lastSeenPhase,
      })
    },
    nextCard() {
      if (this.roomInfo.cardSequence.length == 1) {
        this.shuffle();
      }

      if (Number.isInteger(this.roomInfo.cardSequence[this.roomInfo.currentCardIndex])) {
        this.roomInfo.currentCardIndex += 1
        this.roomInfo.currentPhase = 0
      } else if (this.roomInfo.currentPhase < this.numberOfPhases - 1) {
        this.roomInfo.currentPhase += 1
      } else {
        this.roomInfo.currentPhase = 0;
        this.roomInfo.currentCardIndex += 1
      }

      let lastSeenRound = (this.roomInfo.currentCardIndex > this.endingIndex) ? this.roomInfo.lastSeenRound : this.roomInfo.currentCardIndex
      let lastSeenPhase = (this.roomInfo.currentCardIndex > this.endingIndex) ? this.roomInfo.lastSeenPhase : this.roomInfo.currentPhase

      // numberOfRounds
      if ((this.roomInfo.currentCardIndex >= this.endingIndex) || !this.customOptions.numberOfRounds || parseInt(this.customOptions.numberOfRounds) > this.roomInfo.currentCardIndex - this.firstNonInstruction) {
        this.$emit('firebase-update', {
          currentCardIndex: this.roomInfo.currentCardIndex,
          lastSeenRound: lastSeenRound,
          currentPhase: this.roomInfo.currentPhase,
          lastSeenPhase: lastSeenPhase,
        })
      } else {
        this.ending()
      }

    },
    skipInstructions() {
      this.$emit('firebase-update', {
        currentCardIndex: this.firstNonInstruction,
        lastSeenRound: this.firstNonInstruction,
        currentPhase: 0,
        lastSeenPhase: 0
      })
    },
    ending() {
      if (this.roomInfo.cardSequence.length == 1) {
        this.shuffle();
      }

      this.$emit('firebase-update', {
        lastSeenRound: this.roomInfo.currentCardIndex,
        lastSeenPhase: this.roomInfo.currentPhase,
        currentCardIndex: this.endingIndex,
        skipToEnding: true
      })
    },
    xCard() {
      this.$emit('firebase-update', {
        xCardIsActive: !this.roomInfo.xCardIsActive
      })
    },
    shuffle() {
      this.$bvModal.hide('reshuffleConfirm')

      // Create a ordered array
      var initialCardSequence = []
      var finalCardSequence = []
      var shuffledCards = []

      // add in the ordered cards
      for (var i = 0; i < this.gSheet.length; i++) {
        if (this.gSheet[i].ordered == 0) {
          initialCardSequence.push(i)
        } else if (this.gSheet[i].ordered == 2) {
          finalCardSequence.push(i)
        }
      }

      // Shuffle deck function
      var shuffleDeck = function (deck) {
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
        for (i = 0; i < this.phaseData[0].length; i++) {
          numberOfRounds[j].push(i);
        }
        numberOfRounds[j] = shuffleDeck(numberOfRounds[j])
      }

      var newEmptyCard
      for (i = 0; i < this.phaseData[0].length; i++) {
        newEmptyCard = {};
        for (j = 0; j < this.numberOfPhases; j++) {
          newEmptyCard[j] = numberOfRounds[j][i]
        }

        shuffledCards.push(newEmptyCard)
      }



      // sync the shuffled array
      this.$emit('firebase-update', {
        cardSequence: initialCardSequence.concat(shuffledCards).concat(finalCardSequence),
        currentCardIndex: 0,
        currentPhase: 0,
        lastSeenPhase: 0,
        lastSeenRound: 0,
        extensionData: this.tempExtensionData,
      })

    },
    processSheetData() {
      let cleanData = [];

      if (this.sheetData) {
        this.numberOfPhases = this.sheetData[0].length - 3

        for (var w = 0; w < this.numberOfPhases; w++) {
          this.phaseData.push([])
          this.phaseNames.push(this.sheetData[0][w + 3])
        }

        var newEndingIndex = 0

        this.sheetData.forEach((item, i) => {
          if (i !== 0 && item[0]) {

            // Handle options
            if (item[0] == "option") {
              this.customOptions[item[1]] =
                this.$markdownFriendlyOptions.includes(item[1]) && item[2] ? this.$marked(item[2]) : item[2];
              if (item[1] == "phaseHelpText") {
                this.customOptions.phaseHelpText = this.customOptions.phaseHelpText.split('|')
              } else if (item[1] == "showPastPrompts") {
                this.customOptions.showPastPrompts = this.customOptions.showPastPrompts.split(',')
              }
            }

            // Get count of instruction cards
            if (item[0] == 0) {
              this.firstNonInstruction += 1
            }

            // Get ending index
            if ((item[0] == 0 || item[0] == 1) && this.endingIndex == 0) {
              newEndingIndex += 1
            }

            var rowInfo = {}
            if (item[0] >= 0) {
              rowInfo = {
                ordered: item[0],
                headerText: item[1],
                bodyText: this.$marked(item[2] ?? null)
              }
              cleanData.push(rowInfo)
            }

            if (item[0] == 1) {
              for (var j = 3; j < item.length; j++) {
                this.phaseData[j - 3].push(this.$marked(item[j] ?? null))
              }
            }
          }
        });

        this.endingIndex = newEndingIndex;

        // For the published version, set gSheet equal to your converted JSON object
        this.gSheet = cleanData

        this.dataReady = true;

        if (this.firebaseReady && this.roomInfo?.cardSequence.length < 4) { this.shuffle(); }

      }
    }

  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->


<style scoped>
.phases {
  margin: auto;
  padding-top: 1em;
  padding-bottom: 1em;
}

.card-body {
  font-size: 1.5em;
  min-height: 11em;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity .5s;
}

.fade-enter,
.fade-leave-to

/* .fade-leave-active below version 2.1.8 */
  {
  opacity: 0;
}

.phase-help-text {
  font-size: 1rem;
  line-height: 1.5;
}

.x-card-text {
  font-size: .5em;
  text-decoration: underline;
}
</style>
