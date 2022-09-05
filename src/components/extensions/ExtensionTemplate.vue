<template>
  <div class="mb-4 template">
    <div class="row">
      <div class="col-sm">
        <div class="card d-flex shadow">
          <div class="card-body">
            <h2>Extension Template</h2>
            <p>Put the good stuff here!</p>

          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'app-template',
  props: {
    templateData: Array,
  },
  data: function () {
    return {
      error: null
    };
  },
  mounted() {

  },
  methods: {

  }
};
</script>

<style scoped>
</style>