<template>
  <div class="mb-4 journal-extension">
      <div class="row">
        <div class="col-sm">
          <div class="card d-flex shadow">
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
                      <div class=" journal-entry justify-content-between d-flex">
                        <div class="card-body text-left journal-entry-inner" v-html="entry"></div>
                        <button class="btn btn-sm btn-outline-dark delete-button ml-auto " v-on:click="deleteItem(journalEntries.length - index -1)">x</button>
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
    deleteItem(index){
      
      let tempNewList = this.journalEntries
      tempNewList.length == 0 ? tempNewList = ['EMPTY'] : tempNewList.splice(index, 1)

      this.$emit('process-extension-update', ['journalEntries',JSON.stringify(tempNewList)])
    }
  }
};
</script>

<style scoped>

.card .journal-entry-inner {
  white-space: pre-wrap;
}

.delete-button {
  width:25px;
}

</style>