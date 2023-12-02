<template>
  <nav class="navbar navbar-expand-md navbar-dark position-fixed" :class="{ 'shadow scrolledNavbar': scrollPosition > 100 }" v-if="!$route.params.roomID">
    <div class="container-fluid">
      <a class="navbar-brand" href="/">Story Synth</a>  
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <ul class="navbar-nav me-auto mb-2 mb-lg-0">
          <li class="nav-item"><a class="nav-link" href="https://docs.storysynth.org/guide">About</a></li>
          <li class="nav-item"><a class="nav-link" href="/Gallery/">Gallery</a></li>
          <li class="nav-item"><a class="nav-link" href="/Upload/">Upload</a></li>
          <li class="nav-item"><a class="nav-link" href="https://docs.storysynth.org/guide/design.html">Guide</a></li>
          <li class="nav-item"><a class="nav-link" href="https://docs.storysynth.org/press/">Press</a></li>
        </ul>
      </div>
    </div>
    <!-- <b-navbar toggleable="md" type="dark" variant="dark" v-b-color-mode="'dark'" fixed="top" v-if="!$route.params.roomID"
      :class="{ 'shadow scrolledNavbar': scrollPosition > 100 }">
      <b-navbar-brand href="/">Story Synth</b-navbar-brand>
      <b-navbar-toggle target="navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false"
        aria-label="Toggle navigation">
      </b-navbar-toggle>
  
      <b-collapse id="navbarSupportedContent" is-nav>
        <b-navbar-nav>
          <b-nav-item href="https://docs.storysynth.org/guide">About</b-nav-item>
          <b-nav-item href="/Gallery/">Gallery</b-nav-item>
          <b-nav-item href="/Upload/">Upload</b-nav-item>
          <b-nav-item href="https://docs.storysynth.org/guide/design.html">Guide</b-nav-item>
          <b-nav-item href="https://docs.storysynth.org/press/">Press</b-nav-item>
        </b-navbar-nav>
      </b-collapse>
    </b-navbar> -->
  </nav>
</template>

<script>


export default {
  name: 'app-header',
  data() {
    return {
      scrollPosition: null
    }
  },
  methods: {
    updateScroll() {
      this.scrollPosition = window.scrollY
    }
  },
  mounted() {
    window.addEventListener('scroll', this.updateScroll);
  },
  destroy() {
    window.removeEventListener('scroll', this.updateScroll)
  }
}
</script>