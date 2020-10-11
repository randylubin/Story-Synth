<template>
  <div class="container">
    <div class="timed mb-4">
      <span class="time">{{ time }}</span>

      <div class="btn-container px-1">
        <div v-if="timerSynced">
          <div v-if="playerSelected" class="row mb-4">
            <div class="btn-group col-sm" role="group" aria-label="Timer Controls">
              <button type="button" class="btn btn-primary" :disabled="roomInfo.running" v-on:click="start()">Start</button>
              <button type="button" class="btn btn-primary" :disabled="!roomInfo.running" v-on:click="stop()">Pause</button>  
              <button type="button" class="btn btn-primary" :disabled="!roomInfo.timeBegan" v-on:click="reset()">Reset</button>
            </div>
          </div>

          <div v-if="!playerSelected" class="row mb-4">
            <div class="btn-group col-sm" role="group" aria-label="Timer Controls">
              <button type="button" class="btn btn-primary" v-for="player in playerArray" v-bind:key="player" v-on:click="selectPlayer(player)">{{player}}</button>              
            </div>
          </div>

          <div class="player-label row mb-4" v-if="playerSelected">
            <div class="col-sm">
              Role: {{playerSelected}}
            <button class="btn btn-sm btn-secondary" v-on:click="selectPlayer(null)">Reselect role</button>
            </div>  
          </div>

        </div>
      </div>
    </div>

    <div v-for="(row, index) in gSheet" v-bind:key="index">
      <div v-if="roomInfo.timeBegan">
        <transition name="fade">
          <div class="row mb-4" v-if="row.time <= secondsElapsed && row[playerSelected]">
            <div class="col-sm">
              <div class="card">
                <div class="card-body">
                  <div class="card-text">
                    {{row.text}}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </transition>
      </div>
    </div>


  </div>
    <!--
    <div class="text">
      <a href="https://codepen.io/raphael_octau" target="_blank">@raphael_octau</a>
    </div>
    -->


</template>

<script>
import { roomsCollection } from '../firebase';
import axios from 'axios'

export default {
  name: 'app-timed',
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
      gSheet: []
    }
  },
  mounted(){
    roomsCollection.doc(this.roomID).set(this.roomInfo);
    this.fetchAndCleanSheetData(this.gSheetID);
    this.sync();
  },
  firestore() {
    return {
      roomInfo: roomsCollection.doc(this.roomID)//.set(this.roomInfo, {merge:true})
    }
  },
  methods: {
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

      var getURL = 'https://sheets.googleapis.com/v4/spreadsheets/' + sheetID + '?includeGridData=true&ranges=a1:aa100&key=AIzaSyDsIM5nJ3hNoVRCSd3kJXfrAL8_n9gwFdM'
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

          var rowInfo = {
            time: item.values[0].formattedValue,
            text: item.values[1].formattedValue
          }

          playerArray.forEach((player, i)=>{
            rowInfo[player] = parseInt(item.values[i+2].formattedValue);
          });

          cleanData.push(rowInfo)
        });

        this.gSheet = cleanData.slice().reverse();
        this.playerArray = playerArray

      }).catch(error => {
        this.gSheet = [{text:'Error loading Google Sheet'}]
        console.log(error)
      })      
    }

  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this.roomInfo component only -->

<style scoped>
  .time {
    font-size: 4em;
  }

  .message{
    font-size: 1.5em;
    margin-top: 1em;
  }

  .timed{
    background-color: #f1f1f1;
    margin-top: 1em;
    padding-bottom: 1em;
  }

  .player-button {
    margin-left: .3em;
    margin-right: .3em;
  }

  body {
    background: #74ebd5;  /* fallback for old browsers */
    background: -webkit-linear-gradient(to top, #ACB6E5, #74ebd5);  /* Chrome 10-25, Safari 5.1-6 */
    background: linear-gradient(to top, #ACB6E5, #74ebd5); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
    max-width: 600px;
    margin:auto;
  }

  .fade-enter-active, .fade-leave-active {
    transition: opacity .5s;
  }
  .fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
    opacity: 0;
  }
</style>