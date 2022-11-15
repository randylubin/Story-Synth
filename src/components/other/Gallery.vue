<template>
  <div class="container">
    <div class="row mb-4 padding-after-navbar">
      <div class="col-sm text-center">
        <h1 class="mb-3">Games Gallery</h1>
        <p>Check out these great games playable on Story Synth!</p>
        <p>Want your game added to the gallery? Fill out the <a href="https://forms.gle/CizjsyFsR6sVCYEX7">submit to
            gallery form</a> to add your game!</p>
      </div>
    </div>

    <div class="row">
      <div class="col-sm">
        <h3 class="mb-3">Featured Games</h3>
      </div>
    </div>

    <div class="row">
      <div class="col-xl-8 offset-xl-2 offset-lg-0 col-lg-12 col-md-4 mb-1 d-flex align-items-stretch"
        v-for="(game, key) in gameList" v-bind:key="key">
        <div class="card featured-game shadow mb-2">
          <div class="row no-gutters">
            <div class="col-lg-4">
              <a v-bind:href="game.link">
                <img class="card-img" v-bind:src="game.image" v-bind:alt="game.title + ' logo'" />
              </a>
            </div>
            <div class="col-lg-8">
              <div class="card-body d-flex flex-column h-100">
                <h5 class="card-title">{{ game.title }}</h5>
                <h6 class="card-subtitle text-muted mb-2">
                  {{ game.credits }}
                </h6>
                <div class="card-text">{{ game.blurb }}</div>
                <a v-bind:href="game.link" class="btn mt-auto align-self-start stretched-link">Play game</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="row">
      <div class="col-sm">
        <h3 class="mb-3 mt-5">Full Gallery</h3>
      </div>
    </div>

    <div class="row">
      <div class="col">
        <div class="card shadow mb-2">
          <iframe class="airtable-embed"
            src="https://airtable.com/embed/shrAbAkmabsF7oxZv?backgroundColor=green&viewControls=on" frameborder="0"
            onmousewheel="" width="100%" height="800" style="background: transparent; border: 1px solid #ccc;"></iframe>
        </div>
      </div>
    </div>

    <div class="row">
      <div class="col-xl-8 offset-xl-2 offset-lg-0 col-lg-12 col-sm-12 mb-1 mt-5">
        <div class="card shadow">
          <div class="card-body text-center">
            <h2>Big Bad Con Presents: Story Synth Microgrants</h2>
            <p>In 2022, Big Bad Con and Story Synth teamed up to give $30,000 in microgrants to designers of
              marginalized identities. Check out the <a href="/Microgrant-Gallery">Microgrant Gallery</a> for a listing
              of their games.</p>
            <!-- <a href="https://itch.io/jam/story-synth-summer-jam/entries">
              <img src="https://diegeticgames.com/uploads/story-synth-summer-jam-2021-gallery.png"
                alt="gallery image of game submissions to the story synth summer jam" class="img-fluid">
            </a> -->
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "app-gallery",
  data: function () {
    return {
      gameList: [
        {
          title: "Around the Realm",
          credits: "By Randy Lubin",
          blurb:
            "Tell the story of two companions racing around a fantasy world in order to win a wager.",
          link: "/Games/Around-The-Realm",
          image:
            "https://img.itch.zone/aW1nLzQ4MzI3NjAucG5n/315x250%23cb/Kb6Vr8.png",
        },
        {
          title: "Fedora Noir",
          credits: "By Caroline Hobbs & Morgan Stinson",
          blurb: "A game about a detective and their hat.",
          link: "https://storysynth.org/Monster/1ARqKs4GQP023DqHBEGFxOu2nwRScCR_FgFPrX67JClk/",
          image: "https://iili.io/jAMajf.png"
        },
        {
          title: "The Nameless Summer",
          credits: "By Rudy Mangual",
          blurb: "Young adults in the late '90s working summer jobs on a resort island stumble upon a creeping horror.",
          link: "https://storysynth.org/Shuffled/1S9KStZ7rFBgcjDyLE6MXj4GQy2_kXXFeMV395Cnnars/",
          image: "https://iili.io/julLpR.png"
        },
        // {
        //   title: "Raised By Mechs",
        //   credits: "By Raph D'Amico",
        //   blurb: "Tell the story of a group of children raised by their mech mother.",
        //   link: "/Games/Raised-By-Mechs/",
        //   image:
        //     "https://iili.io/f1F7F1.png",
        // },
        // {
        //   title: "This Heart Within Me Burns",
        //   credits: "By Sam Dunnewold",
        //   blurb: "Tell the story of adventurers trying to lift a curse that's befallen one of them.",
        //   link: "/Shuffled/1WLy_IM9DehQbrBNjTdL67Bc-ZiW83INcfxlnzpDMqnA/",
        //   image: "https://iili.io/q8gJR4.md.jpg"
        // },
        // {
        //   title: "Clash at Ikara",
        //   credits: "By Randy Lubin",
        //   blurb:
        //     "Tell the story of a group of heroes trying to protect a village from a bandit attack.",
        //   link: "/Games/Clash-At-Ikara",
        //   image: "https://img.itch.zone/aW1nLzUxOTM4NzMucG5n/original/Pbl0xw.png",
        // },
        // {
        //   title: "Reunion",
        //   credits: "By Yoshi Creelman, Jenn Martin, Andy Munich",
        //   blurb: "Tell the story of a group coming back together after a long time apart.",
        //   link: "/Shuffled/1rJ3L8E_sBEqiRO8ADQeSAS2UmcK9Xzk0g_F0d_XkkRc/",
        //   image:
        //     "https://iili.io/fjX1ZQ.md.png",
        // },
        // {
        //   title: "Æthelred's Academy for Aspiring Heroes",
        //   credits: "By Greg Lubin and Randy Lubin",
        //   blurb: "Tell silly stories about how aspiring heroes accept unlikely quests to earn dubious certifications in adventuring skills.",
        //   link: "/Games/Aethelreds-Academy",
        //   image:
        //     "https://diegeticgames.com/uploads/aethelreds-logo.png",
        // },
        // {
        //   title: "Umberdred Institute for Emerging Evildoers",
        //   credits: "By Amble Studio",
        //   blurb: "Tell silly stories about how aspiring villains accept unlikely quests to earn dubious certifications in evildoing skills.",
        //   link: "/Games/Umberdred-Institute/",
        //   image: "https://img.itch.zone/aW1nLzY3NzQzNTIuanBn/315x250%23c/XQicpj.jpg",
        // },
        // {
        //   title: "Compersion",
        //   credits: "By Justin Ford",
        //   blurb: "Explore the excitement and intrigue of a polyamorous romance with the Queen in this GM-less game for 2-6 players.",
        //   link: "/Shuffled/12dLB630MtjpJGDwEEwD0lvOzMUoACfzgqHQLgTLYTGc/",
        //   image: "https://iili.io/RuxtON.png"
        // },
        // {
        //   title: "Dawn of the Monster Invasion",
        //   credits: "By Randy Lubin",
        //   blurb: "Create a monster movie spoof through six speeches.",
        //   link: "https://monster.diegeticgames.com",
        //   image:
        //     "https://diegeticgames.com/uploads/monster-game-cover-v2.png",
        // },        
        // {
        //   title: "Generational: A Story about Stories",
        //   credits: "By ProperNerdy",
        //   blurb: "Generational is an improvisational and collaborative way to tell a story that spans the history of an entire world.",
        //   link: "https://prprnrdy.com/gensynth",
        //   image: "https://img.itch.zone/aW1nLzYxNTIwODMucG5n/347x500/tDio8p.png"
        // },
        // {
        //   title: "For the Badge",
        //   credits: "Steve Dee and Peter Blake",
        //   blurb: "Two cops on a stakeout. A mole in the department. But your partner has your back - or do they? A game for two.",
        //   link: "https://storysynth.org/Shuffled/1fudamUXDbE_OtwWBiEdumhdnNbxDXuuhplx2-GYeWOY/",
        //   image: "https://i.imgur.com/i7SKqNV.jpg"
        // },
        /*{
          title: "TK",
          credits: "TK",
          blurb: "TK",
          link: "TK",
          image: "TK"
        },*/
      ],
    };
  },
  metaInfo() {
    return {
      title: "Gallery of Story Synth Games",
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
  mounted() {
    let body = document.getElementById("app"); // document.body;
    body.classList.remove(body.classList[0]);
    body.classList.add("style-template-homepage");

    document.dispatchEvent(new Event("x-app-rendered"));
    if (location.hostname.toString() !== 'localhost') {
      this.$mixpanel.track('Visited Gallery');
    }
  },
  methods: {
  },
};
</script>

<style scoped>
.featured-game {
  color: black;
}
</style>
