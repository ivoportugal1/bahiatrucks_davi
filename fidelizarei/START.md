# 🚀 Como Rodar Fidelizarei

## Pré-requisito: PostgreSQL

Se não tiver PostgreSQL rodando, execute:

```bash
docker run --name fidelizarei-db -e POSTGRES_PASSWORD=senha123 -e POSTGRES_DB=fidelizarei -p 5432:5432 -d postgres:15
```

## Terminal 1 - Backend

```bash
cd fidelizarei\backend
npx prisma db push
npm run dev
```

Espera aparecer:
```
🚀 Servidor rodando em http://localhost:3000
```

## Terminal 2 - Admin

```bash
cd fidelizarei\admin
npm run dev
```

Espera aparecer:
```
Ready in Xs
```

## Acessar

Abra o navegador em: **http://localhost:3001**

## Primeiro uso

1. Clique em "Criar conta"
2. Use:
   - Nome: `Meu Café`
   - Email: `teste@cafe.com`
   - Senha: `senha123`
3. Pronto! Você está no dashboard

## Troubleshooting

**"Database connection failed"**
- PostgreSQL não está rodando
- Rode o comando docker acima

**"ERR_CONNECTION_REFUSED"**
- Certifique que backend está rodando na porta 3000
- Que admin está rodando na porta 3001

**"npm não é reconhecido"**
- Use Bash em vez de PowerShell
- Ou abra um CMD (cmd.exe) em vez de PowerShell
