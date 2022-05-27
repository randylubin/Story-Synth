import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import {
  signInAnonymously
} from "firebase/auth";
import config from "./config";

firebase.initializeApp(config);
const auth = firebase.auth();

export default auth;

export function anonymousSignIn() {
  return signInAnonymously(auth);
}