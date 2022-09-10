<template>
  <div class="mb-4 image-gallery">
    <div class="row">
      <div class="col-sm">
        <div class="card d-flex shadow">
          <div class="card-body">
            <h2 v-if="imageGalleryTitle" class="image-gallery-title">{{ imageGalleryTitle }}</h2>
            <div class="row" v-if="!Number.isInteger(selectedImage)">
              <div class="col-md-4" v-for="(image, index) in imageGallery" v-bind:key="index">
                <figure class="figure">
                  <img role="button"
                    v-bind:alt="imageAltText ? imageAltText[index] : imageCaptions ? imageCaptions[index] : ''"
                    v-bind:src="image" v-on:click="selectImage(index)"
                    class="m-1 figure-img img-fluid rounded gallery-image">
                  <figcaption v-if="markdownRenderedCaptions && markdownRenderedCaptions[index]"
                    class="figure-caption image-caption" v-dompurify-html="markdownRenderedCaptions[index]">
                  </figcaption>
                </figure>
              </div>
            </div>
            <div v-if="Number.isInteger(selectedImage)">
              <figure class="figure">
                <img v-bind:src="imageGallery[selectedImage]" class="figure-img img-fluid rounded selected-image"
                  v-bind:alt="imageAltText ? imageAltText[selectedImage] : imageCaptions ? imageCaptions[selectedImage] : ''">
                <figcaption v-if="markdownRenderedCaptions && markdownRenderedCaptions[selectedImage]"
                  class="figure-caption image-caption" v-dompurify-html="markdownRenderedCaptions[selectedImage]">
                </figcaption>
              </figure>
              <br><button class="mt-2 btn btn-sm btn-outline-dark deselect-button"
                v-on:click="deselectImage()">Deselect</button>
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
    imageAltText: Array,
    imageGalleryTitle: String,
    selectedImage: Number,
  },
  data: function () {
    return {
      error: null
    };
  },
  mounted() {

  },
  computed: {
    markdownRenderedCaptions: function () {
      let renderedEntries = this.imageCaptions ? this.imageCaptions.map(entry => this.$marked(entry) ?? null) : null;

      return renderedEntries
    }
  },
  methods: {
    selectImage(imageIndex) {
      this.$emit('process-extension-update', ['selectedImage', imageIndex])
    },
    deselectImage() {
      this.$emit('process-extension-update', ['selectedImage', null])
    }
  }
};
</script>

<style scoped>

</style>