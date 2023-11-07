import { collection, getDocs } from "firebase/firestore";
import { db } from "./firebaseService";

async function getContacts() {
  try {
    const collectionRef = collection(db, "EmergencyContacts");
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

export { getContacts };
