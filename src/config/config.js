import dotenv from 'dotenv';

dotenv.config({ path: './.env' });

const requiredEnvVars = [
    'PORT',
    'MONGO_URL',
    'JWT_SECRET',
    'SESSION_SECRET',
    'EMAIL_USER',
    'EMAIL_PASS',
    'TWILIO_SID',
    'TWILIO_AUTH_TOKEN'
];

const missingVars = requiredEnvVars.filter((key) => !process.env[key]);
if (missingVars.length > 0) {
    console.error(`Error: Faltan las siguientes variables de entorno: ${missingVars.join(', ')}`);
    process.exit(1);
}

export default {
    PORT: process.env.PORT,
    MONGO_URL: process.env.MONGO_URL,
    JWT_SECRET: process.env.JWT_SECRET,
    SESSION_SECRET: process.env.SESSION_SECRET,
    EMAIL_USER: process.env.EMAIL_USER,
    EMAIL_PASS: process.env.EMAIL_PASS,
    TWILIO_SID: process.env.TWILIO_SID,
    TWILIO_AUTH_TOKEN: process.env.TWILIO_AUTH_TOKEN,
    TWILIO_FROM_SMS: process.env.TWILIO_FROM_SMS,
    TWILIO_FROM_WAPP: process.env.TWILIO_FROM_WAPP
};