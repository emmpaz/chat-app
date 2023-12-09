// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getFirestore} from 'firebase/firestore';
import { GoogleAuthProvider } from "firebase/auth";
import { getAuth } from "firebase/auth";
import Cookies from "universal-cookie";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
export const firebaseConfig = {
    apiKey: "AIzaSyA04qpJ4B9zssWIThR3BbaOfsDspS1ttkI",
    authDomain: "personal-8fc67.firebaseapp.com",
    projectId: "personal-8fc67",
    storageBucket: "personal-8fc67.appspot.com",
    messagingSenderId: "512976951883",
    appId: "1:512976951883:web:7cbb6f4e43397329160bce",
    measurementId: "G-CMZDDBPSMP"
  };

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth();
export const provider = new GoogleAuthProvider();
export const db = getFirestore(app);
export const cookies = new Cookies()