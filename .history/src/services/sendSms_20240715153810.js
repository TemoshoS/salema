import axios from 'axios';
import Config from 'react-native-config';

const accountSid = Config.TWILIO_ACCOUNT_SID;
const authToken = Config.TWILIO_AUTH_TOKEN;

const sendSms = async (to, from, body) => {
    try {
        const formData = new URLSearchParams();
        formData.append('To', to);
        formData.append('From', from);
        formData.append('Body', body);

        const response = await axios.post(
            `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`,
            formData,
            {
                auth: {
                    username: accountSid,
                    password: authToken
                },
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }
        );
        return response.data;
    } catch (error) {
        console.error(`Error sending SMS to ${to}:`, error.response ? error.response.data : error.message);
        throw error;
    }
};

export default sendSms;
