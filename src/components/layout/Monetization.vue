<template>
  <div>
    <div v-dompurify-html="customOptions.monetizationStyle" v-if="roomMonetized"></div>
    <div v-if="customOptions.monetizationMessage && !roomMonetized" class="monetizationMessage">
      <b-alert show variant="light" v-dompurify-html="customOptions.monetizationMessage"></b-alert>
    </div>
    <b-overlay :show="customOptions.monetizationPaywall && !roomMonetized" no-wrap>
      <template #overlay>
        <div class="text-center">
          <div v-dompurify-html="customOptions.monetizationPaywall"></div>
          <div class="mt-4">
            <p>Checking for a <a href="https://webmonetization.org/">web monetization</a> stream now...</p>
            <b-spinner
                class="m-5"
                style="width: 4rem; height: 4rem;"
                label="Busy"
              ></b-spinner>
          </div>
        </div>
      </template>  
    </b-overlay>
  </div>
</template>
  
<script>
export default {
  name: 'app-monetization',
  props: {
    customOptions: Object,
    roomMonetized: Boolean,
  },
  data: function() {
    return {
    };
  },
};
</script>