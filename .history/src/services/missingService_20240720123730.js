import { collection, getDocs } from "firebase/firestore";
import { db } from "./firebaseService";

async function getPeople() {
  const peopleCollection = collection(db, "missingPersons");
  const peopleSnapshot = await getDocs(peopleCollection);
  const peopleList = peopleSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  return peopleList;
}

export { getPeople };
