import { initializeApp } from "firebase/app";
import {
  GoogleAuthProvider,
  getAuth,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut,
} from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAJ0EPkOAGPNQ1emrxeS6SxhMOHUt-zlU0",
  authDomain: "twitter-distribuidos.firebaseapp.com",
  projectId: "twitter-distribuidos",
  storageBucket: "twitter-distribuidos.appspot.com",
  messagingSenderId: "411762054891",
  appId: "1:411762054891:web:140332a4e1c6cbb66dd0ae",
  measurementId: "G-52KBG8MBVP",
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

const googleProvider = new GoogleAuthProvider();
const signInWithGoogle = async () => {
  try {
    const res = await signInWithPopup(auth, googleProvider);
    const user = res.user;
    return user;
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
};

export { signInWithGoogle, auth, signOut };
