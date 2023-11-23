import { requestForegroundPermissionsAsync, getCurrentPositionAsync } from 'expo-location';
import { initializeAuthState } from "../services/homeServices";
const getLocationPermission = async () => {
  try {
    const { status } = await requestForegroundPermissionsAsync();
    if (status === 'granted') {
      const location = await getCurrentPositionAsync({});
      const userLocation = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      };
      const message = `https://www.google.com/maps/?q=${userLocation.latitude},${userLocation.longitude}`;
      return { userLocation, message };
    } else {
      return null;
    }
  } catch (error) {
    return null;
  }
};
export default getLocationPermission;