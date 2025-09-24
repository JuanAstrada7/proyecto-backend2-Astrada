import TicketRepository from '../repositories/ticket.repository.js';

const ticketRepository = new TicketRepository();

export const getTicketById = (id) => ticketRepository.getById(id);
export const createTicket = (ticketData) => ticketRepository.create(ticketData);
export const getAllTickets = () => ticketRepository.getAll();
