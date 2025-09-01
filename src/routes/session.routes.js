import express from 'express';
import passport from 'passport';
import { generateToken } from '../config/passport.config.js';

const router = express.Router();

router.post('/login', passport.authenticate('login', { session: false }), (req, res) => {
  try {
    const token = generateToken(req.user);
    
    console.log('Token generado:', token);
    console.log('Longitud del token:', token.length);
    
    res.json({
      message: 'Login exitoso',
      user: req.user.toPublicJSON(),
      token
    });
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ error: 'Error en login' });
  }
});

router.get('/current', passport.authenticate('jwt', { session: false }), (req, res) => {
  try {
    res.json({
      user: req.user.toPublicJSON()
    });
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener usuario actual' });
  }
});

router.post('/logout', (req, res) => {
  res.json({ message: 'Logout exitoso' });
});

export default router;