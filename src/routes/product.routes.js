import express from 'express';
import * as productController from '../controllers/product.controller.js';
import { verificarUsuario, verificarPermisos } from '../middleware/auth.middleware.js';
import { body } from 'express-validator';

const router = express.Router();

router.get('/', verificarUsuario, productController.getAllProducts);

router.get('/:id', verificarUsuario, productController.getProductById);

router.post('/',
    verificarUsuario,
    verificarPermisos('admin'),
    [
        body('name').notEmpty().withMessage('El nombre del producto es obligatorio'),
        body('price').isFloat({ gt: 0 }).withMessage('El precio debe ser un número positivo'),
        body('stock').isInt({ gt: 0 }).withMessage('El stock debe ser un número entero positivo')
    ],
    productController.createProduct
);

router.put('/:id',
    verificarUsuario,
    verificarPermisos('admin'),
    [
        body('name').optional().notEmpty().withMessage('El nombre no puede estar vacío'),
        body('price').optional().isFloat({ gt: 0 }).withMessage('El precio debe ser un número positivo'),
        body('stock').optional().isInt({ gt: 0 }).withMessage('El stock debe ser un número entero positivo')
    ],
    productController.updateProduct
);

router.delete('/:id', verificarUsuario, verificarPermisos('admin'), productController.deleteProduct);

export default router;
