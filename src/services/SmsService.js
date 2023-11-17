
import * as SMS from 'expo-sms';


export const sendSMS = async (phoneNumber, message) => {
  try {
    await SMS.sendSMSAsync(phoneNumber, message);
    console.log(`SMS sent to ${phoneNumber}`);
  } catch (error) {
    console.error(`Error sending SMS to ${phoneNumber}:`, error);
  }
};
