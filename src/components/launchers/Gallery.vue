<template>
  <div class="container">
    <div class="row my-4 pt-5">
      <div class="col-sm text-center">
        <h1 class="mb-3">Games Gallery</h1>
        <p>Check out these great games playable on Story Synth!</p>
        <p>Want your game added to the gallery? Email <a href="mailto:gallery@storysynth.org">gallery@storysynth.org</a></p>
      </div>
    </div>

    <div class="row">
      <div
        class="col-xl-8 offset-xl-2 offset-lg-0 col-lg-12 col-md-4 mb-1"
        v-for="(game, key) in gameList"
        v-bind:key="key"
      >
        <div class="card mb-2">
          <div class="row no-gutters">
            <div class="col-lg-4">
              <a v-bind:href="game.link">
                <img
                  class="card-img"
                  v-bind:src="game.image"
                  v-bind:alt="game.title + ' logo'"
                />
              </a>
            </div>
            <div class="col-lg-8">
              <div class="card-body d-flex flex-column h-100">
                <h5 class="card-title">{{ game.title }}</h5>
                <h6 class="card-subtitle text-muted mb-2">
                  {{ game.credits }}
                </h6>
                <div class="card-text">{{ game.blurb }}</div>
                <b-button v-bind:href="game.link" variant="dark" class="mt-auto align-self-end stretched-link"
                  >Play</b-button
                >
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "app-gallery",
  data: function() {
    return {
      gameList: [
        {
          title: "Around the Realm",
          credits: "By Randy Lubin",
          blurb:
            "Tell the story of two companions racing around a fantasy world in order to win a wager.",
          link: "https://storysynth.org/Games/Around-The-Realm",
          image:
            "https://img.itch.zone/aW1nLzQ4MzI3NjAucG5n/315x250%23cb/Kb6Vr8.png",
        },
        {
          title: "Clash at Ikara",
          credits: "By Randy Lubin",
          blurb:
            "Tell the story of a group of heroes trying to protect a village from a bandit attack.",
          link: "https://storysynth.org/Games/Clash-At-Ikara",
          image: "https://img.itch.zone/aW1nLzUxOTM4NzMucG5n/original/Pbl0xw.png",
        },
        {
          title: "Dawn of the Monster Invasion",
          credits: "By Randy Lubin",
          blurb: "Create a monster movie spoof through six speeches.",
          link: "https://monster.diegeticgames.com",
          image:
            "https://img.itch.zone/aW1nLzQyNTgyNDYucG5n/315x250%23c/Gqv8x9.png",
        },
        {
          title: "Raised By Mechs",
          credits: "By Raph D'Amico",
          blurb: "Tell the story of a group of children raised by their mech mother.",
          link: "https://storysynth.org/Shuffled/1rJ3L8E_sBEqiRO8ADQeSAS2UmcK9Xzk0g_F0d_XkkRc/",
          image:
            "https://iili.io/f1F7F1.png",
        },
        {
          title: "Reunion",
          credits: "By Yoshi Creelman, Jenn Martin, Andy Munich",
          blurb: "Tell the story of a group coming back together after a long time apart.",
          link: "https://storysynth.org/Shuffled/1rJ3L8E_sBEqiRO8ADQeSAS2UmcK9Xzk0g_F0d_XkkRc/",
          image:
            "https://iili.io/f0DqMb.md.png",
        },
        {
          title: "Working For The Corp",
          credits: "By Ken Davidson, with contributions from Jess Meir",
          blurb: 'Play as cyberpunk megacorp who are tasked with defending sensitive information from runners.  Will you defend The Corp?',
          link: "https://storysynth.org/Shuffled/16jKRcMytaNLTdqHGWE00dFVaaihzD38ga1hTm1wr-iA",
          image:
            "https://iili.io/f1Kl07.md.png",
        },
        /*{
          title: 'TK',
          credits: 'TK',
          blurb: 'TK',
          link: 'TK',
          image: 'TK'
        },
        {
          title: 'TK',
          credits: 'TK',
          blurb: 'TK',
          link: 'TK',
          image: 'TK'
        },
        {
          title: 'TK',
          credits: 'TK',
          blurb: 'TK',
          link: 'TK',
          image: 'TK'
        },*/
      ],
    };
  },
  meta: [
        {
          property: "description",
          content: "Check out the top games you can play with Story Synth",
          vmid: "description",
        },
        {
          property: "og:title",
          content: "Story Synth Gallery",
          vmid: "og:title",
        },
        {
          property: "og:description",
          content: "Check out the top games you can play with Story Synth",
          vmid: "og:description",
        },
        /*
          property: "og:image",
          content: this.customOptions.ogImageSquare,
          vmid: "og:image",
        },
        {
          property: "og:url",
          content: "https://storysynth.org/#" + this.$route.fullPath,
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
        },*/
      ],
      mounted(){
        document.dispatchEvent(new Event("x-app-rendered"));
        if (location.hostname.toString() !== 'localhost'){
            this.$mixpanel.track('Visited Gallery');
          }
      },
};
</script>

<style scoped></style>
