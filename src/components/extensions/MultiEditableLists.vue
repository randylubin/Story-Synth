<template>
  <div class="mb-4 multi-editable-lists">
      <div class="row">
        <div class="col-sm">
          <div class="card d-flex shadow">
            <div class="card-body">

              <div v-if="multiEditableLists != []">
                <div v-for="(list, listIndex) in multiEditableLists" v-bind:key="listIndex" class="">
                  <div class="row">
                    <div class="col-sm my-1 ">
                      <h2>{{list.name}}</h2>
                    </div>
                  </div>
                  <div v-for="(item, itemIndex) in list.value" v-bind:key="itemIndex" class="row">
                    <div class="col-sm justify-content-between d-flex my-1">
                      <span style="min-width:1em"></span>
                      <div v-if="itemIndex != currentEditItemIndex || listIndex != currentEditListIndex">{{item}}</div>
                      <input v-else type="text" v-model="currentEditText" maxlength="50">
                      <div>
                        <button class="btn btn-sm btn-outline-dark m-1 px-1" v-on:click="editItem(listIndex, itemIndex)" v-if="currentEditItemIndex != itemIndex || currentEditListIndex != listIndex">
                          <b-icon-pencil></b-icon-pencil>
                        </button>
                        <div v-else>
                          <button class="btn btn-sm btn-outline-dark m-1 px-1" v-on:click="saveEditedItem(listIndex, itemIndex)">
                            <b-icon-check2></b-icon-check2>
                          </button>
                          <button class="btn btn-sm btn-outline-dark m-1 px-1" v-on:click="deleteItem(listIndex, itemIndex)"><b-icon-trash></b-icon-trash></button>
                        </div>
                      </div>
                    </div>
                  </div>
                  <form>
                    <input v-model="newItemArray[listIndex]" type="text" maxlength="50">
                    <button :disabled="!newItemArray[listIndex]" class="btn btn-outline-dark m-3" v-on:click="addItem(listIndex, newItemArray[listIndex])">Add</button>
                  </form>
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
  name: 'app-multiEditableLists',
  props: {
    multiEditableLists: Array,
  },
  data: function() {
    return {
      newItemArray: [],
      error: null,
      currentEditText: "",
      currentEditListIndex: null,
      currentEditItemIndex: null,
    };
  },
  mounted(){

  },
  methods: {
    addItem(listIndex, item){
      let tempNewLists = this.multiEditableLists
      tempNewLists[listIndex].value.push(item)

      this.newItemArray[listIndex] = null

      this.$emit('process-extension-update', ['multiEditableLists',JSON.stringify(tempNewLists)])
    },
    editItem(listIndex, index){
      this.currentEditItemIndex = index;
      this.currentEditListIndex = listIndex;
      this.currentEditText = this.multiEditableLists[listIndex].value[index];
    },
    saveEditedItem(listIndex, index){
      this.multiEditableLists[listIndex].value[index] = this.currentEditText

      this.$emit('process-extension-update', ['multiEditableLists',JSON.stringify(this.multiEditableLists)])

      this.currentEditItemIndex = null;
      this.currentEditListIndex = null;
      this.currentEditText = "";
    },
    deleteItem(listIndex, itemIndex){
      
      let tempNewLists = this.multiEditableLists

      console.log(tempNewLists)

      tempNewLists[listIndex].length == 0 ? tempNewLists[listIndex] = [] : tempNewLists[listIndex].value.splice(itemIndex, 1)

      this.$emit('process-extension-update', ['multiEditableLists',JSON.stringify(tempNewLists)])
    }
  }
};
</script>

<style scoped>


</style>