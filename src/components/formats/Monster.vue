<template>
  <div class="monster game-room" v-if="roomInfo">
    
    <app-menuBar
      :roomInfo="roomInfo"
      :tempExtensionData="tempExtensionData"
      :customOptions="customOptions"
      :monetizedByUser="monetizedByUser"
      :routeRoomID="$route.params.roomID"
      :dataReady="dataReady"
      :firebaseReady="firebaseReady"
      @roomMonetized="updateRoomMonetization"
    >
      <div class="row menu-row">
        <b-button
          variant="outline-dark"
          class="control-button-safety-card btn-lg btn-block"
          v-on:click="xCard(); closeMenu();"
          v-dompurify-html="
            customOptions.safetyCardButton
                ? customOptions.safetyCardButton
                : 'Pause'
          "
          ></b-button>
      </div>
    </app-menuBar>
    
    <b-alert show class="" variant="info" v-if="customOptions.demoInfo">This demo is powered by <a :href="customOptions.demoInfo" target="_blank">this Google Sheet Template</a>. Copy the sheet and start editing it to design your own game!</b-alert>

    <transition name="fade">
      <div class="fab-buttons container" v-if="(!customOptions.facilitatorMode || userRole == 'facilitator') && (!customOptions.lowerCardNavOnMobile) && (!customOptions.hideNavigationButtons || (parseInt(customOptions.hideNavigationButtons) > roomInfo.currentCardIndex))">
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
            :disabled="roomInfo.xCardIsActive || roomInfo.currentCardIndex == gSheet[gSheet.length-1].ordered"
          >
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

    <!--<h1 class="">{{roomInfo.roundTitle}}</h1>-->
    <h3 class="mb-4">{{roomInfo.roundInfo}} <span class="">{{roomInfo.roundProgress}}</span></h3>


    <div v-if="roomInfo.xCardIsActive" class="mb-4">
      <transition name="fade">
        <div class="card d-flex align-items-center shadow pt-4">
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
            v-dompurify-html="customOptions.safetyCardText"
            v-if="customOptions.safetyCardText"
          ></div>

          <button class="btn btn-outline-dark mb-5" style="width:100px;" type="button" v-on:click="xCard()">Continue</button>
        </div>
      </transition>
    </div>


    <div v-if="!roomInfo.xCardIsActive">

      <div v-for="(row, index) in gSheet" v-bind:key="index">
        <transition name="">
          <div class="row mb-4" v-if="row.ordered == roomInfo.currentCardIndex">
            <div class="col-sm">
              <div class="card shadow img-fluid" v-bind:class="{'bg-transparent': (customOptions.coverImage && roomInfo.currentCardIndex == 0)}" v-on:click="updateClickedCard(index)" style="cursor:pointer">
                <img v-bind:src="customOptions.coverImage" class="card-img-top" style="width:100%" v-if="customOptions.coverImage && roomInfo.currentCardIndex == 0">
                <img v-bind:src="customOptions.cardBackgroundImage" class="card-img-top card-background" style="width:100%" v-if="customOptions.cardBackgroundImage && (!customOptions.coverImage || roomInfo.currentCardIndex != 0)">
                <div class="card-body" v-if="!customOptions.coverImage || index != 0" v-bind:class="{'card-body': !customOptions.cardBackgroundImage, 'card-img-overlay': customOptions.cardBackgroundImage }">
                    <div class="row mb-4" v-if="customOptions.instructionsProgressBar && roomInfo.currentCardIndex <= customOptions.instructionsProgressBar && roomInfo.currentCardIndex != 0">
                      <div class="col-sm">
                        <h2>Instructions</h2>
                        <b-progress :value="roomInfo.currentCardIndex" :max="customOptions.instructionsProgressBar" variant="dark"></b-progress>
                      </div>
                    </div>
                    <div class="card-title" v-if="!row.subtitle">
                      <div v-if="index == 0">
                        <h1 class="mt-4" v-dompurify-html="row.archetype"></h1>
                        <div v-dompurify-html="row.characterDetail"></div>
                      </div>

                      <div v-if="index !== 0">
                        <p class="mt-4" v-dompurify-html="row.archetype"></p>
                        <div class="text-left" v-dompurify-html="row.characterDetail">

                        </div>
                      </div>

                    </div>

                    <h4 class="card-title" v-if="row.subtitle">
                      {{row.archetype}}
                    </h4>
                    <h5 class="card-subtitle mb-4 text-muted">{{row.subtitle}}</h5>

                    <div class="card-text text-left" v-if="clickedCard == index || roomInfo.currentCardIndex == gSheet[gSheet.length-1].ordered">

                      <h5>{{row.characterQuestion}}</h5>
                      <div v-dompurify-html="row.characterDetail">
                      </div>
                      <h5 class="mt-4">{{row.keyQuestion}}</h5>
                      <div v-dompurify-html="row.keyDetails">
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

    <link v-bind:href="selectedWallet">
  </div>
</template>

<script>
export default {
  name: 'app-monster',
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
  },
  data: function(){
    return {
      dataReady: false,
      gSheet: [{text:"loading"}],
      orderedCards: [],
      unorderedCards: [],
      clickedCard: -1,
      instructionCardCount: 0,
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
      roomMonetized: null,
      monetizedByUser: false,
      error: false,
    }
  },
  watch: {
    sheetData: function(){
      this.processSheetData();
    },
    firebaseReady: function(){
      if (this.firebaseReady && !this.roomInfo){
        this.initialFirebaseSetup()
      }
    },
  },
  mounted(){
    if (document.monetization?.state == "started") {
      this.monetizationStarted()
    }
    document.monetization?.addEventListener('monetizationstart', () => {
      this.monetizationStarted()
    })

    if (this.sheetData){
      this.processSheetData();
    }

    if (this.firebaseReady && !this.roomInfo){
      this.initialFirebaseSetup()
    }
  },
  methods: {
    initialFirebaseSetup() {
      this.$emit('firebase-set',
        {currentCardIndex:0,extensionData: this.tempExtensionData,xCardIsActive: false, cardSequence:[0,1,2]}
      )
    },
    monetizationStarted() {
      console.log('monetizing')
      this.monetizedByUser = true;
    },
    updateRoomMonetization(monetizationValue){
      this.roomMonetized = monetizationValue;
      console.log("room is now monetizied")
    },
    closeMenu(){
      this.$bvModal.hide("menuModal");
    },
    copyLinkToClipboard(){
      let currentUrl = location.hostname.toString() + this.$route.fullPath
      navigator.clipboard.writeText(currentUrl).then(function() {
        console.log('copied url')
      }, function() {
        console.log('copy failed')
      });
    },
    previousCard(){
      this.$emit('firebase-update',{
        currentCardIndex: this.roomInfo.currentCardIndex -= 1
      })
      this.updateRoundInfo();
    },
    nextCard(){
      this.$emit('firebase-update',{
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

      this.$emit('firebase-update',{
        roundInfo: newRoundInfo,
        roundProgress: newRoundProgress,
        roundTitle: newRoundTitle
      })
    },
    xCard(){
      this.$emit('firebase-update',{
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
    processSheetData() {
      let cleanData = [];

      if (this.sheetData){
        this.sheetData.forEach((item, i) => {
          if (i !== 0 && item[0] && item[0]){
            // Handle options
            if (item[0] == "option"){
              this.customOptions[item[1]] =
                this.$markdownFriendlyOptions.includes(item[1]) ? this.$marked(item[2]) : item[2];
              console.log(item[2])
            }

            if (item[0] !== "option" &&
                item[0] !== "extension"){

              var rowInfo = {
                ordered: item[0],
                archetype: (item[1] && !item[2]) ? this.$marked(item[1]) : item[1],
                subtitle: item[2],
                characterQuestion: item[3],
                characterDetail: item[4] ? this.$marked(item[4]) : item[4],
                keyQuestion: item[5],
                keyDetails: item[6] ? this.$marked(item[6]) : item[6]
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

        this.dataReady = true
        if (location.hostname.toString() !== 'localhost'){
          this.$mixpanel.track('Visit Game Session', {
            game_name: this.customOptions.gameTitle ?? 'untitled',
            session_url: location.hostname.toString() + this.$route.fullPath,
            format: 'Shuffled'
          });
        }

      }
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

</style>
