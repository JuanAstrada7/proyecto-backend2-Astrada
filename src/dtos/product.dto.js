export default class ProductDTO {
    constructor(product) {
        this.id = product._id;
        this.name = product.name;
        this.price = product.price;
        this.stock = product.stock;
        this.category = product.category;
    }
}