# 📚 Endpoints da API Fidelizarei

## 🔐 Autenticação

### Registrar Empresa
```
POST /api/auth/registrar
Content-Type: application/json

{
  "nome": "Cafe do Joao",
  "email": "joao@cafe.com",
  "senha": "senha123",
  "confirmacaoSenha": "senha123"
}

Response:
{
  "mensagem": "Empresa cadastrada com sucesso!",
  "token": "eyJhbGc...",
  "empresa": {...}
}
```

### Login
```
POST /api/auth/login
Content-Type: application/json

{
  "email": "joao@cafe.com",
  "senha": "senha123"
}

Response:
{
  "mensagem": "Login realizado com sucesso!",
  "token": "eyJhbGc...",
  "empresa": {...}
}
```

### Validar Token
```
GET /api/auth/validar
Authorization: Bearer seu_token_aqui

Response:
{
  "valido": true,
  "empresa": {...}
}
```

---

## 🎁 Programas (Fidelidade)

### Criar Programa
```
POST /api/programas
Authorization: Bearer token
Content-Type: application/json

{
  "nome": "Café Grátis",
  "descricao": "Acumule pontos e ganhe café",
  "regraPrograma": "A cada 7 compras, ganhe 1 café",
  "comprasNecessarias": 7,
  "recompensaPontos": 1,
  "emoji": "☕"
}
```

### Listar Programas
```
GET /api/programas
Authorization: Bearer token
```

### Obter Programa
```
GET /api/programas/:id
Authorization: Bearer token
```

### Atualizar Programa
```
PUT /api/programas/:id
Authorization: Bearer token
Content-Type: application/json

{
  "nome": "Café Grátis Plus",
  "ativo": true
}
```

### Deletar Programa
```
DELETE /api/programas/:id
Authorization: Bearer token
```

---

## 👥 Clientes

### Criar Cliente
```
POST /api/clientes
Authorization: Bearer token
Content-Type: application/json

{
  "nome": "Marina Costa",
  "email": "marina@email.com",
  "telefone": "11999999999",
  "programaId": "id_do_programa"
}
```

### Listar Clientes
```
GET /api/clientes
Authorization: Bearer token
```

### Obter Cliente
```
GET /api/clientes/:id
Authorization: Bearer token
```

### Adicionar Pontos ao Cliente
```
POST /api/clientes/pontos/adicionar
Authorization: Bearer token
Content-Type: application/json

{
  "clienteId": "id_do_cliente",
  "programaId": "id_do_programa",
  "pontos": 1
}
```

### Atualizar Cliente
```
PUT /api/clientes/:id
Authorization: Bearer token
Content-Type: application/json

{
  "nome": "Marina Costa Silva",
  "email": "marina.silva@email.com"
}
```

### Deletar Cliente
```
DELETE /api/clientes/:id
Authorization: Bearer token
```

---

## 📱 QR Codes

### Gerar Lote de QR Codes
```
POST /api/qrcodes/gerar-lote
Authorization: Bearer token
Content-Type: application/json

{
  "programaId": "id_do_programa",
  "quantidade": 100
}

Response:
{
  "mensagem": "100 QR Codes gerados com sucesso!",
  "lote": "LOTE-1234567890",
  "quantidade": 100,
  "qrCodes": [...]
}
```

### Listar QR Codes
```
GET /api/qrcodes
Authorization: Bearer token

Query Parameters:
?status=disponivel (ou utilizados, cancelados)
?programaId=id_do_programa
```

### Escanear QR Code (Cliente)
```
POST /api/qrcodes/escanear
Content-Type: application/json

{
  "codigo": "QR-a1b2-c3d4-e5f6g7h8",
  "clienteId": "id_do_cliente"
}

Response:
{
  "mensagem": "QR Code escaneado com sucesso!",
  "pontosAdicionados": 1,
  "cliente": {...}
}
```

### Estatísticas de QR Codes
```
GET /api/qrcodes/estatisticas
Authorization: Bearer token

Query Parameters:
?programaId=id_do_programa

Response:
{
  "total": 1000,
  "utilizados": 850,
  "disponiveis": 150,
  "cancelados": 0,
  "taxaUtilizacao": "85.00%"
}
```

---

## 🎉 Recompensas

### Criar Recompensa
```
POST /api/recompensas
Authorization: Bearer token
Content-Type: application/json

{
  "programaId": "id_do_programa",
  "nome": "Café Grátis",
  "descricao": "Uma xícara de café quente",
  "pontosNecessarios": 7,
  "quantidade": 100,
  "emoji": "☕"
}
```

### Listar Recompensas
```
GET /api/recompensas
Authorization: Bearer token

Query Parameters:
?programaId=id_do_programa
?ativo=true
```

### Obter Recompensa
```
GET /api/recompensas/:id
Authorization: Bearer token
```

### Resgatar Recompensa
```
POST /api/recompensas/resgatar
Authorization: Bearer token
Content-Type: application/json

{
  "recompensaId": "id_da_recompensa",
  "clienteId": "id_do_cliente"
}

Response:
{
  "mensagem": "Recompensa resgatada com sucesso!",
  "recompensa": {
    "nome": "Café Grátis",
    "emoji": "☕"
  },
  "pontosRestantes": 0
}
```

### Atualizar Recompensa
```
PUT /api/recompensas/:id
Authorization: Bearer token
Content-Type: application/json

{
  "nome": "Café + Pão",
  "pontosNecessarios": 10,
  "ativo": true
}
```

### Deletar Recompensa
```
DELETE /api/recompensas/:id
Authorization: Bearer token
```

---

## 🧪 Teste Rápido

```bash
# 1. Registrar
curl -X POST http://localhost:5000/api/auth/registrar \
  -H "Content-Type: application/json" \
  -d '{"nome":"Cafe","email":"cafe@test.com","senha":"123456","confirmacaoSenha":"123456"}'

# 2. Copiar o token da resposta

# 3. Criar programa
curl -X POST http://localhost:5000/api/programas \
  -H "Authorization: Bearer SEU_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"nome":"Cafe Gratis","regraPrograma":"A cada 7 compras","comprasNecessarias":7,"recompensaPontos":1}'
```

---

## ✅ Headers Necessários

Todas as rotas protegidas precisam do header:
```
Authorization: Bearer seu_token_jwt_aqui
```

Content-Type para POST/PUT:
```
Content-Type: application/json
```

---

Pronto! 🚀 Todos os endpoints estão documentados!
