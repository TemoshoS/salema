const express = require('express');
const twilio = require('twilio');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(bodyParser.json());
app.use(cors());

const accountSid = 'AC6b343086f68fd3d6f29a2ce22e231a6a'; 
const authToken = '80b37efc9fc79b1d61bc28385f515203'; 
const client = twilio(accountSid, authToken);

app.post('/send-sms', async (req, res) => {
    const { to, from, body } = req.body;

    if (!to || !from || !body) {
        return res.status(400).json({ error: 'Missing parameters' });
    }

    try {
        const message = await client.messages.create({ to, from, body });
        res.json({ sid: message.sid });
    } catch (error) {
        console.error('Error creating message:', error);
        res.status(500).json({ error: error.message });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
