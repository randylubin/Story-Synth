import { initializeApp } from 'firebase/app';

const app = initializeApp({
  apiKey: "", // TODO: Add your apiKey here
  authDomain: "",
  databaseURL: "", // TODO: Add your databaseURL here
  projectId: "", // TODO: Add your projectId here
  storageBucket: "",
  messagingSenderId: ""
});

export const db = app.firestore();
export const roomsCollection = db.collection('rooms');

export const rtdb = app.database();