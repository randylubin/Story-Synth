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

    <b-modal
      v-model="showMenu"
      id="menuModal"
      ref="menuModal"
      :title="customOptions.gameTitle ? customOptions.gameTitle : 'Menu'"
      hide-footer
      no-trap-focus
      :auto-focus="false"
      no-fade
      modal-class="menu-modal"
      @show="onShow"
      @shown="onShown"
      @hide="onHide"
      @hidden="onHidden"
    >
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
        :ref="(el) => setContentModalRef(modalNumber, el)" no-fade modal-class="content-modal">
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
      showMenu: false,
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
      // console.log('[MenuBar] openMenu');
      this.showMenu = true;
      this.$nextTick(() => {
        this.$refs.menuModal?.show?.();
      });
    },
    hideMenu(trigger) {
      // console.log('[MenuBar] hideMenu', trigger);
      this.showMenu = false;
      this.$refs.menuModal?.hide?.(trigger);
    },
    copyLinkToClipboard() {
      let currentUrl = location.hostname.toString() + this.$route.fullPath
      navigator.clipboard.writeText(currentUrl).then(function () {
        console.log('copied url')
      }, function () {
        console.log('copy failed')
      });
      this.hideMenu('copy');
    },
    processExtensionUpdate(newData) {
      console.log("processing extension update", newData);

      this.$set(this.roomInfo.extensionData, newData[0], newData[1]);
      this.$emit("sync-extension", this.roomInfo.extensionData);
      this.hideMenu('process-extension-update');
    },
    openContentModal(modalNumber) {
      this.hideMenu('open-content-modal');
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
    onShow(evt) {
      // console.log('[MenuBar] menuModal show', { trigger: evt?.trigger, showMenu: this.showMenu });
    },
    onShown(evt) {
      // console.log('[MenuBar] menuModal shown', { trigger: evt?.trigger, showMenu: this.showMenu });
    },
    onHide(evt) {
      // console.log('[MenuBar] menuModal hide', { trigger: evt?.trigger, showMenu: this.showMenu });
    },
    onHidden(evt) {
      // console.log('[MenuBar] menuModal hidden', { trigger: evt?.trigger, showMenu: this.showMenu });
      // Ensure flag stays in sync if modal gets closed externally
      if (this.showMenu) {
        this.showMenu = false;
      }
    },
  },
};
</script>

<style scoped>
:deep(.menu-modal.modal) {
  opacity: 1 !important;
  display: block !important;
  z-index: 2000;
}

:deep(.content-modal.modal) {
  opacity: 1 !important;
  display: block !important;
  z-index: 2000;
}

:deep(.menu-modal .modal-backdrop) {
  opacity: 0.5 !important;
}

:deep(.content-modal .modal-backdrop) {
  opacity: 0.5 !important;
}
</style>
