import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User, UserSchema } from './schemas/user.schema';
import { CartsModule } from '../carts/carts.module';
import { MessagingModule } from '../messaging/messaging.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    forwardRef(() => CartsModule), // Rompemos la dependencia circular
    MessagingModule, // Importamos el módulo de mensajería
  ],
  providers: [UsersService],
  controllers: [UsersController],
  exports: [UsersService], // ¡MUY IMPORTANTE! Para que AuthModule pueda usarlo.
})
export class UsersModule {}
