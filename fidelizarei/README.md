# Fidelizarei - MVP Backend

Sistema de fidelização digital com QR codes e Apple/Google Wallet.

## Estrutura

```
fidelizarei/
├── backend/          # API Node.js + Express
├── admin/            # Painel administrativo (React)
└── README.md
```

## Backend Setup

### Pré-requisitos
- Node.js 18+
- PostgreSQL 13+
- npm/yarn

### Instalação

```bash
cd backend
npm install
```

### Configuração

1. Copie `.env.example` para `.env`:
```bash
cp .env.example .env
```

2. Configure suas variáveis de ambiente:
```
DATABASE_URL="postgresql://user:password@localhost:5432/fidelizarei"
PORT=3000
JWT_SECRET="sua-chave-secreta-aqui"
```

3. Configure o banco de dados:
```bash
npx prisma db push
```

### Rodar em desenvolvimento

```bash
npm run dev
```

Servidor rodará em `http://localhost:3000`

## API Endpoints

### Autenticação

#### Signup
```
POST /api/auth/signup
Content-Type: application/json

{
  "nome": "Minha Empresa",
  "email": "empresa@example.com",
  "password": "senha123"
}

Response:
{
  "id": "...",
  "nome": "Minha Empresa",
  "email": "empresa@example.com",
  "token": "eyJhbG..."
}
```

#### Login
```
POST /api/auth/login
Content-Type: application/json

{
  "email": "empresa@example.com",
  "password": "senha123"
}

Response:
{
  "id": "...",
  "token": "eyJhbG..."
}
```

### Programas (requer autenticação)

#### Criar Programa
```
POST /api/programas
Authorization: Bearer <token>
Content-Type: application/json

{
  "nome": "Café da Semana",
  "descricao": "Ganhe um café",
  "pontosParaRecompensa": 7,
  "recompensa": "1 café grátis"
}
```

#### Listar Programas
```
GET /api/programas
Authorization: Bearer <token>
```

### QR Codes (requer autenticação)

#### Gerar QR Codes
```
POST /api/qrcodes/generate
Authorization: Bearer <token>
Content-Type: application/json

{
  "programaId": "...",
  "quantidade": 10
}

Response:
{
  "quantidade": 10,
  "qrCodes": [
    {
      "id": "...",
      "token": "...",
      "qrImage": "data:image/png;base64,..."
    }
  ]
}
```

#### Listar QR Codes
```
GET /api/qrcodes/programa/:programaId
Authorization: Bearer <token>
```

### Scan (sem autenticação)

#### Processar Scan
```
GET /scan/:token?clienteId=<id>

Response:
{
  "sucesso": true,
  "mensagem": "Ponto adicionado com sucesso",
  "pontos": {
    "saldo": 3,
    "meta": 7,
    "recompensaLiberada": false,
    "recompensa": null
  }
}
```

## Fluxo da Aplicação

1. Empresa faz signup/login
2. Empresa cria um programa (ex: "A cada 7 compras, 1 café grátis")
3. Empresa gera QR codes via API
4. Empresa imprime os QR codes nas embalagens
5. Cliente escaneia QR code com câmera
6. Sistema valida e adiciona ponto
7. Cliente recebe atualização no Wallet (v2)

## Próximos Passos (V1.1)

- [ ] Geração de passes (Apple Wallet/Google Wallet)
- [ ] Push automático de passes
- [ ] Sistema de resgates
- [ ] Painel admin (React)
- [ ] Métricas e analytics
- [ ] Integração com email/SMS

## Banco de Dados

### Modelos principais

- **Empresa**: dados da empresa e credenciais
- **Programa**: programa de fidelização
- **QRCode**: tokens únicos dos QR codes
- **Cliente**: clientes da empresa
- **Ponto**: saldo de pontos do cliente em cada programa

Ver `prisma/schema.prisma` para detalhes completos.
