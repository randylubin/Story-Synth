<template>
  <div>
    <div class="" v-if="location == 'menu' && (customOptions.modalOneLabel || customOptions.modalTwoLabel || customOptions.modalThreeLabel || customOptions.modalFourLabel || customOptions.modalFiveLabel)">
      <hr class='mb-4'/>
      <b-button
        v-b-modal.modalOne
        v-on:click="closeMenu();"
        variant="outline-dark"
        class="btn-block btn-lg"
        v-if="customOptions.modalOneLabel"
      >
        {{ customOptions.modalOneLabel }}
      </b-button>
      <b-button
        v-b-modal.modalTwo
        v-on:click="closeMenu();"
        variant="outline-dark"
        class="btn-block btn-lg"
        v-if="customOptions.modalTwoLabel"
        >{{ customOptions.modalTwoLabel }}</b-button
      >
      <b-button
        v-b-modal.modalThree
        v-on:click="closeMenu();"
        variant="outline-dark"
        class="btn-block btn-lg"
        v-if="customOptions.modalThreeLabel"
        >{{ customOptions.modalThreeLabel }}</b-button
      >
      <b-button
        v-b-modal.modalFour
        v-on:click="closeMenu();"
        variant="outline-dark"
        class="btn-block btn-lg"
        v-if="customOptions.modalFourLabel"
        >{{ customOptions.modalFourLabel }}</b-button
      >
      <b-button
        v-b-modal.modalFive
        v-on:click="closeMenu();"
        variant="outline-dark"
        class="btn-block btn-lg"
        v-if="customOptions.modalFiveLabel"
        >{{ customOptions.modalFiveLabel }}</b-button
      >
    </div>

    <div v-if="location=='body'">
      <b-modal
        id="modalOne"
        v-bind:title="customOptions.modalOneLabel"
        hide-footer
      >
        <div
          class="d-block text-left"
          v-html="customOptions.modalOneText"
        ></div>
      </b-modal>

      <b-modal
        id="modalTwo"
        v-bind:title="customOptions.modalTwoLabel"
        hide-footer
      >
        <div
          class="d-block text-left"
          v-html="customOptions.modalTwoText"
        ></div>
      </b-modal>

      <b-modal
        id="modalThree"
        v-bind:title="customOptions.modalThreeLabel"
        hide-footer
      >
        <div
          class="d-block text-left"
          v-html="customOptions.modalThreeText"
        ></div>
      </b-modal>

      <b-modal
        id="modalFour"
        v-bind:title="customOptions.modalFourLabel"
        hide-footer
      >
        <div
          class="d-block text-left"
          v-html="customOptions.modalFourText"
        ></div>
      </b-modal>

      <b-modal
        id="modalFive"
        v-bind:title="customOptions.modalFiveLabel"
        hide-footer
      >
        <div
          class="d-block text-left"
          v-html="customOptions.modalFiveText"
        ></div>
      </b-modal>
    </div>
    
  </div>  
</template>

<script>
  export default {
    name: 'app-menu-modals',
    props: {
      customOptions: Object,
      location: String,
    },
    data () {
      return {
      }
    },
    methods: {
      closeMenu(){
        this.$emit('close-menu', []);
        this.$bvModal.hide("menuModal");
      },
    },
  }
</script>