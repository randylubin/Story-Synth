<template>
  <div class="mb-4 embed-website" :class="{'iframe-expanded': expand}">
      <div class="card embed-website-message" v-if="!selectedWebsiteURL">
        <div class="card-body">
          <div v-dompurify-html="markdownParsedStaticContent"></div>
          <b-form-input
            v-model="newURL"
            class="form-control"
            placeholder="Paste a link here to embed it in the page"
            title="Paste an embeddable link here"
            size="lg" 
          />
          <b-button :disabled="!newURL" v-on:click="submitURL()">Embed URL</b-button>
        </div>

      </div>
      <div class="card embed-website-by-url" v-if="selectedWebsiteURL">
        <div class="row">
          <div class="col-sm iframe-menu text-right">
            <b-button size="sm" pill variant="outline-secondary" class="m-1" v-if="!expand" v-on:click="toggleExpansion()">
              <b-icon-arrows-angle-expand></b-icon-arrows-angle-expand>
            </b-button>
            <b-button v-else size="sm" pill variant="outline-secondary" class="m-1" v-on:click="toggleExpansion()">
              <b-icon-arrows-angle-contract></b-icon-arrows-angle-contract>
            </b-button>
            <b-button v-if="!hardcodedWebsiteURL" size="sm" pill variant="outline-secondary" class="m-1" v-on:click="clearEmbed()">
              X
            </b-button>  
          </div>
        </div>
        <div class="row">
          <div class="col-sm">
            <iframe width="100%" height="1500" :src="selectedWebsiteURL" allow="fullscreen" title="Embedded Doc"></iframe>
          </div>
        </div>
      </div>
  </div>
</template>

<script>
export default {
  name: 'app-embed-website',
  props: {
    embedWebsiteMessage: String,
    selectedWebsiteURL: String,
    hardcodedWebsiteURL: String,
  },
  data: function() {
    return {
      expand: false,
      newURL: null,
      error: null
    };
  },
  computed: {
    markdownParsedStaticContent: function(){
      return this.$marked(this.embedWebsiteMessage)
    }
  },
  mounted(){
    if (this.hardcodedWebsiteURL) {
      this.$emit('process-extension-update', ['selectedWebsiteURL',this.hardcodedWebsiteURL])
    } else if (this.selectedWebsiteURL) {
      this.$emit('process-extension-update', ['selectedWebsiteURL',this.selectedWebsiteURL])
    }
  },
  methods: {
    clearEmbed(){
      this.newURL = null;
      this.$emit('process-extension-update', ['selectedWebsiteURL', null]);
    },
    submitURL(){
      this.$emit('process-extension-update', ['selectedWebsiteURL',this.newURL])
    },
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