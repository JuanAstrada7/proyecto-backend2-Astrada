import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, NotFoundException } from '@nestjs/common';
import request from 'supertest';
import { ProductsController } from '../src/products/products.controller';
import { ProductsService } from '../src/products/products.service';
import { JwtAuthGuard } from '../src/auth/guards/jwt-auth.guard';
import { RolesGuard } from '../src/auth/guards/roles.guard';

const mockProductId = '64aa11111111111111111111';
const notFoundId = '64aa22222222222222222222';

const mockProduct = {
  _id: mockProductId,
  title: 'Laptop',
  description: 'Laptop demo',
  price: 1000,
  stock: 5,
};

describe('Products (e2e)', () => {
  let app: INestApplication;

  const mockJwtGuard = { canActivate: (ctx) => { const req = ctx.switchToHttp().getRequest(); req.user = { role: 'admin' }; return true; } };
  const mockRolesGuard = { canActivate: () => true };

  const productsServiceMock = {
    create: jest.fn().mockResolvedValue(mockProduct),
    findAll: jest.fn().mockResolvedValue([mockProduct]),
    findOne: jest.fn().mockImplementation(async (id: string) => {
      if (id === notFoundId) throw new NotFoundException('Product not found');
      return mockProduct;
    }),
    update: jest.fn().mockResolvedValue({ ...mockProduct, price: 900 }),
    remove: jest.fn().mockResolvedValue({ deleted: true }),
  };

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      controllers: [ProductsController],
      providers: [{ provide: ProductsService, useValue: productsServiceMock }],
    })
      .overrideGuard(JwtAuthGuard).useValue(mockJwtGuard)
      .overrideGuard(RolesGuard).useValue(mockRolesGuard)
      .compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  afterEach(async () => { if (app && app.close) await app.close(); });

  it('POST /api/products -> create product (admin)', () => {
    return request(app.getHttpServer()).post('/api/products').send({
      title: 'Laptop', description: 'Desc', price: 1000, stock: 5
    }).expect(201);
  });

  it('GET /api/products -> list products', () => {
    return request(app.getHttpServer()).get('/api/products').expect(200);
  });

  it('GET /api/products/:id -> 404 if not found', () => {
    return request(app.getHttpServer()).get(`/api/products/${notFoundId}`).expect(404);
  });

  it('PUT /api/products/:id -> update (admin)', () => {
    return request(app.getHttpServer()).put(`/api/products/${mockProductId}`).send({ price: 900 }).expect(200);
  });

  it('DELETE /api/products/:id -> delete (admin)', () => {
    return request(app.getHttpServer()).delete(`/api/products/${mockProductId}`).expect(200);
  });
});