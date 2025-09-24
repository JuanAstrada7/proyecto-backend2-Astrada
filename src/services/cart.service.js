import CartRepository from '../repositories/cart.repository.js';
import ProductRepository from '../repositories/product.repository.js';
import TicketRepository from '../repositories/ticket.repository.js';
import UserRepository from '../repositories/user.repository.js';
import { v4 as uuidv4 } from 'uuid';

const cartRepository = new CartRepository();
const productRepository = new ProductRepository();
const ticketRepository = new TicketRepository();
const userRepository = new UserRepository();

export const getCartById = (id) => cartRepository.getById(id);
export const createCart = (cartData) => cartRepository.create(cartData);
export const updateCart = (id, data) => cartRepository.update(id, data);
export const deleteCart = (id) => cartRepository.delete(id);
export const getAllCarts = () => cartRepository.getAll();

export const purchaseCart = async (cartId, userId) => {
  // Obtener carrito y usuario
  const cart = await getCartById(cartId);
  if (!cart) throw new Error('Carrito no encontrado');
  const user = await userRepository.getById(userId);
  if (!user) throw new Error('Usuario no encontrado');

  let total = 0;
  const purchasedProducts = [];
  const notPurchased = [];

  // Verificar stock y preparar productos a comprar
  for (const item of cart.products) {
    const product = await productRepository.getById(item.product._id);
    if (product && product.stock >= item.quantity) {
      // Descontar stock
      product.stock -= item.quantity;
      await product.save();
      total += product.price * item.quantity;
      purchasedProducts.push({ product: product._id, quantity: item.quantity });
    } else {
      notPurchased.push({ product: item.product._id, quantity: item.quantity });
    }
  }

  // Generar ticket solo si hay productos comprados
  let ticket = null;
  if (purchasedProducts.length > 0) {
    ticket = await ticketRepository.create({
      code: uuidv4(),
      amount: total,
      purchaser: user.email,
      products: purchasedProducts
    });
  }

  // Actualizar carrito con productos no comprados
  cart.products = notPurchased;
  await cart.save();

  return {
    ticket,
    notPurchased
  };
};
