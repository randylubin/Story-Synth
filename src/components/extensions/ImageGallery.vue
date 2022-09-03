<template>
  <div class="mb-4 image-gallery">
      <div class="row">
        <div class="col-sm">
          <div class="card d-flex shadow">
            <div class="card-body">
              <h2 v-if="imageGalleryTitle" class="image-gallery-title">{{imageGalleryTitle}}</h2>
              <div v-if="!Number.isInteger(selectedImage)">
                <figure v-for="(image, index) in imageGallery" v-bind:key="index" class="figure">
                  <img role="button" v-bind:alt="imageCaptions[index]" v-bind:src="image" v-on:click="selectImage(index)" class="m-1 figure-img img-fluid rounded gallery-image">
                  <figcaption v-if="imageCaptions && imageCaptions[index]" class="figure-caption image-caption">{{imageCaptions[index]}}</figcaption>
                </figure>
              </div>
              <div v-if="Number.isInteger(selectedImage)">
                <figure class="figure">
                  <img v-bind:src="imageGallery[selectedImage]" class="figure-img img-fluid rounded selected-image" v-bind:alt="imageCaptions[selectedImage]">
                  <figcaption v-if="imageCaptions && imageCaptions[selectedImage]" class="figure-caption image-caption">A caption for the above image.</figcaption>
                </figure>
                <br><button class="mt-2 btn btn-sm btn-outline-dark deselect-button" v-on:click="deselectImage()">Deselect</button>
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
    imageCaptions: Array,
    imageGalleryTitle: String,
    selectedImage: Number,
  },
  data: function() {
    return {
      error: null
    };
  },
  mounted(){

  },
  methods: {
    selectImage(imageIndex) {
      this.$emit('process-extension-update', ['selectedImage',imageIndex])
    },
    deselectImage() {
      this.$emit('process-extension-update', ['selectedImage',null])
    }
  }
};
</script>

<style scoped>


</style>