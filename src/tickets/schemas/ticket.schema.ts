import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type TicketDocument = Ticket & Document;

@Schema({ timestamps: true, versionKey: false })
export class Ticket {
  @Prop({ unique: true, required: true })
  code: string;

  @Prop({ required: true })
  purchase_datetime: Date;

  @Prop({ required: true })
  amount: number;

  @Prop({ required: true })
  purchaser: string;
}

export const TicketSchema = SchemaFactory.createForClass(Ticket);