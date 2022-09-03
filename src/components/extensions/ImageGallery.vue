<template>
  <div class="mb-4 image-gallery">
      <div class="row">
        <div class="col-sm">
          <div class="card d-flex shadow">
            <div class="card-body">
              <h2 v-if="imageGalleryTitle" class="image-gallery-title">{{imageGalleryTitle}}</h2>
              <div v-if="!selectedImage">
                <img v-for="image in imageGallery" v-bind:key="image" v-bind:src="image" role="button" alt="image in gallery" v-on:click="selectImage(image)" class="m-1 selected-image">
              </div>
              <div v-if="selectedImage">
                <img v-bind:src="selectedImage" alt="the selected image from the image gallery"><br>
                <button class="mt-2 btn btn-sm btn-outline-dark deselect-button" v-on:click="deselectImage()">Deselect</button>
              </div> 

            </div>
          </div>
        </div>
      </div>
  </div>
</template>

<script>
export default {
  name: 'app-imageGallery',
  props: {
    imageGallery: Array,
    imageGalleryTitle: String,
    selectedImage: String,
  },
  data: function() {
    return {
      error: null
    };
  },
  mounted(){

  },
  methods: {
    selectImage(imageURL) {
      this.$emit('process-extension-update', ['selectedImage',imageURL])
    },
    deselectImage() {
      this.$emit('process-extension-update', ['selectedImage',null])
    }
  }
};
</script>

<style scoped>


</style>