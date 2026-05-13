# Vantage ERP

Uma interface corporativa leve e refinada para o backend Spring Boot do Vantage ERP.

## O que foi entregue

- Dashboard SaaS premium com sidebar escura, métricas em Bento Grid e visual refinado.
- Gráfico de rosca (`Donut Chart`) que mostra a saúde do estoque: Estável vs Reposição.
- Exportação de produtos para CSV diretamente do dashboard.
- Skeleton loader de tabela para evitar salto de layout durante o carregamento inicial.
- Logs detalhados no `ProductService` para auditoria de operações de banco de dados.

## Tecnologias usadas

- Backend: Spring Boot
- Frontend: HTML/CSS/Vanilla JavaScript
- Visualização: Recharts via CDN
- Logging: SLF4J (`LoggerFactory`) no serviço Java

## Como rodar

### Pré-requisitos

- Java 17+ instalado
- PostgreSQL ou banco compatível configurado conforme `src/main/resources/application.properties`

### Executando o backend

1. No diretório do projeto, execute:

   ```bash
   ./mvnw spring-boot:run
   ```

2. Abra no navegador:

   ```
   http://localhost:8080/
   ```

### Frontend

A interface estática está servida pelo Spring Boot a partir de `src/main/resources/static/index.html`.

> Observação: existe também um frontend SPA em `../frontend`, construído com React + Vite, que consome a mesma API backend.

### APIs disponíveis

- `GET /api/products` - lista todos os produtos
- `POST /api/products` - cria um produto
- `PUT /api/products/{id}` - atualiza um produto
- `DELETE /api/products/{id}` - apaga um produto

## Notas de design

- Fundo principal em `#f9fafb` e bordas sutis para dar mais sofisticação.
- Sidebar escura com borda ativa colorida e itens discretos.
- Status crítico exibido em `pill` com ponto pulsante.
- Ações da tabela aparecem somente no hover para manter a interface limpa.
- O botão principal possui gradiente e elevação suave para reforçar a ação chave.

## Sugestão de prints

1. Dashboard geral com as métricas e o gráfico de rosca.
2. Tabela de produtos com estado de carregamento (`Skeleton loader`).
3. Modal de criação/edição de produto.
4. Exportação de CSV pronta para download.
