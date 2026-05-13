# Vantage ERP

ERP de alta performance com IA Preditiva.

![Java](https://img.shields.io/badge/Java-%23232F3E.svg?logo=java&logoColor=white)
![Spring](https://img.shields.io/badge/Spring-%2366CC66.svg?logo=spring&logoColor=white)
![React](https://img.shields.io/badge/React-%2361DAFB.svg?logo=react&logoColor=black)
![Docker](https://img.shields.io/badge/Docker-%230db7ed.svg?logo=docker&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-%231B2431.svg?logo=supabase&logoColor=white)

## Showcase

Vantage ERP é um sistema moderno de gestão de estoque, com UX elegante e uma camada de previsão que antecipa rupturas de itens críticos. Ideal para operações que precisam de visibilidade imediata, automação de estoque e implantação ágil em container.

## Tecnologias

- Java 26
- Spring Boot
- React
- Tailwind CSS
- Docker
- Supabase

## Destaques Técnicos

- Vantage AI para previsão de ruptura em menos de 7 dias
- Tratamento global de erros com respostas JSON claras
- Dockerização completa com `docker-compose`
- Frontend React moderno com notificações em toast e dashboard de alertas
- Configuração segura de credenciais via `.env`

## Como rodar

Use o script de execução rápida para iniciar todo o sistema no Windows:

```bash
run-project.bat
```

O backend irá iniciar em `http://localhost:8080` e o frontend em `http://localhost:5173` ou `http://localhost:3000` dependendo do start.

## Docker

O projeto também pode ser iniciado com Docker:

```bash
docker compose up --build
```

- Backend: http://localhost:8080
- Frontend: http://localhost:3000

## Configuração de credenciais

Crie `backend/erp/.env` a partir de `backend/erp/.env.example`.

> Nunca comite credenciais reais do Supabase ou do banco de dados no repositório.

## Como testar validações

- CRUD completo de produtos
- Validação de campos no backend e frontend
- Dashboard responsivo com indicadores de estoque
- Gráficos de saúde de estoque
- Exportação CSV do inventário
- Seed de dados inicial para testes
- Tratamento global de erros com respostas JSON limpas
- Notificações de toast para operações de produto
- Persistência de filtro de busca
- Previsão de ruptura de estoque com IA leve para itens críticos
- Docker e Docker Compose para backend + frontend em container

## Instalação rápida

1. Instale as dependências do frontend:

```bash
cd frontend && npm install
```

2. Execute o backend e o frontend com o script Windows:

```bash
run-project.bat
```

## Como rodar

1. Execute o backend:

```bash
cd backend/erp && ..\mvnw.cmd spring-boot:run
```

2. Execute o frontend:

```bash
cd frontend && npm run dev
```

O frontend consome a API em `VITE_API_URL=http://localhost:8080/api` definida em `frontend/.env`.

## Docker

O projeto agora inclui suporte a containerização para backend e frontend com `docker-compose`.

```bash
docker compose up --build
```

- Backend: http://localhost:8080
- Frontend: http://localhost:3000

A interface React usa proxy Nginx para encaminhar `/api` ao backend sem necessidade de alteração de CORS.

## Configuração de credenciais

O backend agora carrega as credenciais do banco de dados a partir de variáveis de ambiente ou de um arquivo `.env`.

- Crie `backend/erp/.env` a partir de `backend/erp/.env.example`
- Não comite suas credenciais reais no repositório

O frontend também suporta `frontend/.env` com `VITE_API_URL`.

## Como testar validações

- Tente cadastrar um produto com preço negativo
- Tente cadastrar um produto com quantidade de estoque negativa
- Tente cadastrar um produto sem nome
- Tente editar um produto para reduzir o estoque abaixo do mínimo e observe o alerta visual

Esses cenários devem exibir mensagens de erro claras e impedir o envio de dados inválidos.
