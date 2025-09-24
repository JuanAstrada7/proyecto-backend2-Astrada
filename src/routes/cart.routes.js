import express from 'express';
import * as cartController from '../controllers/cart.controller.js';
import { verificarUsuario, verificarPermisos } from '../middlewares/auth.middleware.js';

const router = express.Router();

// Obtener carrito por ID
router.get('/:id', verificarUsuario, cartController.getCartById);

// Crear carrito (solo usuario)
router.post('/', verificarUsuario, verificarPermisos('user'), cartController.createCart);

// Actualizar carrito
router.put('/:id', verificarUsuario, cartController.updateCart);

// Eliminar carrito
router.delete('/:id', verificarUsuario, cartController.deleteCart);

// Comprar carrito
router.post('/:id/purchase', verificarUsuario, verificarPermisos('user'), cartController.buyCart);

export default router;