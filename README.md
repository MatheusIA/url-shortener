## Descrição do Projeto

Este repositório contém dois microsserviços construidos com [Nest](https://github.com/nestjs/nest) e TypeScript.

- **auth-service**: serviço de autenticação e registro de usuários.
- **url-service**: serviço de encurtamento e redirecionamento de URLs.

## Links do Ambiente em Nuvem

- **auth-service**: https://auth-service-z2vf.onrender.com/
- **url-service**: https://url-service-mt8s.onrender.com/

## Configuração do Projeto

Para começar, instale as dependências do projeto:

```bash
npm install
```
## Scripts Disponíveis

É possivel executar os serviços manualmente ( fora do Docker ) usando os comandos definidos no package.json:

Build dos serviços

````bash
npm run build:auth   # Compila o auth-service
npm run build:url    # Compila o url-service
````
## Execução dos testes

```bash
npm run test          # Executa testes unitários
npm run test:watch    # Executa testes em modo watch
npm run test:coverage # Gera relatório de cobertura
```
## Formatação do Código

Formata os arquivos .ts com Prettier

````bash
npm run format

````

## Lint
Roda o ESLint para encontrar problemas de lint, para sem alterados:

````bash
npm run lint
````

## Docker

Você pode rodar todo o sistema localmente utilizando Docker e Docker Compose. Dessa forma facilita a configuração e execução de ambos os serviços e  incluindo o banco de dados, de forma padronizada e isolada.

### Pré-requisitos

- [Docker](https://www.docker.com/)
- [Docker Compose](https://docs.docker.com/compose/)

# Rodando o sistema localmente

- Para execuar o sistema completo localmente com Docker, execute o comando abaixo:

````bash
docker-compose up --build
````

Com esse comando, será possivel:

- Realizar o build das imagens Docker definidas no Dockerfile de cada serviço.

- Subir os containers configurados no docker-compose.yml.

- Expor os serviços nas portas especificadas (ex: localhost:3000, localhost:3001, localhost:3002).

## Documentação da API (Swagger)

Para uma melhor visualização das rotas da API, foi desenvolvido uma documentação utilizando o Swagger.

Em ambiente local, é possivel acessar a documentação através dos seguintes endereços:

auth-service: http://localhost:3001/api
url-service: http://localhost:3002/api

Em ambiente de produção ( nuvem ), a documentação fica disponivel através dos endereços:

auth-service: https://auth-service-z2vf.onrender.com/api
url-service: https://url-service-mt8s.onrender.com/api
