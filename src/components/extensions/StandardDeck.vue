<template>
  <div class="mb-4 standard-deck">
    <div class="row">
      <div class="col-sm">
        <div class="card d-flex extension-card">
          <div class="card-body">
            <h2 v-dompurify-html="standardDeckTitle" v-if="standardDeckTitle != undefined"></h2>
            <h2 v-else>Standard Deck</h2>

            <h3 v-if="standardDeck.drawnCards.length"
              v-bind:class="{ redCard: (standardDeck.drawnCards[standardDeck.drawnCards.length - 1].includes('♡') || standardDeck.drawnCards[standardDeck.drawnCards.length - 1].includes('♢')) }">
              {{ standardDeck.drawnCards[standardDeck.drawnCards.length - 1] }}</h3>

            <div v-if="standardDeck.drawnCards.length > 1">
              Past draws:
              <span v-for="(card, index) in standardDeck.drawnCards" v-bind:key="index">
                <span v-if="index != standardDeck.drawnCards.length - 1" v-dompurify-html="card" class="ml-1"
                  v-bind:class="{ redCard: (card.includes('♡') || card.includes('♢')) }"></span>
              </span>
            </div>

            <button class="btn btn-outline-dark m-1 standard-deck-button standard-deck-button-draw"
              :disabled="standardDeck.drawnCards.length == standardDeck.fullDeck.length"
              v-on:click="drawCard()">Draw</button>
            <button class="btn btn-outline-dark m-1 standard-deck-button standard-deck-button-reshuffle"
              v-on:click="reshuffle()">Reshuffle</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'app-standardDeck',
  props: {
    standardDeck: Object,
    standardDeckTitle: String,
  },
  data: function () {
    return {
      error: null
    };
  },
  mounted() {

  },
  methods: {
    drawCard() {
      var tempStandardDeck = this.standardDeck
      tempStandardDeck.cardsLeft = this.standardDeck.fullDeck.filter(x => !this.standardDeck.drawnCards.includes(x));
      var newCard = tempStandardDeck.cardsLeft[Math.floor(Math.random() * tempStandardDeck.cardsLeft.length)]
      tempStandardDeck.drawnCards.push(newCard)
      this.$emit('process-extension-update', ['standardDeck', JSON.stringify(tempStandardDeck)])
    },
    reshuffle() {
      var tempStandardDeck = this.standardDeck
      tempStandardDeck.drawnCards = []
      this.$emit('process-extension-update', ['standardDeck', JSON.stringify(tempStandardDeck)])
    }
  }
};
</script>

<style scoped>
.redCard {
  color: rgb(162, 2, 2);
}
</style>