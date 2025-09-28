export default class CartDTO {
    constructor(cart) {
        this.id = cart._id;
        this.user = cart.user;
        this.products = cart.products.map(p => ({
            product: p.product,
            quantity: p.quantity
        }));
    }
}