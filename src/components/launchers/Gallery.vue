<template>
  <div class="container">
    <div class="row my-5 pt-5">
      <div class="col-sm text-center">
        <h1>Games Gallery</h1>
      </div>
    </div>

    <div class="row">
      <div
        class="col-lg-12 col-md-4"
        v-for="(game, key) in gameList"
        v-bind:key="key"
      >
        <div class="card mb-2">
          <div class="row no-gutters">
            <div class="col-lg-3">
              <img
                class="card-img"
                v-bind:src="game.image"
                v-bind:alt="game.title + ' logo'"
              />
            </div>
            <div class="col-lg-9">
              <div class="card-body">
                <h5 class="card-title">{{ game.title }}</h5>
                <h6 class="card-subtitle text-muted mb-2">
                  {{ game.credits }}
                </h6>
                <div class="card-text">{{ game.blurb }}</div>
                <b-button v-bind:href="game.link" variant="dark" class="mt-2"
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
          image: "https://diegeticgames.com/uploads/clash-at-ikara-square.png",
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
          title: "Reunion",
          credits: "TK",
          blurb: "TK",
          link: "TK",
          image:
            "https://img.itch.zone/aW1nLzQyNTgyNDYucG5n/315x250%23c/Gqv8x9.png",
        },
        {
          title: "Working For The Corp",
          credits: "TK",
          blurb: "TK",
          link: "TK",
          image:
            "https://img.itch.zone/aW1nLzI2OTgyODAuanBn/315x250%23cb/x2jDQ9.jpg",
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
};
</script>

<style scoped></style>
