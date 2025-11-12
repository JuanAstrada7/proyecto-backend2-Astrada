import ProductRepository from '../repositories/product.repository.js';

const productRepository = new ProductRepository();

export const getProductById = (id) => productRepository.getById(id);
export const createProduct = (productData) => productRepository.create(productData);
export const updateProduct = (id, data) => productRepository.update(id, data);
export const deleteProduct = (id) => productRepository.delete(id);
export const createManyProducts = (productsData) => productRepository.create(productsData);
export const getAllProducts = () => productRepository.getAll();
