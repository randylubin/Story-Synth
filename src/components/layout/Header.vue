<template>
  <b-navbar toggleable="md" type="dark" variant="dark" fixed="top" v-if="!$route.params.roomID" :class="{'shadow scrolledNavbar': scrollPosition > 100}">
    <b-navbar-brand href="/">Story Synth</b-navbar-brand>
    <b-navbar-toggle target="navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
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
  </b-navbar>
</template>

<script>


export default {
  name: 'app-header',
  data () {
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