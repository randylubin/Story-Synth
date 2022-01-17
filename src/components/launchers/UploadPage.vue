<template>
  <div class="upload-page">
    <div class="container padding-after-navbar">
      <div class="row mb-4">
        <div class="col-12">
          <h1>Story Synth Game Maker</h1>
          <div class="my-4">
            <p>Pick your game's format and then paste in your Google Sheet link to create your game. If you're looking for inspiration, check out the <a href="/Formats">Formats Page</a> or the <a href="https://docs.storysynth.org/guide/design.html#_1-copy-the-template-spreadsheet">Guide</a>.</p>
          </div>
          <app-gameMaker  pp-gameMaker :routeRoomID="$route.params.roomID" :routeGSheetID="$route.params.gSheetID" :routeGameType="$route.params.gameType"></app-gameMaker>
        </div>
      </div>
    </div> 
  </div>
</template>

<script>
import GameMaker from "./GameMaker.vue";

export default {
  name: "app-uploadPage",
  props: {
    routeGameType: String,
    routeGSheetID: String,
    routeRoomID: String,
  },
  components: {
    "app-gameMaker": GameMaker,
  },
  metaInfo () {
    return {
      title: "Gallery of Story Synth Games",
      meta: [
            {
              property: "description",
              content: "Upload your game to Story Synth",
              vmid: "description",
            },
            {
              property: "og:title",
              content: "Story Synth Game Upload Page",
              vmid: "og:title",
            },
            {
              property: "og:description",
              content: "Upload your game to Story Synth",
              vmid: "og:description",
            },
            {
              property: "og:image",
              content: "https://storysynth.org/img/story-synth-square-logo.gif",
              vmid: "og:image",
            },
            {
              property: "og:url",
              content: "https://storysynth.org/" + this.$route.fullPath,
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
              content: "The Story Synth logo",
              vmid: "twitter:image:alt",
            },
          ],
    }
  },
  mounted(){
      let body = document.getElementById("app"); // document.body;
      body.classList.remove(body.classList[0]);
      body.classList.add("style-template-homepage");

      document.dispatchEvent(new Event("x-app-rendered"));
      if (location.hostname.toString() !== 'localhost'){
          this.$mixpanel.track('Visited Uploader');
        }
    },
};
</script>

<style>
.upload-page {
  max-width: 800px;
  min-height: 100vh;
  margin: auto;
}

</style>