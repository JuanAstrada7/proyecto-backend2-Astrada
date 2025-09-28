import UserRepository from '../repositories/user.repository.js';
import bcrypt from 'bcrypt';

const userRepository = new UserRepository();

export const getUserById = (id) => userRepository.getById(id);
export const getUserByEmail = (email) => userRepository.getByEmail(email);
export const createUser = (userData) => userRepository.create(userData);
export const updateUser = (id, data) => userRepository.update(id, data);
export const deleteUser = (id) => userRepository.delete(id);
export const getAllUsers = () => userRepository.getAll();

// Servicio específico para actualizar contraseñas de forma segura
export const updatePassword = async (userId, newPassword) => {
  try {
    // Hashear la nueva contraseña
    const hashedPassword = bcrypt.hashSync(newPassword, 10);
    
    // Actualizar directamente en el repositorio
    return await userRepository.update(userId, { password: hashedPassword });
  } catch (error) {
    throw new Error('Error al actualizar la contraseña: ' + error.message);
  }
};