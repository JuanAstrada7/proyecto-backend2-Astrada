import * as ticketService from '../services/ticket.service.js';
import Ticket from '../models/ticket.model.js';

export const getTicketById = async (req, res) => {
  try {
    const ticket = await ticketService.getTicketById(req.params.id);
    if (!ticket) return res.status(404).json({ error: 'Ticket no encontrado' });
    res.json(ticket);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener ticket' });
  }
};

export const createTicket = async (req, res) => {
  try {

    const { amount, purchaser, products } = req.body;
    if (!amount || !purchaser || !products || products.length === 0) {
      return res.status(400).json({ error: 'Faltan campos obligatorios' });
    }

    const code = `TICKET-${Date.now()}`;

    const existingTicket = await Ticket.findOne({ code });
    if (existingTicket) {
      return res.status(400).json({ error: 'El código del ticket ya existe' });
    }

    const ticket = new Ticket({ code, amount, purchaser, products });
    await ticket.save();

    res.status(201).json({ message: 'Ticket creado exitosamente', ticket });
  } catch (error) {
    console.error('Error al crear el ticket:', error);
    res.status(500).json({ error: 'Error al crear ticket' });
  }
};

export const getAllTickets = async (req, res) => {
  try {
    const tickets = await ticketService.getAllTickets();
    res.json(tickets);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener tickets' });
  }
};
