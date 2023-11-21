import { requestForegroundPermissionsAsync, getCurrentPositionAsync } from 'expo-location';
import { Linking } from 'react-native';


const getLocationPermission = async () => {
  const { status } = await requestForegroundPermissionsAsync();
  if (status === 'granted') {
    const location = await getCurrentPositionAsync({});
    setUserLocation(location.coords);
    const message = `https://www.google.com/maps/?q=${location.coords.latitude},${location.coords.longitude}`;
    setUserLocationMessage(message);
  }
}; 

   // Function to send location to a single number
   const sendLocationToNumber = async (phoneNumber) => {
    try {
      const { status } = await SMS.sendSMSAsync(
        [phoneNumber],
        `Emergency! I need help. My current location is: ${userLocationMessage}`
      );

      if (status === 'sent') {
        console.log('SMS sent successfully');
      } else {
        console.log('Failed to send SMS');
      }
    } catch (error) {
      console.error('Error sending SMS:', error);
    }
  };

  // Function to send location to 5 numbers
  const sendLocationToNumbers = async () => {
    const emergencyNumbers = ['0721371977', '0724457811', '0722733147'];

    for (const phoneNumber of emergencyNumbers) {
      await sendLocationToNumber(phoneNumber);
    }
  };

  export {getLocationPermission}
