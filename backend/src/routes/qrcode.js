const express = require('express');
const router = express.Router();
const qrCodeController = require('../controllers/qrCodeController');
const authMiddleware = require('../middlewares/auth');

// Rotas públicas (sem autenticação)
// GET /api/qrcodes/validar/:codigo - Validar e obter info do QR Code
router.get('/validar/:codigo', qrCodeController.validarPublico);

// Rotas protegidas (precisam de autenticação)
router.use(authMiddleware);

// POST /api/qrcodes/gerar-lote - Gerar QR Codes em lote
router.post('/gerar-lote', qrCodeController.gerarLote);

// GET /api/qrcodes - Listar QR Codes
router.get('/', qrCodeController.listar);

// GET /api/qrcodes/estatisticas - Obter estatísticas
router.get('/estatisticas', qrCodeController.estatisticas);

// Rota pública para escanear QR Code (não precisa de autenticação)
router.post('/escanear', qrCodeController.escanear);

module.exports = router;
