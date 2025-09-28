import express from 'express';
import * as userController from '../controllers/user.controller.js';
import { verificarUsuario, verificarPermisos } from '../middleware/auth.middleware.js';

const router = express.Router();

router.post('/register', userController.registerUser);

router.get('/', verificarUsuario, verificarPermisos('admin'), userController.getAllUsers);

router.get('/:id', verificarUsuario, userController.getUserById);

router.put('/:id', verificarUsuario, userController.updateUser);

router.delete('/:id', verificarUsuario, verificarPermisos('admin'), userController.deleteUser);

// Ruta para cambio de contraseña (usuario logueado)
router.put('/change-password', verificarUsuario, userController.changePassword);

// Ruta para reset de contraseña (solo admins)
router.post('/reset-password', verificarUsuario, verificarPermisos('admin'), userController.resetUserPassword);

export default router;