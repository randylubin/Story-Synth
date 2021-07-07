import { initializeApp } from 'firebase/app';

const app = initializeApp({
  apiKey: "AIzaSyA4SfYWfVnN5yUoFokGcMOAUvFGXXOWcgI",
  authDomain: "storysynth-raph.firebaseapp.com",
  databaseURL: "https://storysynth-raph-default-rtdb.firebaseio.com",
  projectId: "storysynth-raph",
  storageBucket: "storysynth-raph.appspot.com",
  messagingSenderId: "705821570895",
  appId: "1:705821570895:web:f26b5a2a24baf3e172773a"
});

export const db = app.firestore();
export const roomsCollection = db.collection('rooms');

export const rtdb = app.database();