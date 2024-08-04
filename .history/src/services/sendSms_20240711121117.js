import axios from 'axios';
import qs from 'qs';

const sendSms = async (to, from, body) => {
    try {
        const response = await axios.post(
            'https://api.twilio.com/2010-04-01/Accounts/AC6b343086f68fd3d6f29a2ce22e231a6a/Messages.json',
            qs.stringify({
                To: to,
                From: from,
                Body: body
            }), 
            {
                auth: {
                    username: 'AC6b343086f68fd3d6f29a2ce22e231a6a',
                    password: '80b37efc9fc79b1d61bc28385f515203'
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
