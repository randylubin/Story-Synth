<template>
  <div class="slot-machine game-room container" v-if="roomInfo">
    <div class="full-page-background"></div>
    <div v-html="customOptions.style"></div>

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
              >Reshuffle</b-button
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
              variant="outline-dark"
              class="btn-lg btn-block"
              :disabled="roomInfo.currentCardIndex == gSheet.length - 1 || roomInfo.xCardIsActive"
              v-on:click="lastCard(); closeMenu();"  
            >
              Last Card
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
              :disabled="
                roomInfo.xCardIsActive || roomInfo.currentCardIndex == gSheet.length - 1
              "
            >
              <!-- Next Card -->
              <b-icon class="h1 mb-0 ml-2" icon="card-heading"></b-icon>
              <b-icon class="h1 mb-0" icon="chevron-right"></b-icon>              
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

    <div v-if="gSheet[roomInfo.cardSequence[roomInfo.currentCardIndex]] || Object.prototype.toString.call(roomInfo.cardSequence[roomInfo.currentCardIndex]) === '[object Object]'" class="mb-4">
      <transition name="fade">
        <div class="card d-flex shadow img-fluid" v-bind:class="{'bg-transparent': (customOptions.coverImage && roomInfo.currentCardIndex == 0)}">
          <img v-bind:src="customOptions.coverImage" class="card-img-top" style="width:100%" v-if="customOptions.coverImage && roomInfo.currentCardIndex == 0">
          <img v-bind:src="customOptions.cardBackgroundImage" class="card-img-top card-background" style="width:100%" v-if="customOptions.cardBackgroundImage && (!customOptions.coverImage || roomInfo.currentCardIndex != 0)">
          <div class="card-body text-center" v-if="(!dataReady || !firebaseReady) && !error">
            <h1 class="m-5">Loading</h1>
            <b-spinner class="m-5" style="width: 4rem; height: 4rem;" label="Busy"></b-spinner>
          </div>

          <div class="card-body justify-content-center mt-2" style="white-space: pre-line" v-if="!roomInfo.xCardIsActive && (!customOptions.coverImage || roomInfo.currentCardIndex != 0)" v-bind:class="{'card-body': !customOptions.cardBackgroundImage, 'card-img-overlay': customOptions.cardBackgroundImage }">
            <div class="row mb-4" v-if="customOptions.instructionsProgressBar && roomInfo.currentCardIndex < firstNonInstruction && roomInfo.currentCardIndex != 0">
              <div class="col-sm">
                <h2>Instructions</h2>
                <b-progress :value="roomInfo.currentCardIndex" :max="firstNonInstruction - 1" variant="dark"></b-progress>
              </div>
            </div>


            <div v-if="gSheet[roomInfo.cardSequence[roomInfo.currentCardIndex]]">
              <h1>{{ gSheet[roomInfo.cardSequence[roomInfo.currentCardIndex]].headerText }}</h1>
              <p class="mt-4 mb-4" v-html="gSheet[roomInfo.cardSequence[roomInfo.currentCardIndex]].bodyText"></p>
            </div>

            <div v-if="Object.prototype.toString.call(roomInfo.cardSequence[roomInfo.currentCardIndex]) === '[object Object]'">
              <div v-for="(index) in numberOfWheels" v-bind:key="index" v-html="wheels[index-1][roomInfo.cardSequence[roomInfo.currentCardIndex][index-1]]">
                
              </div>
            </div>
            
          </div>
          
          <div class="card-body align-items-center justify-content-center" v-if="roomInfo.xCardIsActive" v-bind:class="{'card-body': !customOptions.cardBackgroundImage, 'card-img-overlay': customOptions.cardBackgroundImage }">
            <div class="mt-5 pt-5 mb-5">
              <h1 v-if="!customOptions.safetyCardText">X-Card</h1>
              <div class="safety-card-tet" v-html="customOptions.safetyCardText" v-if="customOptions.safetyCardText"></div> 
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
          <b-button variant="outline-dark" v-on:click="xCard()" v-html="customOptions.safetyCardButton ? customOptions.safetyCardButton : 'X-Card'"></b-button>
          <button class="btn btn-outline-dark" :disabled="roomInfo.currentCardIndex == gSheet.length - 1 || roomInfo.xCardIsActive" v-on:click="lastCard()">Last Card</button>
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

  </div>
</template>

<script>
import { roomsCollection } from '../../firebase';
import RoomLink from '../layout/RoomLink.vue';

export default {
  name: 'app-postWorkParadise',
  props: {
    roomID: String,
    gSheetID: String
  },
  components: {
    'app-roomLink': RoomLink,
  },
  data: function(){
    return {
      roomInfo: {
        currentCardIndex: 0,
        xCardIsActive: false,
        cardSequence: [0,1,2]
      },
      firstNonInstruction: 0,
      dataReady: false,
      firebaseReady: false,
      gSheet: [{text:"loading"}],
      numberOfWheels: 0,
      wheels: [],
      orderedCards: [],
      unorderedCards: [],
      customOptions: {},
      error: false,
    }
  },
  mounted(){
    this.fetchAndCleanSheetData(this.gSheetID);

    this.$bind('roomInfo', roomsCollection.doc(this.roomID))
      .then(() => {
        this.firebaseReady = true
      })
      .then(() => {
        if (!this.roomInfo){
          console.log("new room!")

          roomsCollection.doc(this.roomID).set({currentCardIndex:0,xCardIsActive: false, cardSequence:[0,1,2]})

          if(this.dataReady){this.shuffle();}
        }
      })
      .catch((error) => {
        console.log('error in loading: ', error)
      })
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
      roomsCollection.doc(this.roomID).update({
        currentCardIndex: this.roomInfo.currentCardIndex -= 1
      })
    },
    nextCard(){
      if (this.roomInfo.cardSequence.length == 1){
        this.shuffle();
      }
      roomsCollection.doc(this.roomID).update({
        currentCardIndex: this.roomInfo.currentCardIndex += 1
      })
    },
    lastCard(){
      if (this.roomInfo.cardSequence.length == 1){
        this.shuffle();
      }

      roomsCollection.doc(this.roomID).update({
        currentCardIndex: this.gSheet.length -1
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
        currentCardIndex: 0
      })

      // Create a ordered array
      var newCardSequence = []
      var shuffledCards = []

      // add in the ordered cards
      for (var i = 0; i < this.gSheet.length; i++) {
        if (this.gSheet[i].ordered == 0){
          newCardSequence.push(i)
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

      // create an array of the wheel length
      var wheelsIndexArray = []
      
      for (var j = 0; j < this.wheels.length; j++) {
        wheelsIndexArray.push([])
        for (i = 0; i < this.wheels[0].length; i++){
          wheelsIndexArray[j].push(i);
        }
        wheelsIndexArray[j] = shuffleDeck(wheelsIndexArray[j])
      }

      var newEmptyCard
      for (i = 0; i < this.wheels[0].length; i++) {
        newEmptyCard = {};
        for (j = 0; j < this.numberOfWheels; j++){
          newEmptyCard[j] = wheelsIndexArray[j][i]
        }

        shuffledCards.push(newEmptyCard)
      }

      // sync the shuffled array
      roomsCollection.doc(this.roomID).update({
        cardSequence: newCardSequence.concat(shuffledCards)
      })

    },
    fetchAndCleanSheetData(){

      var cleanData = []
      var gRows = [
        ["option","gameTitle","Post-Work Paradise","","","","","","",""  ],
        ["option","byline","By Randy Lubin","","","","","","",""  ],
        ["option","gameBlurb","This game explores what life might be like in a world where work is obsolete. How do people choose to live and spend their time?\n\nDesigned by Randy Lubin of <a target=\"_blank\" href=\"https://leveragedplay.com\">Leveraged Play</a>. Submitted as part of the <a target=\"_blank\" href=\"https://postwork.city/\">The Post-Work City</a> open call for visions for a future without work.\n\nPlay involves seeing randomly generated residents of this future city and answering questions about their lives. Character photos are generated by Artifical Intelligence via <a target=\"_blank\" href=\"https://thispersondoesnotexist.com/\">This Person Does Not Exist</a>.","","","","","","",""  ],
        ["option","style","<link rel=\"preconnect\" href=\"https://fonts.gstatic.com\">\n<link href=\"https://fonts.googleapis.com/css2?family=Orbitron&family=Roboto&display=swap\" rel=\"stylesheet\">\n\n<style>\n\n.full-page-background {\n background: #e65c00;  /* fallback for old browsers */\n background: -webkit-linear-gradient(to right, #F9D423, #e65c00);  /* Chrome 10-25, Safari 5.1-6 */\n background: linear-gradient(to right, #F9D423, #e65c00); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */\n}\n\n#app {\n font-family: 'Roboto',Arial,sans-serif;\n}\n\nh1, h2 { font-family: 'Orbitron', sans-serif;}\n\n</style>","","","","","","",""  ],
        ["option","instructionsProgressBar","TRUE","","","","","","",""  ],
        ["0","Welcome to the Future","This game explores what life might be like in a futuristic city where work is obsolete. Take turns telling the stories of how people live and spend their time.","-","-","-","-","-","-","-"  ],
        ["0","How to Play","This game will randomly generate a series of people living in a post-work future along with focused questions for you to answer about them.\n\nYou can share the session URL with others and they will see the same prompt at the same time, though the generated character image might be different.","-","-","-","-","-","-","-"  ],
        ["0","On Your Turn","Take turns reading about the generated people and then answering the questions at the bottom of their cards.\n\nYour answers can be as elaborate as you want. The other players can ask you follow up questions.","-","-","-","-","-","-","-"  ],
        ["0","Ending the Game","You can stop play at any time. If you run out of cards, you can hit 'Re-shuffle' to start from the beginning with freshly regenerated characters.","-","-","-","-","-","-","-"  ],
        ["0","About the X-Card","If you need to pause the game for any reason, especially if you want to discuss, edit, or reverse any content decisions, just click the X-Card button.","-","-","-","-","-","-","-"  ],
        ["0","The Game is about to start","Hit NEXT to begin","-","-","-","-","-","-","-"  ],
        ["1","-","-","<img style=\"max-width:50%\" src=\"https://thispersondoesnotexist.com/image?v=13\">","<br>","Passion: Acting","Personality: Gregarious, Curious","Housing: Skyscraper condo","<br>","<em>What is the highlight of their week?</em>"  ],
        ["1","-","-","<img style=\"max-width:50%\" src=\"https://thispersondoesnotexist.com/image?v=14\">","<br>","Passion: Sports","Personality: Shy, Caring","Housing: Townhouse","<br>","<em>What is their goal for the year?</em>"  ],
        ["1","-","-","<img style=\"max-width:50%\" src=\"https://thispersondoesnotexist.com/image?v=15\">","<br>","Passion: Music","Personality: Stubborn, Gregarious","Housing: Converted warehouse","<br>","<em>What do they love about living in this city?</em>"  ],
        ["1","-","-","<img style=\"max-width:50%\" src=\"https://thispersondoesnotexist.com/image?v=16\">","<br>","Passion: Learning","Personality: Silly, Adventurous","Housing: Converted office building","<br>","<em>What do they hate about living in this city?</em>"  ],
        ["1","-","-","<img style=\"max-width:50%\" src=\"https://thispersondoesnotexist.com/image?v=17\">","<br>","Passion: Community","Personality: Flexible, Calm","Housing: Tethered blimp","<br>","<em>What is their favorite place to hang out?</em>"  ],
        ["1","-","-","<img style=\"max-width:50%\" src=\"https://thispersondoesnotexist.com/image?v=18\">","<br>","Passion: Volunteering","Personality: Anxious, Caring","Housing: Self-driving RV","<br>","<em>Why did they move to this city?</em>"  ],
        ["1","-","-","<img style=\"max-width:50%\" src=\"https://thispersondoesnotexist.com/image?v=19\">","<br>","Passion: Visual arts","Personality: Serious, Optimisitic","Housing: Dormitory","<br>","<em>Who do they live with?</em>"  ],
        ["1","-","-","<img style=\"max-width:50%\" src=\"https://thispersondoesnotexist.com/image?v=20\">","<br>","Passion: Writing","Personality: Energetic, Practical","Housing: Underground complex","<br>","<em>What obligations do they have?</em>"  ],
        ["1","-","-","<img style=\"max-width:50%\" src=\"https://thispersondoesnotexist.com/image?v=21\">","<br>","Passion: Tinkering","Personality: Curious, Calm","Housing: Intentional-living compound","<br>","<em>What is their favorite annual event?</em>"  ],
        ["1","-","-","<img style=\"max-width:50%\" src=\"https://thispersondoesnotexist.com/image?v=22\">","<br>","Passion: Curating","Personality: Spontaneous, Caring","Housing: Nomadic","<br>","<em>Where do they go to be by themselves?</em>"  ]
      ]

      this.numberOfWheels = gRows[0].length - 3
      
      for (var w = 0; w < this.numberOfWheels; w++) {
        this.wheels.push([])
      }

      // Transform Sheets API response into cleanData
      gRows.forEach((item) => {
        if (item[0]){

          // Handle options
          if (item[0] == "option"){
            this.customOptions[item[1]] = item[2]
            console.log(item[2])
          }

          if (item[0] !== "option"){

            var rowInfo = {}
            if (item[0] >= 0){
              rowInfo = {
                ordered: item[0],
                headerText: item[1],
                bodyText: item[2]
              }
              cleanData.push(rowInfo)

              if (item[0] == 0){
                this.firstNonInstruction += 1
              }

              if (item[0] != 0){
                for (var j = 3; j < item.length; j++) {
                  this.wheels[j-3].push(item[j])
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

      if(this.firebaseReady && this.roomInfo.cardSequence.length < 4){this.shuffle();}
      
    }

  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->


<style scoped>

  .slot-machine{

    margin:auto;
    padding-top: 1em;
    padding-bottom: 1em;
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
  .x-card-text {
    font-size: .5em;
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
