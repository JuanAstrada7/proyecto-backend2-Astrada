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
import mockRoutes from './routes/mock.routes.js';
import emailPreviewRoutes from './routes/email-preview.routes.js';
import errorHandler from './middleware/error.middleware.js';
import logger from './middleware/logger.middleware.js';
import config from './config/config.js';

const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(logger);

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
app.use('/api/mocks', mockRoutes);
app.use('/api/email-preview', emailPreviewRoutes);

app.get('/', (req, res) => {
  res.json({
    message: 'API de Ecommerce funcionando correctamente',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    endpoints: {
      users: '/api/users',
      sessions: '/api/sessions',
      products: '/api/products',
      carts: '/api/carts',
      tickets: '/api/tickets',
      recovery: '/api/recovery',
      messaging: '/api/messaging',
      mocks: '/api/mocks',
      'email-preview': '/api/email-preview'
    },
    status: 'OK'
  });
});

app.use(errorHandler);

process.on('unhandledRejection', (reason) => {
  console.error('[process] Unhandled Rejection:', reason);
});

process.on('uncaughtException', (err) => {
  console.error('[process] Uncaught Exception:', err);
});

process.on('SIGINT', () => {
  console.log('\n[process] SIGINT recibido. Cerrando...');
  process.exit(0);
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});