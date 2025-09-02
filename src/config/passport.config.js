import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';

export const initializePassport = () => {
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

    passport.use('jwt', new JwtStrategy({
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: process.env.JWT_SECRET || 'jwt_secret'
    }, async (payload, done) => {
        try {
            console.log('JWT Payload recibido:', payload);

            const user = await User.findById(payload.id);

            if (!user) {
                console.log('Usuario no encontrado con ID:', payload.id);
                return done(null, false);
            }

            console.log('Usuario encontrado:', user.email);
            return done(null, user);
        } catch (error) {
            console.error('Error en JWT strategy:', error);
            return done(error);
        }
    }));
};

export const generateToken = (user) => {
    console.log('Generando token para usuario:', user.email);

    const token = jwt.sign(
        { id: user._id, email: user.email, role: user.role },
        process.env.JWT_SECRET || 'jwt_secret',
        { expiresIn: '24h' }
    );

    return token;
};