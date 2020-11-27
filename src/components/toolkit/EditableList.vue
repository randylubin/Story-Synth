<template>
  <div class="mb-4">
      <div class="row">
        <div class="col-sm">
          <div class="card d-flex shadow">
            <div class="card-body">
              <h2>List</h2>
                <div v-for="(item, index) in editableList" v-bind:key="index" class="row">
                  <div class="col-sm">{{item}}</div>
                  <button class="btn btn-outline-dark" v-on:click="deleteItem(index)">x</button>
                </div>
                <form>
                  <input v-model="newItem" type="text" >
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

      this.$emit('process-toolkit-update', ['editableList',tempNewList.toString()])
    },
    deleteItem(index){
      
      var tempNewList = this.editableList
      tempNewList.splice(index, 1)

      this.$emit('process-toolkit-update', ['editableList',tempNewList.toString()])
    }
  }
};
</script>

<style scoped>


</style>