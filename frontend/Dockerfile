FROM node:18 AS build

WORKDIR /app

COPY frontend/package*.json ./

RUN npm install

COPY frontend/ ./

COPY frontend/.env .env

RUN npm run build

RUN ls -la /app/dist

FROM nginx:alpine

COPY frontend/nginx.conf /etc/nginx/conf.d/default.conf

COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
