<template>
  <div class="mb-4 template" v-if="renderInterrupts">
    <div class="row">
      <div class="col-sm">
        <div class="card d-flex shadow">
          <div class="card-body" v-if="!currentInterrupt">
            <h2>Interrupts</h2>
            <p>Put the good stuff here!</p>
            <div v-for="interrupt in interruptsArray" :key="interrupt.label">
              <b-button class="btn-block btn-default my-2 interrupt-button" @click="selectInterrupt(interrupt.text)">
                {{ interrupt.label }}
              </b-button>
            </div>

          </div>
          <div class="card-body current-interrupt" v-if="currentInterrupt">
            <div class="interrupt-text" v-dompurify-html="currentInterrupt"></div>
            <br><button class="mt-2 btn btn-sm btn-outline-dark close-button"
              v-on:click="closeInterrupt()">Close</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'app-interrupts',
  props: {
    currentInterrupt: String,
    extensionList: Object,
  },
  data: function () {
    return {
      interruptsArray: [],
      interruptLabels: [],
      renderInterrupts: false,
      error: null
    };
  },
  mounted() {
    this.interruptsArray = this.parseInterruptsFromExtensionList();
    if (this.interruptsArray.length > 0) {
      this.renderInterrupts = true;
    }
  },
  methods: {
    selectInterrupt(interruptText) {
      console.log('new interrupt text', interruptText)
      this.$emit('process-extension-update', ['currentInterrupt', interruptText])
    },
    closeInterrupt() {
      this.$emit('process-extension-update', ['currentInterrupt', null])
    },
    parseInterruptsFromExtensionList() {
      const regex = /^interrupt-(\d+)-(\w+)$/;

      return Object.entries(this.extensionList)
        .filter(([key]) => regex.test(key))
        .reduce((arr, [key, value]) => {
          const match = key.match(regex);

          // The interrupt numbers are 1 based because it should be human readable in the gsheet, but we need to subtract one to make them 0 based for the array
          const index = Number.parseInt(match[1]) - 1;
          const text = match[2];

          if (!arr[index]) {
            arr[index] = {};
          }
          arr[index][text] = value;

          return arr;
        }, []);
    }
  }
}
</script>

<style scoped>

</style>