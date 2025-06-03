FROM node:20.14

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