const express = require('express');
const router = express.Router();
const clienteController = require('../controllers/clienteController');
const authMiddleware = require('../middlewares/auth');

// Todas as rotas de cliente precisam de autenticação
router.use(authMiddleware);

// POST /api/clientes - Criar cliente
router.post('/', clienteController.criar);

// GET /api/clientes - Listar clientes
router.get('/', clienteController.listar);

// GET /api/clientes/:id - Obter cliente por ID
router.get('/:id', clienteController.obter);

// POST /api/clientes/pontos/adicionar - Adicionar pontos ao cliente
router.post('/pontos/adicionar', clienteController.adicionarPontos);

// PUT /api/clientes/:id - Atualizar cliente
router.put('/:id', clienteController.atualizar);

// DELETE /api/clientes/:id - Deletar cliente
router.delete('/:id', clienteController.deletar);

module.exports = router;
