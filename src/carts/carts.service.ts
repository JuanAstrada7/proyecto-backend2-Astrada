import { BadRequestException, Inject, Injectable, NotFoundException, forwardRef } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Cart, CartDocument } from './schemas/cart.schema';
import { AddProductToCartDto } from './dto/add-product-to-cart.dto';
import { RemoveProductFromCartDto } from './dto/remove-product-from-cart.dto';
import { ProductsService } from '../products/products.service';
import { TicketsService } from '../tickets/tickets.service';
import { ProductDocument } from '../products/schemas/product.schema';
import { TicketDocument } from '../tickets/schemas/ticket.schema';
import { Product } from '../products/schemas/product.schema';
import { EmailService } from '../messaging/email.service';
import { SmsService } from '../messaging/sms.service';
import { UsersService } from '../users/users.service';

@Injectable()
export class CartsService {
  constructor(
    @InjectModel(Cart.name) private cartModel: Model<CartDocument>,
    private readonly productsService: ProductsService,
    private readonly ticketsService: TicketsService,
    private readonly emailService: EmailService,
    private readonly smsService: SmsService,
    @Inject(forwardRef(() => UsersService)) private readonly usersService: UsersService,
  ) { }

  async create(): Promise<CartDocument> {
    const newCart = new this.cartModel({ products: [] });
    return newCart.save();
  }

  async findOne(id: string): Promise<CartDocument> {
    const cart = await this.cartModel
      .findById(id)
      .populate('products.product')
      .exec();
    if (!cart) {
      throw new NotFoundException(`No se encontró el carrito con ID "${id}"`);
    }
    return cart;
  }

  async addProduct(
    cartId: string,
    addProductDto: AddProductToCartDto,
  ): Promise<CartDocument> {
    const { productId, quantity } = addProductDto;

    await this.productsService.findOne(productId);

    const cart = await this.findOne(cartId);

    const productIndex = cart.products.findIndex(
      (item) => (item.product as any)._id.toString() === productId,
    );

    if (productIndex > -1) {

      cart.products[productIndex].quantity += quantity;
    } else {

      cart.products.push({ product: productId as any, quantity });
    }

    return cart.save();
  }


  async removeProduct(
    cartId: string,
    removeProductDto: RemoveProductFromCartDto,
  ): Promise<CartDocument> {
    const { productId, quantity } = removeProductDto;

    const cart = await this.findOne(cartId);

    const productIndex = cart.products.findIndex(
      (item) => (item.product as any)._id.toString() === productId,
    );

    if (productIndex === -1) {
      throw new NotFoundException(
        `Producto con ID "${productId}" no encontrado en el carrito`,
      );
    }

    if (quantity && cart.products[productIndex].quantity > quantity) {

      cart.products[productIndex].quantity -= quantity;
    } else {

      cart.products.splice(productIndex, 1);
    }

    return cart.save();
  }

  async purchase(
    cartId: string,
    purchaserEmail: string,
  ): Promise<{ ticket: TicketDocument; productsNotPurchased: any[] }> {
    const cart = await this.findOne(cartId);
    if (cart.products.length === 0) {
      throw new BadRequestException('El carrito está vacío. No se puede proceder con la compra.');
    }

    const productsToPurchase: { product: Product; quantity: number }[] = [];
    const productsNotPurchased: {
      product: Types.ObjectId;
      reason: string;
    }[] = [];
    let totalAmount = 0;

    for (const item of cart.products) {
      const product = item.product as ProductDocument;
      if (product.stock >= item.quantity) {
        productsToPurchase.push(item);
        totalAmount += product.price * item.quantity;
      } else {
        productsNotPurchased.push({
          product: product._id,
          reason: 'Stock insuficiente',
        });
      }
    }

    if (productsToPurchase.length === 0) {
      throw new BadRequestException('No se pudieron comprar productos debido a stock insuficiente.');
    }

    const ticket = await this.ticketsService.create(totalAmount, purchaserEmail);

    const updateStockPromises = productsToPurchase.map((item) => {
      const product = item.product as ProductDocument;
      return this.productsService.update(product._id.toString(), {
        stock: product.stock - item.quantity,
      });
    });
    await Promise.all(updateStockPromises);

    cart.products = productsNotPurchased.map((item) => ({ product: item.product, quantity: 1 })) as any;
    await cart.save();

    this.emailService
      .sendOrderConfirmation(ticket, productsToPurchase, productsNotPurchased)
      .catch(console.error);

    const user = await this.usersService.findByEmail(purchaserEmail);
    if (user && user.phone) {
      const message = `Gracias por tu compra! Tu pedido con código ${ticket.code} por un total de $${ticket.amount} ha sido procesado.`;
      this.smsService.sendSms(user.phone, message).catch(console.error);
    }

    return { ticket, productsNotPurchased };
  }

  async clearCart(cartId: string): Promise<CartDocument> {
    const cart = await this.findOne(cartId);
    cart.products = [];
    return cart.save();
  }
}