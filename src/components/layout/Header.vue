<template>
    <div class="header-section">

        <b-navbar toggleable="md" type="dark" variant="dark" fixed="top" v-if="!$route.params.roomID">
          <b-navbar-brand href="/">Story Synth</b-navbar-brand>
          <b-navbar-toggle target="navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
          </b-navbar-toggle>
        
          <b-collapse id="navbarSupportedContent" is-nav>
            <b-navbar-nav>
                <b-nav-item href="/about">About</b-nav-item>
                <b-nav-item href="/about/formats.html">Formats</b-nav-item>
                <b-nav-item href="/about/playtest.html">Playtest</b-nav-item>
                <b-nav-item href="/about/publish.html">Publish</b-nav-item>
                <b-nav-item href="/about/extend.html">Extend</b-nav-item>
            </b-navbar-nav>
          </b-collapse>
        </b-navbar>

        <div class="container game-room" v-if="$route.params.roomID">
          <div class="row mb-4">
            <div class="col">
              <div class="input-group">
                <div class="input-group-prepend">
                  <button class="btn btn-dark" @click="$bvToast.show('copyToast')" v-on:click="copyTextToClipboard()" type="button">🔗</button>
                </div>
                <input style="cursor: pointer;" @click="$bvToast.show('copyToast')" v-on:click="copyTextToClipboard()" id="urlForCopying" type="text" class="form-control" :value="currentUrl" readonly="readonly">
                
                <b-toast variant="success" id="copyToast" auto-hide-delay="1000" no-close-button>
                    Link copied to clipboard
                </b-toast>

              </div>
            </div>
            <div class="col-3">
              <transition name="bounce" mode="out-in">
                <p v-if="roomInfo" :key="Object.keys(roomInfo).length" class="pt-2">{{ Object.keys(roomInfo).length }} 👀</p>
              </transition>
            </div>
          </div>
        </div>

    </div>
</template>

<script>
import { rtdb } from '../../firebase'
var rooms = rtdb.ref('rooms')
var amOnline = rtdb.ref('.info/connected');

export default {
  name: 'app-header',
  props: {
    routeRoomID: String,
  },
  data () {
    return {
        roomID: null,
        gameType: null,
        gSheetID: null,
        currentUrl: location.hostname.toString() + "/#" + this.$route.fullPath,
        roomInfo: {
          
        }
    }
  },
  firebase: {
    roomInfo: rtdb.ref('documents')
  },
  mounted(){

    if (this.routeRoomID){
      var tempUserRef = "rooms/" + this.routeRoomID + "/" + Math.trunc(Math.random()*1000).toString()

      var userRef = rtdb.ref(tempUserRef);

      amOnline.on('value', function(snapshot) {
        if (snapshot.val()) {
          userRef.onDisconnect().remove();
          userRef.set(true);
        }
      });

      this.$rtdbBind('roomInfo', rooms.child(this.routeRoomID))
        .then(() => {

        })
    }
  },
  watch:{
    $route (){
      if (this.routeRoomID){
        var tempUserRef = "rooms/" + this.routeRoomID + "/" + Math.trunc(Math.random()*1000).toString()

        var userRef = rtdb.ref(tempUserRef);

        amOnline.on('value', function(snapshot) {
          if (snapshot.val()) {
            userRef.onDisconnect().remove();
            userRef.set(true);
          }
        });

        this.$rtdbBind('roomInfo', rooms.child(this.routeRoomID))
          .then(() => {

          })
      }
        
    }
  },
  updated(){
    this.updateUrl()
  },
  methods: {
    updateUrl(){
      this.currentUrl = location.hostname.toString() + "/#" + this.$route.fullPath;
    },
    copyTextToClipboard(){
      var copyText = document.getElementById("urlForCopying")
      copyText.select()
      copyText.setSelectionRange(0, 99999);
      document.execCommand("copy");
    }, 
  },
};
</script>

<style scoped>
  .bounce-enter-active {
    animation: bounce-in .5s;
  }

  @keyframes bounce-in {
    0% {
      transform: scale(0);
    }
    50% {
      transform: scale(1.2);
    }
    100% {
      transform: scale(1);
    }
  }
</style>