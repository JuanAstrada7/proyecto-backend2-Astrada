import express from 'express';
import { verificarUsuario } from '../middleware/auth.middleware.js';
import Cart from '../models/cart.model.js';

const router = express.Router();

router.get('/:id', verificarUsuario, async (req, res) => {
  try {
    const cart = await Cart.findById(req.params.id).populate('products.product');

    if (!cart) {
      return res.status(404).json({ error: 'Carrito no encontrado' });
    }

    if (req.user.role !== 'admin' && cart.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Acceso denegado' });
    }

    res.json(cart);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener carrito' });
  }
});

router.post('/', verificarUsuario, async (req, res) => {
  try {
    const cart = new Cart({
      user: req.user._id
    });

    await cart.save();
    res.status(201).json(cart);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear carrito' });
  }
});

export default router;