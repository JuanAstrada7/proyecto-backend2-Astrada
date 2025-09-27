import express from 'express';
import * as ticketController from '../controllers/ticket.controller.js';
import { verificarUsuario } from '../middleware/auth.middleware.js';
import { body } from 'express-validator';

const router = express.Router();

router.get('/', verificarUsuario, ticketController.getAllTickets);

router.get('/:id', verificarUsuario, ticketController.getTicketById);

router.post('/',
    verificarUsuario,
    [
        body('amount').isFloat({ gt: 0 }).withMessage('El monto debe ser un número positivo'),
        body('purchaser').notEmpty().withMessage('El comprador es obligatorio')
    ],
    ticketController.createTicket
);

export default router;
