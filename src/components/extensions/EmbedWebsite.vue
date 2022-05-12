<template>
  <div class="mb-4 embed-website" :class="{expand: expand}">
      <div class="row">
        <div class="col-sm embed-menu">
          <b-alert show variant="dark" class="iframe-menu">
            <b-button v-on:click="toggleExpansion()">
              Expand
            </b-button>  
          </b-alert>
        </div>
      </div>
      <div class="row">
        <div class="col-sm">
          <iframe width="100%" height="1500" :src="embedWebsiteURL"></iframe>
        </div>
      </div>
  </div>
</template>

<script>
export default {
  name: 'app-embed-website',
  props: {
    embedWebsiteURL: String,
  },
  data: function() {
    return {
      expand: false,
      error: null
    };
  },
  mounted(){

  },
  methods: {
    toggleExpansion(){
      this.expand = !this.expand
    }
  }
};
</script>

<style scoped>
.iframe-menu {
  margin: 0;
}
.expand {
  width: 100vw;
}

</style>