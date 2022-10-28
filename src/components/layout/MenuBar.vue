<template>
  <!-- Menu Bar -->
  <div class="menu-bar mb-4 d-flex align-items-center">
    <button class="btn btn-outline-dark mr-auto border-0" v-b-modal.menuModal
      v-bind:style="{ color: customOptions.menuColor }">
      <b-icon-list></b-icon-list> Menu
    </button>
    <!-- <div v-if="customOptions.gameTitle" class="mx-auto align-middle text-center">{{customOptions.gameTitle}}</div> -->
    <app-roomLink class="d-none d-sm-block" :monetizedByUser="monetizedByUser"
      @roomMonetized="$emit('roomMonetized', true)" :routeRoomID="$route.params.roomID" :color="customOptions.menuColor"
      v-if="dataReady && firebaseReady"></app-roomLink>

    <b-modal id="menuModal" :title="customOptions.gameTitle ? customOptions.gameTitle : 'Menu'" hide-footer>
      <b-container>
        <div class="row menu-row">
          <b-button class="border-0 btn-lg btn-block" v-on:click="copyLinkToClipboard(); closeMenu();"
            @click="$bvToast.show('copyToast')">
            <b-icon-link45deg></b-icon-link45deg> Copy URL
          </b-button>
        </div>
        <div class="row menu-row" v-if="roomInfo">
          <app-downloadExtensionData :extensionData="roomInfo.extensionData" :gameTitle="customOptions.gameTitle"
            v-if="(tempExtensionData['journalEntries'] || tempExtensionData['multiEditableLists'] || tempExtensionData['editableList'] || tempExtensionData['plusMinus'])">
          </app-downloadExtensionData>
        </div>
        <slot></slot>
      </b-container>
      <!-- <app-menuModal :customOptions="customOptions" :location="'menu'"></app-menuModal> -->
      <div v-if="roomInfo.extensionData && roomInfo.extensionData.interruptsInMenu">
        <hr class='mb-4' />
        <app-interrupts class="extension" :extensionList="this.tempExtensionData"
          :currentInterrupt="roomInfo.extensionData.currentInterrupt" :menuLocation="true"
          @process-extension-update="processExtensionUpdate($event)" v-if="
            tempExtensionData['interrupts'] &&
            (!tempExtensionData.interruptsFirstVisible ||
              tempExtensionData.interruptsFirstVisible <=
                roomInfo.currentCardIndex) &&
            (!tempExtensionData.interruptsLastVisible ||
              tempExtensionData.interruptsLastVisible >
                roomInfo.currentCardIndex)
          "></app-interrupts>
      </div>
      <div class=""
        v-if="(customOptions.modalOneLabel || customOptions.modalTwoLabel || customOptions.modalThreeLabel || customOptions.modalFourLabel || customOptions.modalFiveLabel)">
        <hr class='mb-4' />
        <div v-for="modalNumber in modalNumberList" v-bind:key="modalNumber">
          <b-button v-b-modal="'modal' + modalNumber" v-on:click="closeMenu();" variant="outline-dark"
            class="btn-block btn-lg my-1" v-if="customOptions['modal' + modalNumber + 'Label']">
            {{ customOptions['modal' + modalNumber + 'Label'] }}
          </b-button>
        </div>
      </div>
      <div class="row menu-row mt-4">
        <a href="https://storysynth.org" target="_blank">Powered by Story Synth</a>
      </div>
    </b-modal>

    <!-- content modals -->
    <b-modal v-for="modalNumber in modalNumberList" v-bind:key="modalNumber"
      v-bind:title="customOptions['modal' + modalNumber + 'Label']" v-bind:id="'modal' + modalNumber" hide-footer>
      <div class="d-block text-left" v-dompurify-html="customOptions['modal' + modalNumber + 'Text']"></div>
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
  data: function () {
    return {
      modalNumberList: [
        'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen', 'Twenty'
      ]
    };
  },
  components: {
    'app-downloadExtensionData': () => import("../extensions/DownloadExtensionData.vue"),
    'app-roomLink': () => import('../layout/RoomLink.vue'),
    "app-interrupts": () => import("../extensions/Interrupts.vue"),
  },
  methods: {
    closeMenu() {
      this.$bvModal.hide("menuModal");
    },
    copyLinkToClipboard() {
      let currentUrl = location.hostname.toString() + this.$route.fullPath
      navigator.clipboard.writeText(currentUrl).then(function () {
        console.log('copied url')
      }, function () {
        console.log('copy failed')
      });
    },
    processExtensionUpdate(newData) {
      console.log("processing extension update", newData);

      this.$set(this.roomInfo.extensionData, newData[0], newData[1]);
      this.$emit("sync-extension", this.roomInfo.extensionData);
      this.$bvModal.hide("menuModal");
    },
  },
};
</script>

<style scoped>

</style>