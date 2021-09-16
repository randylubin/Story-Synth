<template>
  <div class="mb-4 editable-list">
      <div class="row">
        <div class="col-sm">
          <div class="card d-flex shadow">
            <div class="card-body">
              <h2 v-html="editableListTitle" v-if="editableListTitle != undefined"></h2>
              <h2 v-else>List</h2>

              <div v-if="editableList != []">
                <div v-for="(item, index) in editableList" v-bind:key="index" class="">
                  <div class="row editable-list-row" v-if="item && (item != 'EMPTY')">
                    <div class="col-sm justify-content-between d-flex my-1">
                      <span style="min-width:1em"></span>
                      <div v-if="index != currentEditIndex">{{item}}</div>
                      <input v-else type="text" v-model="currentEditText" maxlength="50">
                      <div>
                        <button class="btn btn-sm btn-outline-dark m-1 px-1" v-on:click="editItem(index)" v-if="currentEditIndex !== index">
                          <b-icon-pencil></b-icon-pencil>
                        </button>
                        <div v-else>
                          <button class="btn btn-sm btn-outline-dark m-1 px-1" v-on:click="saveEditedItem(index)">
                            <b-icon-check2></b-icon-check2>
                          </button>
                          <button class="btn btn-sm btn-outline-dark m-1 px-1" v-on:click="deleteItem(index)"><b-icon-trash></b-icon-trash></button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <form>
                <input v-model="newItem" type="text" maxlength="50">
                <button :disabled="!newItem" class="btn btn-outline-dark m-3" v-on:click="addItem(newItem)">Add</button>
              </form>
            </div>
          </div>
        </div>
      </div>
  </div>
</template>

<script>
export default {
  name: 'app-editableList',
  props: {
    editableList: Array,
    editableListTitle: String,
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
      var tempNewList = this.editableList
      tempNewList.push(item)

      this.newItem = null

      this.$emit('process-extension-update', ['editableList',tempNewList.toString()])
    },
    editItem(index){
      this.currentEditIndex = index;
      this.currentEditText = this.editableList[index]
    },
    saveEditedItem(index){
      this.editableList[index] = this.currentEditText

      this.$emit('process-extension-update', ['editableList',this.editableList.toString()])

      this.currentEditIndex = null
      this.currentEditText = ""
    },
    deleteItem(index){
      
      var tempNewList = this.editableList
      tempNewList.length == 0 ? tempNewList = ['EMPTY'] : tempNewList.splice(index, 1)

      this.$emit('process-extension-update', ['editableList',tempNewList.toString()])
    }
  }
};
</script>

<style scoped>


</style>