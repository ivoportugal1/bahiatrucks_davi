const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// POST /api/auth/registrar
router.post('/registrar', authController.registrar);

// POST /api/auth/login
router.post('/login', authController.login);

// GET /api/auth/validar
router.get('/validar', authController.validarToken);

module.exports = router;
