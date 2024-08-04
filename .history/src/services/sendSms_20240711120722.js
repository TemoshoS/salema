import axios from 'axios';

const sendSms = async (to, from, body) => {
    try {
        const response = await axios.post('https://api.twilio.com/2010-04-01/Accounts/YOUR_ACCOUNT_SID/Messages.json', {
            To: to,
            From: from,
            Body: body
        }, {
            auth: {
                username: 'YOUR_ACCOUNT_SID',
                password: 'YOUR_AUTH_TOKEN'
            }
        });
        return response.data;
    } catch (error) {
        console.error(`Error sending SMS to ${to}:`, error.response ? error.response.data : error.message);
        throw error;
    }
};

export default sendSms;
