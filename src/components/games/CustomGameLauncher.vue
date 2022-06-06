<template>
  <div class="game-launcher">
    <div class="full-page-background"></div>
    <div v-dompurify-html="customOptions.style"></div>
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

          <div>
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

export default {
  name: "app-customGameLauncher",
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
        "Umberdred-Institute": {
          gameTitle: "The Umberdred Institute for Emerging Evildoers",
          gameBlurb: "Tell silly stories about how aspiring villains accept unlikely quests to earn dubious certifications in evildoing skills. By Amble Studio.",
          ogImage: "https://diegeticgames.com/uploads/sized-umberdreds-banner-square.png",
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
            '<link rel="preconnect" href="https://fonts.gstatic.com"><link href="https://fonts.googleapis.com/css2?family=Kelly+Slab&display=swap" rel="stylesheet"><style> h1, h2 { font-family: "Kelly Slab", sans-serif; } .card {border:0px;} .full-page-background {background: #23074d;  /* fallback for old browsers */background: -webkit-linear-gradient(to top, #cc5333, #23074d);  /* Chrome 10-25, Safari 5.1-6 */background: linear-gradient(to top, #cc5333, #23074d); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */} .game-meta { color: white; } .card { background: url(/img/paper.png); } } </style>',
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
      
      case "Umberdred-Institute":
        this.customOptions = {
          gameTitle: "Umberdred Institute",
          byline: "for emerging evildoers",
          gameBlurb: '<h2>An <a href="http://amble.studio">Amble Studio</a> remix of "<a href="https://storysynth.org/Games/Aethelreds-Academy/">Aethelred\'s Academy</a>"</h2><div class="text-left"><p>Tell silly stories about how aspiring villains accept unlikely quests to earn dubious certifications in evildoing skills.</p><p>Umberdred\'s is a fully-accredited, private institution dedicated to sowing mayhem around the world. Attendees earn their certifications by going on quests and demonstrating competency in their skills.</p><p>Improvise short stories about these aspiring villains and see if they succeed!</p><h2 class="text-center">Info</h2><ul class="text-left"><li>2+ players</li><li>All ages</li><li>Play time: from 5 minutes to a 5 year Diploma of Evil Studies</li><li>Genre: Fantasy</li><li>Tone: Comedy</li><li>Activity: improvising quest recaps</li></ul>',
          coverImage: "https://amble.studio/wp-content/uploads/2021/08/UmberdredTitle-1.png",
          style: "<style>.roomLink-section.d-none.d-sm-block{display:none!important}.pb-5 img{margin-bottom:8%}.col-sm.text-center.game-burb{color:#fff}.card.shadow.mb-4{background:0 0;box-shadow:none!important;border:none}.row.mt-3.pt-4.pb-2.bg-light{background:0 0!important;color:#fff}.body{color:#fff}.generator-cell-label.px-2{width:106%;margin-left:-3%}.generator-cell-one-half .generator-cell-body,.generator-cell-one-third .generator-cell-body{font-size:1.4em!important;font-family:'Architects Daughter';font-weight:400!important}.generator-cell-full .generator-cell-body{font-size:2em!important;font-family:'Architects Daughter';font-weight:400!important}.mt-4.generator-main.card.shadow.mb-4{background:#901c1c91;box-shadow:0 3px 15px #000 inset!important;color:#fff;width:108%;margin-left:-4%;background-image:url(https://amble.studio/wp-content/uploads/2021/08/UmberdredGate.png)!important;background-repeat:no-repeat;background-size:150%;background-position-x:center;background-position-y:-70%}button.btn.btn.btn-dark.mx-2.my-1.btn-secondary{background:#fff;color:#000;font-size:.9em}.generator-cell-body.mb-2{padding:20px}.generator-cell-label{text-transform:uppercase;padding-top:2px;padding-bottom:2px;transition:all .2s;font-size:1.2em!important;font-weight:700!important;background:#000!important;box-shadow:0 0 20px #000!important}.upper-text.row{color:#fff;background:#00000070;margin-top:15%}.game-meta .col-sm h1{margin-top:47%;font-family:'Jim Nightshade',Garamond,sans-serif!important;color:#fff;font-size:90px;width:calc(100vw);margin-left:calc(50% - 50vw);line-height:.9;margin-bottom:20px}.game-meta .col-sm h4{margin-top:-5%;font-family:'Jim Nightshade',Garamond,sans-serif!important;color:#fff;font-size:60px}.game-launcher .full-page-background{background-color:rgb(113 43 108)}.game-launcher .card-body{color:#fff;background:#00000070;margin-top:15%}.full-page-background{background-color:rgb(70 24 66)!important;background-image:url(http://amble.studio/wp-content/uploads/2021/08/Gates.png),url(https://amble.studio/wp-content/uploads/2021/08/UmberdredGate-1-1.png)!important;background-repeat:repeat-y,no-repeat;background-size:contain,70%;background-position-x:center;background-blend-mode:normal!important}.category-label{background-color:#953030;color:#fff}</style>",
          upperText: '<div class="text-left"><p>Welcome to The Umberdred Insitute for Emerging Evildoers, a fully accredited and for-profit institution.</p><p>The proven Umberdred\'s Process&trade; involves sending Villains on quests where they can demonstrate their mastery of a specific villainous skill.</p><p>In order to receive a certification for a skill, a Villain must return to Umberdred\'s to present the details of their quest to our certification-granting panel (extra credit will be awarded for interfering with the operation of <a href="https://storysynth.org/Games/Aethelreds-Academy/">Æthelred\'s Academy for Aspiring Adventurers</a>). Please note that aspiring Villains will be charged a certification evaluation fee regardless of whether the panel issues a certification. Retrying is permitted, for an additional fee.</p><h2 style="width:100%; text-align:center">Instructions</h2><p>The Umberdred Process&trade; is standardized. Each round will feature a new aspiring Villain trying to get a certification for a skill – choose one player to be the aspiring Villain and another to be the Quest Giver. Any additional players are members of the certification committee.</p><h3 style="width:100%; text-align:center">On Each Round</h3>1) The Villain introduces themselves and which certificate they think they have earned (pick from the options listed).2) The Quest Giver introduces what the quest goal was and add some embellishing details about the challenges involved.3) The Villain tells the committee how they attempted to accomplish the quest in a manner demonstrating the skill up for certification.4) The Quest Giver says how they feel about the outcome of the quest and if the Villain should be certified in the skill.<h3 style="width:100%; text-align:center">Tips</h3><p>Each round should last a few minutes, but feel free to go longer or shorter if that\'s what the players want.</p><p>If the Villain isn\'t sure how to proceed, they can always say <i>"And that\'s when I turned to the Quest Giver for guidance..."</i> the Quest Giver player can then help with the storytelling, sharing what they advised the villain.</p><p>If the Quest Giver wants to complicate the Villain\'s story, they can jump in and say <i>"You wouldn\'t believe what happened next..."</i> and then narrate the next story beat.</p><p>Play as many rounds as you like, with each round featuring a new Villain and Quest Giver. When you are done playing the game, share how you expect Umberdred\'s Academy will rank in this year\'s Nefarious News and World Report\'s survey of accredited, for-profit institutions.</p></div>',
          license: '<a rel="license" href="http://creativecommons.org/licenses/by/4.0/"><img alt="Creative Commons License" style="border-width:0" src="https://i.creativecommons.org/l/by/4.0/88x31.png" /><br />This work is licensed under a <a rel="license" href="http://creativecommons.org/licenses/by/4.0/">Creative Commons Attribution 4.0 International License.',
          generatorRowLayout: "1,3,1,1,1",
        }

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

      let tempURL = routeFullPath + "/" + roomID

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
            if (i !== 0 && item[0]) {
              // Handle options
              if (item[0] == "option") {
                this.customOptions[item[1]] =
                  item[2];
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