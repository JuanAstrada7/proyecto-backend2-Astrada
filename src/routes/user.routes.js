import express from 'express';
import passport from 'passport';
import User from '../models/user.model.js';
import Cart from '../models/cart.model.js';
import { generateToken } from '../config/passport.config.js';
import { verificarUsuario, verificarPermisos } from '../middleware/auth.middleware.js';

const router = express.Router();

router.post('/register', async (req, res) => {
  try {
    const { first_name, last_name, email, age, password } = req.body;

    if (!first_name || !last_name || !email || !age || !password) {
      return res.status(400).json({ error: 'Todos los campos son requeridos' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'El email ya está registrado' });
    }

    const cart = new Cart();
    await cart.save();

    const user = new User({
      first_name,
      last_name,
      email,
      age,
      password,
      cart: cart._id
    });

    await user.save();

    const token = generateToken(user);

    res.status(201).json({
      message: 'Usuario registrado exitosamente',
      user: user.obtenerDatosPublicos(),
      token
    });

  } catch (error) {
    console.error('Error en registro:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

router.get('/', verificarUsuario, verificarPermisos('admin'), async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener usuarios' });
  }
});

router.get('/:id', verificarUsuario, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');

    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    if (req.user.role !== 'admin' && req.user._id.toString() !== req.params.id) {
      return res.status(403).json({ error: 'Acceso denegado' });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener usuario' });
  }
});

router.put('/:id', verificarUsuario, async (req, res) => {
  try {
    const { first_name, last_name, email, age } = req.body;

    if (req.user.role !== 'admin' && req.user._id.toString() !== req.params.id) {
      return res.status(403).json({ error: 'Acceso denegado' });
    }

    const updateData = {};
    if (first_name) updateData.first_name = first_name;
    if (last_name) updateData.last_name = last_name;
    if (email) updateData.email = email;
    if (age) updateData.age = age;

    const user = await User.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar usuario' });
  }
});

router.delete('/:id', verificarUsuario, verificarPermisos('admin'), async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    if (user.cart) {
      await Cart.findByIdAndDelete(user.cart);
    }

    res.json({ message: 'Usuario eliminado exitosamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar usuario' });
  }
});

export default router;