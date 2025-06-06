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

RUN npm install
RUN npx prisma generate

RUN npm run build:url

CMD ["node", "dist/apps/url-service/main.js"]