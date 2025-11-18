# Stage 1: Build React app
FROM node:20-alpine AS build

WORKDIR /app

# Копируем package.json и package-lock.json из папки portfolio
COPY portfolio/package*.json ./
RUN npm install

# Копируем весь проект из portfolio
COPY portfolio/ ./

# Собираем React приложение
RUN npm run build

# Stage 2: Serve with Nginx
FROM nginx:alpine

# Копируем билд из первого stage
COPY --from=build /app/build /usr/share/nginx/html

# Удаляем дефолтный конфиг nginx
RUN rm /etc/nginx/conf.d/default.conf

# Добавляем свой конфиг nginx
COPY nginx.conf /etc/nginx/conf.d

# expose 80 порт
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
