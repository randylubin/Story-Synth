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
                      <div>{{item}}</div>
                      <button class="btn btn-sm btn-outline-dark m-1" v-on:click="deleteItem(index)">x</button>
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