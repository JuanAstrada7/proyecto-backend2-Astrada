import { Test, TestingModule } from '@nestjs/testing';
import { CartsService } from './carts.service';
import { getModelToken } from '@nestjs/mongoose';
import { ProductsService } from '../products/products.service';
import { TicketsService } from '../tickets/tickets.service';
import { EmailService } from '../messaging/email.service';
import { SmsService } from '../messaging/sms.service';
import { UsersService } from '../users/users.service';

describe('CartsService', () => {
  let service: CartsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CartsService,
        { provide: getModelToken('Cart'), useValue: {} },
        { provide: ProductsService, useValue: {} },
        { provide: TicketsService, useValue: {} },
        { provide: EmailService, useValue: {} },
        { provide: SmsService, useValue: {} },
        { provide: UsersService, useValue: {} },
      ],
    }).compile();

    service = module.get<CartsService>(CartsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
