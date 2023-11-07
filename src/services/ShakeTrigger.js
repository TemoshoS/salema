import Shake from 'react-native-shake'; // install this package
import firebase from 'firebase';
import { sendCoordinates } from './geolocation'; // geolocation.js is in the same directory

class ShakeTrigger {
  constructor() {
    Shake.addEventListener('shake', this.handleShake);
  }

  handleShake = async () => {
    // Fetch the current user's phone number from Firebase
    const user = firebase.auth().currentUser;
    const snapshot = await firebase.database().ref(`/users/${user.uid}`).once('value');
    const phoneNumber = snapshot.val().phoneNumber;

    sendCoordinates(phoneNumber);
  };

  removeShakeListener() {
    Shake.removeEventListener('shake');
  }
}

export default ShakeTrigger;