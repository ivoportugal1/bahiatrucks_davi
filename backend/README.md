# 🚀 Fidelizarei Backend

Backend da plataforma Fidelizarei construído com Node.js, Express e MongoDB.

## 📋 Pré-requisitos

- Node.js (v14+)
- npm ou yarn
- MongoDB Atlas (gratuito) ou MongoDB local

## ⚙️ Instalação

### 1. Instalar dependências

```bash
cd backend
npm install
```

### 2. Configurar variáveis de ambiente

Copie `.env.example` para `.env`:

```bash
cp .env.example .env
```

Edite `.env` com suas configurações:

```
MONGODB_URI=mongodb+srv://seu_usuario:sua_senha@seu_cluster.mongodb.net/fidelizarei
JWT_SECRET=sua_chave_secreta_bem_segura_aqui
PORT=5000
NODE_ENV=development
```

### 3. Rodar o servidor

**Desenvolvimento (com auto-reload):**
```bash
npm run dev
```

**Produção:**
```bash
npm start
```

O servidor vai estar disponível em: `http://localhost:5000`

## 🧪 Testar a API

### Health Check
```bash
curl http://localhost:5000/api/health
```

Resposta esperada:
```json
{
  "status": "✅ API funcionando!",
  "version": "1.0.0",
  "timestamp": "2024-05-23T10:30:00.000Z"
}
```

### Registrar Empresa

```bash
curl -X POST http://localhost:5000/api/auth/registrar \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "Café do João",
    "email": "joao@cafe.com",
    "senha": "senha123",
    "confirmacaoSenha": "senha123"
  }'
```

### Login

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "joao@cafe.com",
    "senha": "senha123"
  }'
```

Resposta (com token JWT):
```json
{
  "mensagem": "Login realizado com sucesso!",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "empresa": {
    "_id": "...",
    "nome": "Café do João",
    "email": "joao@cafe.com",
    ...
  }
}
```

## 📦 Estrutura do Projeto

```
backend/
├── src/
│   ├── config/
│   │   └── database.js       # Configuração MongoDB
│   ├── controllers/
│   │   └── authController.js # Lógica de autenticação
│   ├── models/
│   │   └── Empresa.js        # Schema da Empresa
│   ├── routes/
│   │   └── auth.js           # Rotas de autenticação
│   └── index.js              # Servidor principal
├── .env.example              # Exemplo de variáveis
├── package.json              # Dependências
└── README.md                 # Este arquivo
```

## 🔐 Autenticação

A API usa JWT (JSON Web Tokens) para autenticação.

**Como usar:**

1. Faça login e receba um token
2. Adicione o token nos headers de requisições protegidas:

```
Authorization: Bearer seu_token_aqui
```

## 🌐 Deploy

### Opção 1: Render (Recomendado - Gratuito)

1. Commit no GitHub
2. Conecte seu repo no [Render.com](https://render.com)
3. Configure variáveis de ambiente
4. Deploy automático

### Opção 2: Railway

1. Conecte no [Railway.app](https://railway.app)
2. Configure MongoDB Atlas
3. Deploy com 1 clique

### Opção 3: Heroku

```bash
heroku create seu-app-name
heroku config:set JWT_SECRET=sua_chave
heroku config:set MONGODB_URI=sua_uri_mongodb
git push heroku main
```

## 📝 Próximos Passos

- [ ] Criar modelo de Programa (fidelidade)
- [ ] Criar modelo de Cliente
- [ ] Criar modelo de QR Code
- [ ] Criar modelo de Recompensa
- [ ] Criar endpoints para Programas
- [ ] Criar endpoints para Clientes
- [ ] Criar endpoints para QR Codes
- [ ] Validação de entrada com express-validator
- [ ] Testes automatizados

## 📄 Licença

MIT
