<template>
  <div class="mb-4 plus-minus">
      <div class="row">
        <div class="col-sm">
          <div class="card d-flex extension-card">
            <div class="card-body">
              <h2 v-html="plusMinusTitle" v-if="plusMinusTitle != undefined"></h2>
              <h2 v-else>Key Stats</h2>

              <div v-for="(variable, index) in plusMinus" v-bind:key="index" class="row">
                <div class="col-sm-12 justify-content-between d-flex my-1">
                  <button class="btn btn-sm btn-outline-dark" v-on:click="changeVariable(index, (variable.value - 1))">-</button>
                
                
                  <div class="my-auto">{{variable.name}}: {{variable.value}}</div>
                
                
                  <button class="btn btn-sm btn-outline-dark" v-on:click="changeVariable(index, (variable.value + 1))">+</button>
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
  name: 'app-plusMinus',
  props: {
    plusMinus: Array,
    plusMinusTitle: String,
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
      var tempStateVariables = this.plusMinus
      tempStateVariables[index].value = newValue
      this.$emit('process-extension-update', ['plusMinus',JSON.stringify(tempStateVariables)])
    }
  }
};
</script>

<style scoped>


</style>