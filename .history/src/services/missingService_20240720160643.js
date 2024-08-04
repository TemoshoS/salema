import { collection, getDocs, addDoc, updateDoc, doc, arrayUnion } from "firebase/firestore";
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

async function addCommentToPerson(personId, comment) {
  const personDocRef = doc(db, "missing", personId);
  await updateDoc(personDocRef, {
    comments: arrayUnion(comment)
  });
}

export { getPeople, addPerson, addCommentToPerson };
