import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Accelerometer } from 'expo-sensors';
import { sendCoordinates } from './geolocation';
import { getContacts } from './homeServices';
import { Permissions } from 'expo-permissions';

class ShakeTrigger extends React.Component {
  constructor() {
    super();
    this.isShake = false;
  }

  async componentDidMount() {
    // Request accelerometer permission
    await this.requestAccelerometerPermission();

    // Use the Accelerometer module to start listening for motion data
    Accelerometer.addListener(this.handleAcceleration);
  }

  componentWillUnmount() {
    Accelerometer.removeAllListeners(); // Remove all listeners when the component unmounts
  }

  async requestAccelerometerPermission() {
    const { status } = await Permissions.askAsync(Permissions.ACCCELEROMETER);
    if (status !== 'granted') {
      // Handle permission denied
      console.log('Accelerometer permission denied.');
    }
  }

  handleAcceleration = ({ x, y, z }) => {
    // You can use accelerometer data (x, y, z) for motion detection
    // Example: Trigger an action when a certain threshold is reached
    if (Math.abs(x) > 2 || Math.abs(y) > 2 || Math.abs(z) > 2) {
      this.handleShake();
    }
  };

  async handleShake() {
    // Fetch the emergency contact phone numbers using the imported function
    const phoneNumbers = await getContacts();

    // Now you have the phone numbers and can use them as needed
    phoneNumbers.forEach((phoneNumber) => {
      sendCoordinates(phoneNumber);
    });

    // Update the shake status to true
    this.isShake = true;
    this.props.onShake(this.isShake);
  }

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
