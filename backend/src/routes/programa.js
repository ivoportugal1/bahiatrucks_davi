const express = require('express');
const router = express.Router();
const programaController = require('../controllers/programaController');
const authMiddleware = require('../middlewares/auth');

// Todas as rotas de programa precisam de autenticação
router.use(authMiddleware);

// POST /api/programas - Criar programa
router.post('/', programaController.criar);

// GET /api/programas - Listar programas
router.get('/', programaController.listar);

// GET /api/programas/:id - Obter programa por ID
router.get('/:id', programaController.obter);

// PUT /api/programas/:id - Atualizar programa
router.put('/:id', programaController.atualizar);

// DELETE /api/programas/:id - Deletar programa
router.delete('/:id', programaController.deletar);

module.exports = router;
