import { Accelerometer } from 'expo-sensors';
import * as Location from 'expo-location';
import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';
import { getPhoneNumbersForCurrentUser } from './homeServices';
import { auth } from "./firebaseService";
import { sendSms } from '../services/sendSms';

import {
  onAuthStateChanged,
} from "firebase/auth";



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
            Location.getCurrentPositionAsync({})
              .then(location => {
                handler(location);
                
              })
              .catch(error => {
                console.error('Error fetching location:', error);
              });
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

//Sms function




//Notifaction function
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