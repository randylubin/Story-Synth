<template>
  <div class="mb-4 download-extension-data">
      <div class="row">
        <div class="col-sm">
            <b-button pill variant="light" v-on:click="downloadData()">Save Data <b-icon-save></b-icon-save></b-button>          
        </div>
      </div>
  </div>
</template>

<script>
export default {
  name: 'app-download-extension-data',
  props: {
    extensionData: Object,
    gameTitle: String,
  },
  data: function() {
    return {
      error: null
    };
  },
  mounted(){

  },
  methods: {
    downloadData: function(){
      let downloadText = ""
      let filename = ""

      // Filename
      if (this.gameTitle) {
        filename = this.gameTitle.replace(/[^a-z0-9]/gi, '_') + "-data.txt";
        downloadText = this.gameTitle + "\n\n\n"
      } else {
        filename = "story-synth-data.txt"
      }

      // Editable List
      let listItems = this.extensionData.editableList ? this.extensionData.editableList.split(', ') : null;
      if (listItems) {
        if (this.extensionData.editableListTitle) {
          downloadText += "# " + this.extensionData.editableListTitle + "\n\n"
        } else {downloadText += '# List\n\n'}

        for (let i =0; i < listItems.length; i++){
          downloadText += "- " + listItems[i] + "\n"
        }
        downloadText += "\n\n"
      }

      // Multi Editable List
      let multiLists = this.extensionData.multiEditableLists ? JSON.parse(this.extensionData.multiEditableLists) : {};
      if (multiLists) {
        for (const list in multiLists) {
          if (multiLists[list]['value'].length) {
            downloadText += "# " + multiLists[list].name + '\n\n'
            
            for (let i = 0; i < multiLists[list]['value'].length; i++) {
              downloadText += "- " + multiLists[list].value[i] + "\n";
            }
          }
        downloadText += "\n\n"
        }
      }


      // Journal Entries
      let entries = this.extensionData.journalEntries ? JSON.parse(this.extensionData.journalEntries) : null;
      if (entries){
        if (this.extensionData.journalUpperText){
          downloadText += "# " + this.extensionData.journalUpperText + "\n"
        } else {downloadText += "# Journal Entries\n"}

        for (let i = 0; i < entries.length; i++){
          downloadText += "\n---\n"
          downloadText += entries[i]
          downloadText += "\n"
        }
      }

      var element = document.createElement('a');
      element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(downloadText));
      element.setAttribute('download', filename);

      element.style.display = 'none';
      document.body.appendChild(element);

      element.click();

      document.body.removeChild(element);
    }
  }
};
</script>

<style scoped>


</style>