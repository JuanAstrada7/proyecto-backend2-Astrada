import TicketDAO from '../daos/ticket.dao.js';

export default class TicketRepository {
  constructor() {
    this.dao = new TicketDAO();
  }
  getById(id) {
    return this.dao.findById(id);
  }
  create(ticketData) {
    return this.dao.create(ticketData);
  }
  getAll() {
    return this.dao.findAll();
  }
}
