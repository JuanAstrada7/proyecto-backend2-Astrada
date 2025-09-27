import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import passport from 'passport';
import { initializePassport } from './config/passport.config.js';
import userRoutes from './routes/user.routes.js';
import sessionRoutes from './routes/session.routes.js';
import cartRoutes from './routes/cart.routes.js';
import ticketRoutes from './routes/ticket.routes.js';
import recoveryRoutes from './routes/recovery.routes.js';
import productRoutes from './routes/product.routes.js';
import messagingRoutes from './routes/messaging.routes.js';
import errorHandler from './middleware/error.middleware.js';
import config from './config/config.js';

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
app.use('/api/products', productRoutes);
app.use('/api/tickets', ticketRoutes);
app.use('/api/recovery', recoveryRoutes);
app.use('/api/messaging', messagingRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'API de Ecommerce funcionando correctamente' });
});

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});