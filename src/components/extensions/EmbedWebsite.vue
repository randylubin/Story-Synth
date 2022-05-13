<template>
  <div class="mb-4 embed-website" :class="{'iframe-expanded': expand}">
      <div class="card">
        <div class="row">
          <div class="col-sm iframe-menu text-right">
            <b-button size="sm" pill variant="outline-secondary" class="m-1" v-if="!expand" v-on:click="toggleExpansion()">
              <b-icon-arrows-angle-expand></b-icon-arrows-angle-expand>
            </b-button>
            <b-button v-else size="sm" pill variant="outline-secondary" class="m-1" v-on:click="toggleExpansion()">
              <b-icon-arrows-angle-contract></b-icon-arrows-angle-contract>
            </b-button>  
          </div>
        </div>
        <div class="row">
          <div class="col-sm">
            <iframe width="100%" height="1500" :src="embedWebsiteURL" allow="fullscreen" title="Embedded Doc"></iframe>
          </div>
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
.iframe-expanded {
  position: relative;
  width: 100vw;
  left: calc(-1 * (100vw - 100%) / 2);
}

.iframe-menu {
  margin-bottom: 0;
}

</style>