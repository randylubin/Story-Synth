<template>
  <div class="container">
    <div class="row mb-4 padding-after-navbar">
    </div>

    <div class="row">
      <div class="col-xl-8 offset-xl-2 offset-lg-0 col-lg-12 col-sm-12 mb-5">
        <div class="card shadow">
          <div class="card-body text-center">
            <h2>Big Bad Con Presents: Story Synth Microgrants</h2>
            <p>In 2022, Big Bad Con and Story Synth teamed up to give $30,000 in microgrants to designers of
              marginalized identities. Check out their games below and play them now. You can learn more about the now
              finished program on our <a href="/Grants">grant page</a>.
            </p>
          </div>
        </div>
      </div>
    </div>

    <div class="row">
      <div class="col">
        <div class="card shadow mb-2">
          <iframe class="airtable-embed"
            src="https://airtable.com/embed/shr2X3faMGSsUXkrj?backgroundColor=green&viewControls=on" frameborder="0"
            onmousewheel="" width="100%" height="800" style="background: transparent; border: 1px solid #ccc;"></iframe>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
export default {
  name: "app-microgrant-gallery",
  data: function () {
    return {
    };
  },
  metaInfo() {
    return {
      title: "Microgrant Games Gallery",
      meta: [
        {
          property: "description",
          content: "Check out the games made by designers from our microgrant program",
          vmid: "description",
        },
        {
          property: "og:title",
          content: "Story Synth Microgrant Games Gallery",
          vmid: "og:title",
        },
        {
          property: "og:description",
          content: "Check out the games made by designers from our microgrant program",
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
  inject: ['mixpanel'],
  mounted() {
    let body = document.getElementById("app"); // document.body;
    body.classList.remove(body.classList[0]);
    body.classList.add("style-template-homepage");

    document.dispatchEvent(new Event("x-app-rendered"));
    if (location.hostname.toString() !== 'localhost') {
      this.mixpanel.track('Visited Grantee Gallery');
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
