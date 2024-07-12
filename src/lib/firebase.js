// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import {getAuth} from "firebase/auth"
import { getStorage } from "firebase/storage"

const firebaseConfig = {
  apiKey: import.meta.env.VITE_API_KEY,
  authDomain: "chatwave-90bcf.firebaseapp.com",
  projectId: "chatwave-90bcf",
  storageBucket: "chatwave-90bcf.appspot.com",
  messagingSenderId: "397247213582",
  appId: "1:397247213582:web:477b4a241fe386964d4c5f",
  measurementId: "G-506LM83VXC"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth()
export const db = getFirestore();
export const storage = getStorage()