<template>
  <div class="mb-4 player-turn-order" v-if="isNaN(playerTurnOrderFirstVisible) || (playerTurnOrderFirstVisible <= currentCardIndex)">
      <div class="row">
        <div class="col-sm">
          <div class="card d-flex extension-card">
            <div class="card-body">
              <h2 v-html="playerTurnOrderHeader" v-if="playerTurnOrderHeader != undefined"></h2>
              <h2 v-else>Player Turn Order</h2>
              
              <div v-if="playerTurnOrder.players">
                <div v-for="(player, index) in playerTurnOrder.players" v-bind:key="index">
                  <div class="justify-content-between d-flex">
                    <span></span>
                    <span class="my-auto" v-bind:class="{'font-weight-bold': (index == (currentCardIndex + playerTurnOrder.activePlayerOffset) % playerTurnOrder.players.length)}" style="cursor:pointer" v-on:click="makeActivePlayer(index)" v-if="index != currentEditIndex">
                      <span v-if="index == (currentCardIndex + playerTurnOrder.activePlayerOffset) % playerTurnOrder.players.length"> –</span>
                      {{player}}
                      <span v-if="index == (currentCardIndex + playerTurnOrder.activePlayerOffset) % playerTurnOrder.players.length">– </span>
                    </span>
                    
                    <input v-else type="text" v-model="currentEditText" maxlength="50">

                    <div>
                      <button class="btn btn-sm btn-outline-dark m-1 px-1 edit-button" v-on:click="editPlayer(index)" v-if="currentEditIndex !== index">
                        <b-icon-pencil></b-icon-pencil>
                      </button>
                      <div v-else>
                        <button class="btn btn-sm btn-outline-dark m-1 px-1" v-on:click="deletePlayer(index)"><b-icon-trash></b-icon-trash></button>
                        <button class="btn btn-sm btn-outline-dark m-1 px-1" v-on:click="saveEditedPlayer(index)">
                          <b-icon-check2></b-icon-check2>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <input type="text" v-model="newPlayer" maxlength="50">
              <button :disabled="!newPlayer" class="btn btn-outline-dark m-2" v-on:click="addPlayer(newPlayer)" v-html="playerTurnOrderButtonLabel" v-if="playerTurnOrderButtonLabel != undefined">Add Player</button>
              <button v-else :disabled="!newPlayer" class="btn btn-outline-dark m-2" v-on:click="addPlayer(newPlayer)">Add Player</button>
              
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
    playerTurnOrderHeader: String,
    playerTurnOrderButtonLabel: String,
    playerTurnOrderFirstVisible: Number,
    currentCardIndex: Number,
  },
  data: function() {
    return {
      error: null,
      newPlayer: "",
      currentEditIndex: null,
      currentEditText: "",
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
      
      this.currentEditIndex = null
      this.currentEditText = ""
    },
    makeActivePlayer(index){
      console.log('index',index)
      console.log('players', this.playerTurnOrder.players.length)
      console.log('cci', this.currentCardIndex)
      console.log('offest', this.currentCardIndex % this.playerTurnOrder.players.length)
      this.playerTurnOrder.activePlayerOffset = index - (this.currentCardIndex % this.playerTurnOrder.players.length)
      this.$emit('process-extension-update', ['playerTurnOrder',JSON.stringify(this.playerTurnOrder)])
    },
    editPlayer(index){
      this.currentEditIndex = index;
      this.currentEditText = this.playerTurnOrder.players[index]
    },
    saveEditedPlayer(index){
      this.playerTurnOrder.players[index] = this.currentEditText

      this.$emit('process-extension-update', ['playerTurnOrder',JSON.stringify(this.playerTurnOrder)])

      this.currentEditIndex = null
      this.currentEditText = ""
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