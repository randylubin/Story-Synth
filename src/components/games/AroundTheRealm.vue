<template>
  <div class="phases">
    <div class="full-page-background"></div>
    <div v-html="customOptions.style"></div>

    <div class="game-room container" v-if="roomInfo">
      
      <!-- Menu Bar -->
      <div class="menu-bar mb-4 d-flex align-items-center">
        <button class="btn btn-outline-dark mr-auto border-0" v-b-modal.menuModal><b-icon-list></b-icon-list> Menu</button>
        <!-- <div v-if="customOptions.gameTitle" class="mx-auto align-middle text-center">{{customOptions.gameTitle}}</div> -->
        <app-roomLink class="d-none d-sm-block" :routeRoomID="$route.params.roomID" v-if="dataReady && firebaseReady"></app-roomLink>
        
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
            <div class="row menu-row" v-if="roomInfo.currentCardIndex < firstNonInstruction">
              <b-button
                variant="outline-dark"
                class="btn-lg btn-block"
                v-on:click="skipInstructions(); closeMenu();" 
                >
                  Skip Instructions
                </b-button>
            </div>
            <div class="row menu-row" v-if="roomInfo.currentCardIndex >= firstNonInstruction">
              <b-button
                variant="outline-dark"
                class="btn-lg btn-block"
                :disabled="roomInfo.currentCardIndex >= endingIndex || roomInfo.xCardIsActive" v-on:click="ending(); closeMenu();">
                Ending
              </b-button>
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
        <div class="fab-buttons container" v-if="(!customOptions.facilitatorMode || userRole == 'facilitator') && (!customOptions.lowerCardNavOnMobile) && (!customOptions.hideNavigationButtons || (parseInt(customOptions.hideNavigationButtons) > roomInfo.currentCardIndex))">
            <button
              class="btn btn-outline-dark btn-fab btn-fab-left control-button-previous-card shadow"
              v-on:click="previousCard()"
              v-b-tooltip.hover title="Previous Card"
              :disabled="roomInfo.xCardIsActive || roomInfo.currentCardIndex == 0"
            >
              <!-- Previous Card -->
              <b-icon class="h1 mb-0" icon="chevron-left"></b-icon>
              <b-icon class="h1 mb-0 mr-2" icon="card-heading"></b-icon>
            </button>
            <button
              class="btn btn-outline-dark btn-fab btn-fab-right control-button-next-card shadow"
              v-b-tooltip.hover title="Next Card"
              v-on:click="nextCard()"
              :disabled="roomInfo.xCardIsActive || roomInfo.currentCardIndex == gSheet.length - 1 || (roomInfo.currentCardIndex == gSheet.length - 1 && roomInfo.currentPhase == numberOfPhases -1)"
            >
              <!-- Next Card -->
              <b-icon class="h1 mb-0 ml-2" icon="card-heading"></b-icon>
              <b-icon class="h1 mb-0" icon="chevron-right"></b-icon>              
            </button>
        </div>        
      </transition>



      <div v-if="gSheet[roomInfo.cardSequence[roomInfo.currentCardIndex]] || Object.prototype.toString.call(roomInfo.cardSequence[roomInfo.currentCardIndex]) === '[object Object]'" class="mb-4">
        
          <div class="card d-flex shadow img-fluid" v-bind:class="{'bg-transparent': (customOptions.coverImage && roomInfo.currentCardIndex == 0)}">
            
            <img v-bind:src="customOptions.coverImage" class="card-img-top" style="width:100%" v-if="customOptions.coverImage && roomInfo.currentCardIndex == 0">
            <img v-bind:src="customOptions.cardBackgroundImage" class="card-img-top card-background" style="width:100%" v-if="customOptions.cardBackgroundImage && (!customOptions.coverImage || roomInfo.currentCardIndex != 0) && (!customOptions.cardBackgroundImageAlign)">
            <b-card-img v-bind:src="customOptions.cardBackgroundImage" alt="Card Background image" top v-if="customOptions.cardBackgroundImageAlign == 'top' && roomInfo.currentCardIndex != 0"></b-card-img>

            <div class="card-body text-center" v-if="(!dataReady || !firebaseReady) && !error">
              <h1 class="m-5">Loading</h1>
              <b-spinner class="m-5" style="width: 4rem; height: 4rem;" label="Busy"></b-spinner>
            </div>


            <div class="card-body justify-content-center mt-4 mx-4" style="white-space: pre-line" v-if="!roomInfo.xCardIsActive && dataReady && firebaseReady && (!customOptions.coverImage || roomInfo.currentCardIndex != 0)" v-bind:class="{'card-body': !customOptions.cardBackgroundImage, 'card-img-overlay': (customOptions.cardBackgroundImage && (!customOptions.cardBackgroundImageAlign))}">
              <div class="row mb-4" v-if="customOptions.instructionsProgressBar && roomInfo.currentCardIndex < firstNonInstruction && roomInfo.currentCardIndex != 0">
                <div class="col-sm">
                  <h2>Instructions</h2>
                  <b-progress :value="roomInfo.currentCardIndex" :max="firstNonInstruction -1" variant="dark"></b-progress>
                </div>
              </div>
              
              <div v-if="gSheet[roomInfo.cardSequence[roomInfo.currentCardIndex]]">
                <h2 class="card-header-text">{{ gSheet[roomInfo.cardSequence[roomInfo.currentCardIndex]].headerText }}</h2>
                
                <p v-if="gSheet[roomInfo.cardSequence[roomInfo.currentCardIndex]].bodyText" v-bind:class="{ 'text-left': gSheet[roomInfo.cardSequence[roomInfo.currentCardIndex]].bodyText.length > 60 }" class="my-4" v-html="gSheet[roomInfo.cardSequence[roomInfo.currentCardIndex]].bodyText"></p>
              </div>

              <div v-if="Object.prototype.toString.call(roomInfo.cardSequence[roomInfo.currentCardIndex]) === '[object Object]'">
                <!--<div v-for="(index) in numberOfPhases" v-bind:key="index" v-html="phaseData[index-1][roomInfo.cardSequence[roomInfo.currentCardIndex][index-1]]">
                </div>-->
                <h2 class="card-header-text">{{phaseNames[roomInfo.currentPhase]}}</h2>
                <div v-html="phaseData[roomInfo.currentPhase][roomInfo.cardSequence[roomInfo.currentCardIndex][roomInfo.currentPhase]]"></div>
                <div v-if="Array.isArray(customOptions.phaseHelpText)" class="my-4">
                  <p class="phase-help-text">
                    <i class="">{{customOptions.phaseHelpText[roomInfo.currentPhase]}}</i>
                  </p>
                </div>
              </div>
              
            </div>
            

            <div class="card-body align-items-center justify-content-center" v-if="roomInfo.xCardIsActive" v-bind:class="{'card-body': !customOptions.cardBackgroundImage, 'card-img-overlay': customOptions.cardBackgroundImage && !customOptions.cardBackgroundImageAlign }">
              <div class="mt-5 pt-5 mb-5">
                <h1 v-if="!customOptions.safetyCardText">X-Card</h1>
                <div class="safety-card-tet" v-html="customOptions.safetyCardText" v-if="customOptions.safetyCardText"></div> 
              </div>
              <button class="btn btn-outline-dark mt-5" v-on:click="xCard()">Continue</button>
              <div class="" v-if="!customOptions.safetyCardText">
                <a class="x-card-text" href="http://tinyurl.com/x-card-rpg">About the X-Card</a>
              </div>
            </div>

            <b-card-img v-bind:src="customOptions.cardBackgroundImage" alt="Card Background image" bottom v-if="customOptions.cardBackgroundImageAlign == 'bottom' && roomInfo.currentCardIndex != 0"></b-card-img>

          </div>
        
      </div>

      <!-- <div class="btn-container" style>
        <div class="row mb-4">
          <div class="btn-group col-sm" role="group" aria-label="Deck Controls">
            <button class="btn btn-outline-dark" :disabled="roomInfo.xCardIsActive" v-on:click="shuffle()" color="rgb(187, 138, 200)">Re-shuffle</button>
            <b-button variant="outline-dark" v-on:click="xCard()" v-html="customOptions.safetyCardButton ? customOptions.safetyCardButton : 'X-Card'"></b-button>
            <button class="btn btn-outline-dark" v-on:click="skipInstructions()" v-if="roomInfo.currentCardIndex < firstNonInstruction">Skip Instructions</button>
            <button class="btn btn-outline-dark" v-if="roomInfo.currentCardIndex >= firstNonInstruction" :disabled="roomInfo.currentCardIndex >= endingIndex || roomInfo.xCardIsActive" v-on:click="ending()">Ending</button>
          </div>
        </div>
      </div> -->

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
            v-on:click="shuffle();"
            >Restart and Reshuffle</b-button
          >
        </div>
      </b-modal>

      <div class="row">
        <div class="btn-group col-sm" role="group" aria-label="Extra Info" v-if="customOptions.modalOneLabel || customOptions.modalTwoLabel">
          <!-- <b-button v-b-modal.modalOne variant="outline-dark" v-if="customOptions.modalOneLabel">{{customOptions.modalOneLabel}}</b-button> -->

          <b-modal id="modalOne" v-bind:title="customOptions.modalOneLabel" hide-footer>
            <div class="d-block text-left" v-html="customOptions.modalOneText">
              
            </div>
          </b-modal>

          <!-- <b-button v-b-modal.modalTwo variant="outline-dark" v-if="customOptions.modalTwoLabel">{{customOptions.modalTwoLabel}}</b-button> -->

          <b-modal id="modalTwo" v-bind:title="customOptions.modalTwoLabel" hide-footer>
            <div class="d-block text-left" v-html="customOptions.modalTwoText">
            </div>
          </b-modal>
        </div>
      </div> 

      <div v-if="Array.isArray(customOptions.showPastPrompts) && roomInfo.currentCardIndex >= firstNonInstruction">

        <div class="itinerary mb-5 card d-flex shadow"> <!-- style="display: flex; flex-direction: column-reverse;-->
          <div class="card-body justify-content-center">
            <div class="row my-2">
              <div class="col-sm game-meta">
                <h2 v-html="customOptions.pastPromptHeader ? customOptions.pastPromptHeader : 'Past Prompts'"></h2>
              </div>
            </div>
            <div class="row">
              <div class="col-sm" v-html="customOptions.pastPromptPrecursor ? customOptions.pastPromptPrecursor : null"></div>
            </div>
            <div v-for="(round, roundIndex) in roomInfo.cardSequence" v-bind:key="roundIndex">
              <div v-if="Object.prototype.toString.call(round) === '[object Object]' && phaseData.length>0 && roundIndex <= roomInfo.currentCardIndex">
                <div class="row" v-for="(phase, phaseIndex) in numberOfPhases" v-bind:key="phaseIndex">
                  <div class="col-sm" v-if="roundIndex < roomInfo.lastSeenRound || (roundIndex==roomInfo.lastSeenRound && phaseIndex < roomInfo.lastSeenPhase)">
                    <div v-if="customOptions.showPastPrompts[phaseIndex]==1" style="font-size: .8em;">
                      {{phaseData[phaseIndex][round[phaseIndex]]}}
                      <br>|
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="row" v-if="roomInfo.currentCardIndex >= endingIndex">
              <div class="col-sm" v-html="customOptions.pastPromptCoda ? customOptions.pastPromptCoda : null">
              </div>
            </div>
          </div>
        </div>
      </div>
      

    </div>
  </div>
</template>

<script>
import { roomsCollection } from '../../firebase';
import RoomLink from '../layout/RoomLink.vue';

export default {
  name: 'app-phases',
  props: {
    roomID: String,
  },
  components: {
    'app-roomLink': RoomLink,
  },
  data: function(){
    return {
      roomInfo: {
        currentCardIndex: 0,
        currentPhase: 0,
        xCardIsActive: false,
        cardSequence: [0,1,2],
        skipToEnding: false,
        lastSeenRound: 0,
        lastSeenPhase: 0, 
      },
      customOptions: {},
      dataReady: false,
      firebaseReady: false,
      gSheet: [{text:"loading"}],
      numberOfPhases: 0,
      phaseNames: [],
      phaseData: [],
      orderedCards: [],
      unorderedCards: [],
      firstNonInstruction: 0,
      endingIndex: 0,
      error: false,
    }
  },
  mounted(){
    this.fetchAndCleanSheetData();

    this.$bind('roomInfo', roomsCollection.doc(this.roomID))
      .then(() => {
        this.firebaseReady = true
      })
      .then(() => {
        if (!this.roomInfo){
          console.log("new room!")

          roomsCollection.doc(this.roomID).set({currentCardIndex:0, xCardIsActive: false, cardSequence:[0,1,2], currentPhase: 0, skipToEnding: false, lastSeenRound: 0, lastSeenPhase: 0})

          if(this.dataReady){this.shuffle();}
        }
      })
      .catch((error) => {
        console.log('error in loading: ', error)
      })
  },
  metaInfo () {
    return {
      title: this.customOptions.gameTitle,
      meta: [
        {
          property: 'description',
          content: this.customOptions.gameBlurb,
          vmid: 'description'
        },
        {
          property: 'og:title',
          content: this.customOptions.gameTitle,
          vmid: 'og:title'
        },
        {
          property: 'og:description',
          content: this.customOptions.gameBlurb,
          vmid: 'og:description'
        },
        {
          property: 'og:image',
          content: this.customOptions.ogImageSquare,
          vmid: 'og:image'
        },
        {
          property: 'og:url',
          content: 'https://storysynth.org/' + this.$route.fullPath,
          vmid: 'og:url'
        },
        {
          property: 'twitter:card',
          content: 'summary',
          vmid: 'twitter:card'
        },
        {
          property: 'og:site_name',
          content: 'Story Synth',
          vmid: 'og:site_name'
        },
        {
          property: 'twitter:image:alt',
          content: this.customOptions.gameTitle + " logo",
          vmid: 'twitter:image:alt'
        },
      ]
    }
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
    previousCard(){
      if (Number.isInteger(this.roomInfo.cardSequence[this.roomInfo.currentCardIndex])){
        if (this.roomInfo.cardSequence[this.roomInfo.currentCardIndex] >= this.phaseData[0].length){
          this.roomInfo.currentCardIndex -= 1
          this.roomInfo.currentPhase = this.numberOfPhases - 1
        } else {
          this.roomInfo.currentCardIndex -= 1
          this.roomInfo.currentPhase = 0
        }
      } else if (this.roomInfo.currentPhase == 0){      
        this.roomInfo.currentPhase = this.numberOfPhases - 1
        this.roomInfo.currentCardIndex -= 1
      } else {
        this.roomInfo.currentPhase -= 1
      }

      let lastSeenRound = (this.roomInfo.currentCardIndex > this.endingIndex) ? this.roomInfo.lastSeenRound : this.roomInfo.currentCardIndex
      let lastSeenPhase = (this.roomInfo.currentCardIndex > this.endingIndex) ? this.roomInfo.lastSeenPhase : this.roomInfo.currentPhase
      
      roomsCollection.doc(this.roomID).update({
        currentCardIndex: this.roomInfo.currentCardIndex,
        lastSeenRound: lastSeenRound,
        currentPhase: this.roomInfo.currentPhase,
        lastSeenPhase: lastSeenPhase,
      })
    },
    nextCard(){
      if (this.roomInfo.cardSequence.length == 1){
        this.shuffle();
      }

      if (Number.isInteger(this.roomInfo.cardSequence[this.roomInfo.currentCardIndex])){
        this.roomInfo.currentCardIndex += 1
        this.roomInfo.currentPhase = 0
      } else if (this.roomInfo.currentPhase < this.numberOfPhases - 1){
        this.roomInfo.currentPhase += 1
      } else {
        this.roomInfo.currentPhase = 0;
        this.roomInfo.currentCardIndex += 1
      }

      let lastSeenRound = (this.roomInfo.currentCardIndex > this.endingIndex) ? this.roomInfo.lastSeenRound : this.roomInfo.currentCardIndex
      let lastSeenPhase = (this.roomInfo.currentCardIndex > this.endingIndex) ? this.roomInfo.lastSeenPhase : this.roomInfo.currentPhase

      roomsCollection.doc(this.roomID).update({
        currentCardIndex: this.roomInfo.currentCardIndex,
        lastSeenRound: lastSeenRound,
        currentPhase: this.roomInfo.currentPhase,
        lastSeenPhase: lastSeenPhase,
      })
    },
    skipInstructions(){
      roomsCollection.doc(this.roomID).update({
        currentCardIndex: this.firstNonInstruction,
        lastSeenRound: this.firstNonInstruction,
        currentPhase: 0,
        lastSeenPhase: 0
      })
    },
    ending(){
      if (this.roomInfo.cardSequence.length == 1){
        this.shuffle();
      }

      roomsCollection.doc(this.roomID).update({
        lastSeenRound: this.roomInfo.currentCardIndex,
        lastSeenPhase: this.roomInfo.currentPhase,
        currentCardIndex: this.endingIndex,
        skipToEnding: true
      })
    },
    xCard(){
      roomsCollection.doc(this.roomID).update({
        xCardIsActive: !this.roomInfo.xCardIsActive
      })
    },
    shuffle(){

      // reset card count
      roomsCollection.doc(this.roomID).update({
        currentCardIndex: 0,
        currentPhase: 0
      })

      // Create a ordered array
      var initialCardSequence = []
      var finalCardSequence = []
      var shuffledCards = []

      // add in the ordered cards
      for (var i = 0; i < this.gSheet.length; i++) {
        if (this.gSheet[i].ordered == 0){
          initialCardSequence.push(i)
        } else if (this.gSheet[i].ordered == 2) {
          finalCardSequence.push(i)
        }
      }

      // Shuffle deck function
      var shuffleDeck = function (deck){
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
        for (i = 0; i < this.phaseData[0].length; i++){
          numberOfRounds[j].push(i);
        }
        numberOfRounds[j] = shuffleDeck(numberOfRounds[j])
      }

      var newEmptyCard
      for (i = 0; i < this.phaseData[0].length; i++) {
        newEmptyCard = {};
        for (j = 0; j < this.numberOfPhases; j++){
          newEmptyCard[j] = numberOfRounds[j][i]
        }

        shuffledCards.push(newEmptyCard)
      }



      // sync the shuffled array
      roomsCollection.doc(this.roomID).update({
        cardSequence: initialCardSequence.concat(shuffledCards).concat(finalCardSequence)
      })

    },
    fetchAndCleanSheetData(){

  

        let gRows = [
            ["option","gameBlurb","<div class=\"text-left\" style=\"white-space:normal\">\n<h2>Pitch</h2>\nTell the story of two close companions racing their way around a fantasy world.\n<br><br>\nNella and Bly wagered that they could race completely around the realm and return before the summer solstice. However, the lands are full of magic, danger, and adventure – will they make it back in time?\n<br><br>\n<h2>Info</h2>\n<ul>\n  <li>2+ players</li>\n  <li>All ages</li>\n  <li>30 minutes - 2 hours</li>\n  <li>Genre: Fantasy</li>\n  <li>Tone: exciting adventure</li>\n  <li>Activities: light narration, quick worldbuilding</li>\n</ul>\n</div>","-","-","-","-","-","-"  ],
            ["option","wallet","$ilp.uphold.com/WMbkRBiZFgbx","","","","","",""  ],
            ["option","revShare","0.2","","","","","",""  ],
            ["option","coverImage","https://diegeticgames.com/uploads/around-the-realm-cover-narrow.png","","","","","",""  ],
            ["option","cardBackgroundImage","https://diegeticgames.com/uploads/card-bottom-wave2.png","","","","","",""  ],
            ["option","cardBackgroundImageAlign","bottom","","","","","",""  ],
            ["option","ogImageSquare","https://diegeticgames.com/uploads/around-the-realm-square-unfurl.png"],
            ["option","style","<link href=\"https://fonts.googleapis.com/css?family=IM+Fell+English|Montserrat\" rel=\"stylesheet\">\n\n<style>\n\n#app {Font-Family: 'IM Fell English', Serif;}\n\n.card-header-text {\n  font-size: 2.5rem;\n  Font-Family: 'IM Fell English', Serif;\n}\n\n.card {\n  background-image: url(https://diegeticgames.com/uploads/groovepaper.png);\n}\n\n.card-img-bottom {\n  filter: saturate(0.7);\n  object-fit: cover;\n  object-position: top;\n  height: 60px;\n}\n\n.full-page-background {\n  background: rgb(255,255,255);\n  background: linear-gradient(180deg, rgba(30,150,255,1) 0%, rgba(255,255,255,1) 300px, rgba(255,255,255,1) 100%);\n  background-image: url(\"https://diegeticgames.com/uploads/around-the-realm-background.png\");\n  filter: sepia(1) grayscale(0.4) brightness(1);\n}\n\n</style>"," ","-","-","-","-","-"  ],
            ["option","showPastPrompts","1,0,0,1,0,0","-","-","-","-","-","-"  ],
            ["option","pastPromptHeader","Itinerary","","","","","",""  ],
            ["option","pastPromptPrecursor","Home\n<br>\n|","","","","","",""  ],
            ["option","pastPromptCoda","Home Again","","","","","",""  ],
            ["option","instructionsProgressBar","show","","","","","",""  ],
            ["option","phaseHelpText","Describe the environment, the mode of travel, the fellow travellers, or local rumors|Describe who instigates, who escalates, and what's at stake|Resolve this tangent and set the characters up to arrive at their next destination|Describe the local sights, sounds, and culture|Describe who instigates, who escalates, and what's at stake|Resolve this tangent and set the characters up to continue their journey","-","-","-","-","-","-"  ],
            ["0","Around the Realm\n(in 80 days)\n\n🧳🏰⛰🐉🪂🏜🐪⛵️🏝🧜🏽🌋🧳","One player should hit NEXT to move onto the next card","-","-","-","-","-","-"  ],
            ["0","Get Started","Take turns reading these cards – whomever reads the card should hit NEXT when they're done.","-","-","-","-","-","-"  ],
            ["0","The Pitch","In this game, you'll tell the story of two characters racing around a fantasy realm and getting in and out of trouble (repeatedly). It will be light in tone and fast paced.","-","-","-","-","-","-"  ],
            ["0","The Setting","This story takes place on the The Whirl - an archipelago of islands in the shape of a circle. The islands contain myriad kingdoms and city states; the sea at the center of The Whirl contains a massive and unending maelstrom, the result of a spell gone wrong in centuries past.","-","-","-","-","-","-"  ],
            ["0","The Setting","The lands of The Whirl are constantly jockeying for wealth and status, often through war and always through commerce, espionage, and magic.","-","-","-","-","-","-"  ],
            ["0","The Setting","For the first time in decades, all the lands of The Whirl are at peace. This means it's finally safe to travel in a complete loop around The Whirl and return back home. This hasn't been done in recent memory.","-","-","-","-","-","-"  ],
            ["0","The Characters","Our story centers on two characters – Nella and Bly – who are attempting to circle The Whirl in record time. They have known each other for ages. We'll jointly control and narrate their adventures.\n\nChoose their relationship:\n– Expert and apprentice\n– Siblings\n– Romantic partners\n– Business partners\n– Childhood friends\n\nThen, choose their pronouns","-","-","-","-","-","-"  ],
            ["0","The Characters","Nella and Bly are sharp foils of each other.\n\nFor each of these matched traits, assign one to each character:\n<div class=\"text-center\">\nBook smart OR Street smart\nCourageous OR Cautious\nGregarious OR Shy \n</div>","-","-","-","-","-","-"  ],
            ["0","The Characters","As a group, name something that Nella and Bly like and dislike about their home city.","","","","","",""  ],
            ["0","The Characters","Nella and Bly have boasted that they can travel the entire Whirl and return before the summer solstice. An acquaintance of theirs is skeptical and offers a substantial wager.\n\nChoose what is at stake:\n– An immense amount of wealth\n– Honor and glory\n– A prestigious job\n– A magical artifact\n","-","-","-","-","-","-"  ],
            ["0","The Rules","The story will unfold over a series of vignettes as Nella and Bly navigate The Whirl and try to win the wager. They'll never stay in one place for too long but they could encounter the same travelers and factions in different parts of the realm.","-","-","-","-","-","-"  ],
            ["0","The Rules","Play alternates between Travel rounds and Settlement rounds.\n\nIn a round, the sequence of actions are:\n1) A player describes the new mode of Travel or new Settlement, embellishing what is on the prompt\n2) The next player then draws an Escapade prompt that describes how the characters get into trouble or encounter an opportunity\n3) The next player resolves the situation and gets the characters back on track (arriving at or leaving from a settlement)\n\nThen a player draws a new Travel or Settlement card and the next round begins – make sure to alternate who is drawing the Travel and Settlement cards.","-","-","-","-","-","-"  ],
            ["0","The Rules","When it's your turn, feel free to embellish on the prompt as much as you like. You can ask other players for suggestions, and they can ask follow-up questions, but control of the narrative is ultimately up to you.\n\nFor Settlements: mention the sights, sounds, and smells. For Travel: describe the scenery and the fellow travellers.\n\nEscapades are usually caused by one character or both, perhaps due to their traits. Keep the tone light.\n\nThe characters might get back on track through their own cunning or with the help of an ally. Say whether they're better or worse for the ordeal.","-","-","-","-","-","-"  ],
            ["0","The Rules","Continue through this cycle until you're ready to end the game:\n\n1. Travel\n2. Escapade\n3. Resolution\n4. Settlement\n5. Escapade\n6. Resolution\n\nThen, click the ENDING button and answer the final prompts.","-","-","-","-","-","-"  ],
            ["0","The Rules","If you need to pause the game for any reason, especially if you want to discuss, edit, or reverse any content decisions, just click the X-Card button.","-","-","-","-","-","-"  ],
            ["0","Let's get this adventure started","You're ready to start playing!\n\nHit NEXT to begin and then have one player describe the first form of Travel as Nella and Bly make their way around the Whirl.\n\nThen, keep rotating players and answering prompts until you're ready to end the game.","-","-","-","-","-","-"  ],
            ["1","-","-","A network of magical portals, part of a new experiment by a bright young mage","Under suspicion from government investigators","How do the characters resolve the escapade and get back on track?\n\nDid they gain or lose anything or anyone in the process?","The city of the undead, where teams of skeletons power all infrastructure under the watchful eyes of necromancer-administrators","A massive siege begins and no one can enter or exit the settlement","How do the characters resolve the escapade and get back on track?\n\nDid they gain or lose anything or anyone in the process?"  ],
            ["1","-","-","A caravan of merchants, travelling together for safety as they pass through dangerous territory between destinations","Targeted by con artists, as smooth as they are devious","How do the characters resolve the escapade and get back on track?\n\nDid they gain or lose anything or anyone in the process?","A sunken, submerged city that is protected from the water by an ancient enchantment","A case of mistaken identity","How do the characters resolve the escapade and get back on track?\n\nDid they gain or lose anything or anyone in the process?"  ],
            ["1","-","-","In carriages with an archeological expedition that has been mapping out the region in search of powerful artifacts","Attacked by thieves, bandits, or pirates","How do the characters resolve the escapade and get back on track?\n\nDid they gain or lose anything or anyone in the process?","Magic is omnipresent, though all controlled by the tyrant-mage who runs the city from their wizard's tower","A magical experiment; a bold foray in the arcane to uncover new truths or create epic works","How do the characters resolve the escapade and get back on track?\n\nDid they gain or lose anything or anyone in the process?"  ],
            ["1","-","-","On the backs of dragons who have been domesticated for this purpose","A encounter with megafauna, up close and personal","How do the characters resolve the escapade and get back on track?\n\nDid they gain or lose anything or anyone in the process?","A temporary tent city built by nomads and merchants in the weeks before the summer solstice","The animals have escaped from the zoo and they are everywhere","How do the characters resolve the escapade and get back on track?\n\nDid they gain or lose anything or anyone in the process?"  ],
            ["1","-","-","On foot as the terrain is too treacherous for carriages and horses","A natural or magical disaster disrupts the journey","How do the characters resolve the escapade and get back on track?\n\nDid they gain or lose anything or anyone in the process?","For as far as you can see, the land has been strip-mined – a small community occupies the remains of what was once a great city","A maze of bureaucracy and an army of pencil pushers","How do the characters resolve the escapade and get back on track?\n\nDid they gain or lose anything or anyone in the process?"  ],
            ["1","-","-","By ship through an archipelago of glimmering islands and unpredictable currents","A mutiny or rebellion by the crew or travelling companions","How do the characters resolve the escapade and get back on track?\n\nDid they gain or lose anything or anyone in the process?","An eco-paradise – a thriving city is deeply integrated into the surrounding jungle and local fauna contribute to a continuous symphony","Revolution spreads throughout the settlement","How do the characters resolve the escapade and get back on track?\n\nDid they gain or lose anything or anyone in the process?"  ],
            ["1","-","-","By a flying ship, the last surviving vessel from an ancient fleet\n","An alluring side trek, off the direct route","How do the characters resolve the escapade and get back on track?\n\nDid they gain or lose anything or anyone in the process?","This city is floating high above the surrounding farmland, levitated by some arcane contraption to protect itself from threats","The leaders of the settlement strongly suggest that Nella and Bly stay, or else...","How do the characters resolve the escapade and get back on track?\n\nDid they gain or lose anything or anyone in the process?"  ],
            ["1","-","-","On horseback, with a diplomatic delegation who are hoping to establish formal relations between once rival states","A physical obstacle blocks the way forward","How do the characters resolve the escapade and get back on track?\n\nDid they gain or lose anything or anyone in the process?","A city of clockwork automatons bustling through the streets; oddly few humans though","Love at first sight","How do the characters resolve the escapade and get back on track?\n\nDid they gain or lose anything or anyone in the process?"  ],
            ["1","-","-","Underground, through an endless and labyrinthine cave network ","A malfunction, breakdown, or problem with the mode of transit","How do the characters resolve the escapade and get back on track?\n\nDid they gain or lose anything or anyone in the process?","The city is built into a mountain, with dense networks of tunnels and vaulted chambers","Rumors of a lost tome of great wisdom","How do the characters resolve the escapade and get back on track?\n\nDid they gain or lose anything or anyone in the process?"  ],
            ["2","The Road Home","Nella and Bly are almost back home. Answer the following as a group:\n–Do they expect to make it back by the summer solstice?\n–How do the feel about their journey being so close to an end?","-","-","-","-","-","-"  ],
            ["2","Home Again","Nella and Bly are greeted by the familiar sights and sounds of their hometown.\n\nAs a group, answer the following questions about the characters:\n– Did they win the wager?\n– What are their plans for the future?\n– How has their relationship with each other changed?","-","-","-","-","-","-"  ],
            ["2","The End","<div class=\"text-center\">\nThanks for playing!\n\nYou can share <a target=\"_blank\" href=\"https://storysynth.org/#/Phases/10dXt64oWecErQ0ooCXa1D9dZXfP4WPO7ujwoFsAUN6k\">this link</a> to create new sessions of Around the Realm. Tell your friends!\n</div>","-","-","-","-","-","-"  ],
            ["2","Credits","Game by Randy Lubin, <a target=\"_blank\" href=\"https://diegeticgames.com\">Diegetic Games</a>\n\nArt includes maps generated through <a target=\"_blank\" href=\"https://azgaar.github.io/Fantasy-Map-Generator/\">Azgaar's Fantasy Map Generator</a>\n\nWaves on the bottom of the cards <a target=\"_blank\" href=\"http://www.freepik.com\">Designed by Freepik</a>","-","-","-","-","-","-"  ],
            ["2","Under the Hood","This game is powered by this <a target=”_blank” href=\"https://docs.google.com/spreadsheets/d/10dXt64oWecErQ0ooCXa1D9dZXfP4WPO7ujwoFsAUN6k/edit?usp=sharing\">Google Sheet</a>. Check out <a target=\"_blank\" href=\"https://storysynth.org\">Story Synth</a> to make your own spreadsheet driven games for free!","-","-","-","-","-","-"  ]
          ]

        var cleanData = []

        this.numberOfPhases = 6
        this.phaseNames = ['Transit','Escapade','Resolution', 'Settlement', 'Escapade', 'Resolution']
        this.phaseData = [[],[],[],[],[],[]]

        var newEndingIndex = 0

        // Transform Sheets API response into cleanData
        gRows.forEach((item) => {
          // Handle options
          if (item[0] == "option"){
            this.customOptions[item[1]] = item[2]
            if (item[1] == "phaseHelpText"){
              this.customOptions.phaseHelpText = this.customOptions.phaseHelpText.split('|')
            } else if (item[1] == "showPastPrompts") {
              this.customOptions.showPastPrompts = this.customOptions.showPastPrompts.split(',')
            }
          }

          // Get count of instruction cards
          if (item[0] == 0){
            this.firstNonInstruction += 1
          }

          // Get ending index
          if ((item[0] == 0 || item[0] == 1) && this.endingIndex == 0){
            newEndingIndex += 1
          }

          var rowInfo = {}
          if (item[0] >= 0){
            rowInfo = {
              ordered: item[0],
              headerText: item[1],
              bodyText: item[2]
            }
            cleanData.push(rowInfo)
          }

          if (item[0] == 1){
            for (var j = 3; j < item.length; j++) {
              this.phaseData[j-3].push(item[j])
            }
          }
        });

        this.endingIndex = newEndingIndex;

        // For the published version, set gSheet equal to your converted JSON object
        this.gSheet = cleanData

        console.log('done fetching and cleaning data')
        this.dataReady = true;
        
        if(this.firebaseReady && this.roomInfo.cardSequence.length < 4){this.shuffle();}
      
    }

  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->


<style scoped>

  .phases{
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

  .card-body{
    font-size: 1.5em;
    min-height: 11em;
  }

  .fade-enter-active, .fade-leave-active {
    transition: opacity .5s;
  }
  .fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
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
