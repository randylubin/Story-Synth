<template>
  <div class="">
      <div class="row">
        <div class="col-sm">
          <app-sharedState :stateVariables="JSON.parse(customOptions.stateVariables)" @process-toolkit-update="processToolkitUpdate($event)" v-if="customOptions.stateVariables"></app-sharedState>
          <app-editableList :editableList="customOptions.editableList.split(',')" @process-toolkit-update="processToolkitUpdate($event)" v-if="customOptions.editableList"></app-editableList>
        </div>
      </div>
  </div>
</template>

<script>
import SharedState from './SharedState.vue'
import List from './EditableList.vue'

export default {
  name: 'app-toolkit',
  components: {
    'app-sharedState': SharedState,
    'app-editableList': List,
  },
  props: {
    customOptions: Object,
  },
  data: function() {
    return {
      
    };
  },
  mounted(){

  },
  methods: {
    processToolkitUpdate(newData){
      console.log('new data',newData)
      this.$set(this.customOptions, newData[0], newData[1])
      this.$emit('sync-toolkit')
    },
  }
};
</script>

<style scoped>


</style>