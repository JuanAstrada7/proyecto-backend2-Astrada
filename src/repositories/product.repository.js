import ProductDAO from '../daos/product.dao.js';

export default class ProductRepository {
    constructor() {
        this.dao = new ProductDAO();
    }
    getById(id) {
        return this.dao.findById(id);
    }
    create(productData) {
        return this.dao.create(productData);
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
