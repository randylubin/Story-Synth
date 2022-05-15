<template>
  <div class="mb-4 embed-website" :class="{'iframe-expanded': expand}">
      <div class="card embed-website-message" v-if="!selectedWebsiteURL">
        <div class="card-body">
          <div v-dompurify-html="markdownParsedStaticContent"></div>
          <b-form-input
            v-model="newURL"
            class="form-control"
            placeholder="Paste a shared link here"
            title="Paste an embeddable link here"
          />
          <b-button :disabled="!newURL" class="btn btn-outline-dark m-3" v-on:click="submitURL()">Embed URL</b-button>
        </div>

      </div>
      <div class="card embed-website-by-url" v-if="selectedWebsiteURL">
        <div class="row justify-content-between d-flex align-items-center">
          <!-- <div class="col-sm text-left m-1 ml-3">Embedded Site</div> -->
          <div class="col-sm iframe-menu text-right">
            <button class="btn btn-sm btn-outline-dark m-1 px-1 border-0" size="sm" v-if="!expand" v-on:click="toggleExpansion()">
              <b-icon-arrows-expand rotate="90"></b-icon-arrows-expand>
            </button>
            <button class="btn btn-sm btn-outline-dark m-1 px-1 border-0" v-else v-on:click="toggleExpansion()">
              <b-icon-arrows-collapse rotate="90"></b-icon-arrows-collapse>
            </button>
            <button class="btn btn-sm btn-outline-dark m-1 px-1 border-0" v-if="!hardcodedWebsiteURL" v-on:click="clearEmbed()">
              <b-icon-trash></b-icon-trash>
            </button>  
          </div>
        </div>
        <div class="row">
          <div class="col-sm">
            <iframe width="100%" height="1500" :src="selectedWebsiteURL" allow="fullscreen" fetchpriority="low" title="Embedded Doc"></iframe>
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
      this.$emit('process-extension-update', ['selectedWebsiteURL', this.newURL])
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