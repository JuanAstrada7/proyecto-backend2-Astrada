import UserDTO from '../dtos/user.dto.js';

export const getCurrent = (req, res) => {
  try {
    res.json({ user: new UserDTO(req.user) });
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener usuario actual' });
  }
};