import CartDAO from '../daos/cart.dao.js';

export default class CartRepository {
  constructor() {
    this.dao = new CartDAO();
  }
  getById(id) {
    return this.dao.findById(id);
  }
  create(cartData) {
    return this.dao.create(cartData);
  }
  update(id, data) {
    return this.dao.update(id, data);
  }
  delete(id) {
    return this.dao.delete(id);
  }
  getAll() {
    return this.dao.findAll();
  }
}
