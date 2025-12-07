import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Ticket, TicketDocument } from './schemas/ticket.schema';

@Injectable()
export class TicketsService {
  constructor(
    @InjectModel(Ticket.name) private ticketModel: Model<TicketDocument>,
  ) {}

  async create(
    amount: number,
    purchaser: string,
  ): Promise<TicketDocument> {
    const newTicket = new this.ticketModel({
      code: `${Date.now()}${Math.random()}`, // Código simple, se puede mejorar
      purchase_datetime: new Date(),
      amount,
      purchaser,
    });
    return newTicket.save();
  }
}
