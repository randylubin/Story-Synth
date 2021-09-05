<template>
  <div class="roomLink-section">
    <div class="container game-room" v-if="$route.params.roomID">
      <div class="row mb-4">
        <div class="col">
          <div class="input-group">
            <div class="input-group-prepend">
              <button
                class="btn btn-dark"
                @click="$bvToast.show('copyToast')"
                v-on:click="copyTextToClipboard()"
                type="button"
              >
                🔗
              </button>
            </div>
            <input
              style="cursor: pointer"
              @click="$bvToast.show('copyToast')"
              v-on:click="copyTextToClipboard()"
              id="urlForCopying"
              type="text"
              class="form-control"
              :value="currentUrl"
              title="the page url, readonly"
              readonly="readonly"
            />

            <b-toast
              variant="success"
              id="copyToast"
              auto-hide-delay="1000"
              no-close-button
            >
              Link copied to clipboard
            </b-toast>
          </div>
        </div>
        <div class="col-3">
          <transition name="bounce" mode="out-in">
            <p
              v-if="roomInfo"
              :key="Object.keys(roomInfo).length"
              class="pt-2 game-meta"
            >
              {{ Object.keys(roomInfo).length }} 👀
            </p>
          </transition>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { rtdb } from "../../firebase";
var rooms = rtdb.ref("rooms");
var amOnline = rtdb.ref(".info/connected");

export default {
  name: "app-roomLink",
  props: {
    routeRoomID: String,
  },
  data() {
    return {
      roomID: null,
      gameType: null,
      gSheetID: null,
      currentUrl: location.hostname.toString() + "/" + this.$route.fullPath,
      roomInfo: {},
    };
  },
  firebase: {
    roomInfo: rtdb.ref("documents"),
  },
  mounted() {
    if (this.routeRoomID) {
      var tempUserRef =
        "rooms/" +
        this.routeRoomID +
        "/" +
        Math.trunc(Math.random() * 100000).toString();

      var userRef = rtdb.ref(tempUserRef);

      amOnline.on("value", function (snapshot) {
        if (snapshot.val()) {
          userRef.onDisconnect().remove();
          userRef.set(true);
        }
      });

      this.$rtdbBind("roomInfo", rooms.child(this.routeRoomID)).then(() => {});

      this.$gtag.event("reachedGameSession", {
        sheetID: this.$route.gSheetID,
        gameSessionURL: this.currentUrl,
      });

      this.updateUrl();
    }
  },
  watch: {
    $route() {
      if (this.routeRoomID) {
        var tempUserRef =
          "rooms/" +
          this.routeRoomID +
          "/" +
          Math.trunc(Math.random() * 1000).toString();

        var userRef = rtdb.ref(tempUserRef);

        amOnline.on("value", function (snapshot) {
          if (snapshot.val()) {
            userRef.onDisconnect().remove();
            userRef.set(true);
          }
        });

        this.$rtdbBind("roomInfo", rooms.child(this.routeRoomID)).then(
          () => {}
        );

        this.$gtag.event("reachedGameSession", {
          sheetID: this.$route.gSheetID,
          gameSessionURL: this.currentUrl,
        });
      }
    },
  },
  updated() {
    this.updateUrl();
  },
  methods: {
    updateUrl() {
      if (!this.$route.params.userRole) {
        this.currentUrl =
          "https://" + location.hostname.toString() + this.$route.fullPath;
      } else {
        this.currentUrl =
          "https://" +
          location.hostname.toString() +
          "/" +
          this.$route.params.gameType +
          "/" +
          this.$route.params.gSheetID +
          "/" +
          this.$route.params.roomID +
          "/player/";
        console.log(
          "current URL is now",
          this.$route.params.userRole,
          this.currentUrl
        );
      }
    },
    copyTextToClipboard() {
      var copyText = document.getElementById("urlForCopying");
      copyText.select();
      copyText.setSelectionRange(0, 99999);
      document.execCommand("copy");
    },
  },
};
</script>

<style scoped>
.bounce-enter-active {
  animation: bounce-in 0.5s;
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