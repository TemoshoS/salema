import { auth } from "./firebaseService";

import {
  createUserWithEmailAndPassword,
  updateProfile,
  getAuth,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  onAuthStateChanged,
  getReactNativePersistence
} from "firebase/auth";
// import { getAuth, signInWithEmailAndPassword } from '@react-native-firebase/auth';

import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import { useState, useEffect } from "react";
import Toast from "react-native-toast-message";


const authService = ()  => {
  
const [user, setUser] = useState();
const [isLoading, setIsLoading] = useState(false);

  const registerUser = async (email, password, displayName, phoneNumber) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );

    await updateProfile(userCredential.user, {
      displayName: displayName,
      phoneNumber: phoneNumber,
      smsMessage:"my message"
    });

    return userCredential.user;
  } catch (error) {
    throw error;
  }
};
const loadUserState = async () =>{
  // return new Promise((resolve, reject) => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // console.log(user);
        currentUser = user.uid;
        setUser(user)
        resolve(currentUser);
      } else {
        currentUser = null;
        resolve(null);
      }
    });
  // });

}
const loginUser = async (email, password) => {
  
  setIsLoading(true)
    try {
        const userCredential = await signInWithEmailAndPassword(
        getAuth(),
        email,
        password
        );
          // console.log(userCredential.user);
          setUser(userCredential.user)
          // console.log(user);
        
          setIsLoading(false)
          
    
        return userCredential.user;
    } catch (error) {
        console.log(error);
        throw error;
    }
    };
  

// Function to send a password reset email
const resetPassword = async (email) => {
  try {
    await sendPasswordResetEmail(auth, email);
  } catch (error) {
    throw error;
  }
};


// Function to sign out a user
const signOutUser = async () => {
    try {
      await auth.signOut();
    } catch (error) {
      throw error;
    }
  };
   useEffect(() => {
        // fetchData();
        checkUserLoggedIn()
        // console.log(user );
    }, []);

const checkUserLoggedIn = async () => {
  try {
    const user = await auth.currentUser;
    // console.log('init:', user);

    if (user) {
      setUser(user);
      return user;
    }

    return null;
  } catch (error) {
    console.error('Error checking user login:', error);
    return null;
  }
};

 return { registerUser, loadUserState,loginUser, resetPassword, signOutUser,checkUserLoggedIn,user}
};
export default authService;

