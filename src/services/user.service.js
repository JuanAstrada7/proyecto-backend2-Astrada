import UserRepository from '../repositories/user.repository.js';

const userRepository = new UserRepository();

export const getUserById = (id) => userRepository.getById(id);
export const getUserByEmail = (email) => userRepository.getByEmail(email);
export const createUser = (userData) => userRepository.create(userData);
export const updateUser = (id, data) => userRepository.update(id, data);
export const deleteUser = (id) => userRepository.delete(id);
export const getAllUsers = () => userRepository.getAll();