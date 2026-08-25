const express = require('express');
const router = express.Router();
const recompensaController = require('../controllers/recompensaController');
const authMiddleware = require('../middlewares/auth');

// Todas as rotas de recompensa precisam de autenticação
router.use(authMiddleware);

// POST /api/recompensas - Criar recompensa
router.post('/', recompensaController.criar);

// GET /api/recompensas - Listar recompensas
router.get('/', recompensaController.listar);

// GET /api/recompensas/:id - Obter recompensa por ID
router.get('/:id', recompensaController.obter);

// POST /api/recompensas/resgatar - Resgatar recompensa
router.post('/resgatar', recompensaController.resgatar);

// PUT /api/recompensas/:id - Atualizar recompensa
router.put('/:id', recompensaController.atualizar);

// DELETE /api/recompensas/:id - Deletar recompensa
router.delete('/:id', recompensaController.deletar);

module.exports = router;
