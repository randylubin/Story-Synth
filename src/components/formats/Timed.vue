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
    <!-- Timer code remixed from https://codepen.io/raphael_octau by raphael_octau -->
  </div>
</template>

<script>
export default {
  name: 'app-timed',
  components:{
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
  data: function(){
    return {
      time: '00:00:00',
      started: null,
      timerSynced: false,
      timeElapsed: new Date(0),
      secondsElapsed: 0,
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
      selectedWallet: undefined,
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
    if (this.sheetData){
      this.processSheetData();
    }

    if (this.firebaseReady && !this.roomInfo){
      this.initialFirebaseSetup()
    }

    this.sync();
  },
  // firestore() {
  //   return {
  //     roomInfo: roomsCollection.doc(this.roomID)//.set(this.roomInfo, {merge:true})
  //   }
  // },
  methods: {
    initialFirebaseSetup() {
      this.$emit('firebase-set',
        {
          timeBegan: null
          , timeStopped: null
          , stoppedDuration: 0
          , running: false
          , extensionData: this.tempExtensionData,
        }
      )
    },
    closeMenu() {
      this.$bvModal.hide("menuModal");
    },
    start() {
      if(this.roomInfo.running) return;

      if (this.roomInfo.timeBegan === null) {
        this.reset();
        this.$emit('firebase-update',{
          timeBegan: new Date()
        })
      }

      if (this.roomInfo.timeStopped !== null) {
        this.$emit('firebase-update',{
          stoppedDuration: this.roomInfo.stoppedDuration + (new Date() - this.roomInfo.timeStopped.toDate())
        })
      }

      this.started = setInterval(this.clockRunning, 100);
      this.$emit('firebase-update',{
        running: true
      })

    },
    stop() {
      if (this.roomInfo.timeBegan !== null){
        this.$emit('firebase-update',{
          running: false
        })
        this.$emit('firebase-update',{
          timeStopped: new Date()
        })
      }
    },
    reset() {
      this.$emit('firebase-update',{
        running: false
      })
      this.$emit('firebase-update',{
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
    processSheetData() {
      let cleanData = [];

      if (this.sheetData){
        var headers = this.sheetData[0]

        var playerArray = []

        headers.forEach((item, i) => {
          if (i>=2) {
            playerArray.push(item)
          }
        });

        this.sheetData.forEach((item) => {
          console.log(item[0])

          // Handle options
          if (item[0] == "option"){
            this.customOptions[item[1]] =
              this.$markdownFriendlyOptions.includes(item[1]) && item[2] ? this.$marked(item[2]) : item[2];
            console.log(item[2])
          }

          // Handle cards
          if (
            item[0] !== "option" &&
            item[0] !== "extension"
          ){

            var rowInfo = {
              time: item[0],
              text: this.$marked(item[1] ?? "")
            }

            playerArray.forEach((player, i)=>{
              rowInfo[player] = parseInt(item[i+2]);
            });

            cleanData.push(rowInfo)
          }
        });

        this.gSheet = cleanData.slice().reverse();
        this.playerArray = playerArray
        this.dataReady = true
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
