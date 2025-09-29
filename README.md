# Ecommerce API Backend

API REST para ecommerce con autenticación JWT, gestión de productos, carritos y sistema de pedidos.

## Características

- **Autenticación JWT** con Passport.js
- **CRUD de usuarios** con roles (user/admin)
- **Gestión de productos** y categorías
- **Sistema de carritos** y checkout
- **Tickets de pedidos** 
- **Mensajería SMS/WhatsApp** (Twilio)
- **Recovery de contraseñas**
- **Emails transaccionales**

## Endpoints Principales

### Autenticación
- `POST /api/sessions/login` - Login
- `GET /api/sessions/current` - Usuario actual
- `POST /api/sessions/logout` - Logout

### Usuarios
- `POST /api/users/register` - Registrar usuario
- `GET /api/users` - Listar usuarios (admin)
- `PUT /api/users/change-password` - Cambiar contraseña

### Productos
- `GET /api/products` - Listar productos
- `POST /api/products` - Crear producto (admin)
- `GET /api/products/:id` - Obtener producto

### Carritos & Pedidos
- `POST /api/carts` - Crear carrito
- `GET /api/carts/:id` - Obtener carrito
- `POST /api/carts/:id/purchase` - Finalizar compra
- `GET /api/tickets` - Listar tickets

*Ver colección de Postman para endpoints completos*

## Instalación

```bash
# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env
# Editar .env con valores reales

# Ejecutar en desarrollo
npm run dev
```

## Variables de Entorno

Configurar `.env` con:
- `MONGO_URL` - Conexión a MongoDB
- `JWT_SECRET` / `SESSION_SECRET` - Claves de seguridad  
- `EMAIL_*` - Configuración SMTP para emails
- `TWILIO_*` - Credenciales para SMS/WhatsApp

Ver `.env.example` para referencia completa.

## Tecnologías

- **Node.js** + **Express.js** - Backend framework
- **MongoDB** + **Mongoose** - Base de datos
- **JWT** + **Passport.js** - Autenticación
- **bcrypt** - Encriptación de contraseñas
- **Twilio** - SMS/WhatsApp
- **Nodemailer** - Emails

## Testing

Importar `Ecommerce-API-Complete.postman_collection.json` en Postman para probar todos los endpoints.

La colección incluye:
- Variables automáticas (token, IDs)
- 32+ endpoints organizados
- Tests automáticos

## Arquitectura

```
src/
├── controllers/    # Lógica de controladores
├── services/       # Lógica de negocio  
├── daos/          # Acceso a datos
├── models/        # Modelos Mongoose
├── routes/        # Definición de rutas
├── middleware/    # Middlewares custom
└── config/        # Configuraciones
```

---
**Autor**: Juan Pablo Astrada  
**Curso**: Backend - Coderhouse