# Imagen base con Node
FROM node:20

# Crear directorio de la app
WORKDIR /app

# Copiar package.json e instalar dependencias
COPY package*.json ./
RUN npm install

# Copiar el resto del proyecto
COPY . .

# Exponer el puerto de Vite
EXPOSE 5173

# Correr Vite en modo dev con host accesible
CMD ["npm", "run", "dev", "--", "--host"]