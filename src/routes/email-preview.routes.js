import express from 'express';
import { mailerService } from '../utils/mailer.js';
import path from 'path';
import fs from 'fs/promises';
import Handlebars from 'handlebars';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

async function renderEmailTemplate(templateName, data = {}) {
    const viewDir = path.join(__dirname, "../views/emails");
    const filePath = path.join(viewDir, `${templateName}.handlebars`);
    const source = await fs.readFile(filePath, "utf-8");
    const template = Handlebars.compile(source);
    return template(data);
}

router.get('/preview/welcome', async (req, res) => {
    try {
        const html = await renderEmailTemplate('welcome', {
            name: 'Juan Pérez',
            subject: 'Bienvenido a nuestro servicio',
            link: 'https://ejemplo.com/confirmar'
        });
        res.send(html);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/preview/password-reset', async (req, res) => {
    try {
        const html = await renderEmailTemplate('password-reset', {
            name: 'Juan Pérez',
            link: 'https://ejemplo.com/reset-password?token=abc123'
        });
        res.send(html);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/preview/order-confirmation', async (req, res) => {
    try {
        const html = await renderEmailTemplate('order-confirmation', {
            purchaser: 'juan.perez@email.com',
            code: 'TICKET-1234567890',
            amount: 2500.00,
            date: new Date().toLocaleDateString('es-ES'),
            products: [
                {
                    name: 'Producto 1',
                    quantity: 2,
                    price: 750.00,
                    subtotal: 1500.00
                },
                {
                    name: 'Producto 2',
                    quantity: 1,
                    price: 1000.00,
                    subtotal: 1000.00
                }
            ],
            notPurchased: [
                {
                    name: 'Producto sin stock',
                    quantity: 1
                }
            ]
        });
        res.send(html);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/preview/user-registered', async (req, res) => {
    try {
        const html = await renderEmailTemplate('user-registered', {
            first_name: 'Juan',
            last_name: 'Pérez',
            email: 'juan.perez@email.com',
            age: 28,
            phone: '+54911234567',
            role: 'user',
            loginLink: 'https://ejemplo.com/login'
        });
        res.send(html);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/preview', (req, res) => {
    res.json({
        message: 'Plantillas de email disponibles para previsualización',
        templates: {
            'Bienvenida genérica': '/api/email-preview/preview/welcome',
            'Recuperación de contraseña': '/api/email-preview/preview/password-reset',
            'Confirmación de pedido': '/api/email-preview/preview/order-confirmation',
            'Usuario registrado': '/api/email-preview/preview/user-registered'
        },
        instructions: 'Visita cualquiera de estos endpoints en tu navegador para ver las plantillas renderizadas'
    });
});

export default router;