<template>
  <div class="container game-room">
    <div class="full-page-background"></div>
    <div v-html="customOptions.style"></div>
    <div v-html="customOptions.monetizationStyle" v-if="roomMonetized"></div>
    <div v-if="customOptions.monetizationMessage && !roomMonetized" class="monetizationMessage">
      <b-alert show variant="light" v-html="customOptions.monetizationMessage"></b-alert>
    </div>
    <b-overlay :show="customOptions.monetizationPaywall && !roomMonetized" no-wrap>
      <template #overlay>
        <div class="text-center">
          <div v-html="customOptions.monetizationPaywall"></div>
          <div class="mt-4">
            <p>Checking for a <a href="https://webmonetization.org/">web monetization</a> stream now...</p>
            <b-spinner
                class="m-5"
                style="width: 4rem; height: 4rem;"
                label="Busy"
              ></b-spinner>
          </div>
        </div>
      </template>  
    </b-overlay> 
    
    <div class="menu-bar mb-4 d-flex align-items-center">
      <button class="btn btn-outline-dark mr-auto border-0" v-b-modal.menuModal v-bind:style="{color: customOptions.menuColor}"><b-icon-list></b-icon-list> Menu</button>
      <app-roomLink class="d-none d-sm-block" :monetizedByUser="monetizedByUser" @roomMonetized="updateRoomMonetization" :routeRoomID="$route.params.roomID" :color="customOptions.menuColor" v-if="dataReady && firebaseReady"></app-roomLink>

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
              variant="outline-dark"
              class="control-button-safety-card btn-lg btn-block"
              v-on:click="stop(); closeMenu();"
              v-html="
                customOptions.safetyCardButton
                    ? customOptions.safetyCardButton
                    : 'Pause'
              "
              ></b-button>
          </div>
        </b-container>
        <div class="" v-if="(customOptions.modalOneLabel || customOptions.modalTwoLabel || customOptions.modalThreeLabel || customOptions.modalFourLabel || customOptions.modalFiveLabel)">
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
          <b-button
            v-b-modal.modalThree
            v-on:click="closeMenu();"
            variant="outline-dark"
            class="btn-block btn-lg"
            v-if="customOptions.modalThreeLabel"
            >{{ customOptions.modalThreeLabel }}</b-button
          >
          <b-button
            v-b-modal.modalFour
            v-on:click="closeMenu();"
            variant="outline-dark"
            class="btn-block btn-lg"
            v-if="customOptions.modalFourLabel"
            >{{ customOptions.modalFourLabel }}</b-button
          >
          <b-button
            v-b-modal.modalFive
            v-on:click="closeMenu();"
            variant="outline-dark"
            class="btn-block btn-lg"
            v-if="customOptions.modalFiveLabel"
            >{{ customOptions.modalFiveLabel }}</b-button
          >
        </div>
        <div class="row menu-row mt-4">
          <a href="https://storysynth.org" target="_blank">Powered by Story Synth</a>
        </div>
      </b-modal>
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
    
    <b-alert show class="" variant="info" v-if="customOptions.demoInfo">This demo is powered by <a :href="customOptions.demoInfo" target="_blank">this Google Sheet Template</a>. Copy the sheet and start editing it to design your own game!</b-alert>

    <div class="card shadow" v-if="(!dataReady || !firebaseReady) && !error">
      <div class="card-body text-center">
        <h1 class="m-5">Loading</h1>
        <b-spinner class="m-5" style="width: 4rem; height: 4rem;" label="Busy"></b-spinner>
      </div>
    </div>

    <div v-if="timerSynced">
      <div v-if="!playerSelected" class="row my-4">
        <div class="btn-group col-sm" role="group" aria-label="Role Controls">
          <button type="button" class="btn btn-outline-dark" v-for="player in playerArray" v-bind:key="player" v-on:click="selectPlayer(player)">{{player}}</button>
        </div>
      </div>
      <div class="player-label text-center row my-4" v-if="playerSelected">
        <div class="col-sm">
          Role: {{playerSelected}}
        <button class="btn btn-sm btn-outline-dark" v-on:click="selectPlayer(null)">Reselect role</button>
        </div>
      </div>

    <div class="timer-box mb-4 pt-4">
      <span class="time">{{ time }}</span>
      <div class="btn-container px-1">



          <div v-if="playerSelected" class="row mb-4">
            <div class="btn-group col-sm-6 offset-sm-3" role="group" aria-label="Timer Controls">
              <button type="button" class="btn btn-outline-dark" :disabled="roomInfo.running" v-on:click="start()">Start</button>
              <button type="button" class="btn btn-outline-dark" :disabled="!roomInfo.running" v-on:click="stop()">Pause</button>
              <button type="button" class="btn btn-outline-danger" :disabled="!roomInfo.timeBegan" v-on:click="reset()">Reset</button>
            </div>
          </div>


        </div>
      </div>
    </div>

    <div v-for="(row, index) in gSheet" v-bind:key="index">
      <div v-if="roomInfo && roomInfo.timeBegan">
        <transition name="fade">
          <div class="row mb-4" v-if="row.time <= secondsElapsed && row[playerSelected]">
            <div class="col-sm">
              <div class="card shadow">
                <div class="card-body">
                  <div class="card-text" style="white-space: pre-line" v-html="row.text">

                  </div>
                </div>
              </div>
            </div>
          </div>
        </transition>
      </div>
    </div>

    <b-modal id="modalOne" v-bind:title="customOptions.modalOneLabel" hide-footer>
      <div class="d-block text-left" v-html="customOptions.modalOneText">
        
      </div>
    </b-modal>

    <b-modal id="modalTwo" v-bind:title="customOptions.modalTwoLabel" hide-footer>
      <div class="d-block text-left" v-html="customOptions.modalTwoText">
      </div>
    </b-modal>

    <b-modal
      id="modalThree"
      v-bind:title="customOptions.modalThreeLabel"
      hide-footer
    >
      <div
        class="d-block text-left"
        v-html="customOptions.modalThreeText"
      ></div>
    </b-modal>

    <b-modal
      id="modalFour"
      v-bind:title="customOptions.modalFourLabel"
      hide-footer
    >
      <div
        class="d-block text-left"
        v-html="customOptions.modalFourText"
      ></div>
    </b-modal>

    <b-modal
      id="modalFive"
      v-bind:title="customOptions.modalFiveLabel"
      hide-footer
    >
      <div
        class="d-block text-left"
        v-html="customOptions.modalFiveText"
      ></div>
    </b-modal>


    <link v-bind:href="selectedWallet">
  </div>
    <!-- Timer code remixed from https://codepen.io/raphael_octau by raphael_octau -->


</template>

<script>
import { roomsCollection } from '../../firebase';
import axios from 'axios'
import RoomLink from '../layout/RoomLink.vue';

export default {
  name: 'app-timed',
  components:{
    'app-roomLink': RoomLink,
  },
  props: {
    roomID: String,
    gSheetID: String
  },
  data: function(){
    return {
      time: '00:00:00',
      started: null,
      timerSynced: false,
      timeElapsed: new Date(0),
      secondsElapsed: 0,
      roomInfo: {
        timeBegan: null
        , timeStopped: null
        , stoppedDuration: 0
        , running: false
      },
      playerSelected: null,
      playerArray: [],
      gSheet: [],
      customOptions: {
        gameTitle: undefined,
        byline: undefined,
        gameBlurb: undefined,
        password: undefined,
        wallet: undefined,
        revShare: 0.2,
      },
      dataReady: false,
      firebaseReady: false,
      selectedWallet: undefined,
      roomMonetized: null,
      monetizedByUser: false,
      error: false,
    }
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
          content: this.selectedWallet,
          vmid: "monetization",
        },
      ],
    };
  },
  mounted(){
    if (document.monetization?.state == "started") {
      this.monetizationStarted()
    }
    document.monetization?.addEventListener('monetizationstart', () => {
      this.monetizationStarted()
    })

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
              timeBegan: null
            , timeStopped: null
            , stoppedDuration: 0
            , running: false
            });

          if (this.dataReady) {
            this.shuffleAndResetGame();
          }
        } else if (this.dataReady){
          this.firebaseCacheError = false;
        }
    })
    .catch((error) => {
      console.log("error in loading: ", error);
    });

    this.sync();
  },
  firestore() {
    return {
      roomInfo: roomsCollection.doc(this.roomID)//.set(this.roomInfo, {merge:true})
    }
  },
  methods: {
    monetizationStarted() {
      console.log('monetizing')
      this.monetizedByUser = true;
    },
    updateRoomMonetization(monetizationValue){
      this.roomMonetized = monetizationValue;
      console.log("room is now monetizied")
    },
    start() {
      if(this.roomInfo.running) return;

      if (this.roomInfo.timeBegan === null) {
        this.reset();
        roomsCollection.doc(this.roomID).update({
          timeBegan: new Date()
        })
      }

      if (this.roomInfo.timeStopped !== null) {
        roomsCollection.doc(this.roomID).update({
          stoppedDuration: this.roomInfo.stoppedDuration + (new Date() - this.roomInfo.timeStopped.toDate())
        })
      }

      this.started = setInterval(this.clockRunning, 100);
      roomsCollection.doc(this.roomID).update({
        running: true
      })

    },
    stop() {
      if (this.roomInfo.timeBegan !== null){
        roomsCollection.doc(this.roomID).update({
          running: false
        })
        roomsCollection.doc(this.roomID).update({
          timeStopped: new Date()
        })
      }
    },
    reset() {
      roomsCollection.doc(this.roomID).update({
        running: false
      })
      roomsCollection.doc(this.roomID).update({
        stoppedDuration: 0,
        timeBegan: null,
        timeStopped: null
      })
      this.time = "00:00:00";
      this.timeElapsed = new Date (0);
      this.secondsElapsed = 0;
    },
    sync(){
      this.started = setInterval(this.clockRunning, 100);
      this.timerSynced = true;
    },
    clockRunning(){
      if (!this.roomInfo){
        return
      }
      else if (this.roomInfo.timeBegan == null){
        this.time = "00:00:00";
      }
      if (this.roomInfo.timeBegan !== null && this.roomInfo.running == true){
        var currentTime = new Date()
        this.timeElapsed = new Date(currentTime - this.roomInfo.timeBegan.toDate() - this.roomInfo.stoppedDuration)
        var hour = this.timeElapsed.getUTCHours(),
        min = this.timeElapsed.getUTCMinutes(),
        sec = this.timeElapsed.getUTCSeconds()

        this.secondsElapsed = sec + (min * 60) + (hour *60 * 60)

        this.time =
          this.zeroPrefix(hour, 2) + ":" +
          this.zeroPrefix(min, 2) + ":" +
          this.zeroPrefix(sec, 2)
      }
    },
    closeMenu(){
      this.$bvModal.hide("menuModal");
    },
    zeroPrefix(num, digit) {
      var zero = '';
      for(var i = 0; i < digit; i++) {
        zero += '0';
      }
      return (zero + num).slice(-digit);
    },
    selectPlayer(player){
      this.playerSelected = player
    },
    fetchAndCleanSheetData(sheetID){
      if (!sheetID || sheetID == 'demo') {
        sheetID = '1yq2AKwaYL1uZrCnEfwgSpC0SPkQAZqnCdjNxH_pm018'
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

          if (item.values[0].formattedValue == "option"){
            this.customOptions[item.values[1].formattedValue] = item.values[2].formattedValue
            console.log(item.values[2].formattedValue)
          }

          if (item.values[0].formattedValue !== "option"){

            var rowInfo = {
              time: item.values[0].formattedValue,
              text: item.values[1].formattedValue
            }

            playerArray.forEach((player, i)=>{
              rowInfo[player] = parseInt(item.values[i+2].formattedValue);
            });

            cleanData.push(rowInfo)
          }
        });

        // monetization
        if (this.customOptions.wallet) {
          this.customOptions.wallet = this.customOptions.wallet.split(',')
          if (Math.random() <= this.customOptions.revShare) {
            this.selectedWallet = "$ilp.uphold.com/WMbkRBiZFgbx";
          } else {
            this.selectedWallet = this.customOptions.wallet[0];
          }
        } else {
          this.selectedWallet = "$ilp.uphold.com/WMbkRBiZFgbx";
        }

        // apply custom style to body
        let styleTemplate =
          "style-template-" + this.customOptions.styleTemplate;
        let body = document.getElementById("app"); // document.body;
        body.classList.add(styleTemplate);

        this.gSheet = cleanData.slice().reverse();
        this.playerArray = playerArray
        this.dataReady = true

        if (location.hostname.toString() !== 'localhost'){
          this.$mixpanel.track('Visit Game Session', {
            game_name: this.customOptions.gameTitle ?? 'untitled',
            session_url: location.hostname.toString() + this.$route.fullPath,
            format: 'Timed'
          });
        }

      }).catch(error => {
        this.gSheet = [{text:'Error loading Google Sheet'}]
        this.error = error;
        console.log(error)
      })
    }

  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this.roomInfo component only -->

<style scoped>

  .game-room {
    padding-top: 20px;
  }
  .time {
    font-size: 4em;
  }

  .message{
    font-size: 1.5em;
    margin-top: 1em;
  }

  .timer-box{
    background-color: white;
    margin-top: 1em;
    padding-bottom: 1em;
  }

  .player-button {
    margin-left: .3em;
    margin-right: .3em;
  }

  .fade-enter-active, .fade-leave-active {
    transition: opacity .5s;
  }
  .fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
    opacity: 0;
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
