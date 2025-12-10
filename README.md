# 🛒 Ecommerce API - NestJS Backend

Una API RESTful robusta y escalable para un sistema de ecommerce construida con **NestJS**, **MongoDB** y **TypeScript**.

## 📖 Descripción del Proyecto

Este proyecto es una API RESTful completa para un sistema de ecommerce que proporciona funcionalidades de:

- **Gestión de Usuarios**: Registro, autenticación, cambio de contraseña, gestión de roles.
- **Gestión de Productos**: CRUD completo de productos con stock y precios.
- **Carrito de Compras**: Añadir/eliminar productos, gestionar cantidades y realizar compras.
- **Tickets de Compra**: Generación de tickets de compra con seguimiento.
- **Mensajería**: Envío de correos de confirmación y SMS.
- **Seguridad**: Autenticación JWT, control de roles (Admin/User), encriptación de contraseñas.


## ✨ Características Principales

- ✅ **Autenticación JWT**: Sistema seguro de tokens JWT para autenticación.
- ✅ **Control de Roles**: Roles de administrador y usuario con permisos diferenciados.
- ✅ **Base de Datos MongoDB**: Persistencia de datos con Mongoose.
- ✅ **Documentación Swagger**: API documentada interactivamente en `/api-docs`.
- ✅ **Tests Funcionales**: Suite completa de tests e2e con supertest.
- ✅ **Validación de Datos**: Validación de DTOs con `class-validator`.
- ✅ **Gestión de Errores**: Manejo centralizado de excepciones.
- ✅ **Docker**: Imagen Docker lista para producción.
- ✅ **Configuración por Variables de Entorno**: `.env` para configuración flexible.

---

## 🏗️ Arquitectura y Módulos

El proyecto está organizado en módulos NestJS independientes:

### Módulos Principales

| Módulo | Descripción | Rutas |

| **Users** | Gestión de usuarios, registro, autenticación | `POST /api/users`, `GET /api/users`, `PATCH /api/users/:id/role` |
| **Auth** | Autenticación con JWT y Passport | `POST /api/auth/login`, `POST /api/auth/register` |
| **Products** | CRUD de productos | `GET /api/products`, `POST /api/products`, `PUT /api/products/:id`, `DELETE /api/products/:id` |
| **Carts** | Carrito de compras | `GET /api/carts/:cid`, `POST /api/carts/:cid/products`, `POST /api/carts/:cid/purchase` |
| **Tickets** | Generación de tickets de compra | `POST /api/tickets`, `GET /api/tickets/:code` |
| **Messaging** | Envío de emails y SMS | Servicios internos |

### Stack Tecnológico

- **Framework**: NestJS 11
- **Lenguaje**: TypeScript 5.7
- **Base de Datos**: MongoDB + Mongoose 8
- **Autenticación**: JWT + Passport
- **Testing**: Jest + Supertest
- **Documentación**: Swagger (NestJS Swagger)
- **Email**: Nodemailer
- **SMS**: Twilio
- **Containerización**: Docker

## 📦 Requisitos Previos

### Para ejecución local:

- **Node.js** >= 18.x
- **npm** >= 9.x
- **MongoDB** >= 4.x (local o [MongoDB Atlas](https://www.mongodb.com/cloud/atlas))

### Para Docker:

- **Docker** >= 20.x
- **Docker Compose** >= 1.29.x (opcional)


## 🚀 Instalación Local

### 1. Clonar el repositorio

git clone https://github.com/JuanAstrada7/proyecto-backend2-Astrada.git
cd proyectoBack-niv2

### 2. Instalar dependencias

npm install

### 3. Compilar el proyecto

npm run build

### 4. Configurar variables de entorno

Crea un archivo `.env` en la raíz del proyecto con las siguientes variables:

# MongoDB
MONGO_URI=mongodb://localhost:27017/ecommerce

# JWT
JWT_SECRET=tu_super_secreto_jwt_aqui
JWT_EXPIRATION=3600

# Puerto
PORT=3000

# Twilio (opcional, para SMS)
TWILIO_SID=your_twilio_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_FROM_SMS=+1234567890

# Nodemailer (opcional, para email)
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USER=tu_correo@gmail.com
MAIL_PASS=tu_contraseña_app
MAIL_FROM=noreply@ecommerce.com

# Ambiente
NODE_ENV=development

## ▶️ Ejecutar la Aplicación

### Modo desarrollo

npm run start:dev

La aplicación estará disponible en `http://localhost:3000`

## 🧪 Ejecutar Pruebas

### Tests unitarios

npm run test

### Tests funcionales (e2e)

npm run test:e2e

### Tests Implementados

- ✅ **Carts (e2e)**: Cobertura completa de endpoints de carrito
- ✅ **Products (e2e)**: CRUD de productos
- ✅ **Tickets (e2e)**: Generación de tickets
- ✅ **Messaging (e2e)**: Servicios de email
- ✅ **Units**: Servicios y controladores

## 📚 Documentación API con Swagger

Una vez que la aplicación está en ejecución, accede a la documentación interactiva de la API:

### 🔗 URL: http://localhost:3000/api-docs

### Módulo Users Documentado

El módulo de **Users** está completamente documentado en Swagger con:

- Registro de usuarios
- Obtener perfil actual
- Listar usuarios (Admin)
- Obtener usuario por ID (Admin)
- Actualizar rol de usuario (Admin)
- Cambiar contraseña
- Resetear contraseña (Admin)

#### Cada endpoint incluye:

- ✅ Descripción de la operación
- ✅ Parámetros requeridos y opcionales
- ✅ Respuestas esperadas (200, 400, 401, 403, 404)
- ✅ Autenticación Bearer Token


## 🐳 Docker y Dockerhub

La aplicación está completamente dockerizada y disponible en Docker Hub.

### Docker Hub Repository

| Propiedad | Valor |

| **Repositorio** | [`juancho14/app-ecommerce`](https://hub.docker.com/r/juancho14/app-ecommerce) |
| **Imagen** | `juancho14/app-ecommerce:v1.0.0` |
| **Tamaño** | ~94.7 MB |
| **Estado** | Recientemente actualizado |


### 1️⃣ Descargar la imagen desde Docker Hub

docker pull juancho14/app-ecommerce:v1.0.0

### 2️⃣ Ejecutar el contenedor

docker-compose up -d

**Nota**: Asegúrate de que el archivo `docker-compose.yml` está configurado correctamente con las variables de entorno necesarias.

### 3️⃣ Acceder a la aplicación

- **API**: http://localhost:3000
- **Swagger**: http://localhost:3000/api-docs

### Variables de Entorno Requeridas en Docker

MONGO_URI=mongodb://your_mongodb_connection_string
JWT_SECRET=your_super_secret_jwt_key
PORT=3000
NODE_ENV=production

## 🔐 Autenticación y Autorización

### Flujo de Autenticación

1. **Registro**: `POST /api/users` (sin autenticación)
2. **Login**: `POST /api/auth/login` (sin autenticación)
3. **Token JWT**: Se devuelve un token válido por 1 hora
4. **Uso**: Incluir el token en el header: `Authorization: Bearer <token>`

### Roles y Permisos

| Rol | Permisos |

| **User** | Puede gestionar su propio perfil y carrito |
| **Admin** | Acceso total a usuarios, productos y tickets |

### Guards Implementados

- **JwtAuthGuard**: Valida que el token JWT sea válido
- **RolesGuard**: Verifica los roles requeridos para cada endpoint

## 👤 Autor

**Juan Astrada**

- **GitHub**: [@JuanAstrada7](https://github.com/JuanAstrada7)
- **Docker Hub**: [@juancho14](https://hub.docker.com/u/juancho14)
