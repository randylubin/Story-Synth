<template>
  <div class="room-picker">

    <div class="container">
      

      <div v-if="$route.path == '/lobbyMaker'" class="card shadow mb-4" style="margin-top: 76px">
        <div class="card-body">

          <!-- Remove for published version and replace with your own header and about section -->
          <div id="homepage-intro-text" v-if="!$route.params.gSheetID">
            <div class="row mb-4">
              <div class="col-sm text-center">
                <h1>Story Synth</h1>
                <h3>Game Launcher</h3>
              </div>
            </div>

            <div class="row mb-3">
              <div class="col-sm text-left">
                Use this page to create a Lobby for a specific game. You can then share the lobby with players and they can create new sessions of your game.
              </div>
            </div>
          </div>
          <!-- end of header and about section -->


          <div class="row my-4">
            <div class="col-sm text-center">
              <h2>Create a lobby</h2>
            </div>
          </div>

          <form>
            <div class="row mb-4">
              <div class="col-sm">
                Google Sheet Public URL
                <svg v-b-tooltip.hover title="Paste in the entire URL link to your publicly shared Google Sheet that contains the game data."  width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-question-circle-fill m-1" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                  <path fill-rule="evenodd" d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM5.496 6.033a.237.237 0 0 1-.24-.247C5.35 4.091 6.737 3.5 8.005 3.5c1.396 0 2.672.73 2.672 2.24 0 1.08-.635 1.594-1.244 2.057-.737.559-1.01.768-1.01 1.486v.105a.25.25 0 0 1-.25.25h-.81a.25.25 0 0 1-.25-.246l-.004-.217c-.038-.927.495-1.498 1.168-1.987.59-.444.965-.736.965-1.371 0-.825-.628-1.168-1.314-1.168-.803 0-1.253.478-1.342 1.134-.018.137-.128.25-.266.25h-.825zm2.325 6.443c-.584 0-1.009-.394-1.009-.927 0-.552.425-.94 1.01-.94.609 0 1.028.388 1.028.94 0 .533-.42.927-1.029.927z"/>
                </svg>
                
                <input v-model="gSheetID" class="form-control" placeholder="Paste public Google Sheet URL here">
              </div>
            </div>

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
                Game Title (optional)
                
                <input v-model="gameTitle" class="form-control" placeholder="The name of your game">
              </div>
            </div>

            <div class="row mb-4">
              <div class="col-sm">
                Game Byline (optional)
                
                <input v-model="byline" class="form-control" placeholder="The byline or subtitle">
              </div>
            </div>

            <div class="row mb-4">
              <div class="col-sm">
                Game Blurb (optional)
                
                <textarea v-model="gameBlurb" class="form-control" placeholder="A sentence or two about your game." rows="3"></textarea>
              </div>
            </div>
            <!-- end of format and sheet fields -->

            <div class="row mb-4">
              <div class="col-sm text-center">
                <router-link :to="{path: '/' + formatToURL(gameType, gSheetID)}" target="_blank">
                  <button :disabled="!gSheetID || !gameType" type="button" class="btn btn-dark">Create Lobby</button>
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
export default {
  name: 'app-lobbyMaker',
  data () {
    return {
        gameType: null,
        gSheetID: null,
        gameTitle: null,
        byline: null,
        gameBlurb: null,
        currentUrl: location.hostname.toString() + "/#" + this.$route.fullPath,
        roomInfo: {
          
        }
    }
  },
  mounted(){
    
  },
  methods : {
    formatToURL(gameType, gSheetID){
      var newPath = ""

      // Add game format
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

      // extract and add Google Sheed ID
      if(!gSheetID || gSheetID == 'demo' || gSheetID === ""){
        newPath += 'demo'
      } else if (gSheetID.includes("spreadsheet")){
        newPath += gSheetID.substring(gSheetID.indexOf("/d/")+3, gSheetID.indexOf("/edit"))
      } else {
        newPath += gSheetID;
      }

      // add game metadata
      if(this.gameTitle || this.byline || this.gameBlurb){
        newPath += "?"
      }

      if(this.gameTitle){
        newPath += "&gameTitle=" + this.gameTitle
      }

      if(this.byline){
        newPath += "&byline=" + this.byline
      }

      if(this.gameBlurb){
        newPath += "&gameBlurb=" + this.gameBlurb
      }

      return newPath
    },
  }
}
</script>

<style scoped>
  .room-picker {
    max-width:600px;
    margin: auto;
  }
</style>