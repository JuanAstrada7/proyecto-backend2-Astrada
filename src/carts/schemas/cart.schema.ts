import { Prop, Schema, SchemaFactory, raw } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Product } from '../../products/schemas/product.schema';

export type CartDocument = Cart & Document;

@Schema({ timestamps: true, versionKey: false })
export class Cart {
  @Prop([
    raw({
      product: {
        type: Types.ObjectId,
        ref: 'Product',
        required: true,
      },
      quantity: { type: Number, required: true, min: 1 },
    }),
  ])
  products: { product: Product; quantity: number }[];
}

export const CartSchema = SchemaFactory.createForClass(Cart);