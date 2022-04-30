<template>
  <div class="secretCards game-room container" v-if="roomInfo">
    <div class="full-page-background"></div>
    <div v-html="customOptions.style"></div>

    <!-- Menu Bar -->
    <div class="menu-bar mb-4 d-flex align-items-right">
      <app-roomLink class="d-none d-sm-block" :routeRoomID="$route.params.roomID" :color="customOptions.menuColor" v-if="dataReady && firebaseReady"></app-roomLink>
    </div>


    <div class="mb-4 game-meta" v-if="customOptions.gameTitle || customOptions.byline">
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
    <b-alert show class="demoInfo" variant="info" v-if="customOptions.demoInfo">This demo is powered by <a :href="customOptions.demoInfo" target="_blank">this Google Sheet Template</a>. Copy the sheet and start editing it to design your own game!</b-alert>

    <div>
      <div class="card shadow" v-if="(!dataReady || !firebaseReady) && !error">
        <div class="card-body text-center">
          <h1 class="m-5">Loading</h1>
          <b-spinner class="m-5" style="width: 4rem; height: 4rem;" label="Busy"></b-spinner>
        </div>
      </div>

      <div v-if="!playerSelected" class="mb-4">
        <div class="row align-center mb-3">
          <img v-bind:src="customOptions.coverImage" class="img-fluid" alt="">
        </div>
        <div class="row text-center">
          <div class="col-sm">Pick a player role:</div>
        </div>
        <div class="row">
          <div class="btn-group col-sm" role="group" aria-label="Timer Controls">
            <button type="button" class="btn btn-outline-dark" v-for="player in playerArray" v-bind:key="player" v-on:click="selectPlayer(player)">{{player}}</button>
          </div>
        </div>
      </div>

      <div class="player-label row mb-4" v-if="playerSelected">
        <div class="col-sm">
          Role: {{playerSelected}}
          <button class="btn btn-sm btn-outline-dark" v-on:click="selectPlayer(null)">Reselect role</button>
        </div>
      </div>
    </div>

    <div class="btn-container" v-if="playerSelected">
      <div class="row mb-4">
        <div class="btn-group col-sm" role="group" aria-label="Deck Controls">
          <button class="btn btn-outline-dark" v-on:click="previousCard()" :disabled="roomInfo.xCardIsActive || roomInfo.currentCardIndex == 0">Previous</button>
          <button class="btn btn-outline-dark" v-on:click="nextCard()" :disabled="roomInfo.xCardIsActive || roomInfo.currentCardIndex == gSheet.length-2">
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
              Talk about the direction of story, or revise some content, or adjust the tone. Once everyone is on the same page, resume play.
            </h4>
          </div>

          <button class="btn btn-outline-dark mb-3" style="width:100px;" type="button" v-on:click="xCard()" :disabled="roomInfo.currentCardIndex == 0">Continue</button>
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
                  <span style="white-space: pre-line" v-html="row.publicText"></span>
                  <br><br>

                  <h5>Secret:</h5>
                  <span style="white-space: pre-line" v-html="row[playerSelected]"></span>

                </div>
              </div>
            </div>
          </div>
        </transition>
      </div>
    </div>

    <!--
    <div class="btn-group col-sm" role="group" aria-label="Advice Buttons">
      <b-button v-b-modal.speaker-tips variant="warning">Speaker Tips</b-button>

      <b-modal id="speaker-tips" title="Advice for giving a speech" hide-footer>
        <div class="d-block text-left">
          <h4>Creating a character</h4>
          <p>Take a minute to read through the suggested answers. For each question, pick one or two answers that resonate with you or make up your own; consider what embellishments you might add. Think about what type of personality your character might have and how that might be expressed through manner of speech and gestures.</p>

          <h4>Opening remarks</h4>
          <p>When you're ready to start the meeting, you can say "May I have your attention please." Introduce yourself, in character, including any of the key details about your background. Then, make sure you cover the key information relating to the second question on the character card.</p>
          <p>Feel free to ham it up and make your character ridiculous! When you're done with your speech, open it up to the audience with "Any questions?"</p>

          <h4>Answering questions</h4>
          <p>Here are some go-to tactics when answering questions:</p>
          <ul>
            <li>Make up an answer</li>
            <li>Change the subject</li>
            <li>Be overly defensive</li>
            <li>Show contrition</li>
            <li>Attack whomever asked the question</li>
            <li>Claim ignorance</li>
            <li>Cut off whomever is asking the questions</li>
          </ul>
          <p>You end the round at any time by saying "That will be all!"</p>
        </div>
      </b-modal>

      <b-button v-b-modal.audience-tips variant="warning">Audience Tips</b-button>

      <b-modal id="audience-tips" title="Advice for asking questions" hide-footer>
        <div class="d-block text-left">
          <h4>Being a character</h4>
          <p>You don't need to ask questions in character but it can help! Consider who you might be and why you're at the this speech. For instance you could be a collegue, a rival, a skeptic, a fan, or a concerned citizen.</p>

          <h4>Asking questions</h4>
          <p>Try keep the focus on the speaker; don't hog the spotlight. Try the following types of questions:</p>
          <ul>
            <li>Ask for an elaboration on something the speaker mentioned</li>
            <li>Ask about potential consequences of something in the story</li>
            <li>Cast doubt on the speaker: "That's not what I heard..."</li>
            <li>Introduce new info: “What do you think of rumors that...”</li>
            <li>Share a controverisal opinion: “More of a statement than a question...”</li>
          </ul>

        </div>
      </b-modal>

      <button class="btn btn-warning" v-on:click="xCard()" :disabled="roomInfo.currentCardIndex == 0">Pause</button>
    </div>
    -->
  </div>
</template>

<script>
import { roomsCollection } from '../../firebase';
import axios from 'axios'
import RoomLink from '../layout/RoomLink.vue';

export default {
  name: 'app-secretCards',
  components:{
    'app-roomLink': RoomLink,
  },
  props: {
    roomID: String,
    gSheetID: String
  },
  data: function(){
    return {
      roomInfo: {
        currentCardIndex: 0,
        xCardIsActive: false,
        cardSequence: [0,1,2],
        roundInfo: "",
        roundProgress: "",
        roundTitle: ""
      },
      dataReady: false,
      firebaseReady: false,
      error: false,
      playerSelected: null,
      playerArray: [],
      gSheet: [{text:"loading"}],
      orderedCards: [],
      unorderedCards: [],
      clickedCard: 0,
      instructionCardCount: 15,
      gameRoundCount: 6,
      customOptions: {}
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
      let currentUrl = location.hostname.toString() + this.$route.fullPath
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
      this.updateRoundInfo();
    },
    nextCard(){
      roomsCollection.doc(this.roomID).update({
        currentCardIndex: this.roomInfo.currentCardIndex += 1
      })
      this.updateRoundInfo();
    },
    updateRoundInfo(){
      var newRoundInfo = ""
      var newRoundProgress =""

      if (this.roomInfo.currentCardIndex == 0 || this.roomInfo.currentCardIndex == (this.instructionCardCount + this.gameRoundCount + 1)){
        newRoundInfo = ""
      } else if (this.roomInfo.currentCardIndex <= this.instructionCardCount){
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


      roomsCollection.doc(this.roomID).update({
        roundInfo: newRoundInfo,
        roundProgress: newRoundProgress,
        roundTitle: newRoundTitle
      })
    },
    xCard(){
      roomsCollection.doc(this.roomID).update({
        xCardIsActive: !this.roomInfo.xCardIsActive
      })
    },
    updateClickedCard(index){
      if(this.clickedCard == index){this.clickedCard=0}else{this.clickedCard=index}
    },
    selectPlayer(player){
      this.playerSelected = player
    },
    fetchAndCleanSheetData(sheetID){
      if (!sheetID || sheetID == 'demo') {
        sheetID = '1JwMF02DSxNKtjHp6u-wyznSs-iEG_3DpOobgc17I16o'
      }

      var getURL = 'https://sheets.googleapis.com/v4/spreadsheets/' + sheetID + '?includeGridData=true&ranges=a1:aa400&key=' + process.env.VUE_APP_FIREBASE_API_KEY

      axios.get(getURL)
      .then(response => {

        var cleanData = []
        var gRows = response.data.sheets[0].data[0].rowData

        var headers = gRows[0].values

        var playerArray = []

        headers.forEach((item, i) => {
          if (i>=2) {
            playerArray.push(item.formattedValue)
          }
        });


        gRows.forEach((item) => {
          console.log(item.values[0].formattedValue)

          // Handle options
          if (item.values[0].formattedValue == "option"){
            this.customOptions[item.values[1].formattedValue] = item.values[2].formattedValue
            console.log(item.values[2].formattedValue)
          }

          if (item.values[0].formattedValue !== "option"){

            var rowInfo = {
              order: item.values[0].formattedValue,
              publicText: item.values[1].formattedValue
            }

            for (var i = 0; i < playerArray.length; i++) {
              rowInfo[playerArray[i]] = item.values[i+2].formattedValue
            }

            /*
            playerArray.forEach((player, i)=>{
              rowInfo[player] = parseInt(item.values[i+2].formattedValue);
            });
            */

            cleanData.push(rowInfo)
          }
        });

        // apply custom style to body
        let styleTemplate =
          "style-template-" + this.customOptions.styleTemplate;
        let body = document.getElementById("app"); // document.body;
        body.classList.add(styleTemplate);

        this.gSheet = cleanData.slice().reverse();
        this.playerArray = playerArray
        this.dataReady = true;

        if (location.hostname.toString() !== 'localhost'){
          this.$mixpanel.track('Visit Game Session', {
            game_name: this.customOptions.gameTitle ?? 'untitled',
            session_url: location.hostname.toString() + this.$route.fullPath,
            format: 'Secret Cards'
          });
        }

      }).catch(error => {
        this.gSheet = [{text:'Error loading Google Sheet'}]
        console.log(error)
        this.error = error
      })
    }

  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->

<style scoped>

  .secretCards{

    margin:auto;
    padding-top: 1em;
    padding-bottom: 1em;
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
