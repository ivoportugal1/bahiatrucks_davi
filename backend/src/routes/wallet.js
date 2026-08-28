const express = require('express');
const router = express.Router();
const googleWalletController = require('../controllers/googleWalletController');
const authMiddleware = require('../middlewares/auth');

// POST /api/wallet/gerar-cartao - Gerar cartão Google Wallet
router.post('/gerar-cartao', authMiddleware, googleWalletController.gerarCartao);

module.exports = router;
