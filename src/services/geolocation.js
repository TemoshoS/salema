import * as Location from 'expo-location';
import * as SMS from 'expo-sms';

// Function to get the user's real-time GPS coordinates
const getCoordinates = async () => {
  let { status } = await Location.requestForegroundPermissionsAsync();
  if (status !== 'granted') {
    throw new Error('Permission to access location was denied');
  }

  let location = await Location.getCurrentPositionAsync({});
  return location;
};

// Function to send an SMS with the user's coordinates
const sendCoordinates = async (phoneNumber) => {
  try {
    const position = await getCoordinates();
    const message = `My current location is: https://www.google.com/maps/?q=${position.coords.latitude},${position.coords.longitude}`;

    const isAvailable = await SMS.isAvailableAsync();
    if (isAvailable) {
      const { result } = await SMS.sendSMSAsync(
        [phoneNumber],
        message
      );
      console.log(result);
    } else {
      throw new Error('SMS service not available');
    }
  } catch (error) {
    console.error('Error getting coordinates: ', error);
  }
};

export { sendCoordinates };