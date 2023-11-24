import { auth } from "./firebaseService";
import {
  createUserWithEmailAndPassword,
  updateProfile,
  getAuth,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  onAuthStateChanged,
} from "firebase/auth";



const registerUser = async (email, password, displayName) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );

    await updateProfile(userCredential.user, {
      displayName: displayName,
      phoneNumber: phone,
    });

    return userCredential.user;
  } catch (error) {
    throw error;
  }
};

const loginUser = async (email, password) => {
    try {
        const userCredential = await signInWithEmailAndPassword(
        getAuth(),
        email,
        password
        );
    
        return userCredential.user;
    } catch (error) {
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


//check if user is logged in
const checkUserLoggedIn = (callback) => {
    

    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (user) {
        
        const uid = user.uid;
       
      } else {
 
       
      }

      
    });
    return unsubscribe;
}



export { registerUser, loginUser, resetPassword, signOutUser,checkUserLoggedIn}

