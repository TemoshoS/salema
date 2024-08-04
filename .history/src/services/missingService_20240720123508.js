import { collection, getDocs,addDoc,where, updateDoc, deleteDoc,query, doc } from "firebase/firestore";
import { db } from "./firebaseService";

 async function getPeople(){
  try {
    const collectionRef = collection(db, "emergency_contacts");
    const q = query(collectionRef, where("userId", "==", currentUser));
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

  export { getPeople}