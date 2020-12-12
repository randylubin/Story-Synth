<template>
    <footer class="container text-center">
        <div class="row">
          <div class="col-sm-4 offset-sm-4 game-meta">
            <p class="my-1 game-meta">Powered by <a href="https://storysynth.org">Story Synth</a></p>

          </div>
        </div>
    </footer>
</template>

<script>
export default {
  name: 'app-footer',
  data: function() {
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

</style>