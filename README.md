## Descrição do Projeto

Este repositório contém dois microsserviços construidos com [Nest](https://github.com/nestjs/nest) e TypeScript.

- **auth-service**: serviço de autenticação e registro de usuários.
- **url-service**: serviço de encurtamento e redirecionamento de URLs.

## Links do Ambiente em Nuvem

- **auth-service**: https://auth-service-z2vf.onrender.com/api
- **url-service**: https://url-service-mt8s.onrender.com/api

## Atenção sobre o Delay no Plano Free do Render

Esta aplicação está hospedada no plano gratuito do Render, que coloca o serviço em modo de hibernação após um período de inatividade (cerca de 15 minutos). Quando o serviço é acessado novamente após estar ocioso, ele precisa de um tempo para "acordar".

Esse atraso no "cold start" pode levar aproximadamente 10 a 30 segundos, fazendo com que a primeira requisição após a inatividade seja mais lenta ou até resulte em timeout em alguns casos.

# Como minimizar o delay usando o Uptime Robot

ara reduzir esse impacto, recomenda-se utilizar serviços de monitoramento como o **Uptime Robot** para manter a aplicação "acordada". Ele envia requisições periódicas para a URL da aplicação, impedindo que entre em hibernação.

### Passos para configurar o Uptime Robot:

1. Crie uma conta gratuita em [uptimerobot.com](https://uptimerobot.com).
2. Clique em "Add New Monitor".
3. Escolha o tipo de monitor **HTTP(s)**.
4. Insira o nome e a URL da sua aplicação hospedada no Render  (exemplo: https://meu-app.onrender.com).
5. Defina o intervalo de checagem para 5 minutos (mínimo no plano gratuito).
6. Salve e ative o monitor.

Com isso, a aplicação receberá tráfego constante e reduzirá o tempo de resposta causado pela hibernação do plano gratuito.

## Requisitos de Ambiente

- Node.js v20.x
- npm v9 ou superior
- Docker e Docker Compose (caso use containers)

> Para desenvolvedores: utilize `nvm use` se você tem `.nvmrc` configurado

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

## Observabilidade

Este projeto possui instrumentação de observabilidade com suporte a métricas utilizando o Prometheus.

O serviço url-service expõe as métricas por meio do endpoint HTTP no formato padrão text/plain.

- Endpoint de métricas ( em ambiente local ):

````bash
http://localhost:3002/metrics
````

- Endpoint de métricas ( em ambiente cloud ):

````bash
https://url-service-mt8s.onrender.com/metrics
````

- Exemplo da métrica exposta:

````bash
# HELP url_shortened_total Total de URLs encurtadas
# TYPE url_shortened_total counter
url_shortened_total 42
````

O serviço auth-service expõe as métricas por meio do endpoint HTTP no formato padrão text/plain.

- Endpoint de métricas ( em ambiente local ):

````bash
http://localhost:3001/metrics
````

- Endpoint de métricas ( em ambiente cloud ):

````bash
https://auth-service-z2vf.onrender.com/metrics
````

- Exemplo da métrica exposta:

````bash
# HELP auth_login_total Total de logins realizados
# TYPE auth_login_total counter
auth_login_total 50

# HELP auth_register_total Total de registros realizados
# TYPE auth_register_total counter
auth_register_total 10
````

## Variável de Ambiente

Para ativar ou desativas a exportação das métricas, utilize a varivel de ambiente:

````bash
OBSERVABILITY_ENABLED=true
````

Quando true, o serviço expõe o endpoint de métricas.
Quando false, o endpoint de métricas pode ser desativado
