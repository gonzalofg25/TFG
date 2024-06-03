# Usa la imagen base de Node.js 14
FROM node:20.14.0

# Crea el directorio de la aplicación
WORKDIR /usr/src/app

# Instala las dependencias de la aplicación
COPY package*.json ./
RUN npm install

# Copia el código fuente de la aplicación
COPY . .

# Expone el puerto que usa la aplicación
EXPOSE 3000

# Comando para iniciar la aplicación
CMD ["npm", "start"]
