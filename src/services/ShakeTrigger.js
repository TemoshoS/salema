import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Accelerometer } from 'expo-sensors';
import * as Location from 'expo-location';


const THRESHOLD = 150;

export class ShakeEventExpo {
  static async addListener(handler) {
    let last_x, last_y, last_z;
    let lastUpdate = 0;
    // Request permission to access location
    await Location.requestForegroundPermissionsAsync();
    Accelerometer.addListener(accelerometerData => {
      let { x, y, z } = accelerometerData;
      let currTime = Date.now();
      if ((currTime - lastUpdate) > 100) {
        let diffTime = (currTime - lastUpdate);
        lastUpdate = currTime;
        let speed = Math.abs(x + y + z - last_x - last_y - last_z) / diffTime * 10000;
        if (speed > THRESHOLD) {
          // Shake detected, fetch location
          Location.getCurrentPositionAsync({})
            .then(location => {
              handler(location);
            })
            .catch(error => {
              console.error('Error fetching location:', error);
            });
        }
        last_x = x;
        last_y = y;
        last_z = z;
      }
    });
  }
  static removeListener() {
    Accelerometer.removeAllListeners();
  }
}
