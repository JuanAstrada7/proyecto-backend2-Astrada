import TicketRepository from '../repositories/ticket.repository.js';
import ProductRepository from '../repositories/product.repository.js';

const ticketRepository = new TicketRepository();
const productRepository = new ProductRepository();

export const getTicketById = (id) => ticketRepository.getById(id);
export const createTicket = (ticketData) => ticketRepository.create(ticketData);
export const getAllTickets = () => ticketRepository.getAll();

export const processPurchase = async (cart) => {
  const unavailableProducts = [];
  const purchasedProducts = [];

  for (const item of cart) {
    const product = await productRepository.getById(item.productId);
    if (!product || product.stock < item.quantity) {
      unavailableProducts.push(item);
    } else {
      product.stock -= item.quantity;
      await productRepository.update(product.id, { stock: product.stock });
      purchasedProducts.push(item);
    }
  }

  if (purchasedProducts.length > 0) {
    const ticketData = {
      code: generateUniqueCode(),
      amount: purchasedProducts.reduce((sum, item) => sum + item.price * item.quantity, 0),
      purchaser: cart.userId,
      products: purchasedProducts.map((item) => ({ product: item.productId, quantity: item.quantity })),
    };
    await createTicket(ticketData);
  }

  return { purchasedProducts, unavailableProducts };
};
