<template>
  <div class="mb-4 static-box">
      <div class="row">
        <div class="col-sm">
          <div class="card d-flex extension-card">
            <div class="card-body" v-html="markdownParsedStaticContent">
            </div>
          </div>
        </div>
      </div>
  </div>
</template>

<script>
export default {
  name: 'app-staticBox',
  props: {
    staticBoxContent: String,
  },
  data: function() {
    return {
      error: null
    };
  },
  computed: {
    markdownParsedStaticContent: function(){
      return this.$marked(this.staticBoxContent)
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