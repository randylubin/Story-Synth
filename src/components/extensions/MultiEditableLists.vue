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
                      <div>{{item}}</div>
                      <button class="btn btn-sm btn-outline-dark m-1" v-on:click="deleteItem(listIndex, itemIndex)">x</button>
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
      error: null
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