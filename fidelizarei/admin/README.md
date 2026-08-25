# Fidelizarei Admin - Painel de Controle

Interface web para gerenciar programas de fidelização, QR codes e clientes.

## Tech Stack

- **Next.js 14** - Framework React com App Router
- **TypeScript** - Tipagem estática
- **TailwindCSS** - Estilização
- **Zustand** - State management
- **Axios** - HTTP client

## Instalação

```bash
cd admin
npm install
```

## Configuração

1. Copie `.env.example` para `.env.local`:
```bash
cp .env.example .env.local
```

2. Configure a URL da API (se o backend não estiver em `http://localhost:3000`):
```
NEXT_PUBLIC_API_URL=http://localhost:3000
```

## Desenvolvimento

```bash
npm run dev
```

Painel rodará em `http://localhost:3000` (se backend estiver em porta diferente)

## Estrutura de Páginas

```
/                     # Redireciona para login ou dashboard
/login               # Página de login
/signup              # Criar nova conta
/dashboard           # Dashboard principal (autenticado)
/programas           # Listar programas
/programas/novo      # Criar novo programa
/programas/[id]      # Editar programa (v1.1)
/qrcodes             # Gerar e gerenciar QR codes
/clientes            # Listar clientes (v1.1)
```

## Funcionalidades MVP

✅ **Autenticação**
- Signup com email/senha
- Login
- Persistência de token (localStorage)

✅ **Programas**
- Listar programas
- Criar novo programa
- Definir meta de pontos e recompensa

✅ **QR Codes**
- Gerar QR codes em lote
- Visualizar QR codes como imagem
- Baixar QR codes individuais
- Baixar todos os QR codes

✅ **Dashboard**
- Resumo de programas
- Cards com estatísticas (versão 1.0 tem valores placeholder)

## Fluxo de Uso

1. **Signup/Login**
   - Empresa cria conta ou faz login

2. **Criar Programa**
   - Vai para "Programas" → "+ Novo Programa"
   - Define: nome, descrição, pontos para recompensa, recompensa
   - Programa é criado

3. **Gerar QR Codes**
   - Vai para "QR Codes"
   - Seleciona programa
   - Define quantidade (1-1000)
   - Clica "Gerar"
   - Baixa os QR codes (PNG)

4. **Imprimir QR Codes**
   - Cola QR code na embalagem/pedido
   - Cliente escaneia quando recebe

## Componentes Reutilizáveis

- `Button` - Botões com variantes (primary, secondary, danger)
- `Input` - Campos de entrada com label e erro
- `Card` - Container de conteúdo
- `Navbar` - Navegação do dashboard

## State Management (Zustand)

```typescript
const { user, token, setAuth, logout, loadFromStorage } = useAuthStore();
```

Armazena:
- User (id, nome, email)
- Token JWT
- Funções de login/logout

## API Client

Arquivo `lib/api.ts` com funções para:
- `signup()` / `login()`
- `criarPrograma()` / `listarProgramas()` / `atualizarPrograma()`
- `gerarQRCodes()` / `listarQRCodes()`

Interceptador automático adiciona `Authorization: Bearer <token>` em requisições autenticadas.

## Próximas Funcionalidades (V1.1)

- [ ] Editar programa
- [ ] Deletar programa
- [ ] Listar clientes
- [ ] Visualizar pontos por cliente
- [ ] Resgatar recompensas
- [ ] Métricas e gráficos
- [ ] Customização visual (cores da carteirinha)
- [ ] Integração com Pass Kit (Apple/Google Wallet)

## Build para Produção

```bash
npm run build
npm start
```

## Troubleshooting

**"API connection refused"**
- Verifique se backend está rodando em `http://localhost:3000`
- Verifique `NEXT_PUBLIC_API_URL` no `.env.local`

**"Token expirado"**
- Faça logout e login novamente
- Token dura 7 dias (configurável no backend)

**Porta 3000 já em uso**
- Use flag diferente:
```bash
npm run dev -- -p 3001
```
