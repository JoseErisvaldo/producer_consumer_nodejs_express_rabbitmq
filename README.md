# Pedidos API (Producer & Consumer)

Este repositório contém dois serviços de pedidos:

1. **Consumer**: Recebe pedidos do RabbitMQ, persiste no PostgreSQL e disponibiliza uma API para consulta.
2. **Producer**: Envia pedidos para a fila do RabbitMQ.

Ambos utilizam **Express**, **TypeScript** e **RabbitMQ**.

---

## 🚀 Tecnologias Utilizadas

- Node.js + Express
- TypeScript
- PostgreSQL (Consumer)
- RabbitMQ (Producer & Consumer)
- Docker (para RabbitMQ e PostgreSQL)
- class-validator (Producer)
- ts-node-dev (hot reload em desenvolvimento)
- Bruno api - https://www.usebruno.com/

---

## 📦 Estrutura do Repositório

```
/consumer
├─ controllers/
├─ repositories/
├─ services/
├─ factories/
├─ infra/
├─ routes/
├─ server.ts
└─ app.ts

/producer
├─ dtos/
├─ middleware/
├─ server.ts
├─ rabbimq-setup.ts
├─ pedido.model.ts
└─ index.ts
```

---

## ⚙️ Configuração do Ambiente

Crie um arquivo `.env` na raiz do projeto ou em cada serviço com as seguintes variáveis:

```env
# Para ambos
RABBITMQ_PORT=5672
RABBITMQ_USER=guest
RABBITMQ_PASS=guest
RABBITMQ_HOST=127.0.0.1

# Apenas Consumer
POSTGRES_URL=postgresql://postgres:postgres@localhost:5432/pedidos
PORT=3333
```

---

## 🐳 Executando com Docker

### PostgreSQL (Consumer)

```yaml
services:
  postgres:
    image: postgres:15-alpine
    container_name: postgres
    ports:
      - "5432:5432"
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
      POSTGRES_DB: pedidos
    volumes:
      - ./pg-data:/var/lib/postgresql/data
    networks:
      - pedidos_net
```

### RabbitMQ (Producer & Consumer)

```yaml
services:
  rabbitmq:
    image: rabbitmq:3-management-alpine
    container_name: rabbitmq
    ports:
      - "5672:5672"
      - "15672:15672"
    volumes:
      - ~/.docker-conf/rabbitmq/data/:/var/lib/rabbitmq/
      - ~/.docker-conf/rabbitmq/log/:/var/log/rabbitmq/
    networks:
      - pedidos_net

networks:
  pedidos_net:
    driver: bridge
```

---

## 🏃‍♂️ Rodando os serviços

### Consumer

```bash
cd consumer
npm install
npm run start:local
```

Disponível em `http://localhost:3333`.

### Producer

```bash
cd producer
npm install
npm run start:local
```

Disponível em `http://localhost:3000`.

---

## 🔌 Rotas

### Consumer

- `GET /orders/:cnpj` → Retorna todos os pedidos de um CNPJ

### Producer

- `POST /pedidos` → Envia um pedido para a fila RabbitMQ

**Exemplo de JSON para enviar um pedido:**

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

---

## 📩 Funcionamento RabbitMQ

- Fila padrão: `pedidos`
- Producer envia mensagens para a fila.
- Consumer consome mensagens, persiste no PostgreSQL e disponibiliza via API.

---

## 🛠 Scripts

### Consumer

- `npm run start:local` → Inicia API em modo desenvolvimento com hot reload

### Producer

- `npm run start:local` → Inicia servidor e envia pedidos para a fila em desenvolvimento
- `npm run build` → Compila TypeScript para JavaScript
- `npm run start` → Executa aplicação compilada

---

## 📚 Observações

- Consumer persiste dados no banco, Producer apenas envia mensagens.
- Todos os pedidos passam por validação (Producer) antes de ir para a fila.
- Ambos os serviços dependem da fila RabbitMQ para comunicação.
