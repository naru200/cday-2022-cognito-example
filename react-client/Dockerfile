FROM node:16-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:1.23-alpine AS prod


RUN rm -rf /etc/nginx/conf.d/default.conf
COPY ./nginx.conf /etc/nginx/conf.d

WORKDIR /usr/share/nginx/html

COPY --from=builder /app/dist .
EXPOSE 8080

ENTRYPOINT ["nginx", "-g", "daemon off;"]