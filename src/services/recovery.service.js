import jwt from 'jsonwebtoken';
import UserRepository from '../repositories/user.repository.js';
import { sendMail } from '../utils/mailer.js';
import bcrypt from 'bcrypt';

const userRepository = new UserRepository();

export const sendRecoveryEmail = async (email) => {
  const user = await userRepository.getByEmail(email);
  if (!user) throw new Error('Usuario no encontrado');

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
  const link = `http://localhost:3000/reset-password?token=${token}`;

  await sendMail(
    user.email,
    'Recuperación de contraseña',
    `<p>Haz click en el siguiente enlace para restablecer tu contraseña (expira en 1 hora):</p>
     <a href="${link}">Restablecer contraseña</a>`
  );
};

export const resetPassword = async (token, newPassword) => {
  const payload = jwt.verify(token, process.env.JWT_SECRET);
  const user = await userRepository.getById(payload.id);
  if (!user) throw new Error('Usuario no encontrado');

  if (bcrypt.compareSync(newPassword, user.password)) {
    throw new Error('La nueva contraseña no puede ser igual a la anterior');
  }

  user.password = bcrypt.hashSync(newPassword, 10);
  await user.save();
};