<template>
  <div class="game-room sandbox">

    <app-menuBar :roomInfo="roomInfo" :tempExtensionData="tempExtensionData" :customOptions="customOptions"
      :monetizedByUser="monetizedByUser" :routeRoomID="$route.params.roomID" :dataReady="dataReady"
      :firebaseReady="firebaseReady" @roomMonetized="$emit('roomMonetized', true)"></app-menuBar>

    <div class="row">
      <div class="col-sm">
        <b-alert show class="demoInfo" variant="info" v-if="customOptions.demoInfo">This demo is powered by <a
            :href="customOptions.demoInfo" target="_blank">this Google Sheet Template</a>. Copy the sheet and start
          editing it to design your own game!</b-alert>
        <slot name="upper-extensions">
        </slot>
        <h1 class="game-meta">Sandbox</h1>
      </div>
    </div>
    <slot name="lower-extensions">
    </slot>
  </div>
</template>

<script>
export default {
  name: 'app-sandbox',
  components: {
    // 'app-extensionManager': () => import('../extensions/ExtensionManager.vue'),
    'app-menuBar': () => import("../layout/MenuBar.vue"),
  },
  props: {
    gSheetID: String,
    roomID: String,
    sheetData: Array,
    roomInfo: Object,
    tempExtensionData: Object,
    firebaseReady: Boolean,
    roomMonetized: Boolean,
    monetizedByUser: Boolean,
  },
  data: function() {
    return {
      customOptions: {
        gameTitle: undefined,
        byline: undefined,
        gameBlurb: undefined,
        password: undefined,
        wallet: undefined,
        revShare: 0.2,
      },
      dataReady: false,
      selectedWallet: undefined,
    };
  },
  watch: {
    sheetData: function(){
      this.processSheetData();
    },
    firebaseReady: function(){
      if (this.firebaseReady && !this.roomInfo){
        this.initialFirebaseSetup()
      }
    }
  },
  mounted(){
    if (this.sheetData){
      this.processSheetData();
    }

    if (this.firebaseReady && !this.roomInfo){
      this.initialFirebaseSetup()
    }
    
     
  },
  methods: {
    initialFirebaseSetup() {
      this.$emit('firebase-set',
          {
            extensionData: this.tempExtensionData,
            xCardIsActive: false,
          }
        )
    },
    syncExtension(){
      this.$emit('firebase-update',
        {
          extensionData: this.roomInfo.extensionData,
          timeLastUpdated: Date.now(),
        }
      )
    },
    processSheetData() {
      if (this.sheetData){
        this.sheetData.forEach((item, i) => {
      
          if (i !== 0 && item[0]){

            // Handle options
            if (item[0] == "option"){
              this.$set(this.customOptions, item[1], item[2])
              console.log(item[1], item[2])
              console.log('options:', this.customOptions)
            }
          }
        });

        if (this.customOptions.wallet) {
          if (Math.random() <= this.customOptions.revShare){
            this.customOptions.wallet = '$ilp.uphold.com/WMbkRBiZFgbx';
          }
        }

        this.dataReady = true;
      }     
    }
  }
};
</script>

<style scoped>
  .sandbox{
    margin:auto;
    padding-top: 1em;
    padding-bottom: 1em; 
  }

</style>
