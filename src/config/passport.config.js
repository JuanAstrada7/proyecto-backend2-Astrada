import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import User from '../models/user.model.js';
import { generateToken } from '../utils/token.js';

export const initializePassport = () => {
    // Estrategia local para login
    passport.use('login', new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password'
    }, async (email, password, done) => {
        try {
            const user = await User.findOne({ email });

            if (!user) {
                return done(null, false, { message: 'Usuario no encontrado' });
            }

            if (!user.verificarContraseña(password)) {
                return done(null, false, { message: 'Contraseña incorrecta' });
            }

            return done(null, user);
        } catch (error) {
            return done(error);
        }
    }));

    // Estrategia JWT para autenticación
    passport.use('jwt', new JwtStrategy({
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: process.env.JWT_SECRET || 'jwt_secret'
    }, async (payload, done) => {
        try {
            const user = await User.findById(payload.id);
            if (!user) {
                return done(null, false);
            }
            return done(null, user); // req.user tendrá el usuario completo, incluyendo el rol
        } catch (error) {
            return done(error);
        }
    }));
};

export { generateToken };