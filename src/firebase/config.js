// TODO: Double check this is the correct config

// *** prod version ***

export default {
  apiKey: process.env.VUE_APP_FIREBASE_API_KEY,
  // TODO: env variable
  //authDomain: "ss-amble.firebaseapp.com",
  databaseURL: process.env.VUE_APP_FIREBASE_DATABASE_URL,
  projectId: process.env.VUE_APP_FIREBASE_PROJECT_ID,
  // TODO: env variable
  //storageBucket: "ss-amble.appspot.com"
  // TODO: env variable
  //messagingSenderId: "750012918172",
  // TODO: env variable
  //appId: "1:750012918172:web:b33c9a0198c2ae9cf0c059"
};

// *** dev version ***

//export default {
//  apiKey: "AIzaSyC8wD5AVrPHhbmPP48jGqkLMz1sV8xzf9k",
//  authDomain: "ss-amble-dev.firebaseapp.com",
//  databaseURL: "https://ss-amble-dev-default-rtdb.asia-southeast1.firebasedatabase.app",
//  projectId: "ss-amble-dev",
//  storageBucket: "ss-amble-dev.appspot.com",
//  messagingSenderId: "81574765944",
//  appId: "1:81574765944:web:4031b86ccdac88c18c948d"
//}
