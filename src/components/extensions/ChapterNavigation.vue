<template>
  <div class="mb-4 template" v-if="extensionLocation == 'lower'">
      <div class="row">
        <div class="col-sm">
          <div class="card d-flex shadow">
            <div class="card-body">
              <h2>Chapter Navigation</h2>
              <p>You can jump around!</p>
              
            </div>
          </div>
        </div>
      </div>
  </div>
</template>

<script>
export default {
  name: 'app-template',
  props: {
    templateData: Array,
    extensionLocation: String,
    extensionData: Object,
  },
  data: function() {
    const isRenderUpper = this.extensionData["chapterNavigation + Location"] === 'upper';
    return {
      isRenderUpper,
      error: null
    };
  },
  mounted(){
    console.log(this.extensionData);
  },
  methods: {
    
  }
};
</script>

<style scoped>


</style>