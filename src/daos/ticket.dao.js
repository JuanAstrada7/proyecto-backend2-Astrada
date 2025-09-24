import Ticket from '../models/ticket.model.js';

export default class TicketDAO {
    async findById(id) {
        return Ticket.findById(id);
    }
    async create(ticketData) {
        return Ticket.create(ticketData);
    }
    async findAll() {
        return Ticket.find();
    }
}
