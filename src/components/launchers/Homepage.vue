<template>
  <div class="homepage">
    <div class="container">
      <div class="homepage-header row padding-after-navbar mb-4">
        <div class="col-sm text-center">
          <h1><img src="/img/story-synth-logotype.svg" alt="Story Synth Logo"></h1>
          <h2>Make, play, and share storytelling games</h2>
        </div>
      </div>

      <div class="homepage-gif row rounded-m clipped mb-4">
        <div class="embed-responsive embed-responsive-16by9">
          <video class="embed-responsive-item" autoplay loop controls muted>
            <source
              src="https://diegeticgames.com/uploads/story-synth-teaser.mp4"
              type="video/mp4"
            />
          </video>
        </div>
      </div>

      <div class="homepage-about margin-between-sections">
        <div class="row margin-between-sections">
          <h3 class="col-sm mb-4">
            Story Synth is a free web platform for making, playing, and sharing storytelling games. Just design in Google Sheets and publish here!
          </h3>
        </div>
        <div class="row">
          <div class="col-md-4 col-sm-12 d-flex flex-column">
            <h3>Easy to start</h3>
            <div>Tons of templates, formats, and extensions to jump start your game design</div>
            <!-- Formats by Bart van der Griendt from NounProject.com https://thenounproject.com/icon/formats-687218/ -->
            <img class="img img-fluid mx-auto mt-auto px-3 py-1" style="max-width: 250px; transform:scale(0.9);" src="/img/options.svg" alt="">
          </div>
          <div class="col-md-4 col-sm-12 d-flex flex-column">
            <h3>Design in Sheets</h3>
            <div>Because it's powered by a Google Sheet, designing is quick and iteration is instantaneous</div>
            <!-- icon by Becris https://thenounproject.com/icon/analysis-1018335/ -->
            <img class="img img-fluid mx-auto mt-auto px-3 py-1" style="max-width: 250px; transform: translateY(1.5%);" src="/img/sheet-to-synth.svg" alt="">
          </div>
          <div class="col-md-4 col-sm-12 d-flex flex-column">
            <h3>Multiplayer</h3>
            <div>Game sessions have realtime multiplayer, perfect for online playtesting and publishing</div>
            <!-- icon by Iconathon https://thenounproject.com/icon/networking-2909312/-->
            <img class="img img-fluid mx-auto mt-auto px-3 py-1" style="max-width: 250px;" src="/img/connection.svg" alt="">
          </div>
        </div>
      </div>

      <!-- Section: play -->
      <div class="homepage-play margin-between-sections">
        <h2 class="text-center mb-4">Play an existing game</h2>

        <div class="row">
          <div class="offset-lg-0 col-lg-12 col-md-4 mb-2 d-flex flex-column">
            <div class="card shadow h-100">
              <div class="row no-gutters">
                <div class="col-lg-4">
                  <a href="/Games/Around-The-Realm">
                    <img src="https://img.itch.zone/aW1nLzQ4MzI3NjAucG5n/315x250%23cb/Kb6Vr8.png" 
                    alt="Around the Realm logo" class="card-img">
                  </a>
                </div>
                <div class="col-lg-8">
                  <div class="card-body d-flex flex-column h-100">
                    <h5 class="card-title">Around the Realm</h5>
                    <h6 class="card-subtitle text-muted mb-2">By Randy Lubin</h6>
                    <div class="card-text">Tell the story of two companions racing around a fantasy world in order to win a wager.</div>
                    <a href="/Games/Around-The-Realm" target="_self" class="btn mt-auto align-self-start stretched-link ">Play game</a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        
          <div class="offset-lg-0 col-lg-12 col-md-4 mb-2">
            <div class="card shadow h-100">
              <div class="row no-gutters">
                <div class="col-lg-4">
                  <a href="/Games/Raised-By-Mechs/">
                    <img src="https://iili.io/f1F7F1.png" 
                    alt="Raised by Mechs logo" class="card-img">
                  </a>
                </div>
                <div class="col-lg-8">
                  <div class="card-body d-flex flex-column h-100">
                    <h5 class="card-title">Raised by Mechs</h5>
                    <h6 class="card-subtitle text-muted mb-2">By Raph D'Amico</h6>
                    <div class="card-text">Tell the story of a group of children raised by their mech mother.</div>
                    <a href="/Games/Raised-By-Mechs/" target="_self" class="btn mt-auto align-self-start stretched-link ">Play game</a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        
          <div class="offset-lg-0 col-lg-12 col-md-4 mb-2">
            <div class="card shadow h-100">
              <div class="row no-gutters">
                <div class="col-lg-4">
                  <a href="/Games/Umberdred-Institute/">
                    <img src="https://img.itch.zone/aW1nLzY3NzQzNTIuanBn/315x250%23c/XQicpj.jpg" 
                    alt="Umberdred Institute for Emerging Evildoers logo" class="card-img">
                  </a>
                </div>
                <div class="col-lg-8">
                  <div class="card-body d-flex flex-column h-100">
                    <h5 class="card-title">Umberdred Institute for Emerging Evildoers</h5>
                    <h6 class="card-subtitle text-muted mb-2">By Amble Studio</h6>
                    <div class="card-text">Tell silly stories about how aspiring villains accept unlikely quests to earn dubious certifications in evildoing skills.</div>
                    <a href="/Games/Umberdred-Institute/" target="_self" class="btn mt-auto align-self-start stretched-link ">Play game</a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="row mt-3">
          <div class="col-sm">
            <a href="/Gallery" class="btn py-3 px-4 btn-lg">See all games</a>            
          </div>
        </div>
      </div>

      <!-- Section: create -->
      <div class="homepage-create margin-between-sections">
        <div class="row">
          <div class="col-12">
            <h2>Create a new game</h2>
          </div>  
        </div>
        <div class="row">
          <div class="col-12">
            <p>Copy one of these templates and use it as a base for your game</p>
          </div>
        </div>

        <div class="row">
          <div class="col-md-4">
            <div class="card">
              <img src="/img/shuffled-thumbnail.png" alt="a thumbnail of the shuffled format" class="card-img-top">
              <div class="card-body">
                <h3 class="card-title">Shuffled</h3>
                <a href="/Shuffled/1N5eeyKTVWo5QeGcUV_zYtwtR0DikJCcvcj6w69UkC1w" class="btn btn-block">View demo</a>
              </div>
            </div>
          </div>
          <div class="col-md-4">
            <div class="card">
              <img src="/img/generator-thumbnail.png" alt="a thumbnail of the generator format" class="card-img-top">
              <div class="card-body">
                <h3 class="card-title">Generator</h3>
                <a href="/Generator/1F0g3rVHxRA7O0rRMIQSsLCepJStxBO6pa7QJUNJb3K0/" class="btn btn-block">View demo</a>
              </div>
            </div>
          </div>
          <div class="col-md-4">
            <div class="card">
              <img src="/img/hexflower-thumbnail.png" alt="a thumbnail of the hexflower format" class="card-img-top">
              <div class="card-body">
                <h3 class="card-title">Hexflower</h3>
                <a href="/Hexflower/1wLDboZZBfBwMKswMYcRIXxz6DxRZJyAa6KPW6TvR-dM/" class="btn btn-block">View demo</a>
              </div>
            </div>
          </div>
        </div>

        <div class="row mt-3">
          <div class="col-sm">
            <a href="https://docs.storysynth.org/guide/design.html" class="btn mb-5 py-3 px-4 btn-lg">More templates</a>
            <a href="https://docs.storysynth.org/guide/" class="btn ml-2 mb-5 py-3 px-4 btn-lg">Learn how to make your first game</a>
          </div>
        </div>

      </div>

      <!-- Section: test -->
      <div class="homepage-test margin-between-sections">
        <div class="row">
          <div class="col-12">
            <h2 class='mb-3'>Get a playable link</h2>
          </div>  
        </div>
        <div class="row">
          <div class="col-12">
            <p>Upload your game to Storysynth at a secret but shareable link.</p>
          </div>
          <app-gameMaker v-if="!launcherOnHomepage"
          :routeRoomID="$route.params.roomID"
          :routeGSheetID="$route.params.gSheetID"
          :routeGameType="$route.params.gameType"
        ></app-gameMaker>
        </div>
      
      </div>

      <!-- Section: publish -->
      <div class="homepage-publish margin-between-sections">
        <div class="row">
          <div class="col-12">
            <h2 class="mb-3">Publish your game</h2>
          </div>  
        </div>
        <div class="row">
          <div class="col-12">
            <p>When you’re ready, fill out <a href="https://forms.gle/CizjsyFsR6sVCYEX7">this form</a> to add your game to the gallery!</p>
          </div>
          <a href="/Gallery/">
            <img class="img img-fluid rounded-m clipped" src="/img/story-synth-gallery-banner.png" alt="Collage of Story Synth Games">
          </a>
        </div>
      
      </div>

      
    </div>

    <app-gameLauncherSingleGame v-if="launcherOnHomepage" :gameRoute="String(launcherOnHomepage)"></app-gameLauncherSingleGame>
  
    <div class="homepage-made-by">
      Story Synth is made and by <a href="https://randylubin.com">Randy Lubin</a> with the help of an awesome community!
    </div>

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
    body.classList.add("style-template-homepage");

    document.dispatchEvent(new Event("x-app-rendered"));
  }
};
</script>

<style scoped>
.homepage {
  max-width: 800px;
  margin: auto;
}

li {
  list-style-type: disc;
  display: list-item;
  margin-left: 20px;
}
</style>