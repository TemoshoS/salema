
import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Accelerometer } from 'expo-sensors';
import { Permissions } from 'expo-permissions';
import getLocationPermission from './geolocation';
const ShakeTrigger = ({ onShake }) => {
  const [isShakePaused, setIsShakePaused] = useState(false);

  useEffect(() => {
    let last_x, last_y, last_z;
    let lastUpdate = 0;

    const handleAcceleration = async ({ x, y, z }) => {
      let currTime = Date.now();

      if (currTime - lastUpdate > 100) {
        let diffTime = currTime - lastUpdate;
        lastUpdate = currTime;
        let speed = (Math.abs(x + y + z - last_x - last_y - last_z) / diffTime) * 10000;

        if (!isShakePaused && speed > 150) {
          onShake && onShake(true);

          // Get location and pass it to the HomeScreen component
          const location = await getLocationPermission();
          console.log('Location:', location);
        }

        last_x = x;
        last_y = y;
        last_z = z;
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

    const subscription = Accelerometer.addListener(handleAcceleration);

    return () => {
      subscription.remove();
    };
  }, [onShake, isShakePaused]);

  return <View style={styles.container}></View>;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});




export default ShakeTrigger;
