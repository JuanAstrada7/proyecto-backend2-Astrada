import UserDTO from '../dtos/user.dto.js';
import { getCurrentUser } from '../services/session.service.js';

export const getCurrent = async (req, res) => {
  try {
    const userDTO = await getCurrentUser(req.user._id);
    if (!userDTO) return res.status(404).json({ error: 'Usuario no encontrado' });
    res.json({ user: userDTO });
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener usuario actual' });
  }
};