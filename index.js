import express from 'express';
import dotenv from 'dotenv';
import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
dotenv.config();

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});