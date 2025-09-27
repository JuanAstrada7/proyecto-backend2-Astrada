import express from 'express';
import * as cartController from '../controllers/cart.controller.js';
import { verificarUsuario, verificarPermisos } from '../middleware/auth.middleware.js';

const router = express.Router();

router.get('/:id', verificarUsuario, cartController.getCartById);

router.post('/', verificarUsuario, verificarPermisos('user', 'admin'), cartController.createCart);

router.put('/:id', verificarUsuario, cartController.updateCart);

router.delete('/:id', verificarUsuario,  cartController.deleteCart);

router.post('/:id/purchase', verificarUsuario, verificarPermisos('user', 'admin'), cartController.buyCart);

export default router;