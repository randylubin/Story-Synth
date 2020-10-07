import { initializeApp } from 'firebase/app';

const app = initializeApp({
  apiKey: "AIzaSyDmcF7_1rUwKCFq0pO1Z66GnMiBWPeq4ls", // TODO: Add your apiKey here
  authDomain: "",
  databaseURL: "https://story-synth.firebaseio.com/",
  projectId: "story-synth", // TODO: Add your projectId here
  storageBucket: "",
  messagingSenderId: ""
});

export const db = app.firestore();
export const roomsCollection = db.collection('rooms');

export const rtdb = app.database();