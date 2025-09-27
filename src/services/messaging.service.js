import Twilio from 'twilio';
import config from '../config/config.js';

export class MessagingService {
    #client;

    constructor(twilioClient = null) {
        if (!config.TWILIO_SID || !config.TWILIO_AUTH_TOKEN) {
            console.error('Error: Las credenciales de Twilio no están definidas. Verifica el archivo .env.');
            throw new Error('Credenciales de Twilio faltantes');
        }
        console.log('Inicializando Twilio con:', {
            TWILIO_SID: config.TWILIO_SID,
            TWILIO_AUTH_TOKEN: config.TWILIO_AUTH_TOKEN
        });
        if (!twilioClient) {
            this.#client = new Twilio(config.TWILIO_SID, config.TWILIO_AUTH_TOKEN);
        } else {
            this.#client = twilioClient;
        }
    }

    #assert() {
        if (!this.#client) throw new Error("Twilio no configurado (.env)");
    }

    async sendSMS({ to, body }) {
        this.#assert();
        if (!to || !body) throw new Error("Faltan campos to o body");
        if (!process.env.TWILIO_FROM_SMS) throw new Error("TWILIO_FROM_SMS no configurado");

        console.log('Enviando SMS con los siguientes valores:', {
            From: config.TWILIO_FROM_SMS,
            To: to,
            Body: body
        });

        const m = await this.#client.messages.create({
            from: process.env.TWILIO_FROM_SMS,
            to,
            body,
        });
        return { sid: m.sid, status: m.status };
    }

    async sendWhatsApp({ to, body }) {
        this.#assert();
        if (!to || !body) throw new Error("Faltan campos to o body");
        if (!config.TWILIO_FROM_WAPP) throw new Error("TWILIO_FROM_WAPP no configurado");

        const m = await this.#client.messages.create({
            from: `whatsapp:${config.TWILIO_FROM_WAPP}`,
            to: `whatsapp:${to}`,
            body,
        });

        return { sid: m.sid, status: m.status };
    }
}

export const messagingService = new MessagingService();