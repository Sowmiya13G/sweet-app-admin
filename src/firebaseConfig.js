// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getMessaging, getToken, onMessage } from "firebase/messaging";
import { getDatabase } from "firebase/database";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDJK0vlB0sL13aSpgi3G25yBxxh1HYtOAo",
  authDomain: "foodorder-ed990.firebaseapp.com",
  projectId: "foodorder-ed990",
  storageBucket: "foodorder-ed990.appspot.com",
  messagingSenderId: "185137860431",
  appId: "1:185137860431:web:b7cda979839b014793ff3a",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);
const messaging = getMessaging(app);
const database = getDatabase(app);

export { messaging, database, db, app, auth, storage };
