import nodemailer from 'nodemailer';
import fs from 'fs/promises';
import path, { dirname } from 'path';
import Handlebars from 'handlebars';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const {
    SMTP_HOST,
    SMTP_PORT,
    SMTP_SECURE,
    SMTP_USER,
    SMTP_PASS,
    SMTP_FROM
} = process.env;

function buildTransport() {
    if (!SMTP_HOST) throw new Error("SMTP_HOST not defined.");
    return nodemailer.createTransport({
        host: SMTP_HOST,
        port: Number(SMTP_PORT || 587),
        secure: String(SMTP_SECURE || "false") === "true",
        auth: { user: SMTP_USER, pass: SMTP_PASS },
    });
}

async function renderTemplate(templateName, data) {
    const viewDir = path.join(__dirname, "../../views/emails");
    const filePath = path.join(viewDir, `${templateName}.handlebars`);
    const source = await fs.readFile(filePath, "utf-8");
    const tpl = Handlebars.compile(source);
    return tpl(data || {});
}

export class MailerService {
    async send({ to, subject, template, context = {} }) {
        if (!to || !subject || !template) throw new Error("Missing fields.");
        const transport = buildTransport();
        const html = await renderTemplate(template, context);
        const info = await transport.sendMail({
            from: SMTP_FROM || SMTP_USER,
            to,
            subject,
            html,
        });

        return { messageId: info.messageId, accepted: info.accepted, rejected: info.rejected };
    }

    async sendWelcomeEmail(user, loginLink = null) {
        return this.send({
            to: user.email,
            subject: `¡Bienvenido/a ${user.first_name}!`,
            template: 'user-registered',
            context: {
                first_name: user.first_name,
                last_name: user.last_name,
                email: user.email,
                age: user.age,
                phone: user.phone,
                role: user.role,
                loginLink
            }
        });
    }

    async sendOrderConfirmation(ticket, products = [], notPurchased = []) {
        return this.send({
            to: ticket.purchaser,
            subject: `Confirmación de pedido - ${ticket.code}`,
            template: 'order-confirmation',
            context: {
                purchaser: ticket.purchaser,
                code: ticket.code,
                amount: ticket.amount,
                date: new Date().toLocaleDateString('es-ES'),
                products: products.map(p => ({
                    name: p.name,
                    quantity: p.quantity,
                    price: p.price,
                    subtotal: p.price * p.quantity
                })),
                notPurchased: notPurchased.map(np => ({
                    name: np.name,
                    quantity: np.quantity
                }))
            }
        });
    }

    async sendPasswordReset(user, resetLink) {
        return this.send({
            to: user.email,
            subject: 'Recuperación de contraseña',
            template: 'password-reset',
            context: {
                name: user.first_name || 'Usuario',
                link: resetLink
            }
        });
    }
}

export const mailerService = new MailerService();