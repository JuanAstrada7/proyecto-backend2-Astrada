import { sendRecoveryEmail, resetPassword } from '../services/recovery.service.js';

export const requestPasswordReset = async (req, res) => {
  try {
    const { email } = req.body;
    await sendRecoveryEmail(email);
    res.json({ message: 'Correo de recuperación enviado si el usuario existe.' });
  } catch (error) {
    res.status(500).json({ error: error.message || 'Error al solicitar recuperación' });
  }
};

export const performPasswordReset = async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    await resetPassword(token, newPassword);
    res.json({ message: 'Contraseña restablecida correctamente.' });
  } catch (error) {
    res.status(400).json({ error: error.message || 'Error al restablecer contraseña' });
  }
};
