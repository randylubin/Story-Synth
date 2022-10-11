<template>
  <div class="secretCards game-room" v-if="roomInfo">

    <app-menuBar :roomInfo="roomInfo" :tempExtensionData="tempExtensionData" :customOptions="customOptions"
      :monetizedByUser="monetizedByUser" :routeRoomID="$route.params.roomID" :dataReady="dataReady"
      :firebaseReady="firebaseReady" @roomMonetized="$emit('roomMonetized', true)">
      <div class="row menu-row">
        <b-button variant="outline-dark" class="control-button-safety-card btn-lg btn-block"
          v-on:click="xCard(); closeMenu();" v-dompurify-html="
            customOptions.safetyCardButton
              ? customOptions.safetyCardButton
              : 'Pause'
          "></b-button>
      </div>
    </app-menuBar>
    <slot name="upper-extensions">
    </slot>

    <div class="mb-4 game-meta" v-if="!customOptions.coverImage && (customOptions.gameTitle || customOptions.byline)">
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
    <b-alert show class="demoInfo" variant="info" v-if="customOptions.demoInfo">This demo is powered by <a
        :href="customOptions.demoInfo" target="_blank">this Google Sheet Template</a>. Copy the sheet and start editing
      it to design your own game!</b-alert>

    <div>



      <div v-if="!playerSelected" class="mb-4">
        <div class="row align-center mb-3">
          <img v-bind:src="customOptions.coverImage" class="img-fluid" alt="">
        </div>
        <div class="row text-center">
          <div class="col-sm">Pick a player role:</div>
        </div>
        <div class="row">
          <div class="btn-group col-sm" role="group" aria-label="Timer Controls">
            <button type="button" class="btn btn-outline-dark" v-for="player in playerArray" v-bind:key="player"
              v-on:click="selectPlayer(player)">{{ player }}</button>
          </div>
        </div>
      </div>

      <div class="player-label row mb-4" v-if="playerSelected">
        <div class="col-sm">
          Role: {{ playerSelected }}
          <button class="btn btn-sm btn-outline-dark" v-on:click="selectPlayer(null)">Reselect role</button>
        </div>
      </div>
    </div>

    <div class="btn-container" v-if="playerSelected">
      <div class="row mb-4">
        <div class="btn-group col-sm" role="group" aria-label="Deck Controls">
          <button class="btn btn-outline-dark" v-on:click="previousCard()"
            :disabled="roomInfo.xCardIsActive || roomInfo.currentCardIndex == 0">Previous</button>
          <button class="btn btn-outline-dark" v-on:click="nextCard()"
            :disabled="roomInfo.xCardIsActive || roomInfo.currentCardIndex == gSheet.length - 2">
            <span v-if="roomInfo.currentCardIndex == 0">Start</span>
            <span v-if="roomInfo.currentCardIndex !== 0">Next</span>
          </button>
        </div>
      </div>
    </div>


    <div v-if="roomInfo.xCardIsActive" class="mb-4">
      <transition name="fade">
        <div class="card d-flex align-items-center shadow">
          <div class="card-title">
            <h1 class="mt-5">Pause</h1>
          </div>
          <div class="card-body align-items-center d-flex justify-content-center">
            <h4>
              Talk about the direction of story, or revise some content, or adjust the tone. Once everyone is on the
              same page, resume play.
            </h4>
          </div>

          <button class="btn btn-outline-dark mb-3" style="width:100px;" type="button"
            v-on:click="xCard()">Continue</button>
        </div>
      </transition>
    </div>


    <div v-if="!roomInfo.xCardIsActive && playerSelected">
      <div v-for="(row, index) in gSheet" v-bind:key="index">
        <transition name="fade" mode="out-in">
          <div class="row mb-4" v-if="row.order == roomInfo.currentCardIndex">
            <div class="col-sm">
              <div class="card shadow" v-on:click="updateClickedCard(index)" style="cursor:pointer">
                <div class="card-body">
                  <h5>Public: </h5>
                  <div v-dompurify-html="row.publicText"></div>
                  <br><br>

                  <h5>Secret:</h5>
                  <div v-dompurify-html="row[playerSelected]"></div>

                </div>
              </div>
            </div>
          </div>
        </transition>
      </div>
    </div>
    <slot name="lower-extensions">
    </slot>
  </div>
</template>

<script>
export default {
  name: 'app-secretCards',
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
      dataReady: false,
      error: false,
      playerSelected: null,
      playerArray: [],
      gSheet: [{ text: "loading" }],
      orderedCards: [],
      unorderedCards: [],
      clickedCard: 0,
      instructionCardCount: 15,
      gameRoundCount: 6,
      customOptions: {
        gameTitle: undefined,
        byline: undefined,
        gameBlurb: undefined,
        password: undefined,
        wallet: undefined,
        revShare: 0.2,
      },
      selectedWallet: undefined,
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
          currentCardIndex: 0, xCardIsActive: false,
          cardSequence: [0, 1, 2],
          extensionData: this.tempExtensionData,
        }
      )
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
      this.updateRoundInfo();
    },
    nextCard() {
      this.$emit('firebase-update', {
        currentCardIndex: this.roomInfo.currentCardIndex += 1
      })
      this.updateRoundInfo();
    },
    updateRoundInfo() {
      var newRoundInfo = ""
      var newRoundProgress = ""

      if (this.roomInfo.currentCardIndex == 0 || this.roomInfo.currentCardIndex == (this.instructionCardCount + this.gameRoundCount + 1)) {
        newRoundInfo = ""
      } else if (this.roomInfo.currentCardIndex <= this.instructionCardCount) {
        newRoundInfo = "Instructions";
        newRoundProgress = (this.roomInfo.currentCardIndex) + " of " + this.instructionCardCount
      } else if (this.roomInfo.currentCardIndex > this.instructionCardCount) {
        newRoundInfo = "Round";
        newRoundProgress = (this.roomInfo.currentCardIndex - this.instructionCardCount) + " of " + this.gameRoundCount
      } else {
        newRoundInfo = ""
      }

      var newRoundTitle = ""

      if (this.roomInfo.currentCardIndex > this.instructionCardCount) {
        switch (this.roomInfo.currentCardIndex - this.instructionCardCount) {
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


      this.$emit('firebase-update', {
        roundInfo: newRoundInfo,
        roundProgress: newRoundProgress,
        roundTitle: newRoundTitle
      })
    },
    xCard() {
      this.$emit('firebase-update', {
        xCardIsActive: !this.roomInfo.xCardIsActive
      })
    },
    updateClickedCard(index) {
      if (this.clickedCard == index) { this.clickedCard = 0 } else { this.clickedCard = index }
    },
    selectPlayer(player) {
      this.playerSelected = player
    },
    processSheetData() {
      let cleanData = [];

      if (this.sheetData) {
        var headers = this.sheetData[0]

        var playerArray = []

        headers.forEach((item, i) => {
          if (i >= 2 && item) {
            playerArray.push(item)
          }
        });

        this.sheetData.forEach((item) => {
          // Handle options
          if (item[0] == "option") {
            this.customOptions[item[1]] =
              this.$markdownFriendlyOptions.includes(item[1]) && item[2] ? this.$marked(item[2]) : item[2];
            console.log(item[2])
          }

          if (item[0] && item[0] !== "option" && item[0] !== "extension") {
            console.log(item[1])
            var rowInfo = {
              order: item[0],
              publicText: this.$marked(item[1] ?? null)
            }

            for (var p = 0; p < playerArray.length; p++) {
              if (item[p + 2]) {
                rowInfo[playerArray[p]] = this.$marked(item[p + 2] ?? null)
              }
            }

            /*
            playerArray.forEach((player, i)=>{
              rowInfo[player] = parseInt(item[i+2]);
            });
            */

            cleanData.push(rowInfo)
          }
        });

        this.gSheet = cleanData.slice().reverse();
        this.playerArray = playerArray
        this.dataReady = true;

      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->

<style scoped>
.secretCards {

  margin: auto;
  padding-top: 1em;
  padding-bottom: 1em;
}

.fade-enter-active {
  transition: opacity .5s;
}

.fade-enter

/* .fade-leave-active below version 2.1.8 */
  {
  opacity: 0;
}

.fade-leave-active {
  transition: opacity 0s;
}


li {
  list-style-type: disc;
  display: list-item;
  margin-left: 20px;
}

.card-body {
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
</style>
