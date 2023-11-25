import { collection, getDocs,addDoc, updateDoc, deleteDoc, doc } from "firebase/firestore";
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

async function getContacts() {
  try {
    const collectionRef = collection(db, "emergency_contacts");
    const querySnapshot = await getDocs(collectionRef);
    const contacts = [];

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      contacts.push(data);
    });

    // Filter contacts based on the current user's ID
    const filteredContacts = contacts.filter((contact) => contact.userId === currentUser);

    return filteredContacts;
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
    await updateDoc(docRef, { id: documentId });

    console.log('Contact added successfully with ID:', documentId);
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

export { initializeAuthState,getContacts ,addContact, updateContact, removeContact};
