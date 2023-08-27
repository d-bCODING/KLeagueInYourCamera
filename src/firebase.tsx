// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore/lite";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCeQ1jMtegYjoXcbM3zy3F5vTXo8vfepkA",
  authDomain: "kleagueinyourcamera.firebaseapp.com",
  databaseURL: "https://kleagueinyourcamera-default-rtdb.firebaseio.com",
  projectId: "kleagueinyourcamera",
  storageBucket: "kleagueinyourcamera.appspot.com",
  messagingSenderId: "773739073507",
  appId: "1:773739073507:web:b86567f5a10ba1c847dad6",
  measurementId: "G-XK7007X0ZW",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
export const storage = getStorage(app);
export const db = getFirestore(app);
export const auth = getAuth(app);
