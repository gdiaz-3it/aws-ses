import express from 'express';
import dotenv from 'dotenv';
import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

const sesClient = new SESClient({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

app.post('/send-email', async (req, res) => {
    const { subject, message } = req.body;
    
    if ( !subject || !message) {
        return res.status(400).json({ error: 'Missing required fields: subject, message' });
    }
    
    const params = {
        Destination: {
            ToAddresses: [process.env.TO_EMAIL],
        },
        Message: {
            Body: {
                Text: {
                    Charset: 'UTF-8',
                    Data: message,
                },
            },
            Subject: {
                Charset: 'UTF-8',
                Data: subject,
            },
        },
        Source: process.env.FROM_EMAIL,
    };

    try {
        const command = new SendEmailCommand(params);
        const response = await sesClient.send(command);
        res.status(200).json({ success: true, messageId: response.MessageId });
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).json({ error: 'Failed to send email', details: error.message });
    }
});

