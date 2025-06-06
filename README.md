## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.
- `auth-service`: serviço de autenticação e registro de usuários.
- `url-service`: serviço de encurtamento e redirecionamento de URLs

## Project setup

Para começar, instale as dependências do projeto:

```bash
$ npm install
```

## Compile and run the project

#Build dos serviços individualmente

````bash
npm run build:auth   # Build do auth-service
npm run build:url    # Build do url-service
````

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

#Rodas os serviços em desenvolvimento ( com watch)
````bash
npm run build:auth   # Build do auth-service
npm run build:url    # Build do url-service
````

## Run tests
Para rodar os testes unitários e verificar a cobertura

```bash
npm run test          # Executa testes unitários
npm run test:watch    # Executa testes em modo watch
npm run test:coverage # Gera relatório de cobertura
```
## Format 
Formata os arquivos .ts com Prettier
````bash
npm run format

````

## Lint
Roda o ESLint para encontrar e corrigir problemas de lint automaticamente:
````bash
npm run lint
````

## Docker

