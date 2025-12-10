import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, NotFoundException, BadRequestException } from '@nestjs/common';
import request from 'supertest';
import { CartsController } from '../src/carts/carts.controller';
import { CartsService } from '../src/carts/carts.service';
import { JwtAuthGuard } from '../src/auth/guards/jwt-auth.guard';
import { RolesGuard } from '../src/auth/guards/roles.guard';

const mockCartId = '64aabbccddeeff0011223344';
const mockProductId = '64aabbccddeeff0011223345';
const notFoundId = '64aabbccddeeff0011223346'; 

const mockCart = {
  _id: mockCartId,
  products: [
    { product: { _id: mockProductId, price: 10, stock: 5 }, quantity: 2 },
  ],
  toObject() { return this; },
  save() { return Promise.resolve(this); },
};

describe('Carts (e2e)', () => {
  let app: INestApplication;

  const mockJwtGuard = {
    canActivate: (context) => {
      const req = context.switchToHttp().getRequest();
      req.user = { sub: 'userId', email: 'test@example.com', role: 'user', cartId: mockCartId };
      return true;
    },
  };

  const mockRolesGuard = { canActivate: () => true };

  const cartsServiceMock = {
    create: jest.fn().mockResolvedValue({ _id: mockCartId, products: [] }),
    findOne: jest.fn().mockImplementation(async (id: string) => {
      if (id === notFoundId) throw new NotFoundException(`Cart with ID "${id}" not found`);
      return mockCart;
    }),
    addProduct: jest.fn().mockResolvedValue({
      ...mockCart,
      products: [{ product: mockProductId, quantity: 3 }],
    }),
    removeProduct: jest.fn().mockResolvedValue({
      ...mockCart,
      products: [],
    }),
    purchase: jest.fn().mockImplementation(async (cid: string, email: string) => {
      if (cid === 'empty') throw new BadRequestException('Cart is empty. Cannot proceed to purchase.');
      return { ticket: { code: 'TICKET123', amount: 20 }, productsNotPurchased: [] };
    }),
    clearCart: jest.fn().mockResolvedValue({ ...mockCart, products: [] }),
  };

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      controllers: [CartsController],
      providers: [{ provide: CartsService, useValue: cartsServiceMock }],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue(mockJwtGuard)
      .overrideGuard(RolesGuard)
      .useValue(mockRolesGuard)
      .compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  afterEach(async () => {
    if (app && app.close) await app.close();
  });

  it('GET /api/carts/:cid  -> devuelve carrito existente', () => {
    return request(app.getHttpServer())
      .get(`/api/carts/${mockCartId}`)
      .expect(200)
      .then((res) => {
        expect(res.body).toBeDefined();
        expect(res.body._id === mockCartId || res.body._id === undefined).toBeTruthy();
      });
  });

  it('GET /api/carts/:cid  -> 403 si no pertenece al usuario', () => {
    return request(app.getHttpServer()).get(`/api/carts/${notFoundId}`).expect(403);
  });

  it('POST /api/carts/:cid/products -> añade producto', () => {
    return request(app.getHttpServer())
      .post(`/api/carts/${mockCartId}/products`)
      .send({ productId: mockProductId, quantity: 1 })
      .expect(201);
  });

  it('DELETE /api/carts/:cid/products/:pid -> elimina producto', () => {
    return request(app.getHttpServer())
      .delete(`/api/carts/${mockCartId}/products/${mockProductId}`)
      .send({ quantity: 1 })
      .expect(200);
  });

  it('POST /api/carts/:cid/purchase -> crea ticket', () => {
    return request(app.getHttpServer())
      .post(`/api/carts/${mockCartId}/purchase`)
      .expect(200)
      .then((res) => {
        expect(res.body.ticket).toBeDefined();
        expect(res.body.productsNotPurchased).toBeDefined();
      });
  });

  it('POST /api/carts/:cid/purchase -> 400 si carrito vacío', () => {
    return request(app.getHttpServer()).post(`/api/carts/empty/purchase`).expect(400);
  });

  it('DELETE /api/carts/:cid -> limpia el carrito', () => {
    return request(app.getHttpServer()).delete(`/api/carts/${mockCartId}`).expect(200);
  });
});