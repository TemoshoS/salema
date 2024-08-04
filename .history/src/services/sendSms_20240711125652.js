import axios from 'axios';

const sendSms = async (to, from, body) => {
    try {
        const response = await axios.post('https://9404-41-116-34-223.ngrok-free.app/send-sms', {
            to,
            from,
            body
        });
        return response.data;
    } catch (error) {
        console.error(`Error sending SMS to ${to}:`, error.response ? error.response.data : error.message);
        throw error;
    }
};

export default sendSms;
