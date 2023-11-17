import { collection, getDocs,addDoc, updateDoc, deleteDoc, doc } from "firebase/firestore";
import { db } from "./firebaseService";



async function getContacts() {
  try {
    const collectionRef = collection(db, "emergency_contacts");
    const querySnapshot = await getDocs(collectionRef);
    const contacts = [];

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      contacts.push(data);
    });

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
        console.log('Contact removed successfully');
    } catch (error) {
        console.error('Error removing contact: ', error);
    }
}

export { getContacts ,addContact, updateContact, removeContact};
