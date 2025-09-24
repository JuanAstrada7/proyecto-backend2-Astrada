import express from 'express';
import passport from 'passport';
import { getCurrent } from '../controllers/session.controller.js';

const router = express.Router();

router.get('/current', passport.authenticate('jwt', { session: false }), getCurrent);

export default router;

/*import express from 'express';
import passport from 'passport';
import { generateToken } from '../config/passport.config.js';

const router = express.Router();

router.post('/login', passport.authenticate('login', { session: false }), (req, res) => {
  try {
    console.log('Usuario logueado:', req.user.email);
    const token = generateToken(req.user);

    res.json({
      message: 'Login exitoso',
      user: req.user.obtenerDatosPublicos(),
      token
    });
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ error: 'Error en login' });
  }
});

router.get('/current', passport.authenticate('jwt', { session: false }), (req, res) => {
  try {
    console.log('Usuario actual obtenido:', req.user.email);
    res.json({
      user: req.user.obtenerDatosPublicos()
    });
  } catch (error) {
    console.error('Error al obtener usuario actual:', error);
    res.status(500).json({ error: 'Error al obtener usuario actual' });
  }
});

router.post('/logout', (req, res) => {
  res.json({ message: 'Logout exitoso' });
});

export default router; */