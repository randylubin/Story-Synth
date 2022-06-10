import {
  collection,
  doc,
  onSnapshot,
  setDoc,
  updateDoc,
  getDoc
} from "firebase/firestore";
import { db } from "../firestore";

export const roomsCollection = collection(db, "rooms");

// Returns a function you can call to unsubscribe from updates.
export function onRoomUpdate(roomID, onUpdate) {
  const roomDocument = doc(roomsCollection, roomID);

  return onSnapshot(roomDocument, snapshot => {
    onUpdate(snapshot.data(), snapshot);
  });
}

function getRoomDoc(roomID) {
  return doc(db, "rooms", roomID);
}

export function setRoom(roomID, data) {
  const roomDocument = doc(roomsCollection, roomID);
  return setDoc(roomDocument, data);
}

export function updateRoom(roomID, data) {
  const roomDocument = getRoomDoc(roomID);
  return updateDoc(roomDocument, data);
}

export async function getRoom(roomId) {
  return getDoc(getRoomDoc(roomId)).then(docSnap => {
    if (docSnap.exists()) {
      return docSnap.data();
    }
    return null;
  });
}
