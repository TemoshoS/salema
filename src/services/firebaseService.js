// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

import {getAuth} from 'firebase/auth';
import {getFirestore} from 'firebase/firestore'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDu4HRiR0NO3ch4R0DIafBVmNNH_wY17QE",
  authDomain: "salema-dce69.firebaseapp.com",
  projectId: "salema-dce69",
  storageBucket: "salema-dce69.appspot.com",
  messagingSenderId: "486960310117",
  appId: "1:486960310117:web:58adc2b1b0f83d32bbe38c",
  measurementId: "G-XF4W0FCZC5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

const auth = getAuth(app)
const db = getFirestore(app)
export {auth, db}