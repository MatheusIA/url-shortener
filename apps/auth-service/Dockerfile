FROM node:20-slim

RUN apt-get update && \
    apt-get install -y openssl && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*
    
WORKDIR /usr/src/app

COPY package*.json ./
COPY nest-cli.json ./
COPY tsconfig*.json ./
COPY prisma ./prisma
COPY apps ./apps
COPY libs ./libs
COPY utils ./utils
COPY env ./env

# Instala dependências
RUN npm install
RUN npx prisma generate

# Faz build somente do auth-service
RUN npm run build:auth

# Executa
CMD ["node", "dist/apps/auth-service/main.js"]
