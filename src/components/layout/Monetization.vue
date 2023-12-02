<template>
  <div>
    <div v-dompurify-html="customOptions.monetizationStyle" v-if="roomMonetized"></div>
    <div v-if="customOptions.monetizationMessage && !roomMonetized" class="monetizationMessage">
      <div show class="alert alert-light" v-dompurify-html="customOptions.monetizationMessage"></div>
    </div>
    <div v-if="customOptions.monetizationPaywall && !roomMonetized" no-wrap>
      <div class="text-center">
        <div v-dompurify-html="customOptions.monetizationPaywall"></div>
        <div class="mt-4">
          <div class="row">
            <div class="col">
              <p>Checking for a <a href="https://webmonetization.org/">web monetization</a> stream now...</p>
              <span class="spinner-border m-auto p-auto" role="status">
                <span class="visually-hidden">Loading...</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
  
<script>
export default {
  name: 'app-monetization',
  props: {
    customOptions: Object,
    roomMonetized: Boolean,
  },
  data: function () {
    return {
    };
  },
};
</script>