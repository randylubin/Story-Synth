<template>
  <div class="container">
    <div class="row padding-after-navbar">
      <div class="col text-left">
        <h1 class="mb-3">Microgrant Program</h1>
        <div class="card card-body shadow">
          <p>Story Synth offers many ways for you to customize your design:</p>
          <ul>
            <li>Formats: several distinct game structures for different types of play</li>
            <li>Extensions: additional functionality to support your game</li>
            <li>Custom Options: ways to tweak the formats to suit your vision</li>
          </ul>
          <p>For detailed information on all of the above, visit the <a href="https://docs.storysynth.org/guide/formats.html" target="_blank">Story Synth Documentation</a>. If you have a request for a new format, extension, or custom option, send an email to <a href="mailto:suggestions@storysynth.org">suggestions@storysynth.org</a>.</p>
        </div>
      </div>
    </div>

    <div class="row">
      <div class="col">
        <h2>About the Microgrants</h2>
      </div>
    </div>

    <div class="row">
      <div class="col">
        <div class="card card-body shadow">
          <h3>Shuffled</h3>
          <img src="/img/ikara-thumbnail.png" class="rounded mx-auto d-block format-thumbnail" alt="thumbnail of the shuffled format">
          <div>
            <p class="format-line">In this format, players draw a series of card prompts from one or more decks. The order of cards for the first deck is always the same, which makes it a fit for instructions. Subsequent decks are randomized within each deck (e.g. you'll randomly draw through all of deck B before moving to deck C).</p>
            <p class="format-line">Inspired by <a href="https://www.evilhat.com/home/for-the-queen/">For the Queen</a> and <a href="https://buriedwithoutceremony.com/the-quiet-year">The Quiet Year</a>.</p>
            <p class="format-line">Templates: <a href="https://docs.google.com/spreadsheets/d/1N5eeyKTVWo5QeGcUV_zYtwtR0DikJCcvcj6w69UkC1w/edit?usp=sharing">Simple Deck</a>, <a href="https://docs.google.com/spreadsheets/d/1N2N8URSswhmxLalPOkzi5d4kdeFiGrsobEmM_ojk0ow/edit?usp=sharing">Multi-deck</a></p>
            <p class="format-line">Example Games: <a href="https://storysynth.org/Games/Clash-At-Ikara/">Clash at Ikara</a> and <a href="https://storysynth.org/Games/Raised-By-Mechs/">Raised by Mechs</a></p>
          </div>
        </div>
      </div>
    </div>

    <div class="row">
      <div class="col">
        <div class="card card-body shadow">
          <h3>Generator</h3>
          <img src="/img/generator-thumbnail.png" class="rounded mx-auto d-block format-thumbnail" alt="thumbnail of the generator format">
          <p>This format shows randomly selected options from different categories over a customized layout of rows and columns. Players can regenerate (i.e. reroll) the entire page of selections or just individual categories.</p>
          <p>Template: <a href="https://docs.google.com/spreadsheets/d/1F0g3rVHxRA7O0rRMIQSsLCepJStxBO6pa7QJUNJb3K0/edit?usp=sharing">Generator Template</a></p>
          <p>Example Games: <a href="https://storysynth.org/Games/Aethelreds-Academy">Aethelred's Academy</a> and <a href="https://storysynth.org/Games/Umberdred-Institute/">Umberdred Institute</a></p> 
        </div>
      </div>
    </div>

    
    
  </div>
</template>

<script>
export default {
  name: "app-grants",
  data: function() {
    return {
      
    };
  },
  metaInfo () {
    return {
      title: "Story Synth Grants",
      meta: [
            {
              property: "description",
              content: "Information about the Story Synth grant program, run by Big Bad Con and funded by Grant for the Web",
              vmid: "description",
            },
            {
              property: "og:title",
              content: "Story Synth Gallery",
              vmid: "og:title",
            },
            {
              property: "og:description",
              content: "Information about the Story Synth grant program, run by Big Bad Con and funded by Grant for the Web",
              vmid: "og:description",
            },
            {
              property: "og:image",
              content: "https://diegeticgames.com/uploads/gallery-collage-unfurl.png",
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
              content: "The logos of several games in the Story Synth Gallery",
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
          this.$mixpanel.track('Visited Grant Overview');
        }
    },
};
</script>

<style scoped>
  .container  {
    max-width: 720px;
  }

  h1, h2 {
    text-align: center;
    margin-top: .8rem;
    margin-bottom: 1rem;
  }

  li {
    list-style-position: inside;
  }

  p, li {
    font-size: 18px;
  }

  .card {
    margin-bottom: 1.5rem;
  }

  .format-thumbnail {
    max-width: 100% !important;
    margin-bottom: 15px;
  }
</style>
