# Pedidos Consumer API

API de gerenciamento de pedidos utilizando **Express**, **TypeScript**, **PostgreSQL** e **RabbitMQ**. Permite criar, atualizar e consultar pedidos, além de processar mensagens de pedidos via RabbitMQ.

## 🚀 Tecnologias Utilizadas

- Node.js + Express
- TypeScript
- PostgreSQL
- RabbitMQ
- Docker (para PostgreSQL)
- amqplib (RabbitMQ client)
- ts-node-dev (hot reload em desenvolvimento)

---

## 📦 Estrutura do Projeto

```
src/
├─ controllers/
│  └─ pedido.controller.ts       # Lógica do controller de pedidos
├─ repositories/
│  └─ pedido.repository.ts       # Acesso ao banco de dados
├─ services/
│  ├─ pedido.service.ts          # Lógica de negócios de pedidos
│  └─ rabbitmq/consumer.ts       # Consumidor RabbitMQ
├─ factories/
│  └─ pedido.factory.ts          # Instancia Controller, Service e RabbitMQ
├─ infra/
│  └─ database.ts                # Configuração e conexão com PostgreSQL
├─ routes/
│  ├─ index.ts                   # Registro das rotas
│  └─ pedido.routes.ts           # Rotas de pedidos
├─ server.ts                      # Inicialização do servidor
└─ app.ts                         # Ponto de entrada da aplicação
```

---

## ⚙️ Configuração do Ambiente

Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:

```env
PORT=3333

RABBITMQ_PORT=5672
RABBITMQ_USER=guest
RABBITMQ_PASS=guest
RABBITMQ_HOST=127.0.0.1

POSTGRES_URL=postgresql://postgres:postgres@localhost:5432/pedidos
```

---

## 🐳 Executando com Docker (PostgreSQL)

Um exemplo de serviço PostgreSQL no Docker Compose:

```yaml
services:
  postgres:
    image: postgres:15-alpine
    container_name: postgres
    restart: always
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
      POSTGRES_DB: pedidos
    ports:
      - '5432:5432'
    volumes:
      - ./pg-data:/var/lib/postgresql/data
    networks:
      - rabbitmq_go_net

networks:
  rabbitmq_go_net:
    driver: bridge
```

Para iniciar:

```bash
docker compose up -d
```

---

## 🏃‍♂️ Rodando a aplicação

1. Instale as dependências:

```bash
npm install
```

2. Inicie a aplicação em modo desenvolvimento:

```bash
npm run start:local
```

A aplicação ficará disponível em `http://localhost:3333`.

---

## 🔌 Rotas Disponíveis

### Obter pedidos por CNPJ

```
GET /orders/:cnpj
```

**Exemplo de resposta:**

```json
[
  {
    "id": 1,
    "numero": 123,
    "cnpj": "12345678000100",
    "status": true,
    "created_at": "2025-09-16T22:00:00.000Z",
    "items": [
      { "nome": "Produto A", "qtd": 2 },
      { "nome": "Produto B", "qtd": 5 }
    ]
  }
]
```

---

## 📩 RabbitMQ

O consumidor RabbitMQ é inicializado automaticamente ao iniciar a aplicação.
Fila padrão: `pedidos`.

**Exemplo de mensagem esperada:**

```json
{
  "numero": 123,
  "cnpj": "12345678000100",
  "status": true,
  "items": [
    { "nome": "Produto A", "qtd": 2 },
    { "nome": "Produto B", "qtd": 5 }
  ]
}
```

O serviço cria ou atualiza o pedido conforme o conteúdo da mensagem.

---

## 🛠 Scripts

- `npm run start:local` → Inicia a aplicação em desenvolvimento com hot reload.

---

## 📚 Observações

- A conexão com o banco de dados é feita via `src/infra/database.ts`.
- Todos os pedidos e itens estão normalizados nas tabelas `pedidos` e `pedido_items`.
- Mensagens RabbitMQ são processadas automaticamente via `SetupRabbitMq`.
