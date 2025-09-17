# Pedidos Producer API

API responsável por enviar pedidos para a fila do **RabbitMQ**. Utiliza **Express**, **TypeScript** e **class-validator** para validação de dados.

## 🚀 Tecnologias Utilizadas

- Node.js + Express
- TypeScript
- RabbitMQ
- Docker (para RabbitMQ)
- class-validator + class-transformer
- ts-node-dev (hot reload em desenvolvimento)

---

## 📦 Estrutura do Projeto

```
src/
├─ dtos/
│  └─ pedido.dto.ts              # DTO e validações de pedidos
├─ middleware/
│  └─ validate.middleware.ts     # Middleware de validação de requests
├─ server.ts                      # Setup do servidor Express
├─ rabbimq-setup.ts               # Configuração do RabbitMQ Producer
├─ pedido.model.ts                # Model de pedido e item
└─ index.ts                       # Ponto de entrada da aplicação
```

---

## ⚙️ Configuração do Ambiente

Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:

```env
RABBITMQ_PORT=5672
RABBITMQ_USER=guest
RABBITMQ_PASS=guest
RABBITMQ_HOST=127.0.0.1
```

---

## 🐳 Executando com Docker (RabbitMQ)

Um exemplo de serviço RabbitMQ no Docker Compose:

```yaml
services:
  rabbitmq:
    image: rabbitmq:3-management-alpine
    container_name: rabbitmq
    ports:
      - '5672:5672'
      - '15672:15672'
    volumes:
      - ~/.docker-conf/rabbitmq/data/:/var/lib/rabbitmq/
      - ~/.docker-conf/rabbitmq/log/:/var/log/rabbitmq/
    networks:
      - rabbitmq_go_net

networks:
  rabbitmq_go_net:
    driver: bridge
```

Para iniciar:

```bash
docker-compose up -d
```

A interface de gerenciamento estará disponível em `http://localhost:15672` (usuário: guest / senha: guest).

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

A aplicação ficará disponível em `http://localhost:3000`.

---

## 🔌 Rotas Disponíveis

### Criar um pedido (enviar para fila RabbitMQ)

```
POST /pedidos
```

**Body esperado:**

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
