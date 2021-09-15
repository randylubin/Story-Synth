<template>
  <div class="mb-4 current-player-header" v-if="playerTurnOrder.players && playerTurnOrder.players.length && (isNaN(playerTurnOrderFirstVisible) || (playerTurnOrderFirstVisible <= currentCardIndex))">
      <div class="row">
        <div class="col-sm">
              <h2>{{currentPlayerHeader}} {{playerTurnOrder.players[(currentCardIndex + playerTurnOrder.activePlayerOffset) % playerTurnOrder.players.length]}}</h2>
        </div>
      </div>
  </div>
</template>

<script>
export default {
  name: 'app-currentPlayerHeader',
  props: {
    currentPlayerHeader: String,
    playerTurnOrder: Object,
    playerTurnOrderFirstVisible: Number,
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
      console.log('index',index)
      console.log('players', this.playerTurnOrder.players.length)
      console.log('cci', this.currentCardIndex)
      console.log('offest', this.currentCardIndex % this.playerTurnOrder.players.length)
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