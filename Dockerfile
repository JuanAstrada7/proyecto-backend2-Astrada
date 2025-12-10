# --- Stage 1: Build ---
# Usa una imagen de Node.js para la fase de construcción
FROM node:18-alpine AS builder

# Establece el directorio de trabajo dentro del contenedor
WORKDIR /usr/src/app

# Copia los archivos de definición de dependencias
COPY package*.json ./

# Instala las dependencias de producción y desarrollo
RUN npm install

# Copia el resto de los archivos de la aplicación
COPY . .

# Compila la aplicación TypeScript a JavaScript
RUN npm run build

# --- Stage 2: Production ---
# Usa una imagen de Node.js más ligera para producción
FROM node:18-alpine

WORKDIR /usr/src/app

# Copia solo las dependencias de producción desde la etapa 'builder'
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY package*.json ./

# Copia la aplicación compilada desde la etapa 'builder'
COPY --from=builder /usr/src/app/dist ./dist

# Expone el puerto en el que corre la aplicación
EXPOSE 3000

# Comando para iniciar la aplicación en modo producción
CMD ["node", "dist/main"]