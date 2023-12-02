<template>
  <div class="game-maker">
    <div class="">
      <div v-if="!$route.params.gameType" class="card shadow mb-4">
        <div class="card-body">
          <!-- Take in game title, byline, and blurb from query params -->
          <div class="row mt-4" v-if="$route.query.gameTitle">
            <div class="col-sm text-center">
              <h1>{{ $route.query.gameTitle }}</h1>
            </div>
          </div>

          <div class="row mb-2" v-if="$route.query.byline">
            <div class="col-sm text-center">
              <em>{{ $route.query.byline }}</em>
            </div>
          </div>

          <div v-if="$route.query.gameBlurb" class="row">
            <div class="col-sm text-center" style="white-space: pre-wrap">
              <p>{{ $route.query.gameBlurb }}</p>
            </div>
          </div>

          <div class="row mt-4" v-if="
            $route.params.gSheetID &&
            !$route.query.gameTitle &&
            !$route.query.byline &&
            !$route.query.gameBlurb
          ">
            <div class="col-sm text-center">
              <h1>Playtest with Story Synth</h1>
              <div class="col-sm">
                This room will use the {{ routeGameType }} template and
                <a v-bind:href="
                  'https://docs.google.com/spreadsheets/d/' +
                  routeGSheetID +
                  '/edit?usp=sharing'
                " target="_blank">this Google Sheet</a>. You can <a href="/">clear these defaults</a>, if you'd like.
              </div>
            </div>
          </div>
          <!-- End query param section -->

          <div>
            <!-- Remove for published version. Comment out the format selection and gSheetID field. Make sure to hard code the gSheetID in the game's .vue file. -->
            <div v-if="!routeGSheetID">
              <div class="row mb-3 mx-auto">
                <h3>Upload your game</h3>
              </div>
              <div class="row mb-4">
                <div class="col-sm">
                  Select your game format
                  <select class="form-select form-select-lg" id="formatSelect" v-model="gameType" title="Select your game format">
                    <option disabled selected value="">Please select one</option>
                    <option value="Shuffled">Shuffled</option>
                    <option value="Timed">Timed</option>
                    <option value="Monster">Monster</option>
                    <option value="Secret Cards">Secret Cards</option>
                    <option value="Slot Machine">Slot Machine</option>
                    <option value="Phases">Phases</option>
                    <option value="Generator">Generator</option>
                    <option value="Hexflower">Hexflower</option>
                    <option value="Hexmap">Hexmap</option>
                  </select>
                  <!-- <BFormSelect v-model="gameType" class="custom-select" title="Select your game format" size="lg">
                    <BFormSelectOption disabled value="">Please select one</BFormSelectOption>
                    <BFormSelectOption>Shuffled</BFormSelectOption>
                    <BFormSelectOption>Timed</BFormSelectOption>
                    <BFormSelectOption>Monster</BFormSelectOption>
                    <BFormSelectOption>Secret Cards</BFormSelectOption>
                    <BFormSelectOption>Slot Machine</BFormSelectOption>
                    <BFormSelectOption>Phases</BFormSelectOption>
                    <BFormSelectOption>Generator</BFormSelectOption>
                    <BFormSelectOption>Hexflower</BFormSelectOption>
                    <BFormSelectOption>Hexmap</BFormSelectOption>
                  </BFormSelect> -->
                </div>
              </div>

              <div class="row mb-4">
                <div class="col-sm">
                  Google Sheet link
                  <svg data-bs-toggle="tooltip" data-bs-placement="top"
                    title="Paste in the entire URL link to your publicly shared Google Sheet that contains the game data"
                    width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-question-circle-fill m-1"
                    fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                    <path fill-rule="evenodd"
                      d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM5.496 6.033a.237.237 0 0 1-.24-.247C5.35 4.091 6.737 3.5 8.005 3.5c1.396 0 2.672.73 2.672 2.24 0 1.08-.635 1.594-1.244 2.057-.737.559-1.01.768-1.01 1.486v.105a.25.25 0 0 1-.25.25h-.81a.25.25 0 0 1-.25-.246l-.004-.217c-.038-.927.495-1.498 1.168-1.987.59-.444.965-.736.965-1.371 0-.825-.628-1.168-1.314-1.168-.803 0-1.253.478-1.342 1.134-.018.137-.128.25-.266.25h-.825zm2.325 6.443c-.584 0-1.009-.394-1.009-.927 0-.552.425-.94 1.01-.94.609 0 1.028.388 1.028.94 0 .533-.42.927-1.029.927z" />
                  </svg>

                  <input v-model="gSheetID" class="form-control form-control-lg" placeholder="Google Sheet Public Link"
                    title="Google Sheet Public Link" />
                </div>
              </div>
            </div>
            <!-- end of format and sheet fields -->

            <!-- For the published version, replace gameType with the specific game type in quotes. Example "Shuffled"  -->
            <div class="row mb-2">
              <div class="col-sm text-center">
                <router-link :to="{ path: '/' + formatToURL(gameType, gSheetID) }">
                  <button :disabled="!gSheetID" type="button" class="btn btn-lg button-light">
                    Upload game
                  </button>
                </router-link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>


<script>
import { ref } from 'vue';
import { Tooltip } from 'bootstrap'

export default {
  name: "app-gameMaker",
  props: {
    routeGameType: String,
    routeGSheetID: String,
    routeRoomID: String,
  },
  data() {
    return {
      gameType: ref(null),
      gSheetID: ref(null),
      currentUrl: location.hostname.toString() + "/#" + this.$route.fullPath,
      roomInfo: {},
    };
  },
  inject: ['mixpanel'],
  mounted() {
    document.dispatchEvent(new Event("x-app-rendered"));
    if (!this.routeGameType) {
      this.gameType = "Shuffled";
    } else {
      if (this.routeGameType == "Shuffled") {
        this.gameType = "Shuffled";
      } else if (this.routeGameType == "Timed") {
        this.gameType = "Timed";
      } else if (this.routeGameType == "Monster") {
        this.gameType = "Monster";
      } else if (this.routeGameType == "SlotMachine") {
        this.gameType = "Slot Machine";
      } else if (this.routeGameType == "Phases") {
        this.gameType = "Phases";
      } else if (this.routeGameType == "Generator") {
        this.gameType = "Generator";
      } else if (this.routeGameType == "Hexflower") {
        this.gameType = "Hexflower";
      } else if (this.routeGameType== "Hexmap") {
        this.gameType = "Hexmap";
      } else {
        this.gameType = "SecretCards";
      }
    }
    if (location.hostname.toString() !== "localhost") {
      this.mixpanel.track("Visit Homepage");
    }
    new Tooltip(document.body, {
      selector: "[data-bs-toggle='tooltip']",
    })
  },
  updated() {
    this.updateUrl();
  },
  methods: {
    formatToURL(gameType, gSheetID) {
      var newPath = "";

      if (gameType == "Timed") {
        newPath += "Timed";
      } else if (gameType == "Shuffled") {
        newPath += "Shuffled";
      } else if (gameType == "Monster") {
        newPath += "Monster";
      } else if (gameType == "Secret Cards") {
        newPath += "SecretCards";
      } else if (gameType == "Phases") {
        newPath += "Phases";
      } else if (gameType == "Generator") {
        newPath += "Generator";
      } else if (gameType == "Hexflower") {
        newPath += "Hexflower";
      } else if (gameType == "Hexmap") {
        newPath += "Hexmap";
      } else {
        newPath += "SlotMachine";
      }

      newPath += "/";

      if (!gSheetID || gSheetID == "demo" || gSheetID === "") {
        newPath += "demo";
      } else if (gSheetID.includes("spreadsheet")) {
        newPath += gSheetID.substring(
          gSheetID.indexOf("/d/") + 3,
          gSheetID.indexOf("/edit")
        );
      } else {
        newPath += gSheetID;
      }

      return newPath;
    },
    updateUrl() {
      this.currentUrl =
        location.hostname.toString() + "/#" + this.$route.fullPath;
    },
  },
};
</script>

<style scoped>
.game-maker {

  width: 100%;
}

li {
  list-style-type: disc;
  display: list-item;
  margin-left: 20px;
}
</style>