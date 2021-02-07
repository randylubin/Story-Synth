<template>
  <div class="game-maker">

    <div class="container">
      

      <div v-if="!$route.params.gameType" class="card shadow mb-4" style="margin-top: 76px">
        <div class="card-body">

          <!-- Remove for published version and replace with your own header and about section -->
          <div id="homepage-intro-text" v-if="!$route.params.gSheetID">
            <div class="row mb-4">
              <div class="col-sm text-center">
                <h1>Story Synth</h1>
                <h3>Make, play, and share storytelling games</h3>
              </div>
            </div>

            <div class="row mb-3">
              <div class="col-sm text-left">
                <p>This app allows game designers to make, play, and share simple storytelling games by putting their game content in a Google Spreadsheet. For information on how to use and remix this app, see the <a href="https://docs.storysynth.org/guide">About Page</a> or the <a href="https://docs.storysynth.org/guide/formats.html">Formats Page</a>.</p>
                
                <p>To see Story Synth in actions, watch this <a href="https://youtu.be/TLQk3zyVyVI">Video Tour</a> or try any of the following format demos:</p>
                
                <div class="row mb-3">
                  <div class="col-sm-6 text-left">
                    <ul style="margin-block-end: 0em;">
                      <li><a href="/#/Shuffled/1N5eeyKTVWo5QeGcUV_zYtwtR0DikJCcvcj6w69UkC1w">Shuffled (one deck)</a></li>
                      <li><a href="/#/Shuffled/1N2N8URSswhmxLalPOkzi5d4kdeFiGrsobEmM_ojk0ow">Shuffled (multi-deck)</a></li>
                      <li><a href="/#/Timed/1yq2AKwaYL1uZrCnEfwgSpC0SPkQAZqnCdjNxH_pm018">Timed</a></li>
                      <li><a href="/#/Monster/1NgNHy7Qe1R8KhGR2cOmJwL2aOl2tocBemW2HIAKjrvI">Monster</a></li>
                    </ul>  
                  </div>
                  <div class="col-sm-6 text-left">
                    <ul>
                      <li><a href="/#/SlotMachine/1t5LRUQG9DzMJ3kd8E9DZV7_EbE8J5-Gqhz7TWQ4Y-uU">Slot Machine</a></li>
                      <li><a href="/#/Phases/1HataDfV2lrA4hfzmLgDjXH09dEMLQV6OT10tVH9G52A">Phases</a></li>
                      <li><a href="/#/SecretCards/1JwMF02DSxNKtjHp6u-wyznSs-iEG_3DpOobgc17I16o">Secret Player Prompts</a></li>
                    </ul>  
                  </div>
                </div>
                
                <p>For an example of a polished game built with Story Synth, check out <a href="https://storysynth.org/Games/Around-The-Realm">Around the Realm</a>.</p>
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
              <h2>Create a Game</h2>
            </div>
          </div>

          <form>

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
                  Google Sheet Public Link
                  <svg v-b-tooltip.hover title="Paste in the entire URL link to your publicly shared Google Sheet that contains the game data" width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-question-circle-fill m-1" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                    <path fill-rule="evenodd" d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM5.496 6.033a.237.237 0 0 1-.24-.247C5.35 4.091 6.737 3.5 8.005 3.5c1.396 0 2.672.73 2.672 2.24 0 1.08-.635 1.594-1.244 2.057-.737.559-1.01.768-1.01 1.486v.105a.25.25 0 0 1-.25.25h-.81a.25.25 0 0 1-.25-.246l-.004-.217c-.038-.927.495-1.498 1.168-1.987.59-.444.965-.736.965-1.371 0-.825-.628-1.168-1.314-1.168-.803 0-1.253.478-1.342 1.134-.018.137-.128.25-.266.25h-.825zm2.325 6.443c-.584 0-1.009-.394-1.009-.927 0-.552.425-.94 1.01-.94.609 0 1.028.388 1.028.94 0 .533-.42.927-1.029.927z"/>
                  </svg>
                  
                  <input v-model="gSheetID" class="form-control" placeholder="Google Sheet Public Link">
                </div>
              </div>
            </div>
            <!-- end of format and sheet fields -->

            <!-- For the published version, replace gameType with the specific game type in quotes. Example "Shuffled"  -->
            <div class="row mb-4">
              <div class="col-sm text-center">
                <router-link :to="{path: '/' + formatToURL(gameType, gSheetID)}">
                  <button :disabled="!gSheetID" type="button" class="btn btn-dark">Create Game</button>
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
  name: 'app-gameMaker',
  props: {
    routeGameType: String,
    routeGSheetID: String,
    routeRoomID: String,
  },
  data () {
    return {
        gameType: null,
        gSheetID: null,
        currentUrl: location.hostname.toString() + "/#" + this.$route.fullPath,
        roomInfo: {
          
        }
    }
  },
  mounted(){
    document.dispatchEvent(new Event('x-app-rendered'))
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
    formatToURL(gameType, gSheetID){
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

      return newPath
    },
    updateUrl(){
      this.currentUrl = location.hostname.toString() + "/#" + this.$route.fullPath;
    },

  }
}
</script>

<style scoped>
  .game-maker {
    max-width:600px;
    margin: auto;
  }

  li {
    list-style-type: disc;
    display: list-item;
    margin-left: 20px;
  }
</style>