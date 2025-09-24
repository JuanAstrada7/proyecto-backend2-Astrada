import express from 'express';
import * as productController from '../controllers/product.controller.js';
import { verificarUsuario, verificarPermisos } from '../middleware/auth.middleware.js';

const router = express.Router();

router.get('/', verificarUsuario, productController.getAllProducts);

router.get('/:id', verificarUsuario, productController.getProductById);

router.post('/', verificarUsuario, verificarPermisos('admin'), productController.createProduct);

router.put('/:id', verificarUsuario, verificarPermisos('admin'), productController.updateProduct);

router.delete('/:id', verificarUsuario, verificarPermisos('admin'), productController.deleteProduct);

export default router;
