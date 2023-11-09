import React from 'react';
import { View, StyleSheet } from 'react-native';
import RNShake from 'react-native-shake';
import { Accelerometer } from 'expo-sensors';
import { sendCoordinates } from './geolocation';
import { getContacts } from './homeServices';
import { requestPermissions } from './geolocation';

class ShakeTrigger extends React.Component {
  constructor() {
    super();
    this.isShake = false;
  }

  async componentDidMount() {
    RNShake.addListener(() => {
      this.handleShake();
    });

    // Start listening to the accelerometer for more fine-grained motion data
    this.subscription = Accelerometer.addListener(this.handleAcceleration);
  }

  componentWillUnmount() {
    RNShake.removeListener();
    this.subscription && this.subscription.remove();
  }

  handleShake = async () => {
    // permission request
    await requestPermissions();

    // Fetch the emergency contact phone numbers using the imported function
    const phoneNumbers = await getContacts();

    // Now you have the phone numbers and can use them as needed
    phoneNumbers.forEach((phoneNumber) => {
      sendCoordinates(phoneNumber);
    });

    // Update the shake status to true
    this.isShake = true;
    this.props.onShake(this.isShake);
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
