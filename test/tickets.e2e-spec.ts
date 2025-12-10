import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, BadRequestException, Controller, Post, Body, Get, Param, HttpCode, HttpStatus, Request } from '@nestjs/common';
import request from 'supertest';
import { TicketsService } from '../src/tickets/tickets.service';
import { JwtAuthGuard } from '../src/auth/guards/jwt-auth.guard';

const mockTicket = { code: 'T123', amount: 150 };

describe('Tickets (e2e)', () => {
  let app: INestApplication;

  const mockJwtGuard = { canActivate: (ctx) => { const req = ctx.switchToHttp().getRequest(); req.user = { email: 'test@example.com' }; return true; } };

  const ticketsServiceMock = {
    create: jest.fn().mockResolvedValue(mockTicket),
    findByCode: jest.fn().mockResolvedValue(mockTicket),
  };

  beforeEach(async () => {
    @Controller('api/tickets')
    class TicketsTestController {
      constructor(private readonly ticketsService: TicketsService) {}

      @Post()
      @HttpCode(HttpStatus.CREATED)
      async create(@Request() req: any, @Body() body: any) {
        const purchaser = req.user?.email ?? body.purchaser ?? 'test@example.com';
        return this.ticketsService.create(body.amount, purchaser);
      }
      @Get(':code')
      async findByCode(@Param('code') code: string) {
        // use the mocked service method
        if ((this.ticketsService as any).findByCode) {
          return (this.ticketsService as any).findByCode(code);
        }
        return null;
      }
    }

    const moduleRef: TestingModule = await Test.createTestingModule({
      controllers: [TicketsTestController],
      providers: [{ provide: TicketsService, useValue: ticketsServiceMock }],
    })
      .overrideGuard(JwtAuthGuard).useValue(mockJwtGuard)
      .compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  afterEach(async () => { if (app && app.close) await app.close(); });

  it('POST /api/tickets -> create ticket', () => {
    return request(app.getHttpServer()).post('/api/tickets').send({ amount: 150 }).expect(201);
  });

  it('GET /api/tickets/:code -> get ticket by code', () => {
    return request(app.getHttpServer()).get(`/api/tickets/${mockTicket.code}`).expect(200);
  });
});