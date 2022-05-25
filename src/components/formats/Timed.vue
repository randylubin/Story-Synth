<template>
  <div class="game-room">

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
          v-on:click="stop(); closeMenu();"
          v-dompurify-html="
            customOptions.safetyCardButton
                ? customOptions.safetyCardButton
                : 'Pause'
          "
          ></b-button>
      </div>
    </app-menuBar>
    

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
        :extensionLocation="'upper'"
        class="extension-upper"
      ></app-extensionManager>
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
                  <div class="card-text" v-dompurify-html="row.text">

                  </div>
                </div>
              </div>
            </div>
          </div>
        </transition>
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
        :extensionLocation="'lower'"
        class="extension-lower"
      ></app-extensionManager>
    </div>

    <link v-bind:href="selectedWallet">
  </div>
    <!-- Timer code remixed from https://codepen.io/raphael_octau by raphael_octau -->


</template>

<script>
import { roomsCollection } from '../../firebase';

export default {
  name: 'app-timed',
  components:{
    'app-extensionManager': () => import("../extensions/ExtensionManager.vue"),
    'app-menuBar': () => import("../layout/MenuBar.vue"),
  },
  props: {
    roomID: String,
    gSheetID: String,
    sheetData: Array,
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
      tempExtensionData: { test: null },
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
  watch: {
    sheetData: function(){
      this.processSheetData();
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

    this.$bind("roomInfo", roomsCollection.doc(this.roomID))
      .then(() => {
        this.firebaseReady = true;
        this.$emit('firebase-ready', true);
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
            , extensionData: this.tempExtensionData,
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
    syncExtension() {
      roomsCollection.doc(this.roomID).update({
        extensionData: this.roomInfo.extensionData,
        timeLastUpdated: Date.now(),
      });
    },
    processSheetData() {
      let cleanData = [];

      if (this.sheetData){
        var headers = this.sheetData[0].values

        var playerArray = []

        headers.forEach((item, i) => {
          if (i>=2) {
            playerArray.push(item.formattedValue)
          }
        });

        this.sheetData.forEach((item) => {
          console.log(item.values[0].formattedValue)

          // Handle options
          if (item.values[0].formattedValue == "option"){
            this.customOptions[item.values[1].formattedValue] =
                  this.$markdownFriendlyOptions.includes(item.values[1].formattedValue) ? this.$marked(item.values[2].formattedValue) : item.values[2].formattedValue;
            console.log(item.values[2].formattedValue)
          }

          // Handle extensions
          if (item.values[0].formattedValue == "extension") {
            this.tempExtensionData[item.values[1].formattedValue] =
              item.values[2].formattedValue;

            console.log(
              "extension -",
              item.values[1].formattedValue,
              item.values[2].formattedValue
            );
          }

          // Handle cards
          if (
            item.values[0].formattedValue !== "option" &&
            item.values[0].formattedValue !== "extension"
          ){

            var rowInfo = {
              time: item.values[0].formattedValue,
              text: this.$marked(item.values[1].formattedValue ?? null)
            }

            playerArray.forEach((player, i)=>{
              rowInfo[player] = parseInt(item.values[i+2].formattedValue);
            });

            cleanData.push(rowInfo)
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
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this.roomInfo component only -->

<style scoped>

  .game-room {
    padding-top: 20px;
    margin: auto;
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

</style>
