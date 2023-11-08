import React from 'react';
import { View, StyleSheet } from 'react-native';
import ShakeEvent from 'react-native-shake-event';
import { Accelerometer } from 'expo-sensors';
import firebase from 'firebase';
import { sendCoordinates } from './coordinatesService'; // Assuming you have a service for sending coordinates

class ShakeTrigger extends React.Component {
  constructor() {
    super();
    this.isShake = false;
  }

  async componentDidMount() {
    ShakeEvent.addEventListener('shake', this.handleShake);

    // Start listening to the accelerometer for more fine-grained motion data
    this.subscription = Accelerometer.addListener(this.handleAcceleration);
  }

  componentWillUnmount() {
    ShakeEvent.removeEventListener('shake');
    this.subscription && this.subscription.remove();
  }

  handleShake = async () => {
    // Fetch the emergency contacts from Firebase
    const snapshot = await firebase.firestore().collection('emergency_contacts').get();

    // Send coordinates to each emergency contact
    snapshot.forEach(doc => {
      const contact = doc.data();
      sendCoordinates(contact.phoneNumber);
    });

    // Update the shake status to true
    this.isShake = true;
  };

  handleAcceleration = ({ x, y, z }) => {
    // You can use accelerometer data (x, y, z) for more advanced motion detection
    // Example: Trigger an action when a certain threshold is reached
    if (Math.abs(x) > 2 || Math.abs(y) > 2 || Math.abs(z) > 2) {
      this.handleShake();
    }
  };

  getShakeStatus() {
    return this.isShake;
  }

  render() {
    return <View style={styles.container} />;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default ShakeTrigger;