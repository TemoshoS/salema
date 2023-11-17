import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Accelerometer } from 'expo-sensors';
import { Permissions } from 'expo-permissions';

const ShakeTrigger = ({ onShake }) => {
  useEffect(() => {
    const handleAcceleration = ({ x, y, z }) => {
      // You can use accelerometer data (x, y, z) for motion detection
      // Example: Trigger an action when a certain threshold is reached
      if (Math.abs(x) > 2 || Math.abs(y) > 2 || Math.abs(z) > 2) {
        onShake && onShake(true);
      }
    };

    const requestAccelerometerPermission = async () => {
      try {
        const { status } = await Permissions.askAsync(Permissions.MOTION);
        if (status !== 'granted') {
          // Handle permission denied
          console.log('Accelerometer permission denied.');
        }
      } catch (error) {
        console.error('Error requesting accelerometer permission:', error);
      }
    };

    // Request accelerometer permission
    requestAccelerometerPermission();

    // Use the Accelerometer module to start listening for motion data
    const subscription = Accelerometer.addListener(handleAcceleration);

    return () => {
      subscription.remove(); // Remove the listener when the component unmounts
    };
  }, [onShake]);

  return (
    <View style={styles.container}>
      <Text>Shake me!</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ShakeTrigger;
