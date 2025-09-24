import * as ticketService from '../services/ticket.service.js';

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
        const ticket = await ticketService.createTicket(req.body);
        res.status(201).json(ticket);
    } catch (error) {
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
