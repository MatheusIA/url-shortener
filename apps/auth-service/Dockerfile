FROM node:20.14

WORKDIR /usr/src/app

# Copia os arquivos necessários
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

# Faz build usando Nest
RUN npm run build:auth

# Executa
CMD ["node", "dist/apps/auth-service/main.js"]
