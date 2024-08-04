import axios from 'axios';

const sendSms = async (to, from, body) => {
    try {
        const response = await axios.post('http://41.116.77.76:3000/send-sms', {
            to,
            from,
            body
        });
        return response.data;

        41.116.77.76

    } catch (error) {
        console.error(`Error sending SMS to ${to}:`, error.response ? error.response.data : error.message);
        throw error;
    }
};

export default sendSms;
