<template>
  <div class="slot-machine game-room" v-if="roomInfo">

    <app-menuBar :roomInfo="roomInfo" :tempExtensionData="tempExtensionData" :customOptions="customOptions"
      :monetizedByUser="monetizedByUser" :routeRoomID="$route.params.roomID" :dataReady="dataReady"
      :firebaseReady="firebaseReady" @roomMonetized="$emit('roomMonetized', true)">
      <div class="row menu-row">
        <b-button v-b-modal.reshuffleConfirm v-on:click="closeMenu();" class="control-button-restart btn-lg btn-block"
          variant="outline-dark" :disabled="roomInfo.xCardIsActive"
          v-if="!customOptions.facilitatorMode || userRole == 'facilitator'" color="rgb(187, 138, 200)">Reshuffle
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
      <div class="row menu-row">
        <b-button variant="outline-dark" class="btn-lg btn-block"
          :disabled="roomInfo.currentCardIndex == gSheet.length - 1 || roomInfo.xCardIsActive"
          v-on:click="lastCard(); closeMenu();">
          Last Card
        </b-button>
      </div>
    </app-menuBar>

    <b-alert show class="demoInfo" variant="info" v-if="customOptions.demoInfo">This demo is powered by <a
        :href="customOptions.demoInfo" target="_blank">this Google Sheet Template</a>. Copy the sheet and start editing
      it to design your own game!</b-alert>
    <slot name="upper-extensions">
    </slot>

    <!-- <div class="game-meta">
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
    </div> -->

    <transition name="fade">
      <div class="fab-buttons container"
        v-if="(!customOptions.facilitatorMode || userRole == 'facilitator') && (!customOptions.lowerCardNavOnMobile) && (!customOptions.hideNavigationButtons || (parseInt(customOptions.hideNavigationButtons) > roomInfo.currentCardIndex))">
        <button class="btn btn-outline-dark btn-fab btn-fab-left control-button-previous-card shadow"
          v-on:click="previousCard()" v-b-tooltip.hover title="Previous Card" :disabled="
            roomInfo.xCardIsActive || roomInfo.currentCardIndex == 0
          ">
          <!-- Previous Card -->
          <b-icon class="h1 mb-0" icon="chevron-left"></b-icon>
          <b-icon class="h1 mb-0 mr-2" icon="card-heading"></b-icon>
        </button>
        <button class="btn btn-outline-dark btn-fab btn-fab-right control-button-next-card shadow" v-b-tooltip.hover
          title="Next Card" v-on:click="nextCard()" :disabled="
            roomInfo.xCardIsActive || roomInfo.currentCardIndex == gSheet.length - 1
          ">
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

    <!-- <div class="row mb-4">
      <transition name="fade">
        <div class="btn-group col-sm" role="group" aria-label="Card Controls">

          <button class="btn btn-outline-dark" v-on:click="previousCard()" :disabled="roomInfo.xCardIsActive || roomInfo.currentCardIndex == 0">Previous Card</button>
          <button class="btn btn-outline-primary" v-on:click="nextCard()" :disabled="roomInfo.xCardIsActive || roomInfo.currentCardIndex == gSheet.length - 1">Next Card</button>
        </div>
      </transition>
    </div> -->

    <div
      v-if="gSheet[roomInfo.cardSequence[roomInfo.currentCardIndex]] || Object.prototype.toString.call(roomInfo.cardSequence[roomInfo.currentCardIndex]) === '[object Object]'"
      class="mb-4">
      <transition name="fade">
        <div class="card d-flex shadow img-fluid"
          v-bind:class="{ 'bg-transparent': (customOptions.coverImage && roomInfo.currentCardIndex == 0) }">
          <img v-bind:src="customOptions.coverImage" class="card-img-top" style="width:100%"
            v-if="customOptions.coverImage && roomInfo.currentCardIndex == 0">
          <img v-bind:src="customOptions.cardBackgroundImage" class="card-img-top card-background" style="width:100%"
            v-if="customOptions.cardBackgroundImage && (!customOptions.coverImage || roomInfo.currentCardIndex != 0)">

          <div class="card-body justify-content-center mt-2"
            v-if="!roomInfo.xCardIsActive && (!customOptions.coverImage || roomInfo.currentCardIndex != 0)"
            v-bind:class="{ 'card-body': !customOptions.cardBackgroundImage, 'card-img-overlay': customOptions.cardBackgroundImage }">
            <div class="row mb-4"
              v-if="customOptions.instructionsProgressBar && roomInfo.currentCardIndex < firstNonInstruction && roomInfo.currentCardIndex != 0">
              <div class="col-sm">
                <h2>Instructions</h2>
                <b-progress :value="roomInfo.currentCardIndex" :max="firstNonInstruction - 1" variant="dark">
                </b-progress>
              </div>
            </div>


            <div v-if="gSheet[roomInfo.cardSequence[roomInfo.currentCardIndex]]">
              <h1>{{ gSheet[roomInfo.cardSequence[roomInfo.currentCardIndex]].headerText }}</h1>
              <p class="mt-4 mb-4" v-dompurify-html="gSheet[roomInfo.cardSequence[roomInfo.currentCardIndex]].bodyText">
              </p>
            </div>

            <div
              v-if="Object.prototype.toString.call(roomInfo.cardSequence[roomInfo.currentCardIndex]) === '[object Object]'">
              <div v-for="(index) in numberOfWheels" v-bind:key="index"
                v-dompurify-html="wheels[index - 1][roomInfo.cardSequence[roomInfo.currentCardIndex][index - 1]]">

              </div>
            </div>

          </div>

          <div class="card-body align-items-center justify-content-center" v-if="roomInfo.xCardIsActive"
            v-bind:class="{ 'card-body': !customOptions.cardBackgroundImage, 'card-img-overlay': customOptions.cardBackgroundImage }">
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

        </div>
      </transition>
    </div>

    <!-- <div class="btn-container" style>
      <div class="row mb-4">
        <div class="btn-group col-sm" role="group" aria-label="Deck Controls">
          <button class="btn btn-outline-dark" :disabled="roomInfo.xCardIsActive" v-on:click="shuffle()" color="rgb(187, 138, 200)">Re-shuffle</button>
          <b-button variant="outline-dark" v-on:click="xCard()" v-dompurify-html="customOptions.safetyCardButton ? customOptions.safetyCardButton : 'X-Card'"></b-button>
          <button class="btn btn-outline-dark" :disabled="roomInfo.currentCardIndex == gSheet.length - 1 || roomInfo.xCardIsActive" v-on:click="lastCard()">Last Card</button>
        </div>
      </div>
    </div> -->

    <b-modal id="reshuffleConfirm" title="Restart and Reshuffle" hide-footer>
      <p>Do you want to reshuffle all of the prompts and restart the game?</p>
      <div class="text-center mb-3">
        <b-button variant="dark" v-on:click="shuffle();">Restart and Reshuffle</b-button>
      </div>
    </b-modal>
    <slot name="lower-extensions">
    </slot>
  </div>
</template>

<script>
export default {
  name: 'app-slotMachine',
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
      firstNonInstruction: 0,
      dataReady: false,
      gSheet: [{ text: "loading" }],
      numberOfWheels: 0,
      wheels: [],
      orderedCards: [],
      unorderedCards: [],
      customOptions: {
        gameTitle: undefined,
        byline: undefined,
        gameBlurb: undefined,
        password: undefined,
        wallet: undefined,
        revShare: 0.2,
      },
      selectedWallet: undefined,
      error: false,
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
        {
          extensionData: this.tempExtensionData,
          xCardIsActive: false,
          currentCardIndex: 0,
          cardSequence: [0, 1, 2],
        }
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
      this.$emit('firebase-update', {
        currentCardIndex: this.roomInfo.currentCardIndex -= 1
      })
    },
    nextCard() {
      if (this.roomInfo.cardSequence.length == 1) {
        this.shuffle();
      }
      this.$emit('firebase-update', {
        currentCardIndex: this.roomInfo.currentCardIndex += 1
      })
    },
    lastCard() {
      if (this.roomInfo.cardSequence.length == 1) {
        this.shuffle();
      }

      this.$emit('firebase-update', {
        currentCardIndex: this.gSheet.length - 1
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
      var newCardSequence = []
      var shuffledCards = []

      // add in the ordered cards
      for (var i = 0; i < this.gSheet.length; i++) {
        if (this.gSheet[i].ordered == 0) {
          newCardSequence.push(i)
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

      // create an array of the wheel length
      var wheelsIndexArray = []

      for (var j = 0; j < this.wheels.length; j++) {
        wheelsIndexArray.push([])
        for (i = 0; i < this.wheels[0].length; i++) {
          wheelsIndexArray[j].push(i);
        }
        wheelsIndexArray[j] = shuffleDeck(wheelsIndexArray[j])
      }

      var newEmptyCard
      for (i = 0; i < this.wheels[0].length; i++) {
        newEmptyCard = {};
        for (j = 0; j < this.numberOfWheels; j++) {
          newEmptyCard[j] = wheelsIndexArray[j][i]
        }

        shuffledCards.push(newEmptyCard)
      }

      // add shuffled cards to array
      newCardSequence = newCardSequence.concat(shuffledCards)

      // add last cards
      for (var l = 0; l < this.gSheet.length; l++) {
        if (this.gSheet[l].ordered >= 2) {
          newCardSequence.push(l)
        }
      }

      // sync the shuffled array
      this.$emit('firebase-update', {
        cardSequence: newCardSequence,
        currentCardIndex: 0,
        extensionData: this.tempExtensionData,
      })

    },
    processSheetData() {
      let cleanData = [];

      if (this.sheetData) {
        this.numberOfWheels = this.sheetData[0].length - 3

        for (var w = 0; w < this.numberOfWheels; w++) {
          this.wheels.push([])
        }

        this.sheetData.forEach((item, i) => {
          if (i !== 0 && item[0]) {

            // Handle options
            if (item[0] == "option") {
              this.customOptions[item[1]] =
                this.$markdownFriendlyOptions.includes(item[1]) && item[2] ? this.$marked(item[2]) : item[2];
              console.log(item[2])
            }

            if (item[0] !== "option" && item[0] !== "extension") {

              var rowInfo = {}
              if (item[0] >= 0) {
                rowInfo = {
                  ordered: item[0],
                  headerText: item[1],
                  bodyText: item[2] ? this.$marked(item[2]) : null
                }
                cleanData.push(rowInfo)

                if (item[0] == 0) {
                  this.firstNonInstruction += 1
                }

                if (item[0] == 1) {
                  for (var j = 3; j < item.length; j++) {
                    if (item[j]) {
                      this.wheels[j - 3].push(this.$marked(item[j]))
                    }
                  }
                }
              }
            }


          }
        });

        // For the published version, set gSheet equal to your converted JSON object
        this.gSheet = cleanData

        console.log('done fetching and cleaning data')
        this.dataReady = true;

        if (this.firebaseReady && this.roomInfo?.cardSequence.length < 4) { this.shuffle(); }

      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->


<style scoped>
.slot-machine {

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

.x-card-text {
  font-size: .5em;
  text-decoration: underline;
}
</style>
