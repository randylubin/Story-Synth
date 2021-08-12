<template>
  <div class="game-launcher">
    <div class="full-page-background"></div>
    <div v-html="customOptions.style"></div>
    <div class="container">
      <div class="card shadow mb-4" style="margin-top: 76px">
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
                <p v-html="customOptions.gameBlurb"></p>
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
              <h2>Create A Session</h2>
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
                  title="room code"
                />
                <div class="input-group-append">
                  <button
                    class="btn btn-sm btn-outline-dark"
                    v-on:click="assignRandomRoomName()"
                    title="assign random room code"
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

          <div class="row mt-3 pt-4 pb-2 bg-light" v-if="customOptions.license">
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
              v-html="customOptions.license"
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

export default {
  name: "app-gameLauncher",
  props: {
    routeGSheetID: String,
    routeGameType: String,
    routeUserRole: String,
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
      gameMetaData: {
        "Arriba-Town": {
          gameTitle: "Arriba Town",
          gameBlurb:
            "Tell the story of two close companions racing their way around a fantasy world. Nella and Bly wagered that they could travel completely around the realm and return before the summer solstice.",
          ogImage:
            "https://diegeticgames.com/uploads/around-the-realm-square-unfurl.png",
        },
        "Around-The-Realm": {
          gameTitle: "Around The Realm",
          gameBlurb:
            "Tell the story of two close companions racing their way around a fantasy world. Nella and Bly wagered that they could travel completely around the realm and return before the summer solstice.",
          ogImage:
            "https://diegeticgames.com/uploads/around-the-realm-square-unfurl.png",
        },
        "Post-Work-Paradise": {
          gameTitle: "Post-Work Paradise",
          gameBlurb:
            "This game explores what life might be like in a world where work is obsolete. How do people choose to live and spend their time?",
          ogImage: "https://storysynth.org/img/story-synth-square-logo.gif",
        },
        "Clash-At-Ikara": {
          gameTitle: "Clash at Ikara",
          gameBlurb:
            "Tell the story of a group of heroes who have agreed to protect the defenseless community of Ikara from an imminent bandit raid.",
          ogImage:
            "https://diegeticgames.com/uploads/clash-at-ikara-square.png",
        },
        "Raised-By-Mechs": {
          gameTitle: "Raised By Mechs",
          gameBlurb:
            "Tell the story of children being raised by a mech on a new planet. Inspired by Raised by Wolves and For the Queen.",
          ogImage: "https://iili.io/f1zdtn.png",
        },
        "Aethelreds-Academy": {
          gameTitle: "Æthelred's Academy for Aspiring Heroes",
          gameBlurb:
            "Tell silly stories about how aspiring heroes go on unlikely quests to earn dubious certifications in adventuring skills. By Greg and Randy Lubin.",
          ogImage: "https://diegeticgames.com/uploads/aethelreds-logo-square.png",
        },
        gameRoute: {
          gameTitle: "TK",
          gameBlurb: "TK",
          ogImage: "TK",
        },
      },
    };
  },
  metaInfo() {
    return {
      title: this.gameMetaData[this.routeGSheetID].gameTitle,
      meta: [
        {
          property: "description",
          content: this.gameMetaData[this.routeGSheetID].gameBlurb,
          vmid: "description",
        },
        {
          property: "og:title",
          content: this.gameMetaData[this.routeGSheetID].gameTitle,
          vmid: "og:title",
        },
        {
          property: "og:description",
          content: this.gameMetaData[this.routeGSheetID].gameBlurb,
          vmid: "og:description",
        },
        {
          property: "og:image",
          content: this.gameMetaData[this.routeGSheetID].ogImage,
          vmid: "og:image",
        },
        {
          property: "og:url",
          content: location.hostname.toString() + "/" + this.$route.fullPath,
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
          content: this.gameMetaData[this.routeGSheetID].gameTitle + " logo",
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
    //let correctGSheetID = ""

    switch (this.routeGSheetID) {
      case "Arriba-Town":
        //  correctGSheetID = "1dJErJDT_WF99dDKRZZqAhx95zvuGQIyBlkEdZnMfTgA"
        this.customOptions = {
          gameTitle: "Arriba Town",
          byline: "By Amble Studio",
          gameBlurb:
            '<div class="text-left" style="white-space:normal">\n<h2>Pitch</h2>\nTell the story of two close companions racing their way around a fantasy world.\n<br><br>\nNella and Bly wagered that they could race completely around the realm and return before the summer solstice. However, the lands are full of magic, danger, and adventure – will they make it back in time?\n<br><br>\n<h2>Info</h2>\n<ul>\n  <li>2+ players</li>\n  <li>All ages</li>\n  <li>30 minutes - 2 hours</li>\n  <li>Genre: Fantasy</li>\n  <li>Tone: exciting adventure</li>\n  <li>Activities: light narration, quick worldbuilding</li>\n</ul>\n</div>',
          coverImage:
            "https://diegeticgames.com/uploads/around-the-realm-cover-narrow.png",
          style:
            '<link href="https://fonts.googleapis.com/css?family=IM+Fell+English|Montserrat" rel="stylesheet">\n\n<style>\n\n#app {Font-Family: \'IM Fell English\', Serif;}\n\n.card-header-text {\n  font-size: 2.5rem;\n  Font-Family: \'IM Fell English\', Serif;\n}\n\n.card {\n  background-image: url(https://diegeticgames.com/uploads/groovepaper.png);\n}\n\n.card-img-bottom {\n  filter: saturate(0.7);\n  object-fit: cover;\n  object-position: top;\n  height: 60px;\n}\n\n.full-page-background {\n  background: rgb(255,255,255);\n  background: linear-gradient(180deg, rgba(30,150,255,1) 0%, rgba(255,255,255,1) 300px, rgba(255,255,255,1) 100%);\n  background-image: url("https://diegeticgames.com/uploads/around-the-realm-background.png");\n  filter: sepia(1) grayscale(0.4) brightness(1);\n}\n\n</style>',
        };
        this.dataReady = true;

        break;
        
        case "Around-The-Realm":
        //  correctGSheetID = "10dXt64oWecErQ0ooCXa1D9dZXfP4WPO7ujwoFsAUN6k"
        this.customOptions = {
          gameTitle: "Around the Realm",
          byline: "By Randy Lubin",
          gameBlurb:
            '<div class="text-left" style="white-space:normal">\n<h2>Pitch</h2>\nTell the story of two close companions racing their way around a fantasy world.\n<br><br>\nNella and Bly wagered that they could race completely around the realm and return before the summer solstice. However, the lands are full of magic, danger, and adventure – will they make it back in time?\n<br><br>\n<h2>Info</h2>\n<ul>\n  <li>2+ players</li>\n  <li>All ages</li>\n  <li>30 minutes - 2 hours</li>\n  <li>Genre: Fantasy</li>\n  <li>Tone: exciting adventure</li>\n  <li>Activities: light narration, quick worldbuilding</li>\n</ul>\n</div>',
          coverImage:
            "https://diegeticgames.com/uploads/around-the-realm-cover-narrow.png",
          style:
            '<link href="https://fonts.googleapis.com/css?family=IM+Fell+English|Montserrat" rel="stylesheet">\n\n<style>\n\n#app {Font-Family: \'IM Fell English\', Serif;}\n\n.card-header-text {\n  font-size: 2.5rem;\n  Font-Family: \'IM Fell English\', Serif;\n}\n\n.card {\n  background-image: url(https://diegeticgames.com/uploads/groovepaper.png);\n}\n\n.card-img-bottom {\n  filter: saturate(0.7);\n  object-fit: cover;\n  object-position: top;\n  height: 60px;\n}\n\n.full-page-background {\n  background: rgb(255,255,255);\n  background: linear-gradient(180deg, rgba(30,150,255,1) 0%, rgba(255,255,255,1) 300px, rgba(255,255,255,1) 100%);\n  background-image: url("https://diegeticgames.com/uploads/around-the-realm-background.png");\n  filter: sepia(1) grayscale(0.4) brightness(1);\n}\n\n</style>',
        };
        this.dataReady = true;

        break;

      case "Post-Work-Paradise":
        this.customOptions = {
          gameTitle: "Post-Work-Paradise",
          byline: "By Randy Lubin",
          gameBlurb:
            "This game explores what life might be like in a world where work is obsolete. How do people choose to live and spend their time? <br><br> Designed by Randy Lubin of <a target='_blank' href='https://leveragedplay.com'>Leveraged Play</a>. Submitted as part of the <a target='_blank' href='https://postwork.city/'>The Post-Work City</a> open call for visions for a future without work.<br><br>Play involves seeing randomly generated residents of this future city and answering questions about their lives. Character photos are generated by Artifical Intelligence via <a target='_blank' href='https://thispersondoesnotexist.com/'>This Person Does Not Exist</a>.",
          style:
            '<link rel="preconnect" href="https://fonts.gstatic.com"><link href="https://fonts.googleapis.com/css2?family=Orbitron&family=Roboto&display=swap" rel="stylesheet"><style>.full-page-background { background: #e65c00; /* fallback for old browsers */ background: -webkit-linear-gradient(to right, #F9D423, #e65c00);  /* Chrome 10-25, Safari 5.1-6 */ background: linear-gradient(to right, #F9D423, #e65c00); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */} #app { font-family: \'Roboto\',Arial,sans-serif;} h1, h2 { font-family: \'Orbitron\', sans-serif;} </style>',
        };

        this.dataReady = true;

        break;

      case "Clash-At-Ikara":
        this.customOptions = {
          gameTitle: "Clash At Ikara",
          byline: "By Randy Lubin",
          gameBlurb:
            '<i>By Randy Lubin</i><br><br><div class="text-left" style="white-space:normal"> <h2>Pitch</h2> Play as a group of heroes who have agreed to protect the defenseless community of Ikara from an imminent bandit raid. First meet the heroes, then discover Ikara and its inhabitants, and finally see how they fare in a battle against the bandits. <br><br> Inspired by Seven Samurai and For the Queen <br><br> <h2>Info</h2> <ul> <li>2+ players</li> <li>30-60 minutes</li> <li>Genre: Flexible (fantasy or science fiction work well)</li> <li>Tone: tense preparation, heroic sacrifice</li> <li>Activities: tell quick vignettes that build the characters and the world</li> </ul> </div>',
          coverImage:
            "https://diegeticgames.com/uploads/clash-at-ikara-cover.png",
          style:
            '<link rel="preconnect" href="https://fonts.gstatic.com"><link href="https://fonts.googleapis.com/css2?family=Kelly+Slab&display=swap" rel="stylesheet"><style> h1, h2 { font-family: "Kelly Slab", sans-serif; } .card {border:0px;} .full-page-background {background: #23074d;  /* fallback for old browsers */background: -webkit-linear-gradient(to top, #cc5333, #23074d);  /* Chrome 10-25, Safari 5.1-6 */background: linear-gradient(to top, #cc5333, #23074d); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */} .game-meta { color: white; } .card { background: url(https://www.toptal.com/designers/subtlepatterns/patterns/handmadepaper.png); } } </style>',
        };

        this.dataReady = true;

        break;

      case "Raised-By-Mechs":
        this.customOptions = {
          gameTitle: "Raised By Mechs",
          byline: "Raph D'Amico",
          gameBlurb:
            "A storygame inspired by Raised By Wolves & <a target='_blank' href='https://forthequeengame.com/'>For The Queen</a> </br><span class='m-subtitle'>By <a target='_blank' href='http://laughingkaiju.com'>Raph D'Amico</a><span> <hr>",
          coverImage: "https://iili.io/f1F7F1.png",
          style:
            "<style> #app { font-family: 'Questrial', sans-serif !important; color: #20193c; } .full-page-background { /* background: #ffc107; */ background: rgb(252,255,206); background: radial-gradient(circle, rgba(252,255,206,1) 0%, rgba(88,131,154,1) 37%, rgba(27,0,45,1) 100%); } @media (min-width: 576px) { .card-body p { font-size: 1.8rem !important; padding: 0px 36px 8px !important; } } @media (max-width: 576px) { .card-body { padding: 0px 12px !important; } .card-body p { font-size: 1.6rem !important; padding: 4px 12px 8px !important; } } .game-meta { color: #F4AD62; } .game-meta h1 { font-weight: 400; text-transform: uppercase; letter-spacing: 0.3em; } .card-body { margin-top: 0px !important; } .m-subtitle { font-size: 0.7em !important; line-height: 1.5em !important; margin-top: 12px; } .m-mother { font-family: 'VT323', monospace; background: #ffdfbe; border-radius: 40px; letter-spacing: 0.1em; padding: 1px 12px 1px 16px; color: #db7a13; margin-left: 3px; margin-right: 3px; } /* latin */ @font-face { font-family: 'VT323'; font-style: normal; font-weight: 400; font-display: swap; src: url(https://fonts.gstatic.com/s/vt323/v12/pxiKyp0ihIEF2isfFJXUdVNF.woff2) format('woff2'); unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD; } /* latin */ @font-face { font-family: 'Alata'; font-style: normal; font-weight: 400; font-display: swap; src: url(https://fonts.gstatic.com/s/alata/v2/PbytFmztEwbIoce9zqYzQ1OW.woff2) format('woff2'); unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD; } /* latin */ @font-face { font-family: 'Questrial'; font-style: normal; font-weight: 400; font-display: swap; src: url(https://fonts.gstatic.com/s/questrial/v12/QdVUSTchPBm7nuUeVf70viFluW44JQ.woff2) format('woff2'); unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD; } </style>",
        };

        this.dataReady = true;

        break;

      case "Aethelreds-Academy":
        this.customOptions = {
          gameTitle: "Æthelred's Academy for Aspiring Heroes",
          byline: "By Greg Lubin and Randy Lubin",
          gameBlurb: '<h2>By Greg Lubin and Randy Lubin</h2><div class="text-left"><p>Tell silly stories about how aspiring heroes accept unlikely quests to earn dubious certificates.</p><p>Æthelred\'s Academy is a non-accredited, for-profit institution. Attendees earn their certifications by finding quest givers, going on quests, and demonstrating competency in their skills.</p><p>Improvise short stories about these aspiring adventures and see if they succeed!</p><h2 class="text-center">Info</h2><ul class="text-left"><li>2+ players</li><li>All ages</li><li>Play time: from 5 minutes to a two year "degree"</li><li>Genre: Fantasy</li><li>Tone: Comedy</li><li>Activity: improvising quest recaps</li></ul><p>This game is free to share and remix under a Creative Commons License: <a href="https://creativecommons.org/licenses/by/4.0/">CC BY 4.0</a></p><p><i>Icons via Flaticon designers: Freepik, fjstudio, Eucalyp, and Pixel perfect</i></p>',
          coverImage: "https://diegeticgames.com/uploads/aethelreds-logo.png",
          style: "<style>.game-launcher .card-body {background-color: white;}</style>",
          styleTemplate: "fantasy"
        };

        this.dataReady = true;

        break;

      default:
        break;
    }

    document.dispatchEvent(new Event("x-app-rendered"));
    //this.fetchAndCleanSheetData(correctGSheetID);

    // custom style template
    let styleTemplate =
      "style-template-" + this.customOptions.styleTemplate;
    let body = document.getElementsByClassName("non-footer-content")[0]; // document.body;
    body.classList.add(styleTemplate);

    if (location.hostname.toString() !== "localhost") {
      this.$mixpanel.track("Visit Game Launcher", {
        game_name: this.customOptions.gameTitle ?? "untitled",
        launcher_url: location.hostname.toString() + this.$route.fullPath,
      });
    }

    if (!this.roomID) {
      this.assignRandomRoomName();
    }

    this.$gtag.event("reachedGameLauncher", {
      sheetID: this.routeGSheetID,
      gameTitle: this.customOptions.gameTitle,
      gameLauncherURL: this.currentUrl,
    });
  },
  methods: {
    updateUrl() {
      this.currentUrl =
        location.hostname.toString() + "/" + this.$route.fullPath;
    },
    constructURL(routeFullPath, roomID) {
      if (routeFullPath.slice(-1) == "/") {
        routeFullPath = routeFullPath.slice(0, -1);
      }

      return routeFullPath + "/" + roomID;
    },
    recreateSheetURL(sheetID) {
      return "https://docs.google.com/spreadsheets/d/" + sheetID;
    },
    assignRandomRoomName() {
      var wordList = [
        "acid",
        "acorn",
        "acre",
        "acts",
        "afar",
        "affix",
        "aged",
        "agent",
        "agile",
        "aging",
        "agony",
        "ahead",
        "aide",
        "aids",
        "aim",
        "ajar",
        "alarm",
        "alias",
        "alibi",
        "alien",
        "alike",
        "alive",
        "aloe",
        "aloft",
        "aloha",
        "alone",
        "amend",
        "amino",
        "ample",
        "amuse",
        "angel",
        "anger",
        "angle",
        "ankle",
        "apple",
        "April",
        "apron",
        "aqua",
        "area",
        "arena",
        "argue",
        "arise",
        "armed",
        "armor",
        "army",
        "aroma",
        "array",
        "arson",
        "art",
        "ashen",
        "ashes",
        "atlas",
        "atom",
        "attic",
        "audio",
        "avert",
        "avoid",
        "awake",
        "award",
        "awoke",
        "axis",
        "bacon",
        "badge",
        "bagel",
        "baggy",
        "baked",
        "baker",
        "balmy",
        "banjo",
        "barge",
        "barn",
        "bash",
        "basil",
        "bask",
        "batch",
        "bath",
        "baton",
        "bats",
        "blade",
        "blank",
        "blast",
        "blaze",
        "bleak",
        "blend",
        "bless",
        "blimp",
        "blink",
        "bloat",
        "blob",
        "blog",
        "blot",
        "blunt",
        "blurt",
        "blush",
        "boast",
        "boat",
        "body",
        "boil",
        "bolt",
        "boney",
        "bonus",
        "bony",
        "book",
        "booth",
        "boots",
        "boss",
        "botch",
        "both",
        "boxer",
        "breed",
        "bribe",
        "brick",
        "bride",
        "brim",
        "bring",
        "brink",
        "brisk",
        "broad",
        "broil",
        "broke",
        "brook",
        "broom",
        "brush",
        "buck",
        "bud",
        "buggy",
        "bulge",
        "bulk",
        "bully",
        "bunch",
        "bunny",
        "bunt",
        "bush",
        "bust",
        "busy",
        "buzz",
        "cable",
        "cache",
        "cadet",
        "cage",
        "cake",
        "calm",
        "cameo",
        "canal",
        "candy",
        "cane",
        "canon",
        "cape",
        "card",
        "cargo",
        "carol",
        "carry",
        "carve",
        "case",
        "cash",
        "cause",
        "cedar",
        "chain",
        "chair",
        "chant",
        "chaos",
        "charm",
        "chase",
        "cheek",
        "cheer",
        "chef",
        "chess",
        "chest",
        "chew",
        "chief",
        "chili",
        "chill",
        "chip",
        "chomp",
        "chop",
        "chow",
        "chuck",
        "chump",
        "chunk",
        "churn",
        "chute",
        "cider",
        "cinch",
        "city",
        "civic",
        "civil",
        "clad",
        "claim",
        "clamp",
        "clap",
        "clash",
        "clasp",
        "class",
        "claw",
        "clay",
        "clean",
        "clear",
        "cleat",
        "cleft",
        "clerk",
        "click",
        "cling",
        "clink",
        "clip",
        "cloak",
        "clock",
        "clone",
        "cloth",
        "cloud",
        "clump",
        "coach",
        "coast",
        "coat",
        "cod",
        "coil",
        "coke",
        "cola",
        "cold",
        "colt",
        "coma",
        "comic",
        "comma",
        "cone",
        "cope",
        "copy",
        "coral",
        "cork",
        "cost",
        "cot",
        "couch",
        "cough",
        "cover",
        "cozy",
        "craft",
        "crane",
        "crank",
        "crate",
        "crave",
        "crawl",
        "creme",
        "crepe",
        "crept",
        "crib",
        "cried",
        "crisp",
        "crook",
        "crop",
        "cross",
        "crowd",
        "crown",
        "crumb",
        "crush",
        "crust",
        "cub",
        "cult",
        "cupid",
        "cure",
        "curl",
        "curry",
        "curse",
        "curve",
        "curvy",
        "cushy",
        "cut",
        "cycle",
        "dab",
        "dad",
        "daily",
        "dairy",
        "daisy",
        "dance",
        "dandy",
        "darn",
        "dart",
        "dash",
        "data",
        "date",
        "dawn",
        "deal",
        "dean",
        "debit",
        "debt",
        "debug",
        "decaf",
        "decal",
        "decay",
        "deck",
        "decor",
        "decoy",
        "deed",
        "delay",
        "denim",
        "dense",
        "dent",
        "depth",
        "derby",
        "desk",
        "dial",
        "diary",
        "dice",
        "dig",
        "dill",
        "dime",
        "dimly",
        "diner",
        "dingy",
        "disco",
        "dish",
        "disk",
        "ditch",
        "ditzy",
        "dizzy",
        "dock",
        "dodge",
        "doing",
        "doll",
        "donor",
        "donut",
        "dose",
        "dot",
        "dove",
        "down",
        "dowry",
        "doze",
        "drab",
        "drama",
        "drank",
        "draw",
        "dress",
        "dried",
        "drift",
        "drill",
        "drive",
        "drone",
        "droop",
        "drove",
        "drown",
        "drum",
        "dry",
        "duck",
        "duct",
        "dude",
        "dug",
        "duke",
        "duo",
        "dusk",
        "dust",
        "duty",
        "dwarf",
        "dwell",
        "eagle",
        "early",
        "earth",
        "easel",
        "east",
        "eaten",
        "eats",
        "ebony",
        "ebook",
        "echo",
        "edge",
        "eel",
        "eject",
        "elbow",
        "elder",
        "elf",
        "elk",
        "elm",
        "elope",
        "elude",
        "elves",
        "email",
        "emit",
        "empty",
        "emu",
        "enter",
        "entry",
        "envoy",
        "equal",
        "erase",
        "error",
        "erupt",
        "essay",
        "etch",
        "evade",
        "even",
        "evict",
        "evil",
        "evoke",
        "exact",
        "exit",
        "fable",
        "faced",
        "fact",
        "fade",
        "fall",
        "fancy",
        "fang",
        "fax",
        "feast",
        "feed",
        "femur",
        "fence",
        "fend",
        "ferry",
        "fetch",
        "fever",
        "fiber",
        "fifth",
        "fifty",
        "film",
        "final",
        "finch",
        "fit",
        "five",
        "flag",
        "flaky",
        "flame",
        "flap",
        "flask",
        "fled",
        "flick",
        "fling",
        "flint",
        "flip",
        "float",
        "flock",
        "flop",
        "floss",
        "flyer",
        "foam",
        "foe",
        "fog",
        "foil",
        "folic",
        "folk",
        "food",
        "fool",
        "found",
        "fox",
        "foyer",
        "frail",
        "frame",
        "fray",
        "fresh",
        "fried",
        "frill",
        "frisk",
        "from",
        "front",
        "frost",
        "froth",
        "frown",
        "froze",
        "fruit",
        "gains",
        "gala",
        "game",
        "gap",
        "gas",
        "gave",
        "gear",
        "gecko",
        "geek",
        "gem",
        "genre",
        "gift",
        "gig",
        "gills",
        "given",
        "giver",
        "glad",
        "glass",
        "glide",
        "gloss",
        "glove",
        "glow",
        "glue",
        "goal",
        "going",
        "golf",
        "gong",
        "good",
        "gooey",
        "goofy",
        "gore",
        "gown",
        "grab",
        "grain",
        "grant",
        "grape",
        "graph",
        "grasp",
        "grass",
        "grave",
        "gravy",
        "gray",
        "green",
        "greet",
        "grew",
        "grid",
        "grief",
        "grill",
        "grip",
        "grit",
        "groom",
        "growl",
        "grub",
        "grunt",
        "guide",
        "gulf",
        "gulp",
        "gummy",
        "guru",
        "gush",
        "gut",
        "guy",
        "habit",
        "half",
        "halo",
        "halt",
        "happy",
        "harm",
        "hash",
        "hasty",
        "hatch",
        "haven",
        "hazel",
        "hazy",
        "heap",
        "heat",
        "heave",
        "hedge",
        "hefty",
        "help",
        "herbs",
        "hers",
        "hub",
        "hug",
        "hula",
        "hull",
        "human",
        "humid",
        "hump",
        "hung",
        "hunk",
        "hunt",
        "hurry",
        "hurt",
        "hush",
        "hut",
        "ice",
        "icing",
        "icon",
        "icy",
        "igloo",
        "image",
        "ion",
        "iron",
        "issue",
        "item",
        "ivory",
        "ivy",
        "jab",
        "jam",
        "jaws",
        "jazz",
        "jeep",
        "jelly",
        "jet",
        "jiffy",
        "job",
        "jog",
        "jolly",
        "jolt",
        "jot",
        "joy",
        "judge",
        "juice",
        "juicy",
        "July",
        "jumbo",
        "jump",
        "junky",
        "juror",
        "jury",
        "keep",
        "keg",
        "kept",
        "kick",
        "kilt",
        "king",
        "kite",
        "kitty",
        "kiwi",
        "knee",
        "knelt",
        "koala",
        "ladle",
        "lady",
        "lair",
        "lake",
        "lance",
        "land",
        "lapel",
        "large",
        "lash",
        "lasso",
        "last",
        "latch",
        "late",
        "lazy",
        "left",
        "legal",
        "lemon",
        "lend",
        "lens",
        "lent",
        "level",
        "lever",
        "lid",
        "life",
        "lift",
        "lilac",
        "lily",
        "limb",
        "limes",
        "line",
        "lint",
        "lion",
        "lip",
        "list",
        "lived",
        "liver",
        "lunar",
        "lunch",
        "lung",
        "lurch",
        "lure",
        "lurk",
        "lying",
        "lyric",
        "mace",
        "maker",
        "malt",
        "mama",
        "mango",
        "manor",
        "many",
        "map",
        "March",
        "mardi",
        "marry",
        "mash",
        "match",
        "mate",
        "math",
        "mocha",
        "moist",
        "mold",
        "mom",
        "moody",
        "mop",
        "morse",
        "most",
        "motor",
        "motto",
        "mount",
        "mouse",
        "mousy",
        "mouth",
        "move",
        "movie",
        "mower",
        "mud",
        "mug",
        "mulch",
        "mule",
        "mull",
        "mumbo",
        "mummy",
        "mural",
        "muse",
        "music",
        "musky",
        "mute",
        "nacho",
        "nag",
        "nail",
        "name",
        "nanny",
        "nap",
        "navy",
        "near",
        "neat",
        "neon",
        "nerd",
        "nest",
        "net",
        "next",
        "ninth",
        "nutty",
        "oak",
        "oasis",
        "oat",
        "ocean",
        "oil",
        "old",
        "olive",
        "omen",
        "onion",
        "only",
        "ooze",
        "opal",
        "open",
        "opera",
        "opt",
        "otter",
        "ouch",
        "ounce",
        "outer",
        "oval",
        "oven",
        "owl",
        "ozone",
        "pace",
        "pagan",
        "pager",
        "palm",
        "panda",
        "panic",
        "pants",
        "panty",
        "paper",
        "park",
        "party",
        "pasta",
        "patch",
        "path",
        "patio",
        "payer",
        "pecan",
        "penny",
        "pep",
        "perch",
        "perm",
        "pest",
        "petal",
        "petri",
        "petty",
        "photo",
        "plank",
        "plant",
        "plaza",
        "plead",
        "plot",
        "plow",
        "pluck",
        "plug",
        "plus",
        "poach",
        "pod",
        "poem",
        "poet",
        "pogo",
        "point",
        "poise",
        "poker",
        "polar",
        "polka",
        "polo",
        "pond",
        "pony",
        "poppy",
        "pork",
        "poser",
        "pouch",
        "pound",
        "pout",
        "power",
        "prank",
        "press",
        "print",
        "prior",
        "prism",
        "prize",
        "probe",
        "prong",
        "proof",
        "props",
        "prude",
        "prune",
        "pry",
        "pug",
        "pull",
        "pulp",
        "pulse",
        "puma",
        "punch",
        "punk",
        "pupil",
        "puppy",
        "purr",
        "purse",
        "push",
        "putt",
        "quack",
        "quake",
        "query",
        "quiet",
        "quill",
        "quilt",
        "quit",
        "quota",
        "quote",
        "rabid",
        "race",
        "rack",
        "radar",
        "radio",
        "raft",
        "rage",
        "raid",
        "rail",
        "rake",
        "rally",
        "ramp",
        "ranch",
        "range",
        "rank",
        "rant",
        "rash",
        "raven",
        "reach",
        "react",
        "ream",
        "rebel",
        "recap",
        "relax",
        "relay",
        "relic",
        "remix",
        "repay",
        "repel",
        "reply",
        "rerun",
        "reset",
        "rhyme",
        "rice",
        "rich",
        "ride",
        "rigid",
        "rigor",
        "rinse",
        "riot",
        "ripen",
        "rise",
        "risk",
        "ritzy",
        "rival",
        "river",
        "roast",
        "robe",
        "robin",
        "rock",
        "rogue",
        "roman",
        "romp",
        "rope",
        "rover",
        "royal",
        "ruby",
        "rug",
        "ruin",
        "rule",
        "runny",
        "rush",
        "rust",
        "rut",
        "sadly",
        "sage",
        "said",
        "saint",
        "salad",
        "salon",
        "salsa",
        "salt",
        "same",
        "sandy",
        "satin",
        "sauna",
        "saved",
        "savor",
        "sax",
        "say",
        "scale",
        "scam",
        "scan",
        "scare",
        "scarf",
        "scary",
        "scoff",
        "scold",
        "scoop",
        "scoot",
        "scope",
        "score",
        "scorn",
        "scout",
        "scowl",
        "scrap",
        "scrub",
        "scuba",
        "scuff",
        "sect",
        "sedan",
        "self",
        "send",
        "sepia",
        "serve",
        "set",
        "seven",
        "shack",
        "shade",
        "shady",
        "shaft",
        "shaky",
        "sham",
        "shape",
        "share",
        "sharp",
        "shed",
        "sheep",
        "sheet",
        "shelf",
        "shell",
        "shine",
        "shiny",
        "ship",
        "shirt",
        "shock",
        "shop",
        "shore",
        "shout",
        "shove",
        "shown",
        "showy",
        "shred",
        "shrug",
        "shun",
        "shush",
        "shut",
        "shy",
        "sift",
        "silk",
        "silly",
        "silo",
        "sip",
        "siren",
        "sixth",
        "size",
        "skate",
        "skew",
        "skid",
        "skier",
        "skies",
        "skip",
        "skirt",
        "skit",
        "sky",
        "slab",
        "slack",
        "slain",
        "slam",
        "slang",
        "slash",
        "slate",
        "slaw",
        "sled",
        "sleek",
        "sleep",
        "sleet",
        "slept",
        "slice",
        "slick",
        "slimy",
        "sling",
        "slip",
        "slit",
        "slob",
        "slot",
        "slug",
        "slum",
        "slurp",
        "slush",
        "small",
        "smash",
        "smell",
        "smile",
        "smirk",
        "smog",
        "snack",
        "snap",
        "snare",
        "snarl",
        "sneak",
        "sneer",
        "sniff",
        "snore",
        "snort",
        "snout",
        "snowy",
        "snub",
        "speak",
        "speed",
        "spend",
        "spent",
        "spew",
        "spied",
        "spill",
        "spiny",
        "spoil",
        "spoke",
        "spoof",
        "spool",
        "spoon",
        "sport",
        "spot",
        "spout",
        "spray",
        "spree",
        "spur",
        "squad",
        "squat",
        "squid",
        "stack",
        "staff",
        "stage",
        "stain",
        "stall",
        "stamp",
        "stand",
        "stark",
        "start",
        "stash",
        "state",
        "stays",
        "steam",
        "steep",
        "stem",
        "step",
        "stew",
        "stick",
        "sting",
        "stir",
        "stock",
        "stole",
        "stomp",
        "stony",
        "stood",
        "stoop",
        "stop",
        "storm",
        "stout",
        "stove",
        "straw",
        "stray",
        "strut",
        "stuck",
        "stud",
        "stuff",
        "stump",
        "stung",
        "stunt",
        "suds",
        "sugar",
        "sulk",
        "surf",
        "sushi",
        "swab",
        "swan",
        "swarm",
        "sway",
        "swear",
        "sweat",
        "sweep",
        "swell",
        "swept",
        "swim",
        "swing",
        "swipe",
        "swirl",
        "swoop",
        "swore",
        "syrup",
        "tacky",
        "taco",
        "tag",
        "take",
        "tall",
        "talon",
        "tamer",
        "tank",
        "taper",
        "taps",
        "tarot",
        "task",
        "taste",
        "tasty",
        "taunt",
        "thank",
        "thaw",
        "theft",
        "theme",
        "thigh",
        "thing",
        "think",
        "thorn",
        "those",
        "thud",
        "thumb",
        "thump",
        "thus",
        "tiara",
        "tidal",
        "tidy",
        "tiger",
        "tile",
        "tilt",
        "tint",
        "tiny",
        "trace",
        "track",
        "trade",
        "train",
        "trait",
        "trap",
        "trash",
        "tray",
        "treat",
        "tree",
        "trek",
        "trend",
        "trial",
        "tribe",
        "trick",
        "trio",
        "trout",
        "truce",
        "truck",
        "trunk",
        "try",
        "tug",
        "tulip",
        "tummy",
        "turf",
        "tusk",
        "tutor",
        "tutu",
        "tux",
        "tweak",
        "tweet",
        "twice",
        "twine",
        "twins",
        "twirl",
        "twist",
        "uncle",
        "uncut",
        "undo",
        "unify",
        "union",
        "unit",
        "untie",
        "upon",
        "upper",
        "urban",
        "used",
        "user",
        "usher",
        "utter",
        "value",
        "vapor",
        "vegan",
        "venue",
        "verse",
        "vest",
        "veto",
        "vice",
        "video",
        "view",
        "visa",
        "visor",
        "vixen",
        "vocal",
        "voice",
        "void",
        "volt",
        "voter",
        "vowel",
        "wad",
        "wafer",
        "wager",
        "wages",
        "wagon",
        "wake",
        "walk",
        "wand",
        "wasp",
        "watch",
        "water",
        "wavy",
        "wheat",
        "whiff",
        "whole",
        "whoop",
        "wick",
        "widen",
        "widow",
        "width",
        "wife",
        "wifi",
        "wilt",
        "wimp",
        "wind",
        "wing",
        "wink",
        "wipe",
        "wired",
        "wiry",
        "wise",
        "wish",
        "wispy",
        "wok",
        "wolf",
        "womb",
        "wool",
        "woozy",
        "word",
        "work",
        "worry",
        "wound",
        "woven",
        "wrath",
        "wreck",
        "wrist",
        "xerox",
        "yahoo",
        "yam",
        "yard",
        "year",
        "yeast",
        "yelp",
        "yield",
        "yo-yo",
        "yodel",
        "yoga",
        "yoyo",
        "yummy",
        "zebra",
        "zero",
        "zesty",
        "zippy",
        "zone",
        "zoom",
      ];

      this.roomID =
        wordList[Math.floor(Math.random() * wordList.length)] +
        "-" +
        wordList[Math.floor(Math.random() * wordList.length)] +
        "-" +
        wordList[Math.floor(Math.random() * wordList.length)];
    },
    fetchAndCleanSheetData(sheetID) {
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

          // custom style template
          let styleTemplate =
            "style-template-" + this.customOptions.styleTemplate;
          let body = document.getElementsByClassName("non-footer-content")[0]; // document.body;
          body.classList.add(styleTemplate);

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
