import Product from '../models/product.model.js';

export default class ProductDAO {
    async findById(id) {
        return Product.findById(id);
    }
    async create(productData) {
        return Product.create(productData);
    }
    async update(id, data) {
        return Product.findByIdAndUpdate(id, data, { new: true });
    }
    async delete(id) {
        return Product.findByIdAndDelete(id);
    }
    async findAll() {
        return Product.find();
    }
}
