<template>
  <div class="game-launcher">
    <div class="full-page-background"></div>
    <div v-dompurify-html="customOptions.style"></div>
    <div class="container" style="margin-top: 76px">
      <b-alert show class="" variant="info" v-if="customOptions.demoInfo">This demo is powered by a <a :href="customOptions.demoInfo" target="_blank">Google Sheet</a>, click to view the spreadsheet behind this game. Make a copy and start editing to design your own game!</b-alert>

      <div class="card shadow mb-4">
        <div class="card-body text-center" v-if="!dataReady && !error">
          <h1 class="m-5">Loading game...</h1>
          <b-spinner
            class="m-5"
            style="width: 4rem; height: 4rem"
            label="Busy"
          ></b-spinner>
        </div>

        <div class="card-body text-center" v-if="error">
          <h1 class="m-3">Error loading game</h1>
          <p>{{ error }}</p>
          <p>
            Please make sure that the link is correct and that it is publicly
            viewable.
          </p>

          <router-link :to="{ path: '/' }">
            <button type="button" class="my-3 btn btn-dark">Back</button>
          </router-link>
        </div>

        <div v-if="dataReady && !error" class="card-body">
          <!-- Remove for published version and replace with your own header and about section -->
          <div id="homepage-intro-text" v-if="!routeGSheetID">
            <div class="row mb-4">
              <div class="col-sm text-center">
                <h1>Story Synth</h1>
                <h3>Game Launcher</h3>
              </div>
            </div>
          </div>

          <div class="">
            <div
              class="row mt-4"
              v-if="customOptions.gameTitle && !customOptions.coverImage"
            >
              <div class="col-sm text-center">
                <h1>{{ customOptions.gameTitle }}</h1>
              </div>
            </div>

            <div
              class="row mb-2"
              v-if="customOptions.byline && !customOptions.coverImage"
            >
              <div class="col-sm text-center">
                <em>{{ customOptions.byline }}</em>
              </div>
            </div>

            <div
              class="pb-5"
              style="margin: -1.25rem"
              v-if="customOptions.coverImage"
            >
              <img
                style="max-width: 100%; max-height: auto"
                v-bind:src="customOptions.coverImage"
                v-bind:alt="customOptions.gameTitle + ' cover'"
              />
            </div>

            <div v-if="customOptions.gameBlurb" class="row">
              <div
                class="col-sm text-center game-burb"
                style="white-space: pre-wrap"
              >
                <p v-dompurify-html="customOptions.gameBlurb"></p>
              </div>
            </div>
          </div>

          <div
            class="row mt-4"
            v-if="
              routeGSheetID &&
              !customOptions.gameTitle &&
              !customOptions.byline &&
              !customOptions.gameBlurb &&
              !customOptions.gameCover
            "
          >
            <div class="col-sm text-center">
              <h1>Playtest with Story Synth</h1>
              <div class="col-sm">
                This session will use the {{ routeGameType }} template and
                <a
                  v-bind:href="
                    'https://docs.google.com/spreadsheets/d/' +
                    routeGSheetID +
                    '/edit?usp=sharing'
                  "
                  target="_blank"
                  >this Google Sheet</a
                >
                for game content. You can <a href="/">clear these defaults</a>,
                if you'd like.
              </div>
            </div>
          </div>
          <!-- End query param section -->

          <!-- end of header and about section -->

          <div class="row my-4">
            <div class="col-sm text-center">
              <h2>Create a Session</h2>
            </div>
          </div>

          <div class="row">
            <div class="col-sm form-group">
              <label for="roomInput">Session Name</label>

              <svg
                v-b-tooltip.hover
                title="The shareable session code – use this random one or write in a custom one"
                width="1em"
                height="1em"
                viewBox="0 0 16 16"
                class="bi bi-question-circle-fill m-1"
                fill="currentColor"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fill-rule="evenodd"
                  d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM5.496 6.033a.237.237 0 0 1-.24-.247C5.35 4.091 6.737 3.5 8.005 3.5c1.396 0 2.672.73 2.672 2.24 0 1.08-.635 1.594-1.244 2.057-.737.559-1.01.768-1.01 1.486v.105a.25.25 0 0 1-.25.25h-.81a.25.25 0 0 1-.25-.246l-.004-.217c-.038-.927.495-1.498 1.168-1.987.59-.444.965-.736.965-1.371 0-.825-.628-1.168-1.314-1.168-.803 0-1.253.478-1.342 1.134-.018.137-.128.25-.266.25h-.825zm2.325 6.443c-.584 0-1.009-.394-1.009-.927 0-.552.425-.94 1.01-.94.609 0 1.028.388 1.028.94 0 .533-.42.927-1.029.927z"
                />
              </svg>

              <div class="input-group">
                <input
                  v-model="roomID"
                  class="form-control"
                  placeholder="Room Code"
                  title="Room Code"
                  id="roomInput"
                />
                <div class="input-group-append">
                  <button
                    class="btn btn-sm btn-outline-dark"
                    title="Assign random room name"
                    v-on:click="assignRandomRoomName()"
                  >
                    <svg
                      width="1em"
                      height="1em"
                      viewBox="0 0 16 16"
                      class="bi bi-arrow-clockwise"
                      fill="currentColor"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M8 3a5 5 0 1 0 4.546 2.914.5.5 0 0 1 .908-.417A6 6 0 1 1 8 2v1z"
                      />
                      <path
                        d="M8 4.466V.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384L8.41 4.658A.25.25 0 0 1 8 4.466z"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div class="row" v-if="customOptions.password">
            <div class="col-sm form-group">
              <label for="passwordInput">Password</label>

              <svg
                v-b-tooltip.hover
                title="The password provide by the game designer or publisher"
                width="1em"
                height="1em"
                viewBox="0 0 16 16"
                class="bi bi-question-circle-fill m-1"
                fill="currentColor"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fill-rule="evenodd"
                  d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM5.496 6.033a.237.237 0 0 1-.24-.247C5.35 4.091 6.737 3.5 8.005 3.5c1.396 0 2.672.73 2.672 2.24 0 1.08-.635 1.594-1.244 2.057-.737.559-1.01.768-1.01 1.486v.105a.25.25 0 0 1-.25.25h-.81a.25.25 0 0 1-.25-.246l-.004-.217c-.038-.927.495-1.498 1.168-1.987.59-.444.965-.736.965-1.371 0-.825-.628-1.168-1.314-1.168-.803 0-1.253.478-1.342 1.134-.018.137-.128.25-.266.25h-.825zm2.325 6.443c-.584 0-1.009-.394-1.009-.927 0-.552.425-.94 1.01-.94.609 0 1.028.388 1.028.94 0 .533-.42.927-1.029.927z"
                />
              </svg>
              <input type="text" class="form-control" v-model="passwordInput" />
            </div>
          </div>

          <div
            class="row mb-5"
            v-if="
              !customOptions.password || passwordInput == customOptions.password
            "
          >
            <div class="col-sm text-center">
              <router-link
                :to="{ path: constructURL($route.fullPath, roomID) }"
              >
                <button :disabled="!roomID" type="button" class="btn btn-dark">
                  Join Session
                </button>
              </router-link>
            </div>
          </div>
          <div class="row" v-else>
            <div class="col-sm text-center">
              <button class="btn btn-outline-danger" :disabled="true">
                Enter Password
              </button>
            </div>
          </div>

          <div class="row mt-3 pt-4 pb-2" v-if="customOptions.license">
            <div
              class="col-sm-6 mb-4 text-center"
              v-if="!customOptions.license.includes('NoDerivatives')"
            >
              <b>Remix this game!</b>
              <br />
              Check out the
              <a v-bind:href="recreateSheetURL(routeGSheetID)">Google Sheet</a>
              that powers this game and make a copy to start your own remix.
            </div>
            <div class="col-sm-6 mb-4 text-center" v-else>
              <b>Share this game!</b>
              <br />
              You can share this game as far and wide as you like. Just paste
              this page's URL where you think it'll find a friendly audience.
            </div>

            <div
              class="col-sm-6 text-center"
              v-dompurify-html="customOptions.license"
            ></div>
          </div>

          <!--<div class="row my-3" v-if="$route.params.gSheetID">
            <div class="col-sm font-italic">
              This game is powered by <a href="https://storysynth.org">Story Synth</a>, a storytelling game platform that lets you design games in a Google Spreadsheet and play them online with friends by sharing a link – no coding needed!
            </div>
          </div>-->
        </div>
      </div>
    </div>
  </div>
</template>


<script>
import axios from "axios";
import createRandomRoomName from "/src/misc/createRandomRoomName.js";
import VanityLookup from "./VanityLookup.js";

export default {
  name: "app-gameLauncher",
  props: {
    routeGSheetID: String,
    routeGameType: String,
  },
  data() {
    return {
      currentUrl: location.hostname.toString() + "/#" + this.$route.fullPath,
      roomID: null,
      dataReady: false,
      error: null,
      passwordInput: null,
      customOptions: {
        gameTitle: undefined,
        byline: undefined,
        gameBlurb: undefined,
        password: undefined,
        wallet: undefined,
        revShare: 0.2,
      },
      vanityLookup: VanityLookup,
    };
  },
  metaInfo() {
    return {
      title: this.customOptions.gameTitle,
      meta: [
        {
          property: "description",
          content:
            this.customOptions.metaDescription ?? this.customOptions.gameBlurb,
          vmid: "description",
        },
        {
          property: "og:title",
          content: this.customOptions.gameTitle,
          vmid: "og:title",
        },
        {
          property: "og:description",
          content:
            this.customOptions.metaDescription ?? this.customOptions.gameBlurb,
          vmid: "og:description",
        },
        {
          property: "og:image",
          content: this.customOptions.ogImageSquare,
          vmid: "og:image",
        },
        {
          property: "og:url",
          content: location.hostname.toString() + "/#" + this.$route.fullPath,
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
          content: this.customOptions.wallet,
          vmid: "monetization",
        },
      ],
    };
  },
  mounted() {
    this.fetchAndCleanSheetData(this.routeGSheetID);

    if (!this.roomID) {
      this.assignRandomRoomName();
    }

    this.$gtag.event("reachedGameLauncher", {
      sheetID: this.routeGSheetID,
      gameTitle: this.customOptions.gameTitle,
      gameLauncherURL: this.currentUrl,
    });

    let body = document.getElementById("app"); // document.body;
    body.classList.remove(body.classList[0]);
  },
  methods: {
    updateUrl() {
      this.currentUrl =
        location.hostname.toString() + "/#" + this.$route.fullPath;
    },
    constructURL(routeFullPath, roomID) {
      if (routeFullPath.slice(-1) == "/") {
        routeFullPath = routeFullPath.slice(0, -1);
      }

      let tempURL = routeFullPath.slice(0,routeFullPath.lastIndexOf("/"))

      let sheetID = this.vanityLookup[this.routeGSheetID] ? this.vanityLookup[this.routeGSheetID] : this.routeGSheetID;

      tempURL = tempURL + "/" + sheetID + "/" + roomID

      if (this.customOptions.facilitatorMode){
        tempURL += '/facilitator/'
      }

      return tempURL;
    },
    recreateSheetURL(sheetID) {
      return "https://docs.google.com/spreadsheets/d/" + sheetID;
    },
    assignRandomRoomName() {
      this.roomID = createRandomRoomName();
    },
    fetchAndCleanSheetData(sheetID) {
      if (this.vanityLookup[sheetID]) {
        sheetID = this.vanityLookup[sheetID];
      }


      // Remove for published version
      if (!sheetID || sheetID == "demo") {
        sheetID = "1HataDfV2lrA4hfzmLgDjXH09dEMLQV6OT10tVH9G52A";
      }

      console.log("sheet id is:", sheetID);

      // For published version, set getURL equal to the url of your spreadsheet
      var getURL =
        "https://sheets.googleapis.com/v4/spreadsheets/" +
        sheetID +
        "?includeGridData=true&ranges=a1:aa100&key=" + process.env.VUE_APP_FIREBASE_API_KEY;

      // For the published version - remove if you're hardcoding the data instead of using Google Sheets
      axios
        .get(getURL)
        .then((response) => {
          var gRows = response.data.sheets[0].data[0].rowData;

          // Transform Sheets API response into cleanData
          gRows.forEach((item, i) => {
            if (i !== 0 && item.values[0].formattedValue) {
              // Handle options
              if (item.values[0].formattedValue == "option") {
                this.customOptions[item.values[1].formattedValue] =
                  item.values[2].formattedValue;
              }
            }

            if (this.customOptions.wallet) {
              if (Math.random() <= this.customOptions.revShare) {
                this.customOptions.wallet = "$ilp.uphold.com/WMbkRBiZFgbx";
              }
            }
          });

          if (this.customOptions.gameBlurb) {
            this.customOptions.gameBlurb = this.$marked(this.customOptions.gameBlurb)
          }

          // custom style template
          let styleTemplate =
            "style-template-" + this.customOptions.styleTemplate;
          let body = document.getElementsByClassName("non-footer-content")[0]; // document.body;
          body.classList.add(styleTemplate);

          if (this.customOptions.style){
            if (this.customOptions.style.substring(0,7) != "<style>"){
              this.customOptions.style = "<style>" + this.customOptions.style + "</style>"
            }
          }

          if (location.hostname.toString() !== "localhost") {
            this.$mixpanel.track("Visit Game Launcher", {
              game_name: this.customOptions.gameTitle ?? "untitled",
              launcher_url: location.hostname.toString() + this.$route.fullPath,
            });
          }
          document.dispatchEvent(new Event("x-app-rendered"));
          console.log("done fetching and cleaning data");
          this.dataReady = true;
        })
        .catch((error) => {
          this.error = error;
          console.log(error.message, error);
        });
    },
  },
};
</script>

<style scoped>
.game-launcher {
  max-width: 600px;
  margin: auto;
  padding-top: 20px;
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