import express from 'express';
import * as productController from '../controllers/product.controller.js';
import { verificarUsuario, verificarPermisos } from '../middlewares/auth.middleware.js';

const router = express.Router();

// Obtener todos los productos
router.get('/', verificarUsuario, productController.getAllProducts);

// Obtener producto por ID
router.get('/:id', verificarUsuario, productController.getProductById);

// Crear producto (solo admin)
router.post('/', verificarUsuario, verificarPermisos('admin'), productController.createProduct);

// Actualizar producto (solo admin)
router.put('/:id', verificarUsuario, verificarPermisos('admin'), productController.updateProduct);

// Eliminar producto (solo admin)
router.delete('/:id', verificarUsuario, verificarPermisos('admin'), productController.deleteProduct);

export default router;
