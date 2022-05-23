<template>
  <!-- Menu Bar -->
  <div class="menu-bar mb-4 d-flex align-items-center">
    <button class="btn btn-outline-dark mr-auto border-0" v-b-modal.menuModal v-bind:style="{color: customOptions.menuColor}"><b-icon-list></b-icon-list> Menu</button>
    <!-- <div v-if="customOptions.gameTitle" class="mx-auto align-middle text-center">{{customOptions.gameTitle}}</div> -->
    <app-roomLink class="d-none d-sm-block" :monetizedByUser="monetizedByUser" @roomMonetized="$emit('roomMonetized', true)" :routeRoomID="$route.params.roomID" :color="customOptions.menuColor" v-if="dataReady && firebaseReady"></app-roomLink>
    
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
        <div class="row menu-row">
          <app-downloadExtensionData :extensionData="roomInfo.extensionData" :gameTitle="customOptions.gameTitle" v-if="(tempExtensionData['journalEntries'] || tempExtensionData['multiEditableLists'] || tempExtensionData['editableList'] || tempExtensionData['plusMinus'])"></app-downloadExtensionData>
        </div>
        <slot></slot>
      </b-container>
      <!-- <app-menuModal :customOptions="customOptions" :location="'menu'"></app-menuModal> -->
      <div class="" v-if="(customOptions.modalOneLabel || customOptions.modalTwoLabel || customOptions.modalThreeLabel || customOptions.modalFourLabel || customOptions.modalFiveLabel)">
        <hr class='mb-4'/>
        <b-button
          v-b-modal.modalOne
          v-on:click="closeMenu();"
          variant="outline-dark"
          class="btn-block btn-lg"
          v-if="customOptions.modalOneLabel"
        >
          {{ customOptions.modalOneLabel }}
        </b-button>
        <b-button
          v-b-modal.modalTwo
          v-on:click="closeMenu();"
          variant="outline-dark"
          class="btn-block btn-lg"
          v-if="customOptions.modalTwoLabel"
          >{{ customOptions.modalTwoLabel }}</b-button
        >
        <b-button
          v-b-modal.modalThree
          v-on:click="closeMenu();"
          variant="outline-dark"
          class="btn-block btn-lg"
          v-if="customOptions.modalThreeLabel"
          >{{ customOptions.modalThreeLabel }}</b-button
        >
        <b-button
          v-b-modal.modalFour
          v-on:click="closeMenu();"
          variant="outline-dark"
          class="btn-block btn-lg"
          v-if="customOptions.modalFourLabel"
          >{{ customOptions.modalFourLabel }}</b-button
        >
        <b-button
          v-b-modal.modalFive
          v-on:click="closeMenu();"
          variant="outline-dark"
          class="btn-block btn-lg"
          v-if="customOptions.modalFiveLabel"
          >{{ customOptions.modalFiveLabel }}</b-button
        >
      </div>
      <div class="row menu-row mt-4">
        <a href="https://storysynth.org" target="_blank">Powered by Story Synth</a>
      </div>
    </b-modal>

    <!-- content modals -->
    <b-modal
          id="modalOne"
          v-bind:title="customOptions.modalOneLabel"
          hide-footer
        >
          <div
            class="d-block text-left"
            v-dompurify-html="customOptions.modalOneText"
          ></div>
        </b-modal>

        <b-modal
          id="modalTwo"
          v-bind:title="customOptions.modalTwoLabel"
          hide-footer
        >
          <div
            class="d-block text-left"
            v-dompurify-html="customOptions.modalTwoText"
          ></div>
        </b-modal>

        <b-modal
          id="modalThree"
          v-bind:title="customOptions.modalThreeLabel"
          hide-footer
        >
          <div
            class="d-block text-left"
            v-dompurify-html="customOptions.modalThreeText"
          ></div>
        </b-modal>

        <b-modal
          id="modalFour"
          v-bind:title="customOptions.modalFourLabel"
          hide-footer
        >
          <div
            class="d-block text-left"
            v-dompurify-html="customOptions.modalFourText"
          ></div>
        </b-modal>

        <b-modal
          id="modalFive"
          v-bind:title="customOptions.modalFiveLabel"
          hide-footer
        >
          <div
            class="d-block text-left"
            v-dompurify-html="customOptions.modalFiveText"
          ></div>
        </b-modal>
  </div>
</template>

<script>
export default {
  name: 'app-menuBar',
  props: {
    customOptions: Object,
    roomInfo: Object,
    tempExtensionData: Object,
    routeRoomID: String,
    monetizedByUser: Boolean,
    dataReady: Boolean,
    firebaseReady: Boolean,
  },
  data: function() {
    return {
    };
  },
  components: {
    'app-downloadExtensionData': () => import("../extensions/DownloadExtensionData.vue"),
    'app-roomLink': () => import('../layout/RoomLink.vue'),
  },
  methods: {
    closeMenu(){
      this.$bvModal.hide("menuModal");
    },
    copyLinkToClipboard(){
      let currentUrl = location.hostname.toString() + this.$route.fullPath
      navigator.clipboard.writeText(currentUrl).then(function() {
        console.log('copied url')
      }, function() {
        console.log('copy failed')
      });
    },
  },
};
</script>

<style scoped>


</style>