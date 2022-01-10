<template>
  <div class="mb-4 dice-roller">
      <div class="row">
        <div class="col-sm">
          <div class="card d-flex extension-card">
            <div class="card-body">
              <h2 v-html="diceRollerTitle" v-if="diceRollerTitle != undefined"></h2>
              <h2 v-else>Dice Roller</h2>

              <div class="row">
                <div class="col-sm">
                  <span v-for="(die, index) in diceResults" v-bind:key="index" class="font-weight-bold mx-2" style="font-size: 150%">
                    {{die}}
                  </span>
                </div>
              </div>

              <div class="row">
                <div class="col-sm">
                  <input v-model="diceInput" type="text" maxlength="50">
                  <button class="btn btn-outline-dark m-2" v-on:click="rollDice(diceInput)" :disabled="!diceInput">Roll</button>
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
  name: 'app-diceRoller',
  props: {
    diceResults: Array,
    diceRollerTitle: String,
  },
  data: function() {
    return {
      diceInput: null,
      error: null
    };
  },
  mounted(){
    
  },
  methods: {
    rollDice(diceInput){
      var results = []

      // parse input into integers
      var rawDiceArray = diceInput.split(/[\s,]+/)
      var cleanDiceArray = []

      rawDiceArray.forEach(die => {
        if (die.includes('d')){
          var subDice = die.split('d')
          for (var i = 0; i < subDice[0]; i++) {
            cleanDiceArray.push(parseInt(subDice[1]))
          }
        } else {
          cleanDiceArray.push(parseInt(die))
        }  
      });

      // roll dice
      cleanDiceArray.forEach(die => {
        results.push(Math.floor(Math.random()*die) + 1)
      });

      this.$emit('process-extension-update', ['diceRoller',results.toString()])
    }
  }
};
</script>

<style scoped>


</style>