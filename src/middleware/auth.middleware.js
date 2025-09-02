import passport from 'passport';

export const verificarUsuario = passport.authenticate('jwt', { session: false });

export const verificarPermisos = (...rolesPermitidos) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'No autorizado' });
    }

    if (!rolesPermitidos.includes(req.user.role)) {
      return res.status(403).json({ error: 'Acceso denegado' });
    }

    next();
  };
};