<template>
  <!-- Menu Bar -->
  <div class="menu-bar mb-4 d-flex align-items-center">
    <button id="menu-bar-button" key="menuModalButton" class="btn btn-outline-dark me-auto border-0"
      v-bind:style="{ color: customOptions.menuColor }" @click="openMenu">
      <iBiList /> Menu
    </button>
    <!-- <div v-if="customOptions.gameTitle" class="mx-auto align-middle text-center">{{customOptions.gameTitle}}</div> -->
    <app-roomLink class="d-none d-sm-block" :monetizedByUser="monetizedByUser"
      @roomMonetized="$emit('roomMonetized', true)" :routeRoomID="$route.params.roomID" :color="customOptions.menuColor"
      v-if="dataReady && firebaseReady"></app-roomLink>

    <b-modal id="menuModal" ref="menuModal" :title="customOptions.gameTitle ? customOptions.gameTitle : 'Menu'" hide-footer no-trap-focus :auto-focus="false">
      <div class="row menu-row">
        <button class="border-0 btn btn-lg btn-secondary w-100" v-on:click="copyLinkToClipboard();">
          <iBiLink45deg /> Copy URL
        </button>
      </div>
      <div class="row menu-row" v-if="roomInfo">
        <app-downloadExtensionData :extensionData="roomInfo.extensionData" :gameTitle="customOptions.gameTitle"
          v-if="(tempExtensionData['journalEntries'] || tempExtensionData['multiEditableLists'] || tempExtensionData['editableList'] || tempExtensionData['plusMinus'])">
        </app-downloadExtensionData>
      </div>
      <slot></slot>

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
        <div v-for="modalNumber in modalNumberList" v-bind:key="modalNumber" class="row menu-row">
          <button class="btn btn-outline-dark w-100 btn-lg my-1" v-if="customOptions['modal' + modalNumber + 'Label']" @click="openContentModal(modalNumber)">
            {{ customOptions['modal' + modalNumber + 'Label'] }}
          </button>
        </div>
      </div>
      <div class="row menu-row mt-4">
        <a href="https://storysynth.org" target="_blank">Powered by Story Synth</a>
      </div>
    </b-modal>

    <!-- content modals -->
    <template v-for="modalNumber in modalNumberList" :key="'contentModal'+modalNumber">
      <b-modal v-if="customOptions['modal' + modalNumber + 'Label']"
        :title="customOptions['modal' + modalNumber + 'Label']" :id="'modal' + modalNumber" hide-footer
        :ref="(el) => setContentModalRef(modalNumber, el)">
        <div class="d-block text-start" v-dompurify-html="customOptions['modal' + modalNumber + 'Text']"></div>
      </b-modal>
    </template>
  </div>

</template>

<script>
import { defineAsyncComponent } from 'vue';

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
      ],
      contentModalRefs: {},
    };
  },
  components: {
    'app-downloadExtensionData': defineAsyncComponent(() => import("../extensions/DownloadExtensionData.vue")),
    'app-roomLink': defineAsyncComponent(() => import('../layout/RoomLink.vue')),
    "app-interrupts": defineAsyncComponent(() => import("../extensions/Interrupts.vue")),
  },
  methods: {
    openMenu() {
      this.$refs.menuModal?.show?.();
    },
    hideMenu() {
      this.$refs.menuModal?.hide?.();
    },
    copyLinkToClipboard() {
      let currentUrl = location.hostname.toString() + this.$route.fullPath
      navigator.clipboard.writeText(currentUrl).then(function () {
        console.log('copied url')
      }, function () {
        console.log('copy failed')
      });
      this.$refs.menuModal?.hide?.();
    },
    processExtensionUpdate(newData) {
      console.log("processing extension update", newData);

      this.$set(this.roomInfo.extensionData, newData[0], newData[1]);
      this.$emit("sync-extension", this.roomInfo.extensionData);
      this.$refs.menuModal?.hide?.();
    },
    openContentModal(modalNumber) {
      this.$refs.menuModal?.hide?.();
      this.$nextTick(() => {
        const target = this.contentModalRefs[modalNumber];
        setTimeout(() => target?.show?.(), 0);
      });
    },
    setContentModalRef(modalNumber, el) {
      if (el) {
        this.contentModalRefs[modalNumber] = el;
      } else {
        delete this.contentModalRefs[modalNumber];
      }
    },
  },
};
</script>

<style scoped>

</style>
