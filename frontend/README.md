# Vantage ERP Frontend

Esta é a interface React + Vite para o Vantage ERP.

## O que está incluído

- Dashboard de estoque premium com cards de performance.
- Busca rápida por produtos.
- Criação, edição e exclusão de produtos via API Spring Boot.
- Indicadores de estoque crítico e valor total.
- Modal responsivo e feedbacks de toast.
- Tratamento de falha de conexão com o backend.

## Como rodar

1. Abra um terminal em `frontend`
2. Instale as dependências (se ainda não instalou):

```bash
npm install
```

3. Inicie o servidor de desenvolvimento:

```bash
npm run dev
```

4. Abra o app no navegador no endereço fornecido pelo Vite.

## Build de produção

```bash
npm run build
```

## Observação

O backend Spring Boot é esperado em `http://localhost:8080` para as rotas de API:

- `GET /api/products`
- `POST /api/products`
- `PUT /api/products/{id}`
- `DELETE /api/products/{id}`

Se desejar, use o backend embutido em `backend/erp` para servir a versão estática principal do painel.
