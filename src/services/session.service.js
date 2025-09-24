import UserRepository from '../repositories/user.repository.js';
import UserDTO from '../dtos/user.dto.js';

const userRepository = new UserRepository();

export const getCurrentUser = async (userId) => {
  const user = await userRepository.getById(userId);
  if (!user) return null;
  return new UserDTO(user);
};
