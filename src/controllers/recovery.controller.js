import { sendRecoveryEmail, resetPassword } from '../services/recovery.service.js';
import { messagingService } from '../services/messaging.service.js';
import UserRepository from '../repositories/user.repository.js';

const userRepository = new UserRepository();

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

export const recoveryRequest = async (req, res) => {
  try {
    const { phone } = req.body; // El usuario debe enviar su número de teléfono
    console.log('Número de teléfono recibido:', phone);

    // Verificar si el número de teléfono está registrado
    const user = await userRepository.getByPhone(phone);
    console.log('Resultado de búsqueda de usuario:', user);

    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    const code = Math.floor(100000 + Math.random() * 900000); // Genera un código de recuperación
    console.log('Código de recuperación generado:', code);

    await messagingService.sendSMS({ to: phone, body: `Tu código de recuperación es: ${code}` });
    res.json({ message: 'SMS enviado correctamente', code });
  } catch (error) {
    console.error('Error en recoveryRequest:', error);
    res.status(500).json({ error: 'Error al enviar SMS' });
  }
};
