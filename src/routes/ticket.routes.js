import express from 'express';
import * as ticketController from '../controllers/ticket.controller.js';
import { verificarUsuario } from '../middlewares/auth.middleware.js';

const router = express.Router();

// Obtener todos los tickets
router.get('/', verificarUsuario, ticketController.getAllTickets);

// Obtener ticket por ID
router.get('/:id', verificarUsuario, ticketController.getTicketById);

// Crear ticket (puede ser solo usuario autenticado, ajusta según tu lógica de negocio)
router.post('/', verificarUsuario, ticketController.createTicket);

export default router;
