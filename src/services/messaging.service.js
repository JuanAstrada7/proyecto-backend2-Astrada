import twilio from 'twilio';

const {
    TWILIO_ACCOUNT_SID,
    TWILIO_AUTH_TOKEN,
    TWILIO_FROM_SMS,
    TWILIO_FROM_WAPP
} = process.env;

const client = (TWILIO_ACCOUNT_SID && TWILIO_AUTH_TOKEN)
    ? twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN)
    : null;

export class MessagingService {

    #client;
    constructor(twilioClient = client) { this.#client = twilioClient; }
    #assert() { if (!this.#client) throw new Error("Twilio not configured (.env)"); }

    async sendSMS({ to, body }) {
        this.#assert();
        if (!to || !body) throw new Error("Missing fields: to or body");
        if (!TWILIO_FROM_SMS) throw new Error("TWILIO_FROM_SMS not configured");
        const message = await this.#client.messages.create({ from: TWILIO_FROM_SMS, to, body });
        return { sid: message.sid, status: message.status };
    }

    async sendWhatsApp({ to, body }) {
        this.#assert();
        if (!to || !body) throw new Error("Missing fields: to or body");
        if (!TWILIO_FROM_WAPP) throw new Error("TWILIO_FROM_WAPP no configurado");
        const message = await this.#client.messages.create({ from: TWILIO_FROM_WAPP, to, body });
        return { sid: message.sid, status: message.status };
    }
}

export const messagingService = new MessagingService();