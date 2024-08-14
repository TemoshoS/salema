import { collection, getDocs, addDoc, updateDoc, doc, arrayUnion } from "firebase/firestore";
import { db, storage } from "./firebaseService";
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

async function getPeople() {
  try {
    const peopleCollection = collection(db, "missing");
    const peopleSnapshot = await getDocs(peopleCollection);
    const peopleList = peopleSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    return peopleList;
  } catch (error) {
    console.error("Error getting people:", error);
    throw new Error("Could not fetch people");
  }
}

async function addPerson(person) {
  try {
    const peopleCollection = collection(db, "missing");
    await addDoc(peopleCollection, person);
  } catch (error) {
    console.error("Error adding person:", error);
    throw new Error("Could not add person");
  }
}

async function addCommentToPerson(personId, comment, imageUri, username) {
  try {
    const personDocRef = doc(db, "missing", personId);
    
    let imageUrl = null;
    if (imageUri) {
      const response = await fetch(imageUri);
      const blob = await response.blob();
      const imageRef = ref(storage, `comments/${Date.now()}.jpg`);
      await uploadBytes(imageRef, blob);
      imageUrl = await getDownloadURL(imageRef);
    }

    const commentData = { text: comment, image: imageUrl, username: username || 'Anonymous', timestamp: new Date() };
    await updateDoc(personDocRef, {
      comments: arrayUnion(commentData)
    });
  } catch (error) {
    console.error("Error adding comment:", error);
    throw new Error("Could not add comment");
  }
}

export { getPeople, addPerson, addCommentToPerson };
