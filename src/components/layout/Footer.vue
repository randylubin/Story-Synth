<template>
  <footer class="container text-center">
    <div class="row">
      <div class="col-sm d-flex justify-content-center">
        <p class="py-1 game-meta footer-text">Powered by <a href="https://storysynth.org">Story Synth</a></p>

      </div>
    </div>
  </footer>
</template>

<script>
export default {
  name: 'app-footer',
  data: function () {
    return {
    };
  }
};
</script>

<style scoped>
footer {
  position: absolute;
  bottom: 0;
  width: 100%;
  height: 3rem;
  left: 0;
  right: 0;
}

.footer-text {
  backdrop-filter: blur(1px);
}
</style>