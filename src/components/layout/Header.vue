<template>
    <div class="header-section">

        <b-navbar toggleable="md" type="dark" variant="dark" fixed="top" v-if="!$route.params.roomID">
          <b-navbar-brand href="/">Story Synth</b-navbar-brand>
          <b-navbar-toggle target="navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
          </b-navbar-toggle>
        
          <b-collapse id="navbarSupportedContent" is-nav>
            <b-navbar-nav>
                <b-nav-item href="https://docs.storysynth.org/guide">About</b-nav-item>
                <b-nav-item href="https://docs.storysynth.org/guide/formats.html">Formats</b-nav-item>
                <b-nav-item href="https://docs.storysynth.org/guide/design.html">Design</b-nav-item>
                <b-nav-item href="https://docs.storysynth.org/guide/publish.html">Publish</b-nav-item>
                <b-nav-item href="https://docs.storysynth.org/guide/extend.html">Extend</b-nav-item>
            </b-navbar-nav>
          </b-collapse>
        </b-navbar>

    </div>
</template>

<script>


export default {
  name: 'app-header',
}
</script>