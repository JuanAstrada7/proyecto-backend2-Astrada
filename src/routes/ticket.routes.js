import express from 'express';
import * as ticketController from '../controllers/ticket.controller.js';
import { verificarUsuario } from '../middleware/auth.middleware.js';

const router = express.Router();

router.get('/', verificarUsuario, ticketController.getAllTickets);

router.get('/:id', verificarUsuario, ticketController.getTicketById);

router.post('/', verificarUsuario, ticketController.createTicket);

export default router;
