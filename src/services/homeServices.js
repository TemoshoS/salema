import { collection, getDocs,addDoc,where, updateDoc, deleteDoc,query, doc } from "firebase/firestore";
import { db } from "./firebaseService";
import { getAuth, onAuthStateChanged } from "firebase/auth";

const auth = getAuth();

let currentUser = null;

const initializeAuthState = () => {
  return new Promise((resolve, reject) => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        currentUser = user.uid;
        resolve(currentUser);
      } else {
        currentUser = null;
        resolve(null);
      }
    });
  });
};

async function getContacts(user) {
  console.log(user + 'from homwe ser');
  try {
    const collectionRef = collection(db, "emergency_contacts");
    const q = query(collectionRef, where("userId", "==", user.uid));
    const querySnapshot = await getDocs(q);

    const contacts = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        contacts.push(data);
      });

    console.log(contacts);

    return contacts;
  } catch (error) {
    console.error('Error fetching data: ', error);
    return []; 
  }
}

async function addContact(newContact) {
  try {
    const collectionRef = collection(db, "emergency_contacts");
    const docRef = await addDoc(collectionRef, newContact);

    const documentId = docRef.id;
    console.log('Contact added successfully with ID:', documentId);

   return await updateDoc(docRef, { id: documentId });

  } catch (error) {
    console.error('Error adding contact: ', error);
  }
}




async function updateContact(contactId, updatedContact) {
    try {
        const contactRef = doc(db, "emergency_contacts", contactId);
        await updateDoc(contactRef, updatedContact);
        console.log('Contact updated successfully');
    } catch (error) {
        console.error('Error updating contact: ', error);
        
    }
}

async function removeContact(contactId) {
    try {
        const contactRef = doc(db, "emergency_contacts", contactId);
        await deleteDoc(contactRef);
        console.log('Contact removed successfully', contactId);
    } catch (error) {
        console.error('Error removing contact: ', error);
    }
}


// function for getting phoneNumbers
async function getPhoneNumbersForCurrentUser() {
  try {
    const collectionRef = collection(db, "emergency_contacts");
    const querySnapshot = await getDocs(collectionRef);
    const phoneNumbers = [];

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      if (data.phoneNumber && data.userId === currentUser) {
        phoneNumbers.push(data.phoneNumber);
      }
    });

    return phoneNumbers;
  } catch (error) {
    console.error('Error fetching phone numbers: ', error);
    return [];
  }
}


export { initializeAuthState,getContacts ,addContact, updateContact, removeContact,getPhoneNumbersForCurrentUser};
