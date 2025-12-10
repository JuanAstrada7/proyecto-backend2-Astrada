import { Test, TestingModule } from '@nestjs/testing';
import { TicketsService } from './tickets.service';
import { getModelToken } from '@nestjs/mongoose';

describe('TicketsService', () => {
  let service: TicketsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TicketsService,
        { provide: getModelToken('Ticket'), useValue: {} },
      ],
    }).compile();

    service = module.get<TicketsService>(TicketsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
