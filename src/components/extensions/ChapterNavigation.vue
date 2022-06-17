<template>
  <div class="mb-4 template" v-if="shouldRender">
    <div class="row">
      <div class="col-sm">
        <div class="card d-flex shadow">
          <div class="card-body">
            <h2>Chapter Navigation</h2>
            <p>You can jump around!</p>
            <li v-for="chapter in chapters" :key="chapter.label">
              {{ chapter.label }}
              {{ chapter.firstcard }}
            </li>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "app-template",
  props: {
    templateData: Array,
    extensionLocation: String,
    // Assumes that props.extensionData 
    // - will have keys that match the pattern `chapter-{chapterNumber}-label` and `chapter-{chapterNumber}-firstcard`
    // - will set "chapterNavigation + Location" to either "upper" or "lower" to set the position of the component
    extensionData: Object,
  },
  data: function () {
    const chapterNavigationLocation =
      this.extensionData["chapterNavigation + Location"];

    const shouldRender = chapterNavigationLocation === this.extensionLocation;

    const chapters = this.parseChaptersFromExtensionData();

    return {
      chapters,
      shouldRender,
      error: null,
    };
  },
  mounted() {
  },
  methods: {
    parseChaptersFromExtensionData: function () {
      const regex = /^chapter-(\d)-(\w+)$/;

      return Object.entries(this.extensionData)
        .filter(([key]) => regex.test(key))
        .reduce((arr, [key, value]) => {
          const match = key.match(regex);

          // The chapter numbers are 1 based because it should be human readable in the gsheet, but we need to subtract on to make them 0 based for the array
          const index = Number.parseInt(match[1]) - 1;
          const chapterKey = match[2];

          if (!arr[index]) {
            arr[index] = {};
          }
          arr[index][chapterKey] = value;

          return arr;
        }, []);
    },
  },
};
</script>

<style scoped>
</style>
