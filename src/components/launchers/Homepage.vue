<template>
  <div class="homepage">
    <div class="container">
      <div v-if="!$route.params.gameType" class="card shadow mb-4" style="margin-top: 76px">
        <div class="card-body">
          <div id="homepage-intro-text" v-if="!$route.params.gSheetID">
            <div class="row mb-4">
              <div class="col-sm text-center">
                <h1>Story Synth</h1>
                <h3>Make, play, and share storytelling games</h3>
              </div>
            </div>

            <div class="row mb-3">
              <div class="col-sm text-left">
                <p>Designing a game in Story Synth is super easy: just add your story prompts to a spreadsheet and then paste the sheet's link below. Story Synth will automatically generate your game and you can play it in the browser.</p>
                
                <p>Story Synth games have a unique session-creation URL, which you can share with others. When you launch a session, everyone in that game will see the same prompts at the same time.</p>
                  
                <p>There are a handful of different formats that you can use for your game and plenty of customization options and extensions you can include. To learn more, watch this <a href="https://www.youtube.com/watch?v=FqfBcB4iZEI">Video Tour</a>, or check out the <a href="https://docs.storysynth.org/guide">About Page</a> or the <a href="https://docs.storysynth.org/guide/formats.html">Formats Page</a>.</p>
              </div>
            </div>
          </div>
        </div>
      </div>  
      
      <div class="card shadow mb-4">
        <div class="card-body">
          <div class="row">
            <div class="col">
              <a href="https://itch.io/jam/story-synth-summer-jam" target="_blank">
                <b-img fluid src="https://diegeticgames.com/uploads/story-synth-summer-jam-website-promo.png" alt="the logo for the Story Synth Summer Jam with a link to the jam"></b-img>
              </a>
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
              
              <p>Check out the <a href="https://storysynth.org/Gallery/">Gallery</a> to find Story Synth games you can play right now.</p>

              <p>Here are demos of the different formats:</p>    
                
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
            </div>
          </div>
        </div>
      </div>
    </div>

      




    
    <app-gameMaker :routeRoomID="$route.params.roomID" :routeGSheetID="$route.params.gSheetID" :routeGameType="$route.params.gameType"></app-gameMaker>
  </div>
</template>

<script>
import GameMaker from './GameMaker.vue'
export default {
  name: 'app-homepage',
  components: {
    'app-gameMaker': GameMaker,
  },
  props: {
    routeGameType: String,
    routeGSheetID: String,
    routeRoomID: String,
  },
}
</script>

<style scoped>
  .homepage {
    max-width:600px;
    margin: auto;
  }

  li {
    list-style-type: disc;
    display: list-item;
    margin-left: 20px;
  }
</style>