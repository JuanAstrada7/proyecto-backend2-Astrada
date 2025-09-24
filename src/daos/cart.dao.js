import Cart from '../models/cart.model.js';

export default class CartDAO {
    async findById(id) {
        return Cart.findById(id).populate('products.product');
    }
    async create(cartData) {
        return Cart.create(cartData);
    }
    async update(id, data) {
        return Cart.findByIdAndUpdate(id, data, { new: true });
    }
    async delete(id) {
        return Cart.findByIdAndDelete(id);
    }
    async findAll() {
        return Cart.find().populate('products.product');
    }
}
