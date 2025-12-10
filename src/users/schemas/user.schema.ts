import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { ApiProperty, ApiPropertyOptional, ApiHideProperty } from '@nestjs/swagger';

export type UserDocument = User & Document;

@Schema({ timestamps: true, versionKey: false })
export class User {
  @ApiProperty({ example: 'Juan', description: 'Nombre' })
  @Prop({ required: true, trim: true })
  first_name: string;

  @ApiProperty({ example: 'Pérez', description: 'Apellido' })
  @Prop({ required: true, trim: true })
  last_name: string;

  @ApiProperty({ example: 'juan@example.com', description: 'Email' })
  @Prop({ required: true, unique: true, trim: true, lowercase: true })
  email: string;

  @ApiPropertyOptional({ example: 30, description: 'Edad' })
  @Prop()
  age: number;

  @ApiHideProperty()
  @Prop({ required: true })
  password: string;

  @ApiPropertyOptional({ example: '+541112345678', description: 'Teléfono' })
  @Prop({ trim: true })
  phone: string;

  @ApiProperty({ example: 'user', description: 'Role del usuario' })
  @Prop({ default: 'user' })
  role: string;

  @ApiPropertyOptional({ example: '64aabbccddeeff0011223344', description: 'ID del carrito asociado' })
  @Prop({ type: Types.ObjectId, ref: 'Cart' })
  cart: Types.ObjectId;
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.pre<UserDocument>('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

UserSchema.methods.toJSON = function () {
  const userObject = this.toObject();
  delete userObject.password;
  return userObject;
};