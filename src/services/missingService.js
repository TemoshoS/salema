import { collection, getDocs, addDoc, updateDoc, doc, arrayUnion } from "firebase/firestore";
import { db, storage } from "./firebaseService";
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

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

async function addCommentToPerson(personId, comment, imageUri) {
  const personDocRef = doc(db, "missing", personId);
  
  let imageUrl = null;
  if (imageUri) {
    const response = await fetch(imageUri);
    const blob = await response.blob();
    const imageRef = ref(storage, `comments/${Date.now()}.jpg`);
    await uploadBytes(imageRef, blob);
    imageUrl = await getDownloadURL(imageRef);
  }

  const commentData = { text: comment, image: imageUrl, timestamp: new Date() };
  await updateDoc(personDocRef, {
    comments: arrayUnion(commentData)
  });
}

export { getPeople, addPerson, addCommentToPerson };
