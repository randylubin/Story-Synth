<template>
  <div class="room-picker">

    <div class="container">
      

      <div v-if="!$route.params.roomID" class="card shadow mb-4" style="margin-top: 76px">
        <div class="card-body">

          <!-- Remove for published version and replace with your own header and about section -->
          <div id="homepage-intro-text" v-if="!$route.params.gSheetID">
            <div class="row mb-4">
              <div class="col-sm text-center">
                <h1>Story Synth</h1>
                <h3>Playtest with your friends online!</h3>
              </div>
            </div>

            <div class="row mb-3">
              <div class="col-sm text-left">
                <p>This app allows game designers to playtest simple storytelling games by putting their game content in a Google Spreadsheet. For information on how to use and remix this app, see the <a href="/about">About Page</a> or the <a href="/about/formats.html">Formats Page</a>.</p>
                
                <p>To see Story Synth work with placeholder content, try any of the formats below with "demo" in the sheet field or watch this <a href="https://youtu.be/TLQk3zyVyVI">Video Tour</a>.</p>
                
                <p>For an example of a published app built on Story Synth, check out <a href="https://monster.diegeticgames.com">Dawn of the Monster Invasion</a>.</p>
              </div>
            </div>
          </div>
          <!-- end of header and about section -->

          <!-- Take in game title, byline, and blurb from query params -->
          <div class="row mt-4" v-if="$route.query.gameTitle">
            <div class="col-sm text-center">
              <h1>{{$route.query.gameTitle}}</h1>
            </div>
          </div>


          <div class="row mb-2" v-if="$route.query.byline">
            <div class="col-sm text-center">
              <em>{{$route.query.byline}}</em>
            </div>
          </div>

          <div v-if="$route.query.gameBlurb" class="row">
            <div class="col-sm text-center" style="white-space: pre-wrap;">
              <p>{{$route.query.gameBlurb}}</p>
            </div>
          </div>

          <div class="row mt-4" v-if="$route.params.gSheetID && (!$route.query.gameTitle && !$route.query.byline && !$route.query.gameBlurb)">
            <div class="col-sm text-center">
              <h1>Playtest with Story Synth</h1>
              <div class="col-sm">This room will use the {{routeGameType}} template and <a v-bind:href="'https://docs.google.com/spreadsheets/d/'+routeGSheetID+'/edit?usp=sharing'" target="_blank">this Google Sheet</a>. You can <a href="/">clear these defaults</a>, if you'd like.</div>
            </div>
          </div>
          <!-- End query param section -->

          <div class="row my-4">
            <div class="col-sm text-center">
              <h2>Create a room</h2>
            </div>
          </div>

          <form>

            <div class="row">
              <div class="col-sm form-group">
                <label for="roomInput">Room Code</label>

                <svg v-b-tooltip.hover title="The shareable room code – use this random one or write in a custom one" width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-question-circle-fill m-1" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                  <path fill-rule="evenodd" d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM5.496 6.033a.237.237 0 0 1-.24-.247C5.35 4.091 6.737 3.5 8.005 3.5c1.396 0 2.672.73 2.672 2.24 0 1.08-.635 1.594-1.244 2.057-.737.559-1.01.768-1.01 1.486v.105a.25.25 0 0 1-.25.25h-.81a.25.25 0 0 1-.25-.246l-.004-.217c-.038-.927.495-1.498 1.168-1.987.59-.444.965-.736.965-1.371 0-.825-.628-1.168-1.314-1.168-.803 0-1.253.478-1.342 1.134-.018.137-.128.25-.266.25h-.825zm2.325 6.443c-.584 0-1.009-.394-1.009-.927 0-.552.425-.94 1.01-.94.609 0 1.028.388 1.028.94 0 .533-.42.927-1.029.927z"/>
                </svg>

                <div class="input-group">
                  <input v-model="roomID" class="form-control" placeholder="Room Code">
                  <div class="input-group-append">
                    <button class="btn btn-sm btn-outline-dark" v-on:click="assignRandomRoomName()">
                      <svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-arrow-clockwise" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                        <path fill-rule="evenodd" d="M8 3a5 5 0 1 0 4.546 2.914.5.5 0 0 1 .908-.417A6 6 0 1 1 8 2v1z"/>
                        <path d="M8 4.466V.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384L8.41 4.658A.25.25 0 0 1 8 4.466z"/>
                      </svg>
                    </button>
                  </div>
                </div>

              </div>
            </div>

            <!-- Remove for published version. Comment out the format selection and gSheetID field. Make sure to hard code the gSheetID in the game's .vue file. -->
            <div v-if="!routeGSheetID">
              <div class="row mb-4">
                <div class="col-sm">
                  Game Format
                  <select v-model="gameType" class="custom-select">
                    <option disabled value="">Please select one</option>
                    <option>Shuffled</option>
                    <option>Timed</option>
                    <option>Monster</option>
                    <option>Secret Cards</option>
                    <option>Slot Machine</option>
                    <option>Phases</option>
                  </select>
                </div>
              </div>

              <div class="row mb-4">
                <div class="col-sm">
                  Sheet (optional) 
                  <svg v-b-tooltip.hover title="Paste in the entire URL link to your publicly shared Google Sheet that contains the game data."  width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-question-circle-fill m-1" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                    <path fill-rule="evenodd" d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM5.496 6.033a.237.237 0 0 1-.24-.247C5.35 4.091 6.737 3.5 8.005 3.5c1.396 0 2.672.73 2.672 2.24 0 1.08-.635 1.594-1.244 2.057-.737.559-1.01.768-1.01 1.486v.105a.25.25 0 0 1-.25.25h-.81a.25.25 0 0 1-.25-.246l-.004-.217c-.038-.927.495-1.498 1.168-1.987.59-.444.965-.736.965-1.371 0-.825-.628-1.168-1.314-1.168-.803 0-1.253.478-1.342 1.134-.018.137-.128.25-.266.25h-.825zm2.325 6.443c-.584 0-1.009-.394-1.009-.927 0-.552.425-.94 1.01-.94.609 0 1.028.388 1.028.94 0 .533-.42.927-1.029.927z"/>
                  </svg>
                  
                  <input v-model="gSheetID" class="form-control" placeholder="Google Sheet ID (optional)">
                </div>
              </div>
            </div>
            <!-- end of format and sheet fields -->

            <!-- For the published version, replace gameType with the specific game type in quotes. Example "Shuffled"  -->
            <div class="row mb-4">
              <div class="col-sm text-center">
                <router-link :to="{path: '/' + formatToURL(gameType, gSheetID, roomID)}">
                  <button :disabled="!roomID" type="button" class="btn btn-dark">Enter Room</button>
                </router-link>
              </div>
            </div>

          </form>
        </div>
      </div>
    </div>
  </div>
</template>


<script>
import createRandomRoomName from "../createRandomRoomName";

export default {
  name: 'app-roomPicker',
  props: {
    routeGameType: String,
    routeGSheetID: String,
    routeRoomID: String,
  },
  data () {
    return {
        roomID: null,
        gameType: null,
        gSheetID: null,
        currentUrl: location.hostname.toString() + "/#" + this.$route.fullPath,
        roomInfo: {
          
        }
    }
  },
  mounted(){
    if (!this.roomID) {
      this.assignRandomRoomName();
    }

    if(!this.routeGSheetID || this.routeGSheetID === ""){
      this.gSheetID = 'demo'
    } else {
      this.gSheetID = this.routeGSheetID
    }

    if(!this.routeGameType){
      this.gameType = "Shuffled"
    } else {
      if (this.routeGameType == "Shuffled"){
        this.gameType = "Shuffled"
      } else if (this.routeGameType == "Timed") {
        this.gameType = "Timed"
      } else if (this.routeGameType == "Monster") {
        this.gameType = "Monster"
      } else if (this.routeGameType == "SlotMachine"){
        this.gameType = "Slot Machine"
      } else if (this.routeGameType == "Phases"){
        this.gameType = "Phases"
      } else {
        this.gameType = "SecretCards"
      }
    }
  },
  updated(){
    this.updateUrl();
  },
  methods : {
    formatToURL(gameType, gSheetID, roomID){
      var newPath = ""

      if (gameType == "Timed"){
        newPath += "Timed"
      } else if (gameType=="Shuffled") {
        newPath += "Shuffled"
      } else if (gameType == "Monster") {
        newPath += "Monster"
      } else if (gameType == "Secret Cards"){
        newPath += "SecretCards"
      } else if (gameType == "Phases") {
        newPath += "Phases"
      } else {
        newPath += "SlotMachine"
      }

      newPath += "/"

      if(!gSheetID || gSheetID == 'demo' || gSheetID === ""){
        newPath += 'demo'
      } else if (gSheetID.includes("spreadsheet")){
        newPath += gSheetID.substring(gSheetID.indexOf("/d/")+3, gSheetID.indexOf("/edit"))
      } else {
        newPath += gSheetID;
      }

      newPath += "/" + roomID

      return newPath
    },
    updateUrl(){
      this.currentUrl = location.hostname.toString() + "/#" + this.$route.fullPath;
    },
    assignRandomRoomName(){
      this.roomID = createRandomRoomName();
    }

  }
}
</script>

<style scoped>
  .room-picker {
    max-width:600px;
    margin: auto;
  }
</style>