// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDMMTyommxj67b_Cq3ebzXry0MkD66z_Zs",
  authDomain: "note-app-mitidevus.firebaseapp.com",
  projectId: "note-app-mitidevus",
  storageBucket: "note-app-mitidevus.appspot.com",
  messagingSenderId: "849374636069",
  appId: "1:849374636069:web:f0558d8943fccfb38e77cc",
  measurementId: "G-KCF84C9Y5E"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);