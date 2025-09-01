import passport from 'passport';

export const authenticateJWT = passport.authenticate('jwt', { session: false });

export const authorizeRoles = (...roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ error: 'No autorizado' });
        }

        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ error: 'Acceso denegado' });
        }

        next();
    };
};

export const checkOwnership = (resourceField = 'user') => {
    return (req, res, next) => {
        if (req.user.role === 'admin') {
            return next();
        }

        const resourceId = req.params[resourceField] || req.params.id;
        if (req.user._id.toString() !== resourceId) {
            return res.status(403).json({ error: 'Acceso denegado' });
        }

        next();
    };
};