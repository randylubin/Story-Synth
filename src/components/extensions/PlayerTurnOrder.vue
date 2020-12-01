<template>
  <div class="mb-4 player-turn-order">
      <div class="row">
        <div class="col-sm">
          <div class="card d-flex shadow">
            <div class="card-body">
              <h2>Player Turn Order</h2>
              
              <div v-if="playerTurnOrder.players">
                <div v-for="(player, index) in playerTurnOrder.players" v-bind:key="index">
                  <span v-on:click="makeActivePlayer(index)">
                    <span v-if="index == (currentCardIndex + playerTurnOrder.activePlayerOffset) % playerTurnOrder.players.length">Active: </span>{{player}}
                  </span>
                  <button class="btn btn-outline-dark" v-on:click="deletePlayer(index)">X</button>
                </div>
              </div>

              <input type="text" v-model="newPlayer">
              <button class="btn btn-outline-dark" v-on:click="addPlayer(newPlayer)">Add</button>
              
            </div>
          </div>
        </div>
      </div>
  </div>
</template>

<script>
export default {
  name: 'app-playerTurnOrder',
  props: {
    playerTurnOrder: Object,
    currentCardIndex: Number,
  },
  data: function() {
    return {
      error: null,
      newPlayer: "",
    };
  },
  mounted(){
    if (this.playerTurnOrder.players == undefined){
      this.playerTurnOrder.players = []
      this.playerTurnOrder.currentTurn = 0
      this.playerTurnOrder.activePlayerOffset = 0
    }
    this.$emit('process-extension-update', ['playerTurnOrder',JSON.stringify(this.playerTurnOrder)])
  },
  methods: {
    addPlayer(playerName){
      this.playerTurnOrder.players.push(playerName)
      this.newPlayer = ""
      this.$emit('process-extension-update', ['playerTurnOrder',JSON.stringify(this.playerTurnOrder)])
    },
    deletePlayer(index){
      var tempNewPlayerList = this.playerTurnOrder.players
      tempNewPlayerList.length == 0 ? tempNewPlayerList = [] : tempNewPlayerList.splice(index, 1)
      this.playerTurnOrder.players = tempNewPlayerList
      this.$emit('process-extension-update', ['playerTurnOrder',JSON.stringify(this.playerTurnOrder)])
    },
    makeActivePlayer(index){
      this.playerTurnOrder.activePlayerOffset = index - (this.currentCardIndex % this.playerTurnOrder.players.length)
      this.$emit('process-extension-update', ['playerTurnOrder',JSON.stringify(this.playerTurnOrder)])
    },
    previousTurn(){
      this.playerTurnOrder.currentTurn = (this.playerTurnOrder.currentTurn - 1) % this.playerTurnOrder.length
      this.$emit('process-extension-update', ['playerTurnOrder',JSON.stringify(this.playerTurnOrder)])
    }

  }
};
</script>

<style scoped>


</style>