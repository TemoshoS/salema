import * as SMS from 'expo-sms';

// ...

const sendSMS = async (emergency_contact) => {
  try {
    const message = "This is an emergency. Please contact me ASAP.";

    for (const emergency_contact of emergency_contact) {
      const phoneNumber = emergency_contact.phoneNumber; 
      const messageBody = `This is an emergency. Please contact me ASAP.`;

      const isAvailable = await SMS.isAvailableAsync();
      if (isAvailable) {
        await SMS.sendSMSAsync([phoneNumber], messageBody);
        console.log(`SMS sent successfully to ${phoneNumber}`);
      } else {
        console.log('SMS is not available on this device.');
      }
    }

    console.log('SMS sent successfully');
  } catch (error) {
    console.error('Error sending SMS: ', error);
  }
};
 export default {sendSMS}