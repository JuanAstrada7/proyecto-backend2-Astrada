import UserRepository from '../repositories/user.repository.js';
import { sendMail } from '../utils/mailer.js';
import bcrypt from 'bcrypt';
import { generateToken, verifyToken } from '../utils/token.js';

const userRepository = new UserRepository();

export const sendRecoveryEmail = async (email) => {
  const formattedEmail = email.trim().toLowerCase(); // Formatear el correo
  console.log('Buscando usuario con email:', formattedEmail); // Log para depuración

  const user = await userRepository.getByEmail(formattedEmail);
  if (!user) throw new Error('Usuario no encontrado');

  const token = generateToken({ id: user._id }, '1h');
  const link = `http://localhost:${process.env.PORT}/reset-password?token=${token}`;

  await sendMail(
    user.email,
    'Recuperación de contraseña',
    `<p>Haz click en el siguiente enlace para restablecer tu contraseña (expira en 1 hora):</p>
     <a href="${link}">Restablecer contraseña</a>`
  );
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