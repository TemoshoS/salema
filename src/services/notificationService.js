import * as Notifications from 'expo-notifications';
import { Vibration } from 'react-native';

const sendNotification = async () => {
    try {
      const { status } = await Notifications.getPermissionsAsync();
  
      if(status !== 'granted'){
        console.error('Notification permission not granted');
        return;
      }
      Vibration.vibrate(1000);
  
      const notificationId = await Notifications.scheduleNotificationAsync({
        content: {
          title: 'Emergency Alert',
          body: 'This is an emergency alert',
        },
        trigger: null,
      });
  
      console.log('Notification scheduled: ', notificationId);
      
    } catch (error) {
      console.error("Error sending notification: ", error);	
      
    }
  
  }
    
export default sendNotification;