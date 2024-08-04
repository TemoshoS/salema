import axios from 'axios';

const sendSms = async (to, from, body) => {
    try {
        const response = await axios.post('http://<your-backend-url>:3000/send-sms', {
            to,
            from,
            body
        });
        return response.data;
    } catch (error) {
        console.error('Error sending SMS:', error);
        throw error;
    }
};

export default sendSms;
