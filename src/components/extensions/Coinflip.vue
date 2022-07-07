<template>
  <div class="mb-4 template">
    <div class="row">
      <div class="col-sm">
        <div class="card d-flex shadow">
          <div class="card-body">
            <h4 v-if="coinflipTitle" class="coinflip-title">{{coinflipTitle}}</h4>
            <div class="flip-result" v-if="flipResult">{{flipResult}}</div>
            <div v-else style="min-height: 50px"><br></div>
            <button class="btn btn-outline-dark m-2 coinflip-button" v-on:click="flipCoin()">{{coinflipButtonLabel ? coinflipButtonLabel : 'Flip Coin'}}</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'app-coinflip',
  props: {
    flipResult: String,
    coinflipTitle: String,
    coinflipButtonLabel: String,
    coinflipValues: String, 
  },
  data: function() {
    return {
      error: null,
    };
  },
  mounted(){

  },
  methods: {
    flipCoin() {
      let coinSides = !this.coinflipValues.includes(',') ? ['Heads','Tails'] : this.coinflipValues?.split(',')
      let newFlip = ""
      if (Math.random() > .5) {
        newFlip = coinSides[0]
      } else {
        newFlip = coinSides[1]
      }
      this.$emit('process-extension-update', ['flipResult', null])
      setTimeout(() => {
        this.$emit('process-extension-update', ['flipResult', newFlip])
      }, 500)
    }
    
  }
};
</script>

<style lang='scss' scoped>
.flip-result {
  animation-duration: .75s;
  animation-name: showcoin;
  font-size: 1.5em;
  min-height: 50px;
}

@keyframes showcoin {
  from {
    font-size: 1%;
  } 

  50% {
    font-size: 2em;
  }

  to {
    font-size: 1.5em;
  }
}

.coinflip-enter-active, .coinflip-leave-active {
  transition: opacity .5s;
}
.coinflip-enter, .coinflip-leave-to {
  opacity: 0;
}
</style>