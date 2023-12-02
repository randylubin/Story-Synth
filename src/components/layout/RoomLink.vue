<template>
  <div class="roomLink-section">
    <div class="room-link flex-row d-flex" v-if="$route.params.roomID">
      <transition name="bounce" mode="out-in">
        <div v-if="roomInfo" :key="Object.keys(roomInfo).length" class="pt-2 px-2 game-meta live-player-counter"
          v-bind:style="{ color: color }">
          {{ Object.keys(roomInfo).length }} <IBiPeople />
        </div>
      </transition>
      <transition name="bounce" mode="out-in">
        <div v-if="atLeastOneMonetizedUser" class="pt-2 px-2 game-meta live-player-counter"
          v-bind:style="{ color: color }">
          <iBiCoin alt="web monetization active" />
        </div>
      </transition>

      <button class="btn btn-outline-dark ml-auto border-0"
        v-on:click="copyTextToClipboard()" type="button" v-bind:style="{ color: color }">
        <iBiLink45deg /> Copy URL
      </button>

      <!-- <b-toast variant="success" id="copyToast" auto-hide-delay="1000" no-close-button>
        Link copied to clipboard
      </b-toast> -->

      <div aria-live="polite" aria-atomic="true" class="bg-dark position-relative bd-example-toasts">
        <div class="toast-container position-absolute p-3" id="copyToast">
          <div class="toast hide">
            <div class="toast-body">
              Link copied to clipboard
            </div>
          </div>
        </div>
      </div>



    </div>
  </div>
</template>

<script>

import { notifyMyOnlineStatus, onRoomInfoUpdate, setMyOnlineData } from "../../firebase/models/players_in_room.js";

let userRef = null;

export default {
  name: "app-roomLink",
  props: {
    routeRoomID: String,
    color: String,
    monetizedByUser: Boolean,
  },
  data() {
    return {
      roomID: null,
      gameType: null,
      gSheetID: null,
      currentUrl: location.hostname.toString() + "/" + this.$route.fullPath,
      roomInfo: {},
      context: null,
      userID: null,
      atLeastOneMonetizedUser: false,
    };
  },
  mounted() {
    if (this.routeRoomID) {
      this.bindToFirebaseRTDB()
      this.checkMonetization();
    }
  },
  computed: {
    stringyRoomInfo: function () {
      return JSON.stringify(this.roomInfo);
    }
  },
  watch: {
    monetizedByUser: {
      handler() {
        if (this.userRef) {
          setMyOnlineData(this.userRef, { monetized: this.monetizedByUser })
        }
      }, deep: true,
    },
    stringyRoomInfo: {
      handler() {
        this.checkMonetization();
      }, deep: true,
    },
    $route: {
      handler() {
        if (this.routeRoomID) {
          this.bindToFirebaseRTDB()
        }
      }, deep: true,
    },
  },
  updated() {
    this.updateUrl();
  },
  methods: {
    bindToFirebaseRTDB() {
      userRef = notifyMyOnlineStatus(this.routeRoomID);
      onRoomInfoUpdate(this.routeRoomID, (roomInfo) => {
        // console.log(roomInfo)
        this.roomInfo = roomInfo
      })
      this.$gtag.event("reachedGameSession", {
        sheetID: this.$route.gSheetID,
        gameSessionURL: this.currentUrl,
      });
      setMyOnlineData(userRef, { monetized: this.monetizedByUser })
      this.updateUrl();
    },
    checkMonetization() {
      for (const user in this.roomInfo) {
        if (this.roomInfo[user].monetized || this.monetizedByUser) {
          this.atLeastOneMonetizedUser = true; // currently set to be a one way switch – if you shared this room with a monetized user, then you can keep playing if they leave
          this.$emit('roomMonetized', true)
        }
      }
    },
    updateUrl() {
      if (!this.$route.params.userRole) {
        this.currentUrl =
          "https://" + location.hostname.toString() + this.$route.fullPath;
      } else {
        this.currentUrl = "https://" + location.hostname.toString() + '/' + this.$route.params.gameType + '/' + this.$route.params.gSheetID + '/' + this.$route.params.roomID + '/player/'
      }
      // console.log('current URL is now', this.$route.params.userRole, this.currentUrl)
    },
    copyTextToClipboard() {
      navigator.clipboard.writeText(this.currentUrl).then(function () {
        console.log('copied url')
      }, function () {
        console.log('copy failed')
      });
    },
  },
};
</script>

<style scoped>
.live-player-counter {
  color: #343a40
}

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
