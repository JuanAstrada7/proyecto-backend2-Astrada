import * as userService from '../services/user.service.js';
import UserDTO from '../dtos/user.dto.js';
import User from '../models/user.model.js';
import Cart from '../models/cart.model.js';
import { generateToken } from '../utils/token.js';
import bcrypt from 'bcrypt';

export const getAllUsers = async (req, res) => {
  try {
    const users = await userService.getAllUsers();
    res.json(users.map(u => new UserDTO(u)));
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener usuarios' });
  }
};

export const getUserById = async (req, res) => {
  try {
    const user = await userService.getUserById(req.params.id);
    if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });
    res.json(new UserDTO(user));
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener usuario' });
  }
};

export const updateUser = async (req, res) => {
  try {
    const user = await userService.updateUser(req.params.id, req.body);
    if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });
    res.json(new UserDTO(user));
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar usuario' });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const user = await userService.deleteUser(req.params.id);
    if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });
    res.json({ message: 'Usuario eliminado exitosamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar usuario' });
  }
};

export const registerUser = async (req, res) => {
  try {
    const { first_name, last_name, email, age, password, phone } = req.body;

    if (!first_name || !last_name || !email || !age || !password || !phone) {
      return res.status(400).json({ error: 'Todos los campos son requeridos (first_name, last_name, email, age, password, phone)' });
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
      phone,
      cart: cart._id
    });

    await user.save();

    const token = generateToken(user.obtenerDatosPublicos());

    res.status(201).json({
      message: 'Usuario registrado exitosamente',
      user: user.obtenerDatosPublicos(),
      token
    });
  } catch (error) {
    console.error('Error en registro:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

export const changePassword = async (req, res) => {
  try {
    const { email, newPassword, currentPassword } = req.body;
    
    if (!email || !newPassword) {
      return res.status(400).json({ error: 'Email y nueva contraseña son requeridos' });
    }

    const user = await userService.getUserByEmail(email);
    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    // Si se proporciona contraseña actual, verificarla (para usuarios logueados)
    if (currentPassword) {
      if (!user.verificarContraseña(currentPassword)) {
        return res.status(401).json({ error: 'Contraseña actual incorrecta' });
      }
    }

    // Actualizar contraseña usando el servicio
    await userService.updatePassword(user._id, newPassword);

    res.json({
      message: 'Contraseña actualizada correctamente',
      email: user.email
    });
  } catch (error) {
    console.error('Error al cambiar contraseña:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// Controlador para reset de contraseña (sin verificar contraseña actual - solo para admins)
export const resetUserPassword = async (req, res) => {
  try {
    const { email, newPassword } = req.body;
    
    if (!email || !newPassword) {
      return res.status(400).json({ error: 'Email y nueva contraseña son requeridos' });
    }

    const user = await userService.getUserByEmail(email);
    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    // Actualizar contraseña usando el servicio
    await userService.updatePassword(user._id, newPassword);

    res.json({
      message: 'Contraseña restablecida correctamente',
      email: user.email,
      role: user.role
    });
  } catch (error) {
    console.error('Error al restablecer contraseña:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};