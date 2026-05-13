# Vantage ERP 🚀
### Gestão de Inventário Inteligente com IA Preditiva

O **Vantage ERP** é uma solução Full Stack moderna para controle de estoque, unindo a robustez do ecossistema Java com a agilidade do React. O diferencial do sistema é o módulo **Vantage AI**, que utiliza lógica preditiva para antecipar rupturas de estoque e auxiliar na tomada de decisão do gestor.

![Vantage ERP Dashboard](./dashboard.png)

---

## 🛠️ Tecnologias Utilizadas

### Backend
- **Java 21** & **Spring Boot 3**
- **Spring Data JPA** para persistência
- **PostgreSQL** (Hospedado no **Supabase**)
- **Validation API** (Bean Validation)

### Frontend
- **React 18** + **Vite**
- **Tailwind CSS** (Design System Corporativo)
- **Axios** para consumo de API
- **Lucide React** (Iconografia)
- **Recharts** (Visualização de Dados)

### Infraestrutura
- **Docker** & **Docker Compose**
- **Variáveis de Ambiente** (.env) para segurança

---

## ✨ Funcionalidades Principais

- 📊 **Dashboard SaaS**: Visão consolidada de itens ativos, valor total em estoque e alertas críticos.
- 🧠 **Vantage AI Insights**: Predição em tempo real de dias restantes para o esgotamento de produtos.
- 📱 **Interface Responsiva**: Adaptável para Desktop (Tabela) e Mobile (Cards).
- 🔄 **CRUD Completo**: Gestão total de produtos com validações rigorosas.
- 📥 **Exportação CSV**: Relatórios rápidos para análise externa.
- 🏗️ **Foco em UX**: Skeleton loaders, notificações de operação (toasts) e filtros em tempo real.

---

## 🚀 Como Executar o Projeto

### Pré-requisitos
- Docker e Docker Compose instalados (Recomendado)
- Ou Java 21 e Node.js 18+ para execução manual.

### Via Docker (Recomendado)
Na raiz do projeto, execute:

```bash
docker-compose up -d
```

O frontend estará disponível em `http://localhost:5173` e o backend em `http://localhost:8080`.

### Via Script de Automação (Windows)
Execute o arquivo:

```bash
./run-project.bat
```

---

## 🛡️ Segurança e Robustez

- **Global Error Handling**: Tratamento de exceções centralizado no backend.
- **Environment Isolation**: Proteção de credenciais sensíveis via arquivos `.env`.
- **Database Seeding**: O sistema já inicia com dados fictícios para demonstração imediata.

---

## 👨‍💻 Autor
Matheus Goés — Desenvolvedor Full Stack especializado em soluções corporativas e inteligência de dados.

---

## 📸 Como inserir a imagem
Salve o screenshot do dashboard como `dashboard.png` na raiz do projeto. O README já usa esse arquivo como preview visual.

- Crie `backend/erp/.env` a partir de `backend/erp/.env.example`
- Não comite suas credenciais reais no repositório

O frontend também suporta `frontend/.env` com `VITE_API_URL`.

## Como testar validações

- Tente cadastrar um produto com preço negativo
- Tente cadastrar um produto com quantidade de estoque negativa
- Tente cadastrar um produto sem nome
- Tente editar um produto para reduzir o estoque abaixo do mínimo e observe o alerta visual

Esses cenários devem exibir mensagens de erro claras e impedir o envio de dados inválidos.
