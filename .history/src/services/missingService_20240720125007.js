import { collection, getDocs, add } from "firebase/firestore";
import { db } from "./firebaseService";

async function getPeople() {
  const peopleCollection = collection(db, "missing");
  const peopleSnapshot = await getDocs(peopleCollection);
  const peopleList = peopleSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  return peopleList;
}


async function addPerson(person) {
    const peopleCollection = collection(db, "missing");
    await addDoc(peopleCollection, person);
  }


export { getPeople, addPerson };
