<template>
  <div class="mb-4">
      <div class="row">
        <div class="col-sm">
          <div class="card d-flex shadow">
            <div class="card-body">
              <h2>Game State</h2>
              <div v-for="(variable, index) in stateVariables" v-bind:key="index" class="row">
                <div class="col-sm-12 justify-content-between d-flex my-1">
                  <button class="btn btn-outline-dark" v-on:click="changeVariable(index, (variable.value - 1))">-</button>
                
                
                  <div>{{variable.name}}: {{variable.value}}</div>
                
                
                  <button class="btn btn-outline-dark" v-on:click="changeVariable(index, (variable.value + 1))">+</button>
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
  name: 'app-sharedState',
  props: {
    stateVariables: Array,
  },
  data: function() {
    return {
      error: null
    };
  },
  mounted(){

  },
  methods: {
    changeVariable(index, newValue){
      var tempStateVariables = this.stateVariables
      tempStateVariables[index].value = newValue
      this.$emit('process-toolkit-update', ['stateVariables',JSON.stringify(tempStateVariables)])
    }
  }
};
</script>

<style scoped>


</style>