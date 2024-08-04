const express = require('express');
const twilio = require('twilio');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(bodyParser.json());
app.use(cors());

const accountSid = 'AC6b343086f68fd3d6f29a2ce22e231a6a'; // Your Account SID
const authToken = '80b37efc9fc79b1d61bc28385f515203'; // Your Auth Token
const client = twilio(accountSid, authToken);

app.post('/send-sms', (req, res) => {
    const { to, from, body } = req.body;

    client.messages
        .create({ to, from, body })
        .then(message => res.json({ sid: message.sid }))
        .catch(error => res.status(500).json({ error: error.message }));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
