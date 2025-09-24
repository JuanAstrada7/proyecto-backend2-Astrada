import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import passport from 'passport';
import dotenv from 'dotenv';

import { initializePassport } from './config/passport.config.js';
import userRoutes from './routes/user.routes.js';
import sessionRoutes from './routes/session.routes.js';
import cartRoutes from './routes/cart.routes.js';
import ticketRoutes from './routes/ticket.routes.js';
import recoveryRoutes from './routes/recovery.routes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

initializePassport();
app.use(passport.initialize());

mongoose.connect(process.env.MONGO_URL)
  .then(() => console.log('Conectado a MongoDB'))
  .catch(err => console.error('Error conectando a MongoDB:', err));

app.use('/api/users', userRoutes);
app.use('/api/sessions', sessionRoutes);
app.use('/api/carts', cartRoutes);
app.use('/api/tickets', ticketRoutes);
app.use('/api/recovery', recoveryRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'API de Ecommerce funcionando correctamente' });
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});