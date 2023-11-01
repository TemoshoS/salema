import Geolocation from 'react-native-geolocation-service';
import SendSMS from 'react-native-sms';
import { check, PERMISSIONS, RESULTS, request } from 'react-native-permissions';

// Function to get the user's real-time GPS coordinates
const getCoordinates = () => {
  return new Promise((resolve, reject) => {
    Geolocation.getCurrentPosition(
      (position) => {
        resolve(position);
      },
      (error) => {
        reject(error);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
    );
  });
};

// Function to send an SMS with the user's coordinates
const sendCoordinates = async (phoneNumber) => {
  try {
    const position = await getCoordinates();
    const message = `My current location is: https://www.google.com/maps/?q=${position.coords.latitude},${position.coords.longitude}`;
    SendSMS.send(
      {
        body: message,
        recipients: [phoneNumber],
        successTypes: ['sent', 'queued'],
      },
      (completed, cancelled, error) => {
        console.log('SMS Callback: completed: ' + completed + ' cancelled: ' + cancelled + 'error: ' + error);
      }
    );
  } catch (error) {
    console.error('Error getting coordinates: ', error);
  }
};

// Function to request the necessary permissions
const requestPermissions = async () => {
  const locationPermission = await check(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION);
  if (locationPermission !== RESULTS.GRANTED) {
    await request(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION);
  }
  const smsPermission = await check(PERMISSIONS.ANDROID.SEND_SMS);
  if (smsPermission !== RESULTS.GRANTED) {
    await request(PERMISSIONS.ANDROID.SEND_SMS);
  }
};