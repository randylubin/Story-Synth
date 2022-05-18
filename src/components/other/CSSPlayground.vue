<template>
  <div>
    <div id="css-playground" :class="styleTemplate">
      
      <div v-html="computedStyle"></div>
      <div v-html="editableStyle"></div>
      
      <div class="full-page-background"></div>
        <div class="container game-room padding-after-navbar">

          <!-- Menu Bar -->
          <div class="menu-bar mb-4 d-flex align-items-center">
          <button class="btn btn-outline-dark mr-auto border-0" v-b-modal.menuModal><b-icon-list></b-icon-list> Menu</button>
          <div class="room-link flex-row d-flex">
            <div
              class="pt-2 px-2 game-meta live-player-counter"
            >
              3 <b-icon-people></b-icon-people>
            </div>

          <button
            class="btn btn-outline-dark ml-auto border-0"
            @click="$bvToast.show('copyToast')"
            type="button"
          >
            <b-icon-link45deg></b-icon-link45deg> Copy URL
          </button>

          <b-toast
            variant="success"
            id="copyToast"
            auto-hide-delay="1000"
            no-close-button
          >
            Link copied to clipboard
          </b-toast>
        </div>
          
          <b-modal
            id="menuModal"
            :title="customOptions.gameTitle ? customOptions.gameTitle : 'Menu'" 
            hide-footer
          >  
            <b-container>
              <div class="row menu-row">
                <b-button
                  class="border-0 btn-lg btn-block"
                  v-on:click="copyLinkToClipboard(); closeMenu();"
                  @click="$bvToast.show('copyToast')"
                >
                  <b-icon-link45deg></b-icon-link45deg> Copy URL 
                </b-button>
              </div>
            </b-container>
            
            <div class="row menu-row mt-4">
              <a href="https://storysynth.org" target="_blank">Powered by Story Synth</a>
            </div>
          </b-modal></div>
        </div>
        <div class="container game-room">
          <div class="fab-buttons container" >
            <button
              class="btn btn-outline-dark btn-fab btn-fab-left control-button-previous-card shadow"
              v-b-tooltip.hover title="Previous Card"
              :disabled="
                true
              "
            >
              <!-- Previous Card -->
              <b-icon class="h1 mb-0" icon="chevron-left"></b-icon>
              <b-icon class="h1 mb-0 mr-2" icon="card-heading"></b-icon>
            </button>
            <button
              class="btn btn-outline-dark btn-fab btn-fab-right control-button-next-card shadow"
              v-b-tooltip.hover title="Next Card"
            >
              <!-- Next Card -->
              <b-icon class="h1 mb-0 ml-2" icon="card-heading"></b-icon>
              <b-icon class="h1 mb-0" icon="chevron-right"></b-icon>              
            </button>
          </div>
          <div class="card shadow mb-4">
            <div class="card-body text-center">
              <h1>Story Synth CSS Playground</h1>
              <p>Use this page to experiment with CSS for your game, then copy the style code into your Google Sheet. Check out the <a href="https://docs.storysynth.org/tutorials/styling.html#what-s-css">Story Synth CSS Tutorial</a> to learn more.</p>
            </div>
          </div>  
        </div>
      </div>
      <div class="css-editor container-fluid p-4">
        <div class="row">
          <div class="col-sm">
            <h1>CSS Editor</h1>
            <p>Learn more in the <a href="https://docs.storysynth.org/guide/options.html#visual-style">Visual Style</a> section of the docs or via the Story Synth <a href="https://docs.storysynth.org/tutorials/styling.html">CSS Tutorial</a></p>
            <hr style="border-top: 1px solid rgb(255 255 255 / 54%)">
          </div>
        </div>

        <div class="row">
          <div class="col-sm-3">
            <div class="row">
              <div class="col">
                <h4>Color Pickers</h4>
              </div>
            </div>
            <!-- <div class="row">
              <div class="col-sm-7">
                <p>Style Template:</p>
              </div>

              <div class="col-sm-5">
                <b-form-select
                  v-model="selectedStyleTemplate"
                  class="custom-select"
                  title="Select a style template"
                >
                  <option>none</option>
                  <option>light</option>
                  <option>dark</option>
                  <option>cyberpunk</option>
                  <option>fantasy</option>
                  <option>vaporwave</option>
                </b-form-select>
              </div>
            </div> -->

            <div class="row">
              <div class="col-sm-7">
                <p>Background color:</p>
              </div>
              <div class="col-sm-5">
                <b-form-input v-model="backgroundColor" type="color" id="colorpicker" value="#ffffff"></b-form-input>
              </div> 
            </div>

            <div class="row">
              <div class="col-sm-7">
                <p>Menu color:</p>
              </div>
              <div class="col-sm-5">
                <b-form-input v-model="menuColor" type="color" id="colorpicker" value="#ffffff"></b-form-input>
              </div> 
            </div>

            <div class="row">
              <div class="col-sm-7">
                <p>Card color:</p>
              </div>
              <div class="col-sm-5">
                <b-form-input v-model="cardColor" type="color" id="colorpicker" value="#ffffff"></b-form-input>
              </div> 
            </div>

            <div class="row">
              <div class="col-sm-7">
                <p>Text color:</p>
              </div>
              <div class="col-sm-5">
                <b-form-input v-model="textColor" type="color" id="colorpicker" value="#ffffff"></b-form-input>
              </div> 
            </div>

            <div class="row">
              <div class="col-sm-7">
                <p>Link color:</p>
              </div>
              <div class="col-sm-5">
                <b-form-input v-model="linkColor" type="color" id="colorpicker" value="#ffffff"></b-form-input>
              </div> 
            </div>
          </div>

          <div class="col-sm-4 px-5">
            <div class="row">
              <h4>Resulting CSS</h4>
            </div>
            <div class="row">
              <code class="col-sm computed-css py-3">{{computedStyle}}</code>
            </div>
          </div>
          <div class="col-sm-5">
            <div class="row">
              <h4>Freeform editing</h4>
            </div>
            <div class="row">
              <textarea v-model="editableStyle" id="" cols="30" rows="10"></textarea>
            </div>
          </div>
        </div>
    </div>
  </div>
</template>

<script>

export default {
  name: "app-CSSPlayground",
  props: {
    roomID: String,
    gSheetID: String,
  },
  data: function() {
    return {
      menuColor: null,
      backgroundColor: null,
      cardColor: null,
      textColor: null,
      linkColor: null,
      selectedStyleTemplate: 'none',
      editableStyle: "<style>\n\n</style>",
      roomInfo: {
        currentCardIndex: 0,
        xCardIsActive: false,
        cardSequence: [0, 1, 2],
        locationOfLastCard: 0,
      },
      customOptions: {
        gameTitle: undefined,
        byline: undefined,
        gameBlurb: undefined,
        password: undefined,
        wallet: undefined,
        revShare: 0.2,
        lastCardLabel: "Last Card"
      }
    }
  },
  computed: {
    styleTemplate: function(){
      return 'style-template-' + this.selectedStyleTemplate
    },
    computedStyle: function(){
      let styleBlob = "<style>"

      if (this.backgroundColor){
        styleBlob += ".full-page-background {background:" + this.backgroundColor + " !important;}"
      }

      if (this.menuColor){
        styleBlob += ".menu-bar, .menu-bar .btn {color:" + this.menuColor + " !important;}"
      }

      if (this.cardColor){
        styleBlob += ".card {background:" + this.cardColor + " !important;}"
      }

      if (this.textColor){
        styleBlob += ".card-body {color:" + this.textColor + " !important;}"
      }

      if (this.linkColor){
        styleBlob += ".card-body a {color:" + this.linkColor + " !important;}"
      }

      return styleBlob + "</style>"
    }
  },
  components: {

  },
  metaInfo () {
    return {
      title: "CSS Playground",
      meta: [
            {
              property: "description",
              content: "Explore Styles for Story Synth",
              vmid: "description",
            },
            {
              property: "og:title",
              content: "Story Synth CSS Playground",
              vmid: "og:title",
            },
            {
              property: "og:description",
              content: "Explore Styles for Story Synth",
              vmid: "og:description",
            },
            {
              property: "og:image",
              content: "https://storysynth.org/img/story-synth-square-logo.gif",
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
              content: "The Story Synth logo",
              vmid: "twitter:image:alt",
            },
          ],
    }
  },
  mounted(){
    let body = document.getElementById("app"); // document.body;
    body.classList.remove(body.classList[0]);

    body = document.getElementsByClassName("non-footer-content")[0]
    if (body.classList.length > 0){
      body.classList.remove(body.classList[1])
    }

    document.dispatchEvent(new Event("x-app-rendered"));
    if (location.hostname.toString() !== 'localhost'){
        this.$mixpanel.track('Visited CSS Playground');
    }
  },
  methods: {
  },
};
</script>

<style lang="scss" scoped>
#css-playground {
  margin: auto;
  padding-bottom: 1em;
}

.game-room {
  text-align: center;
  max-width: 600px;
}

@media (max-width: 576px) {
  h1,
  h2 {
    font-size: 1.7em;
  }

  .card-body {
    font-size: 1.2em;
    min-height: 11em;
  }
}

@media (min-width: 576px) {
  .card-body {
    font-size: 1.5em;
    min-height: 11em;
  }
}

.full-page-background {
  position: absolute;
  height: 100%;
  width: 100vw;
  top: 0;
  right: 0;
  margin: 0;
  z-index: -1;
}

.css-editor {
  color: white;
  background: #302c2c;
  height: 500px;

  a {
    color: white;
    text-decoration: underline;
  }
}

.computed-css {
  background: black;
}

</style>