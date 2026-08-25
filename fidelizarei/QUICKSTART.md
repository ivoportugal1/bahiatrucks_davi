# Quick Start - Fidelizarei

Comece em 5 minutos.

## 1. Instalar dependências

```bash
cd fidelizarei/backend
npm install
```

## 2. Configurar banco de dados

Você precisa do PostgreSQL rodando. Se não tiver, você pode usar Docker:

```bash
docker run --name fidelizarei-db \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=senha123 \
  -e POSTGRES_DB=fidelizarei \
  -p 5432:5432 \
  -d postgres:15
```

## 3. Configurar `.env`

Crie `backend/.env` com:

```
DATABASE_URL="postgresql://postgres:senha123@localhost:5432/fidelizarei"
PORT=3000
JWT_SECRET="sua-chave-secreta-mudara-em-producao"
SCAN_BASE_URL="http://localhost:3000/scan"
```

## 4. Criar tabelas no banco

```bash
npx prisma db push
```

## 5. Rodar servidor

```bash
npm run dev
```

Pronto! Servidor rodando em `http://localhost:3000`

## Testar API

### 1. Criar empresa (signup)

```bash
curl -X POST http://localhost:3000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "Meu Café",
    "email": "cafe@example.com",
    "password": "senha123"
  }'
```

Salve o `token` da resposta.

### 2. Criar programa

```bash
curl -X POST http://localhost:3000/api/programas \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SEU_TOKEN_AQUI" \
  -d '{
    "nome": "Café da Semana",
    "recompensa": "1 café grátis",
    "pontosParaRecompensa": 7
  }'
```

Salve o `id` do programa.

### 3. Gerar QR codes

```bash
curl -X POST http://localhost:3000/api/qrcodes/generate \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SEU_TOKEN_AQUI" \
  -d '{
    "programaId": "ID_DO_PROGRAMA",
    "quantidade": 3
  }'
```

Você vai receber QR codes com imagens em base64 (você pode salvar essas imagens).

### 4. Testar scan

Primeiro, crie um cliente manualmente no banco:

```bash
npx prisma db execute --stdin <<EOF
INSERT INTO "Cliente" ("id", "empresaId", "nome", "email", "telefone", "createdAt", "updatedAt")
VALUES (
  'client123',
  'EMPRESA_ID',
  'João Silva',
  'joao@example.com',
  '11999999999',
  NOW(),
  NOW()
);
EOF
```

Depois escaneia (substitua o token do QR code):

```bash
curl "http://localhost:3000/scan/TOKEN_DO_QR?clienteId=client123"
```

Você vai receber:

```json
{
  "sucesso": true,
  "mensagem": "Ponto adicionado com sucesso",
  "pontos": {
    "saldo": 1,
    "meta": 7,
    "recompensaLiberada": false
  }
}
```

## Próximos passos

- [ ] Integrar Pass Kit (Apple/Google Wallet)
- [ ] Criar painel admin (React)
- [ ] Adicionar endpoints para cliente (listar programas, histórico)
- [ ] Sistema de resgates
- [ ] Autenticação de cliente (via email/QR)

## Troubleshooting

**"Database connection failed"**
- Verifique se PostgreSQL está rodando
- Verifique `DATABASE_URL` no `.env`

**"Prisma Client not generated"**
```bash
npx prisma generate
```

**Porta 3000 já está em uso**
```bash
# Mudar porta no .env
PORT=3001
```
