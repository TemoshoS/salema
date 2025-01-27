import { Accelerometer } from 'expo-sensors';
import * as Location from 'expo-location';
import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';
import { getPhoneNumbersForCurrentUser} from './homeServices';
import sendSms from './sendSms';
import { useState, useEffect, useRef } from 'react';
import { auth } from "./firebaseService";





// Threshold for shake detection
const THRESHOLD = 150;

export class ShakeEventExpo {
  static async addListener(handler) {
    let last_x, last_y, last_z;
    let lastUpdate = 0;
    let lastNotificationTime = 0;
    
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
          // Shake detected, check if enough time has passed since the last notification
          if (currTime - lastNotificationTime > 5 * 60 * 1000) { // 5 minutes in milliseconds
            // Update the last notification time
            lastNotificationTime = currTime;

            // Fetch location and send notification
            (async () => {
              try {
                const location = await Location.getCurrentPositionAsync({});
                const user = auth.currentUser;
                const userName = user.displayName; // Assuming displayName exists
    
                handler(location);
                await sendShakeDetectedSms(location, userName);
              } catch (error) {
                console.error('Error fetching location or sending SMS:', error);
              }
            })();
          }
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

// Function to send SMS on shake detection
const sendShakeDetectedSms = async (location, userName) => {
  try {
    const message = `Hi, it's ${userName}. I'm in danger and need help. My location: https://www.google.com/maps?q=${location.coords.latitude},${location.coords.longitude}`;
    const from = '';

    const numbers = await getPhoneNumbersForCurrentUser();
    const promises = numbers.map(async (to) => {
      try {
        return await sendSms(to, from, message);
      } catch (error) {
        console.error(`Failed to send SMS to ${to}:`, error);
        throw error;
      }
    });
    const responses = await Promise.all(promises);
    console.log('Messages sent:', responses.map((res) => res.sid));
  } catch (error) {
    console.error('Error sending SMS:', error);
  }
};


// Notification handler
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export const NotificationService = () => {
  const [expoPushToken, setExpoPushToken] = useState('');
  const [notification, setNotification] = useState(false);
  const notificationListener = useRef();
  const responseListener = useRef();

  useEffect(() => {
    registerForPushNotificationsAsync().then((token) => setExpoPushToken(token));

    notificationListener.current = Notifications.addNotificationReceivedListener((notification) => {
      setNotification(notification);
    });

    responseListener.current = Notifications.addNotificationResponseReceivedListener((response) => {
      console.log(response);
    });

    return () => {
      Notifications.removeNotificationSubscription(notificationListener.current);
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  async function registerForPushNotificationsAsync() {
    let token;
    if (Constants.isDevice) {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== 'granted') {
        alert('Failed to get push token for push notification!');
        return;
      }
      token = (await Notifications.getExpoPushTokenAsync()).data;
      console.log(token);
    } else {
      alert('Must use physical device for Push Notifications');
    }

    if (Platform.OS === 'android') {
      Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }

    return token;
  }
};
