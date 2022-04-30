<template>
  <div class="container">
    <div class="row padding-after-navbar">
      <div class="col text-left">
        <h2 class="mb-3">Microgrant Program</h2>
        <div class="card shadow">
          <a href="https://www.bigbadcon.com/story-synth-microgrants/">
            <img class="img img-fluid" src="/img/microgrant-banner.png" alt="microgrant banner - click it to learn more and apply">
          </a>
        </div>
        <p>We're thrilled to announce that you can now apply for a grant to build a Story Synth game. The grant program is run by Big Bad Con and funded by Grant for the Web. Learn more on <a href="https://www.bigbadcon.com/story-synth-microgrants/">Big Bad Con's site</a>.</p>
      </div>
    </div>

    <div class="row">
      <div class="col">
        <div class="card card-body shadow">
          <h3>Program Details</h3>
          <div>
            <p>The microgrants are for designers from marginalized backgrounds to create new games on Story Synth that take advantage of web monetization.</p>

            <p>The microgrants come with the following:</p>
            <ul>              
              <li>$300 to each grant recipient (up to 100 recipients) to create a game in a 6 month window</li>
              <li>Administrative support from the Big Bad Con grants administrators</li>
              <li>Story Synth technical and design support from Randy Lubin</li>
              <li>Designers retain full ownership / rights to their games</li>
            </ul>
            <p>The microgrant program is being run by the wonderful folks at Big Bad Con. Learn more about the application process and apply on <a href="https://www.bigbadcon.com/story-synth-microgrants/">Big Bad Con's site</a>.</p>
          </div>
        </div>
      </div>
    </div>

    <div class="row">
      <div class="col">
        <div class="card card-body shadow">
          <h3>More About Web Monetization</h3>

          <p>The funds for this program are provided by <a href="https://www.grantfortheweb.org/">Grant for the Web</a>, a non-profit seeking to boost open, fair, and inclusive standards and innovation in web monetization; enabling new ways for content creators to earn incomes online.</p>

          <p>The <a href="https://webmonetization.org/">Web Monetization standard</a> allows sites to know if a site visitor is sending a stream of micropayments and, if so, the site can then enable content or functionality for that user. An early example of this is <a href="https://coil.com/">Coil</a>, a browser extension where a user can subscribe for $5.00 per month and that money is shared among the sites that the user visits, based on time spent.</p>

          <p>In addition to the $300 grant award, recipients will also receive micropayments from players playing the game. They might start as just pennies here and there, but as more people play they will begin to add up.</p>

          <p>Story Synth currently has a basic implementation of web monetization via the monetization <a href="https://docs.storysynth.org/guide/options.html">custom option</a>. Over the next few months, we'll be adding new monetization related functionality to Story Synth, including the ability to restrict some or all of your game to groups of players using web monetization. Stay tuned for more details!</p>
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
              content: "https://www.bigbadcon.com/story-synth-microgrants/",
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
              content: "a banner announcing the big bad con story synth microprogram",
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
