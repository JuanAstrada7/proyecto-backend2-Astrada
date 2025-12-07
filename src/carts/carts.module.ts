import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CartsService } from './carts.service';
import { CartsController } from './carts.controller';
import { Cart, CartSchema } from './schemas/cart.schema';
import { ProductsModule } from '../products/products.module'; // Importante
import { TicketsModule } from '../tickets/tickets.module';
import { MessagingModule } from '../messaging/messaging.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Cart.name, schema: CartSchema }]),
    ProductsModule, // Hacemos disponible los providers de ProductsModule (ej. ProductsService)
    TicketsModule,
    forwardRef(() => UsersModule), // Para poder inyectar UsersService y romper la dependencia circular
    MessagingModule,
  ],
  controllers: [CartsController],
  providers: [CartsService],
  exports: [CartsService],
})
export class CartsModule {}