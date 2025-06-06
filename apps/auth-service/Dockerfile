# Base image
FROM node:20-slim

RUN apt-get update && apt-get install -y openssl && apt-get clean && rm -rf /var/lib/apt/lists/*

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install

COPY prisma ./prisma
RUN npx prisma generate

COPY . .

RUN npm run build:auth

EXPOSE 3000

CMD ["node", "dist/apps/auth-service/main.js"]