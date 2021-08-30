import { initializeApp } from 'firebase/app';

const app = initializeApp({
  apiKey: process.env.VUE_APP_FIREBASE_API_KEY,
  authDomain: "",
  databaseURL: process.env.VUE_APP_FIREBASE_DATABASE_URL,
  projectId: process.env.VUE_APP_FIREBASE_PROJECT_ID,
  storageBucket: "",
  messagingSenderId: ""
});

export const db = app.firestore();
// db.settings({ experimentalForceLongPolling: true });
export const roomsCollection = db.collection('rooms');

export const rtdb = app.database();