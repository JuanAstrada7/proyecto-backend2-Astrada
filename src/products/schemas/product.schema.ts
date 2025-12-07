import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, PaginateModel } from 'mongoose';
import paginate from 'mongoose-paginate-v2';

export type ProductDocument = Product & Document;

@Schema({ timestamps: true, versionKey: false })
export class Product {
  @Prop({ required: true, trim: true })
  name: string;

  @Prop({ required: true })
  price: number;

  @Prop({ required: true, default: 0 })
  stock: number;

  @Prop({ trim: true })
  description: string;

  @Prop({ required: true, trim: true })
  category: string;

  @Prop({ required: true, unique: true, trim: true })
  code: string;

  @Prop({ type: [String], default: [] })
  thumbnails: string[];

  @Prop({ default: true })
  status: boolean;

}

export const ProductSchema = SchemaFactory.createForClass(Product);

ProductSchema.plugin(paginate);

export type ProductPaginateModel = PaginateModel<ProductDocument>;