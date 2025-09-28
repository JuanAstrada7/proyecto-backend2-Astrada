import UserRepository from '../repositories/user.repository.js';
import { mailerService } from '../utils/mailer.js';
import bcrypt from 'bcrypt';
import { generateToken, verifyToken } from '../utils/token.js';

const userRepository = new UserRepository();

export const sendRecoveryEmail = async (email) => {
  const formattedEmail = email.trim().toLowerCase();
  console.log('Buscando usuario con email:', formattedEmail);

  const user = await userRepository.getByEmail(formattedEmail);
  if (!user) throw new Error('Usuario no encontrado');

  const token = generateToken({ id: user._id }, '1h');
  const link = `${process.env.BASE_URL}/reset-password?token=${token}`;

  await mailerService.send({
    to: user.email,
    subject: 'Recuperación de contraseña',
    template: 'password-reset',
    context: {
      name: user.first_name || 'Usuario',
      link
    },
  });
};

export const resetPassword = async (token, newPassword) => {
  const payload = verifyToken(token);
  if (!payload) throw new Error('Token inválido o expirado');
  const user = await userRepository.getById(payload.id);
  if (!user) throw new Error('Usuario no encontrado');

  if (bcrypt.compareSync(newPassword, user.password)) {
    throw new Error('La nueva contraseña no puede ser igual a la anterior');
  }

  user.password = bcrypt.hashSync(newPassword, 10);
  await user.save();
};