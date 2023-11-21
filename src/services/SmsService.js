import * as SMS from 'expo-sms';

export const sendSMS = async (phoneNumber, message) => {
  try {
    await SMS.sendSMSAsync([phoneNumber], message);
  } catch (error) {
    console.error('Error sending SMS:', error);
    throw error;
  }
};
