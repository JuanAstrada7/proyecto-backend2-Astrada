# Ecommerce Backend

## Características

- **CRUD completo** de usuarios
- **Autenticación JWT** con Passport
- **Autorización por roles** (user, admin)
- **Encriptación de contraseñas** con bcrypt
- **Sistema de carritos** integrado

## Endpoints

### Usuarios
- `POST /api/users/register` - Registrar usuario
- `GET /api/users` - Obtener usuarios (admin)
- `GET /api/users/:id` - Obtener usuario por ID
- `PUT /api/users/:id` - Actualizar usuario
- `DELETE /api/users/:id` - Eliminar usuario (admin)

### Sesiones
- `POST /api/sessions/login` - Login
- `GET /api/sessions/current` - Usuario actual
- `POST /api/sessions/logout` - Logout

### Carritos
- `GET /api/carts/:id` - Obtener carrito
- `POST /api/carts` - Crear carrito

## Instalación

# Instalar dependencias
npm install

# Crear variables de entorno
crear Archivo .env

# Ejecutar en desarrollo
npm run dev

## Variables de Entorno

.env
PORT=8080
MONGO_URL=mongodb://localhost:27017/ecommerce
JWT_SECRET=tu_jwt_secret_aqui
SESSION_SECRET=tu_session_secret_aqui

## 🔒 Seguridad

- Contraseñas encriptadas con bcrypt
- Tokens JWT para autenticación
- Autorización por roles
- Validaciones de acceso

## 📚 Tecnologías

- Node.js
- Express.js
- MongoDB con Mongoose
- Passport.js
- JWT
- bcrypt