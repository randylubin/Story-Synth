<template>
  <div class="single-game-launcher container">
    <div class="card shadow mb-4" style="">
      <div class="card-body">
        <div class="row my-4">
          <div class="col-sm text-center">
            <h2>Create a Session</h2>
          </div>
        </div>

        <div class="row">
          <div class="col-sm form-group">
            <label for="roomInput">Session Name</label>

            <svg v-b-tooltip.hover title="The shareable session code – use this random one or write in a custom one"
              width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-question-circle-fill m-1" fill="currentColor"
              xmlns="http://www.w3.org/2000/svg">
              <path fill-rule="evenodd"
                d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM5.496 6.033a.237.237 0 0 1-.24-.247C5.35 4.091 6.737 3.5 8.005 3.5c1.396 0 2.672.73 2.672 2.24 0 1.08-.635 1.594-1.244 2.057-.737.559-1.01.768-1.01 1.486v.105a.25.25 0 0 1-.25.25h-.81a.25.25 0 0 1-.25-.246l-.004-.217c-.038-.927.495-1.498 1.168-1.987.59-.444.965-.736.965-1.371 0-.825-.628-1.168-1.314-1.168-.803 0-1.253.478-1.342 1.134-.018.137-.128.25-.266.25h-.825zm2.325 6.443c-.584 0-1.009-.394-1.009-.927 0-.552.425-.94 1.01-.94.609 0 1.028.388 1.028.94 0 .533-.42.927-1.029.927z" />
            </svg>

            <div class="input-group">
              <input v-model="roomID" class="form-control" placeholder="Room Code" title="Room Code" id="roomInput" />
              <div class="input-group-append">
                <button class="btn btn-sm btn-outline-dark" title="Assign random room name"
                  v-on:click="assignRandomRoomName()">
                  <svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-arrow-clockwise" fill="currentColor"
                    xmlns="http://www.w3.org/2000/svg">
                    <path fill-rule="evenodd" d="M8 3a5 5 0 1 0 4.546 2.914.5.5 0 0 1 .908-.417A6 6 0 1 1 8 2v1z" />
                    <path
                      d="M8 4.466V.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384L8.41 4.658A.25.25 0 0 1 8 4.466z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        <div class="row" v-if="customOptions.password">
          <div class="col-sm form-group">
            <label for="passwordInput">Password</label>

            <svg v-b-tooltip.hover title="The password provide by the game designer or publisher" width="1em"
              height="1em" viewBox="0 0 16 16" class="bi bi-question-circle-fill m-1" fill="currentColor"
              xmlns="http://www.w3.org/2000/svg">
              <path fill-rule="evenodd"
                d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM5.496 6.033a.237.237 0 0 1-.24-.247C5.35 4.091 6.737 3.5 8.005 3.5c1.396 0 2.672.73 2.672 2.24 0 1.08-.635 1.594-1.244 2.057-.737.559-1.01.768-1.01 1.486v.105a.25.25 0 0 1-.25.25h-.81a.25.25 0 0 1-.25-.246l-.004-.217c-.038-.927.495-1.498 1.168-1.987.59-.444.965-.736.965-1.371 0-.825-.628-1.168-1.314-1.168-.803 0-1.253.478-1.342 1.134-.018.137-.128.25-.266.25h-.825zm2.325 6.443c-.584 0-1.009-.394-1.009-.927 0-.552.425-.94 1.01-.94.609 0 1.028.388 1.028.94 0 .533-.42.927-1.029.927z" />
            </svg>
            <input type="text" class="form-control" v-model="passwordInput" />
          </div>
        </div>

        <div class="row mb-5" v-if="
          !customOptions.password || passwordInput == customOptions.password
        ">
          <div class="col-sm text-center">
            <router-link :to="{ path: constructURL($route.fullPath, roomID) }">
              <button :disabled="!roomID" type="button" class="btn btn-dark">
                Join Session
              </button>
            </router-link>
          </div>
        </div>
        <div class="row" v-else>
          <div class="col-sm text-center">
            <button class="btn btn-outline-danger" :disabled="true">
              Enter Password
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>


<script>
import createRandomRoomName from "/src/misc/createRandomRoomName.js";

export default {
  name: "app-gameLauncherSingleGame",
  props: {
    gameRoute: String,
  },
  data() {
    return {
      currentUrl: location.hostname.toString() + "/#" + this.$route.fullPath,
      roomID: null,
      dataReady: false,
      error: null,
      passwordInput: null,
      customOptions: {
        password: undefined,
      },
    };
  },
  mounted() {
    if (!this.roomID) {
      this.assignRandomRoomName();
    }

    let body = document.getElementById("app"); // document.body;
    body.classList.remove(body.classList[0]);
  },
  methods: {
    updateUrl() {
      this.currentUrl =
        location.hostname.toString() + "/#" + this.$route.fullPath;
    },
    constructURL(routeFullPath, roomID) {
      return this.gameRoute + roomID;
    },
    recreateSheetURL(sheetID) {
      return "https://docs.google.com/spreadsheets/d/" + sheetID;
    },
    assignRandomRoomName() {
      this.roomID = createRandomRoomName();
    },
  },
};
</script>

<style scoped>
.game-launcher {
  max-width: 600px;
  margin: auto;
}

.full-page-background {
  position: absolute;
  height: 100%;
  width: 100vw;
  top: 0;
  right: 0;
  margin: 0;
  z-index: -1;
}
</style>