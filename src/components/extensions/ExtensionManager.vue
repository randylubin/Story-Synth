<template>
  <div class="extension-manager">
    <div class="row">
      <div class="col-sm">
        <app-game class="extension" :gameAsExtension="Boolean(extensionData.hexflowerAsExtension)" :gSheetID="
          extensionData.hexflowerAsExtension.substring(
            extensionData.hexflowerAsExtension.indexOf('/d/') + 3,
            extensionData.hexflowerAsExtension.indexOf('/edit')
          )
        " :gameType="'Hexflower'" :roomID="$route.params.roomID + '-hexflower-extensions'" v-if="
          Boolean(extensionData.hexflowerAsExtension) &&
          (!extensionList.hexflowerFirstVisible ||
            extensionList.hexflowerFirstVisible <=
              roomInfo.currentCardIndex) &&
          (!extensionList.hexflowerLastVisible ||
            extensionList.hexflowerLastVisible > roomInfo.currentCardIndex) &&
          ((!extensionList.hexflowerAsExtensionLocation &&
            extensionLocation == 'lower') ||
            extensionList.hexflowerAsExtensionLocation == extensionLocation)
        ">
        </app-game>
        <app-game class="extension" :gameAsExtension="Boolean(extensionData.generatorAsExtension)" :gSheetID="
          extensionData.generatorAsExtension.substring(
            extensionData.generatorAsExtension.indexOf('/d/') + 3,
            extensionData.generatorAsExtension.indexOf('/edit')
          )
        " :gameType="'Generator'" :roomID="$route.params.roomID + '-generator-extensions'" v-if="
          Boolean(extensionData.generatorAsExtension) &&
          (!extensionList.generatorFirstVisible ||
            extensionList.generatorFirstVisible <=
              roomInfo.currentCardIndex) &&
          (!extensionList.generatorLastVisible ||
            extensionList.generatorLastVisible > roomInfo.currentCardIndex) &&
          ((!extensionList.generatorAsExtensionLocation &&
            extensionLocation == 'lower') ||
            extensionList.generatorAsExtensionLocation == extensionLocation)
        ">
        </app-game>
        <app-staticBox class="extension" :staticBoxContent="extensionData.staticBoxContent" v-if="
          extensionData.staticBoxContent &&
          (!extensionList.staticBoxContentFirstVisible ||
            extensionList.staticBoxContentFirstVisible <=
              roomInfo.currentCardIndex) &&
          (!extensionList.staticBoxContentLastVisible ||
            extensionList.staticBoxContentLastVisible >
              roomInfo.currentCardIndex) &&
          ((!extensionList.staticBoxLocation &&
            extensionLocation == 'lower') ||
            extensionList.staticBoxLocation == extensionLocation)
        ">
        </app-staticBox>
        <app-playerTurnOrder class="extension" :playerTurnOrder="JSON.parse(extensionData.playerTurnOrder)"
          :playerTurnOrderHeader="extensionData.playerTurnOrderHeader"
          :playerTurnOrderButtonLabel="extensionData.playerTurnOrderButtonLabel" :playerTurnOrderFirstVisible="
            parseInt(extensionData.playerTurnOrderFirstVisible)
          " :currentCardIndex="roomInfo.currentCardIndex" @process-extension-update="processExtensionUpdate($event)"
          v-if="
            extensionList['playerTurnOrder'] &&
            (!extensionList.playerTurnOrderFirstVisible ||
              extensionList.playerTurnOrderFirstVisible <=
                roomInfo.currentCardIndex) &&
            (!extensionList.playerTurnOrderLastVisible ||
              extensionList.playerTurnOrderLastVisible >
                roomInfo.currentCardIndex) &&
            ((!extensionList.playerTurnOrderLocation &&
              extensionLocation == 'lower') ||
              extensionList.playerTurnOrderLocation == extensionLocation)
          ">
        </app-playerTurnOrder>
        <app-imageGallery class="extension" :imageGallery="
        extensionData.imageGallery
          ? extensionData.imageGallery.split(',')
          : null
        " :imageCaptions="
          extensionData.imageGalleryCaptions
            ? extensionData.imageGalleryCaptions.split(',')
            : null
        " :imageAltText="
          extensionData.imageGalleryAltText ? extensionData.imageGalleryAltText.split(',') : null
        " :imageGalleryTitle="extensionData.imageGalleryTitle" :selectedImage="extensionData.selectedImage"
          @process-extension-update="processExtensionUpdate($event)" v-if="
            extensionList['imageGallery'] &&
            (!extensionList.imageGalleryFirstVisible ||
              extensionList.imageGalleryFirstVisible <=
                roomInfo.currentCardIndex) &&
            (!extensionList.imageGalleryLastVisible ||
              extensionList.imageGalleryLastVisible >
                roomInfo.currentCardIndex) &&
            ((!extensionList.imageGalleryLocation &&
              extensionLocation == 'lower') ||
              extensionList.imageGalleryLocation == extensionLocation)
          "></app-imageGallery>
        <app-plusMinus class="extension" :plusMinus="JSON.parse(extensionData.plusMinus)"
          :plusMinusTitle="extensionData.plusMinusTitle" @process-extension-update="processExtensionUpdate($event)"
          v-if="
            extensionList['plusMinus'] &&
            (!extensionList.plusMinusFirstVisible ||
              extensionList.plusMinusFirstVisible <=
                roomInfo.currentCardIndex) &&
            (!extensionList.plusMinusLastVisible ||
              extensionList.plusMinusLastVisible > roomInfo.currentCardIndex) &&
            ((!extensionList.plusMinusLocation &&
              extensionLocation == 'lower') ||
              extensionList.plusMinusLocation == extensionLocation)
          ">
        </app-plusMinus>
        <app-editableList class="extension" :editableList="extensionData.editableList.split(',')"
          :editableListTitle="extensionData.editableListTitle"
          @process-extension-update="processExtensionUpdate($event)" v-if="
            (extensionList['editableList'] ||
              extensionList.editableListFirstVisible ||
              extensionList.editableListTitle) &&
            (!extensionList.editableListFirstVisible ||
              extensionList.editableListFirstVisible <=
                roomInfo.currentCardIndex) &&
            (!extensionList.editableListLastVisible ||
              extensionList.editableListLastVisible >
                roomInfo.currentCardIndex) &&
            ((!extensionList.editableListLocation &&
              extensionLocation == 'lower') ||
              extensionList.editableListLocation == extensionLocation)
          ">
        </app-editableList>
        <app-multiEditableLists class="extension" :multiEditableLists="JSON.parse(extensionData.multiEditableLists)"
          @process-extension-update="processExtensionUpdate($event)" v-if="
            extensionList['multiEditableLists'] &&
            (!extensionList.multiEditableListsFirstVisible ||
              extensionList.multiEditableListsFirstVisible <=
                roomInfo.currentCardIndex) &&
            (!extensionList.multiEditableListsLastVisible ||
              extensionList.multiEditableListsLastVisible >
                roomInfo.currentCardIndex) &&
            ((!extensionList.multiEditableListsLocation &&
              extensionLocation == 'lower') ||
              extensionList.multiEditableListsLocation == extensionLocation)
          ">
        </app-multiEditableLists>
        <app-diceRoller class="extension" :diceResults="extensionData.diceRoller.split(',')"
          :diceRollerTitle="extensionData.diceRollerTitle" @process-extension-update="processExtensionUpdate($event)"
          v-if="
            extensionList['diceRoller'] &&
            (!extensionList.diceRollerFirstVisible ||
              extensionList.diceRollerFirstVisible <=
                roomInfo.currentCardIndex) &&
            (!extensionList.diceRollerLastVisible ||
              extensionList.diceRollerLastVisible >
                roomInfo.currentCardIndex) &&
            ((!extensionList.diceRollerLocation &&
              extensionLocation == 'lower') ||
              extensionList.diceRollerLocation == extensionLocation)
          ">
        </app-diceRoller>
        <app-coinflip class="extension" :flipResult="extensionData.flipResult" :coinflipValues="extensionData.coinflip"
          :coinflipTitle="extensionData.coinflipTitle" :coinflipButtonLabel="extensionData.coinflipButtonLabel"
          @process-extension-update="processExtensionUpdate($event)" v-if="
            extensionList['coinflip'] &&
            ((!extensionList.coinflipLocation &&
              extensionLocation == 'lower') ||
              extensionList.coinflipLocation == extensionLocation) &&
            (!extensionList.coinflipFirstVisible ||
              extensionList.coinflipFirstVisible <=
                roomInfo.currentCardIndex) &&
            (!extensionList.coinflipLastVisible ||
              extensionList.coinflipLastVisible > roomInfo.currentCardIndex)
          ">
        </app-coinflip>
        <app-standardDeck class="extension" :standardDeck="JSON.parse(extensionData.standardDeck)"
          :standardDeckTitle="extensionData.standardDeckTitle"
          @process-extension-update="processExtensionUpdate($event)" v-if="
            extensionList['standardDeck'] &&
            (!extensionList.standardDeckFirstVisible ||
              extensionList.standardDeckFirstVisible <=
                roomInfo.currentCardIndex) &&
            (!extensionList.standardDeckLastVisible ||
              extensionList.standardDeckLastVisible >
                roomInfo.currentCardIndex) &&
            ((!extensionList.standardDeckLocation &&
              extensionLocation == 'lower') ||
              extensionList.standardDeckLocation == extensionLocation)
          ">
        </app-standardDeck>
        <app-journal class="extension" :journalEntries="JSON.parse(extensionData.journalEntries)"
          :journalUpperText="extensionData.journalUpperText" :journalOrder="extensionData.journalOrder"
          @process-extension-update="processExtensionUpdate($event)" v-if="
            (extensionList['journalEntries'] ||
              extensionList.journalUpperText) &&
            ((!extensionList.journalEntiresLocation &&
              extensionLocation == 'lower') ||
              extensionList.journalEntriesLocation == extensionLocation) &&
            (!extensionList.journalFirstVisible ||
              extensionList.journalFirstVisible <= roomInfo.currentCardIndex) &&
            (!extensionList.journalLastVisible ||
              extensionList.journalLastVisible > roomInfo.currentCardIndex)
          ">
        </app-journal>
        <app-currentPlayerHeader class="extension" :playerTurnOrder="JSON.parse(extensionData.playerTurnOrder)"
          :currentPlayerHeader="extensionList.currentPlayerHeader" :playerTurnOrderFirstVisible="
            parseInt(extensionData.playerTurnOrderFirstVisible)
          " :currentCardIndex="roomInfo.currentCardIndex" @process-extension-update="processExtensionUpdate($event)"
          v-if="
            extensionList['currentPlayerHeader'] &&
            extensionList['playerTurnOrder'] &&
            extensionLocation == 'upper' &&
            (!extensionList.currentPlayerHeaderFirstVisible ||
              extensionList.currentPlayerHeaderFirstVisible <=
                roomInfo.currentCardIndex) &&
            (!extensionList.currentPlayerHeaderLastVisible ||
              extensionList.currentPlayerHeaderLastVisible >
                roomInfo.currentCardIndex)
          ">
        </app-currentPlayerHeader>
        <app-embedWebsite class="extension" :hardcodedWebsiteURL="extensionData.hardcodedWebsiteURL"
          :selectedWebsiteURL="extensionData.selectedWebsiteURL"
          :embedWebsiteMessage="extensionData.embedWebsiteMessage"
          @process-extension-update="processExtensionUpdate($event)" v-if="
            (extensionList['hardcodedWebsiteURL'] ||
              extensionList['embedWebsiteMessage']) &&
            (((!extensionList.hardcodedWebsiteURLFirstVisible ||
              extensionList.hardcodedWebsiteURLFirstVisible <=
                roomInfo.currentCardIndex) &&
              (!extensionList.hardcodedWebsiteURLLastVisible ||
                extensionList.hardcodedWebsiteURLLastVisible >
                  roomInfo.currentCardIndex)) ||
              ((!extensionList.embedWebsiteMessageFirstVisible ||
                extensionList.embedWebsiteMessageFirstVisible <=
                  roomInfo.currentCardIndex) &&
                (!extensionList.embedWebsiteMessageLastVisible ||
                  extensionList.embedWebsiteMessageLastVisible >
                    roomInfo.currentCardIndex))) &&
            ((!extensionList.embededWebsiteLocation &&
              extensionLocation == 'lower') ||
              extensionList.embededWebsiteLocation == extensionLocation)
          ">
        </app-embedWebsite>
        <!-- <app-downloadExtensionData :extensionData="extensionData" :gameTitle="gameTitle" v-if="(extensionList['journalEntries'] || extensionList['multiEditableLists'] || extensionList['editableList']) && ((!extensionList.downloadExtensionDataLocation && extensionLocation == 'lower') || (extensionList.downloadExtensionDataLocation == extensionLocation))"></app-downloadExtensionData> -->
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "app-extensionManager",
  components: {
    "app-game": () => import("../layout/Game.vue"),
    "app-currentPlayerHeader": () => import("./CurrentPlayerHeader.vue"),
    "app-diceRoller": () => import("./DiceRoller.vue"),
    "app-coinflip": () => import("./Coinflip"),
    "app-editableList": () => import("./EditableList.vue"),
    "app-embedWebsite": () => import("./EmbedWebsite.vue"),
    "app-imageGallery": () => import("./ImageGallery.vue"),
    // 'app-generatorAsExtension': () => import('../formats/Generator.vue'),
    // 'app-hexflowerAsExtension': () => import('../formats/Hexflower.vue'),
    "app-journal": () => import("./Journal.vue"),
    "app-multiEditableLists": () => import("./MultiEditableLists.vue"),
    "app-playerTurnOrder": () => import("./PlayerTurnOrder"),
    "app-plusMinus": () => import("./PlusMinus.vue"),
    "app-standardDeck": () => import("./StandardDeck.vue"),
    "app-staticBox": () => import("./StaticBox.vue"),
    // 'app-downloadExtensionData': () => import('./DownloadExtensionData.vue'),
  },
  props: {
    extensionData: Object,
    extensionList: Object,
    extensionLocation: String,
    roomInfo: Object,
    gameTitle: String,
  },
  data: function () {
    return {
      generatorSheetData: null,
      hexflowerSheetData: null,
    };
  },
  watch: {
    "extensionList.generatorAsExtension": function () {
      if (this.extensionData.generatorAsExtension) {
        let sheetID = this.extensionData.generatorAsExtension.substring(
          this.extensionData.generatorAsExtension.indexOf("/d/") + 3,
          this.extensionData.generatorAsExtension.indexOf("/edit")
        );
        this.fetchDataForEmbeddedFormat(sheetID, "generatorSheetData");
      }
    },
    "extensionList.hexflowerAsExtension": function () {
      if (this.extensionData.hexflowerAsExtension) {
        let sheetID = this.extensionData.hexflowerAsExtension.substring(
          this.extensionData.hexflowerAsExtension.indexOf("/d/") + 3,
          this.extensionData.hexflowerAsExtension.indexOf("/edit")
        );
        this.fetchDataForEmbeddedFormat(sheetID, "hexflowerSheetData");
      }
    },
  },
  mounted() {
    if (this.extensionData.generatorAsExtension) {
      let sheetID = this.extensionData.generatorAsExtension.substring(
        this.extensionData.generatorAsExtension.indexOf("/d/") + 3,
        this.extensionData.generatorAsExtension.indexOf("/edit")
      );
      this.fetchDataForEmbeddedFormat(sheetID, "generatorSheetData");
    }

    if (this.extensionData.hexflowerAsExtension) {
      let sheetID = this.extensionData.hexflowerAsExtension.substring(
        this.extensionData.hexflowerAsExtension.indexOf("/d/") + 3,
        this.extensionData.hexflowerAsExtension.indexOf("/edit")
      );
      this.fetchDataForEmbeddedFormat(sheetID, "hexflowerSheetData");
    }
  },
  methods: {
    processExtensionUpdate(newData) {
      console.log("processing extension update", newData);

      this.$set(this.extensionData, newData[0], newData[1]);
      this.$emit("sync-extension", this.extensionData);
    },
    fetchDataForEmbeddedFormat(sheetID, varName) {
      // Remove for published version
      if (!sheetID || sheetID == "demo") {
        sheetID = "1N5eeyKTVWo5QeGcUV_zYtwtR0DikJCcvcj6w69UkC1w";
      }

      // For published version, set getURL equal to the url of your spreadsheet
      let getURL =
        "https://sheets.googleapis.com/v4/spreadsheets/" +
        sheetID +
        "?includeGridData=true&ranges=a1:aa400&key=" +
        process.env.VUE_APP_FIREBASE_API_KEY;

      axios
        .get(getURL)
        .then((response) => {
          console.log("DAAAAAAATA", response.data.sheets[0].data[0].rowData);
          this[varName] = response.data.sheets[0].data[0].rowData;
        })
        .catch((error) => {
          console.log(error.message, error);
          this[varName] = error;
        });
    },
  },
};
</script>

<style scoped>
.extension-manager {
  margin: auto;
  max-width: 600px;
  text-align: center;
}
</style>
