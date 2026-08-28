const express = require('express');
const router = express.Router();
const googleWalletController = require('../controllers/googleWalletController');
const authMiddleware = require('../middlewares/auth');

// POST /api/wallet/gerar-cartao - Gerar cartão Google Wallet (autenticado)
router.post('/gerar-cartao', authMiddleware, googleWalletController.gerarCartao);

// GET /api/wallet/link-qrcode/:codigo - Gerar link Google Wallet a partir do QR code (público)
router.get('/link-qrcode/:codigo', googleWalletController.gerarLinkQRCode);

module.exports = router;
