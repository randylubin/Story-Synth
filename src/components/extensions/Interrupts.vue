<template>
  <div class="mb-4 template" v-if="renderInterrupts">
    <div v-if="!menuLocation">
      <!-- Interrupt Content -->
      <div class="row mb-4" v-if="currentInterrupt && !roomInfo.xCardIsActive">
        <div class="col-sm">
          <div class="card d-flex shadow">
            <div class="card-body current-interrupt">
              <div class="interrupt-text" v-dompurify-html="currentInterrupt.text"></div>
              <br><button class="mt-2 btn btn-sm btn-outline-dark close-button"
                v-on:click="closeInterrupt()">Close</button>
            </div>
          </div>
        </div>
      </div>

      <!-- Interrupt Options -->
      <div class="row"
        v-if="(!currentInterrupt || extensionList.interruptsKeepOptionsVisible) && (!customOptions.facilitatorMode || userRole == 'facilitator')">
        <div class="col-sm">
          <div class="card d-flex shadow">
            <div class="card-body">
              <div class="interrupts-top-text" v-if="extensionList.interruptTopText"
                v-dompurify-html="interruptTopTextMarkdown"></div>
              <div v-for="interrupt in interruptsArray" :key="interrupt.label">
                <b-button class="btn-block btn-default my-2 interrupt-button"
                  @click="selectInterrupt(interrupt.text, interrupt.label)"
                  v-if="currentInterrupt && interrupt.label == currentInterrupt.label" :active="true" :pressed="true"
                  :active-class="'active'">
                  {{ interrupt.label }}
                </b-button>
                <b-button class="btn-block btn-default my-2 interrupt-button"
                  @click="selectInterrupt(interrupt.text, interrupt.label)"
                  v-if="!currentInterrupt || interrupt.label != currentInterrupt.label">
                  {{ interrupt.label }}
                </b-button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-if="menuLocation">
      <div v-for="interrupt in interruptsArray" :key="interrupt.label">
        <b-button variant="outline-dark" class="btn-block btn-lg my-1 interrupt-button-menu"
          @click="selectInterrupt(interrupt.text, interrupt.label)"
          v-if="currentInterrupt && interrupt.label == currentInterrupt.label" :active="true" :pressed="true"
          :active-class="'active'">
          {{ interrupt.label }}
        </b-button>
        <b-button variant="outline-dark" class="btn-block btn-lg my-1 interrupt-button-menu"
          @click="selectInterrupt(interrupt.text, interrupt.label)"
          v-if="!currentInterrupt || interrupt.label != currentInterrupt.label">
          {{ interrupt.label }}
        </b-button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'app-interrupts',
  props: {
    interruptTopText: String,
    currentInterrupt: Object,
    extensionList: Object,
    menuLocation: Boolean,
    customOptions: Object,
    roomInfo: Object,
    userRole: String,
  },
  data: function () {
    return {
      interruptsArray: [],
      interruptLabels: [],
      renderInterrupts: false,
      interruptTopTextMarkdown: null,
      error: null
    };
  },
  mounted() {
    this.interruptsArray = this.parseInterruptsFromExtensionList();
    if (this.interruptsArray.length > 0) {
      this.renderInterrupts = true;
    }

    if (this.interruptTopText) {
      this.interruptTopTextMarkdown = this.$marked(this.interruptTopText)
    }
  },
  methods: {
    selectInterrupt(interruptText, interruptLabel) {
      let parsedText = interruptText ? this.$marked(interruptText) : null

      let newCurrentInterrupt = { label: interruptLabel, text: parsedText }

      this.$emit('process-extension-update', ['currentInterrupt', newCurrentInterrupt])
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