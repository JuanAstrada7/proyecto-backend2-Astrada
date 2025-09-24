import express from 'express';
import * as userController from '../controllers/user.controller.js';
import { verificarUsuario, verificarPermisos } from '../middleware/auth.middleware.js';

const router = express.Router();

// Registro de usuario
router.post('/register', userController.registerUser);

// Listar usuarios (solo admin)
router.get('/', verificarUsuario, verificarPermisos('admin'), userController.getAllUsers);

// Obtener usuario por ID
router.get('/:id', verificarUsuario, userController.getUserById);

// Actualizar usuario
router.put('/:id', verificarUsuario, userController.updateUser);

// Eliminar usuario (solo admin)
router.delete('/:id', verificarUsuario, verificarPermisos('admin'), userController.deleteUser);

export default router;