import {ref, onValue, onDisconnect, set, child, get} from "firebase/database";
import rtdb from "../rtdb";

const rooms = ref(rtdb, "rooms");
const amOnline = ref(rtdb, ".info/connected");

function createNewRandomUserRef(routeRoomID) {
  const userId =
    "rooms/" +
    routeRoomID +
    "/" +
    Math.trunc(Math.random() * 100000).toString();

  return ref(rtdb, userId);
}

export function notifyMyOnlineStatus(routeRoomID) {
  const userRef = createNewRandomUserRef(routeRoomID);

  onValue(amOnline, (snapshot) => {
    if (snapshot.val()) {
      onDisconnect(userRef).remove();
      setMyOnlineData(userRef, {here: true})
    }
  });
  return userRef;
}

// Gets the current db state, merges data with it and sets the db to the new value.
export function setMyOnlineData(userRef, data) {
  get(userRef).then(snapshot => {
    const newData = Object.assign({}, snapshot.val(), data)
    set(userRef, newData);
  })
}

export function onRoomInfoUpdate(routeRoomID, onUpdate) {
  const roomRef = child(rooms, routeRoomID);

  onValue(roomRef, (snapshot) => {
    onUpdate(snapshot.val());
  });
}
