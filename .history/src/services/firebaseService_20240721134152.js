import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getAuth} from 'firebase/auth';
import {getFirestore} from 'firebase/firestore'
import firebase from 'firebase/compat/app';
import { getStorage } from 'firebase/storage';
import 'firebase/compat/auth';
// import auth from '@react-native-firebase/auth';

import 'firebase/compat/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
if (!firebase.apps.length ) {
  firebase.initializeApp(firebaseConfig);
 }

const app = initializeApp(firebaseConfig);

const auth = getAuth(app)
// auth.setPersistence = AsyncStorage;
// auth.setPersistence(auth.Auth.Persistence.LOCAL);

const db = getFirestore(app)
// auth.setPersistence = AsyncStorage;

const storage = getStorage(app);

export {auth, db, firebase, storage}
