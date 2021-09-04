<template>
  <div class="homepage">
    <div class="container">
      <div
        v-if="!$route.params.gameType"
        class="card shadow mb-4"
        style="margin-top: 76px"
      >
        <div class="card-body">
          <div id="homepage-intro-text" v-if="!$route.params.gSheetID">
            <div class="row mb-4">
              <div class="col-sm text-center">
                <h1>Story Synth</h1>
                <h3>Make, play, and share storytelling games</h3>
              </div>
            </div>

            <div class="embed-responsive embed-responsive-16by9 mb-3">
              <video class="embed-responsive-item" autoplay loop controls muted>
                <source
                  src="https://diegeticgames.com/uploads/story-synth-teaser.mp4"
                  type="video/mp4"
                />
              </video>
            </div>

            <div class="row mb-3">
              <div class="col-sm text-left">
                <p>Story Synth is a free web platform for making, playing, and sharing storytelling games:</p>
                <ul>
                  <li>
                    Designing is super easy – just add prompts to Google Sheets and
                    paste a link on this page
                  </li>
                  <li>
                    Plenty of formats and extensions for you to customize your game
                  </li>
                  <li>
                    Game sessions have real-time multiplayer, perfect for online
                    play
                  </li>
                </ul>
                <!--
                <p>
                  Designing a game in Story Synth is super easy: just add your
                  story prompts to a spreadsheet and then paste the sheet's link
                  below. Story Synth will automatically generate your game and
                  you can play it in the browser.
                </p>

                <p>
                  Story Synth games have a unique session-creation URL, which
                  you can share with others. When you launch a session, everyone
                  in that game will see the same prompts at the same time.
                </p>

                <p>
                  There are a handful of different formats that you can use for
                  your game and plenty of customization options and extensions
                  you can include. To learn more, watch this
                  <a href="https://www.youtube.com/watch?v=FqfBcB4iZEI"
                    >Video Tour</a
                  >, or check out the
                  <a href="https://docs.storysynth.org/guide">About Page</a> or
                  the
                  <a href="https://docs.storysynth.org/guide/formats.html"
                    >Formats Page</a
                  >.
                </p>
                -->
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="card shadow mb-4">
        <div class="card-body">
          <div class="row mb-4">
            <div class="col-sm-12 text-center">
              <h2>Games and Demos</h2>
            </div>
            <div class="col-sm-12">
              <p>
                Check out the
                <a href="https://storysynth.org/Gallery/">Gallery</a> to find
                Story Synth games you can play right now.
              </p>

              <a href="/Gallery/">
                <img class="img img-fluid" src="https://diegeticgames.com/uploads/story-synth-game-collage.png" alt="Collage of Story Synth Games">
              </a>

              <p class="mt-4">Or check out demos of the different formats:</p>

              <div class="row mb-3">
                <div class="col-sm-6 text-left">
                  <ul style="margin-block-end: 0em">
                    <li>
                      <a
                        href="/#/Shuffled/1N5eeyKTVWo5QeGcUV_zYtwtR0DikJCcvcj6w69UkC1w"
                        >Shuffled (one deck)</a
                      >
                    </li>
                    <li>
                      <a
                        href="/#/Shuffled/1N2N8URSswhmxLalPOkzi5d4kdeFiGrsobEmM_ojk0ow"
                        >Shuffled (multi-deck)</a
                      >
                    </li>
                    <li>
                      <a
                        href="/#/Timed/1yq2AKwaYL1uZrCnEfwgSpC0SPkQAZqnCdjNxH_pm018"
                        >Timed</a
                      >
                    </li>
                    <li>
                      <a
                        href="/#/Monster/1NgNHy7Qe1R8KhGR2cOmJwL2aOl2tocBemW2HIAKjrvI"
                        >Monster</a
                      >
                    </li>
                  </ul>
                  <ul>
                    <li>
                      <a href="/Hexflower/1wLDboZZBfBwMKswMYcRIXxz6DxRZJyAa6KPW6TvR-dM/">Hexflower</a>
                    </li>
                  </ul>
                </div>
                <div class="col-sm-6 text-left">
                  <ul>
                    <li>
                      <a
                        href="/#/Generator/1F0g3rVHxRA7O0rRMIQSsLCepJStxBO6pa7QJUNJb3K0/"
                        >Generator</a
                      >
                    </li>
                    <li>
                      <a
                        href="/#/SlotMachine/1t5LRUQG9DzMJ3kd8E9DZV7_EbE8J5-Gqhz7TWQ4Y-uU"
                        >Slot Machine</a
                      >
                    </li>
                    <li>
                      <a
                        href="/#/Phases/1HataDfV2lrA4hfzmLgDjXH09dEMLQV6OT10tVH9G52A"
                        >Phases</a
                      >
                    </li>
                    <li>
                      <a
                        href="/#/SecretCards/1JwMF02DSxNKtjHp6u-wyznSs-iEG_3DpOobgc17I16o"
                        >Secret Player Prompts</a
                      >
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <app-gameLauncherSingleGame v-if="launcherOnHomepage" :gameRoute="String(launcherOnHomepage)"></app-gameLauncherSingleGame>
    <app-gameMaker v-if="!launcherOnHomepage"
      :routeRoomID="$route.params.roomID"
      :routeGSheetID="$route.params.gSheetID"
      :routeGameType="$route.params.gameType"
    ></app-gameMaker>
  </div>
</template>

<script>
import GameMaker from "./GameMaker.vue";
import GameLauncherSingleGame from "./GameLauncherSingleGame.vue"

export default {
  name: "app-homepage",
  components: {
    "app-gameMaker": GameMaker,
    "app-gameLauncherSingleGame": GameLauncherSingleGame,
  },
  props: {
    routeGameType: String,
    routeGSheetID: String,
    routeRoomID: String,
  },
  data() {
    return {
      launcherOnHomepage: false, // if you want the game launcher on the homepage, add in the route up until the roomID e.g. "/Games/Around-The-Realm/"
    }
  },
  mounted(){
    let body = document.getElementById("app"); // document.body;
    body.classList.remove(body.classList[0]);

    let page = document.getElementsByClassName("non-footer-content")[0]; // document.body;
    page.classList.remove(page.classList[1])

    document.dispatchEvent(new Event("x-app-rendered"));
  }
};
</script>

<style scoped>
.homepage {
  max-width: 600px;
  margin: auto;
}

li {
  list-style-type: disc;
  display: list-item;
  margin-left: 20px;
}
</style>