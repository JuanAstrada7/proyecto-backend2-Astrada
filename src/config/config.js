import dotenv from 'dotenv';

// Cargar las variables de entorno desde el archivo .env
dotenv.config({ path: './.env' });

// Validar que las variables críticas estén definidas
if (!process.env.TWILIO_SID || !process.env.TWILIO_AUTH_TOKEN) {
  console.error('Error: Las variables de entorno de Twilio no están definidas. Verifica el archivo .env.');
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