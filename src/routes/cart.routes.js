import express from 'express';
import * as cartController from '../controllers/cart.controller.js';
import { verificarUsuario, verificarPermisos } from '../middleware/auth.middleware.js';
import { body } from 'express-validator';

const router = express.Router();

router.get('/:id', verificarUsuario, cartController.getCartById);

router.post('/',
    verificarUsuario,
    verificarPermisos('user', 'admin'),
    [
        body('products').isArray({ min: 1 }).withMessage('Debe incluir al menos un producto en el carrito'),
        body('products.*.product').notEmpty().withMessage('Cada producto debe tener un ID válido'),
        body('products.*.quantity').isInt({ gt: 0 }).withMessage('La cantidad debe ser un número entero positivo')
    ],
    cartController.createCart
);

router.put('/:id', verificarUsuario, cartController.updateCart);

router.delete('/:id', verificarUsuario, cartController.deleteCart);

router.post('/:id/purchase',
    verificarUsuario,
    verificarPermisos('user', 'admin'),
    [
        body('paymentMethod').notEmpty().withMessage('El método de pago es obligatorio')
    ],
    cartController.buyCart
);

export default router;