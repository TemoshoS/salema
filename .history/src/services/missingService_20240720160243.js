import { collection, getDocs, addDoc, doc, updateDoc } from "firebase/firestore";
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

async function getComments(personId) {
  const commentsCollection = collection(db, "missing", personId, "comments");
  const commentsSnapshot = await getDocs(commentsCollection);
  const commentsList = commentsSnapshot.docs.map(doc => doc.data());
  return commentsList;
}

async function addCommentToPerson(personId, comment) {
  const commentsCollection = collection(db, "missing", personId, "comments");
  await addDoc(commentsCollection, comment);
}

export { getPeople, addPerson, getComments, addCommentToPerson };
