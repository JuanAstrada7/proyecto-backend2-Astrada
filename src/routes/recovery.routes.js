import express from 'express';
import { requestPasswordReset, performPasswordReset } from '../controllers/recovery.controller.js';

const router = express.Router();

// Solicitar recuperación de contraseña
router.post('/request', requestPasswordReset);

// Restablecer contraseña
router.post('/reset', performPasswordReset);

export default router;
