<template>
  <div class="mb-4 journal-extension">
      <div class="row">
        <div class="col-sm">
          <div class="card d-flex extension-card">
            <div class="card-body">
              <div v-html="journalUpperText" v-if="journalUpperText != undefined"></div>
              <h2 v-else>Journal Entries</h2>

              <form>
                <textarea v-model="newItem" type="text" maxlength="250" rows="5" class="form-control"></textarea>
                <button :disabled="!newItem" class="btn btn-outline-dark m-3" v-on:click="addItem(newItem)">Post</button>
              </form>

              <div v-if="journalEntries != []">
                <div v-for="(entry, index) in journalEntries.slice().reverse()" v-bind:key="index">
                  <div class="row journal-list-row" v-if="entry && (entry != 'EMPTY')">
                    <div class="col-sm-12 my-1 card px-0">
                      <div class="journal-entry justify-content-between d-flex">
                        <div class="card-body text-left ">
                          <div class="journal-entry-inner" v-html="entry" v-if="index != currentEditIndex"></div>
                          <textarea v-else class="form-control" type="text" v-model="currentEditText" maxlength="250" rows="5"></textarea>
                        </div>
                        <div v-if="currentEditIndex !== index">
                          <button class="btn btn-sm btn-outline-dark m-1 px-1 edit-button" v-on:click="editItem(index)">
                            <b-icon-pencil></b-icon-pencil>
                          </button>
                        </div>
                        <div v-else>
                          <div class="">
                            <button class="btn btn-sm btn-outline-dark m-1 px-1" v-on:click="saveEditedItem(index)">
                              <b-icon-check2></b-icon-check2>
                            </button>
                          </div>
                          <div class="">
                            <button class="btn btn-sm btn-outline-dark m-1 px-1 delete-button" v-on:click="deleteItem(journalEntries.length - index -1)"><b-icon-trash></b-icon-trash></button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
  </div>
</template>

<script>
export default {
  name: 'app-journalEntries',
  props: {
    journalEntries: Array,
    journalUpperText: String,
  },
  data: function() {
    return {
      newItem: null,
      currentEditIndex: null,
      currentEditText: "",
      error: null
    };
  },
  mounted(){

  },
  methods: {
    addItem(item){
      let tempNewList = this.journalEntries
      tempNewList.push(item)

      this.newItem = null

      this.$emit('process-extension-update', ['journalEntries',JSON.stringify(tempNewList)])
    },
    editItem(index){
      this.currentEditIndex = index;
      this.currentEditText = this.journalEntries[this.journalEntries.length - index -1]
    },
    saveEditedItem(index){
      this.journalEntries[this.journalEntries.length - index -1] = this.currentEditText

      this.$emit('process-extension-update', ['journalEntries',JSON.stringify(this.journalEntries)])

      this.currentEditIndex = null
      this.currentEditText = ""
    },
    deleteItem(index){
      
      let tempNewList = this.journalEntries

      tempNewList.length == 0 ? tempNewList = ['EMPTY'] : tempNewList.splice(index, 1)

      this.currentEditIndex = null
      this.currentEditText = ""

      this.$emit('process-extension-update', ['journalEntries',JSON.stringify(tempNewList)])
    }
  }
};
</script>

<style scoped>

.card .journal-entry-inner {
  white-space: pre-wrap;
  word-break: break-word;
  overflow-wrap: break-all;
}

.delete-button {
  width:25px;
}

</style>