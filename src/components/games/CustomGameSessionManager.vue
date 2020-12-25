<template>
  <div class="">
    <app-aroundTheRealm :roomID="$route.params.roomID" v-if="routeGSheetID == 'Around-The-Realm'"></app-aroundTheRealm>
  </div>
</template>

<script>
import AroundTheRealm from './AroundTheRealm.vue'

export default {
  name: 'app-customGameSession',
  components: {
    'app-aroundTheRealm': AroundTheRealm,
  },
  props: {
    routeGSheetID: String,
  },
  data: function() {
    return {
      gameMetaData: {
        'Around-The-Realm': {
          'gameTitle': 'Around The Realm',
          'gameBlurb': 'Tell the story of two close companions racing their way around a fantasy world. Nella and Bly wagered that they could travel completely around the realm and return before the summer solstice. However, the lands are full of magic, danger, and adventure – will they make it back in time?',
          'ogImage': 'https://diegeticgames.com/uploads/around-the-realm-square-unfurl.png', 
        }
      }
    };
  },
  metaInfo () {
    return {
      title: this.gameMetaData[this.routeGSheetID].gameTitle,
      meta: [
        {
          property: 'description',
          content: this.gameMetaData[this.routeGSheetID].gameBlurb,
          vmid: 'description'
        },
        {
          property: 'og:title',
          content: this.gameMetaData[this.routeGSheetID].gameTitle,
          vmid: 'og:title'
        },
        {
          property: 'og:description',
          content: this.gameMetaData[this.routeGSheetID].gameBlurb,
          vmid: 'og:description'
        },
        {
          property: 'og:image',
          content: this.gameMetaData[this.routeGSheetID].ogImage,
          vmid: 'og:image'
        },
        {
          property: 'og:url',
          content: location.hostname.toString() + "/#" + this.$route.fullPath,
          vmid: 'og:url'
        },
        {
          property: 'twitter:card',
          content: 'summary',
          vmid: 'twitter:card'
        },
        {
          property: 'og:site_name',
          content: 'Story Synth',
          vmid: 'og:site_name'
        },
        {
          property: 'twitter:image:alt',
          content: this.gameMetaData[this.routeGSheetID].gameTitle + " logo",
          vmid: 'twitter:image:alt'
        }
      ]
    }
  },
  mounted(){

  },
  methods: {

  }
};
</script>

<style scoped>


</style>