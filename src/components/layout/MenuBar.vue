<template>
  <!-- Menu Bar -->
  <div class="menu-bar mb-4 d-flex align-items-center">
    <button id="menu-bar-button" key="menuModalButton" class="btn btn-outline-dark mr-auto border-0" data-bs-toggle="modal" href="#menuModal"
      v-bind:style="{ color: customOptions.menuColor }">
      <iBiList /> Menu
    </button>
    <!-- <div v-if="customOptions.gameTitle" class="mx-auto align-middle text-center">{{customOptions.gameTitle}}</div> -->
    <app-roomLink class="d-none d-sm-block" :monetizedByUser="monetizedByUser"
      @roomMonetized="$emit('roomMonetized', true)" :routeRoomID="$route.params.roomID" :color="customOptions.menuColor"
      v-if="dataReady && firebaseReady"></app-roomLink>

    <div class="modal" id="menuModal" key="menuModal" tabindex="-1"  aria-labelledby="exampleModalLabel" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="exampleModalLabel">{{ customOptions.gameTitle ? customOptions.gameTitle : 'Menu' }}</h5>
            <button key="closeMenuModalX" type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <div class="row menu-row">
              <button class="border-0 btn btn-lg btn-secondary btn-block" v-on:click="copyLinkToClipboard();" data-bs-dismiss="modal">
                <iBiLink45deg /> Copy URL
              </button>
            </div>
            <div class="row menu-row" v-if="roomInfo">
              <app-downloadExtensionData :extensionData="roomInfo.extensionData" :gameTitle="customOptions.gameTitle"
                v-if="(tempExtensionData['journalEntries'] || tempExtensionData['multiEditableLists'] || tempExtensionData['editableList'] || tempExtensionData['plusMinus'])">
              </app-downloadExtensionData>
            </div>
            <slot></slot>

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
              <div v-for="modalNumber in modalNumberList" v-bind:key="modalNumber" class="row menu-row">
                <button v-bind:data-bs-target="'#modal' + modalNumber" data-bs-toggle="modal" data-bs-dismiss="modal"
                  class="btn btn-outline-dark btn-block btn-lg my-1" v-if="customOptions['modal' + modalNumber + 'Label']">
                  {{ customOptions['modal' + modalNumber + 'Label'] }}
                </button>
              </div>
            </div>
            <div class="row menu-row mt-4">
              <a href="https://storysynth.org" target="_blank">Powered by Story Synth</a>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- content modals -->
    <div v-for="modalNumber in modalNumberList" v-bind:key="'contentModal'+modalNumber" class="modal fade"
      v-bind:title="customOptions['modal' + modalNumber + 'Label']" v-bind:id="'modal' + modalNumber" tabindex="-1" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <div class="modal-title">
              <button type="button" key="closeMenuModal" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
          </div>
          <div class="modal-body">
            <div class="d-block text-left" v-dompurify-html="customOptions['modal' + modalNumber + 'Text']"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { defineAsyncComponent } from 'vue';
import { Collapse } from 'bootstrap';

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
    'app-downloadExtensionData': defineAsyncComponent(() => import("../extensions/DownloadExtensionData.vue")),
    'app-roomLink': defineAsyncComponent(() => import('../layout/RoomLink.vue')),
    "app-interrupts": defineAsyncComponent(() => import("../extensions/Interrupts.vue")),
  },
  methods: {
    // closeMenu() {
    //   var menuModal = new this.$modal(document.getElementById('menuModal'))
    //   menuModal.hide("menuModal")
    // },
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
      
      // var menuModal = new this.$modal(document.getElementById('menuModal'))
      // menuModal.hide("menuModal")
    },
  },
};
</script>

<style scoped>

</style>