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
  ) {}

  async create(): Promise<CartDocument> {
    const newCart = new this.cartModel({ products: [] });
    return newCart.save();
  }

  async findOne(id: string): Promise<CartDocument> {
    const cart = await this.cartModel
      .findById(id)
      .populate('products.product') // Populamos los datos de los productos
      .exec();
    if (!cart) {
      throw new NotFoundException(`Cart with ID "${id}" not found`);
    }
    return cart;
  }

  async addProduct(
    cartId: string,
    addProductDto: AddProductToCartDto,
  ): Promise<CartDocument> {
    const { productId, quantity } = addProductDto;

    // 1. Validar que el producto exista
    await this.productsService.findOne(productId);

    const cart = await this.findOne(cartId);

    // 2. Comprobar si el producto ya está en el carrito
    const productIndex = cart.products.findIndex(
      (item) => (item.product as any)._id.toString() === productId,
    );

    if (productIndex > -1) {
      // Si ya existe, actualizamos la cantidad
      cart.products[productIndex].quantity += quantity;
    } else {
      // Si no existe, lo añadimos al array
      cart.products.push({ product: productId as any, quantity });
    }

    return cart.save();
  }

  // Aquí irían otros métodos como removeProduct, updateQuantity, clearCart, etc.

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
        `Product with ID "${productId}" not found in cart`,
      );
    }

    if (quantity && cart.products[productIndex].quantity > quantity) {
      // Reducir la cantidad
      cart.products[productIndex].quantity -= quantity;
    } else {
      // Eliminar el producto completamente
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
      throw new BadRequestException('Cart is empty. Cannot proceed to purchase.');
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
          reason: 'Insufficient stock',
        });
      }
    }

    if (productsToPurchase.length === 0) {
      throw new BadRequestException('No products could be purchased due to insufficient stock.');
    }

    // 1. Crear el ticket
    const ticket = await this.ticketsService.create(totalAmount, purchaserEmail);

    // 2. Actualizar el stock de los productos comprados
    const updateStockPromises = productsToPurchase.map((item) => {
      const product = item.product as ProductDocument;
      return this.productsService.update(product._id.toString(), {
        stock: product.stock - item.quantity,
      });
    });
    await Promise.all(updateStockPromises);

    // 3. Actualizar el carrito con los productos que no se pudieron comprar
    cart.products = productsNotPurchased.map((item) => ({ product: item.product, quantity: 1 })) as any; // Asumiendo que se re-añade con cantidad 1
    await cart.save();

    // 4. Enviar email de confirmación
    this.emailService
      .sendOrderConfirmation(ticket, productsToPurchase, productsNotPurchased)
      .catch(console.error);

    // 5. Enviar SMS de confirmación (si el usuario tiene teléfono)
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