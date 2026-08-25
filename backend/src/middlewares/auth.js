const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({
        erro: 'Token não fornecido'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'chave-secreta-padrao');
    req.user = { id: decoded.id };
    next();
  } catch (error) {
    res.status(401).json({
      erro: 'Token inválido ou expirado'
    });
  }
};

module.exports = authMiddleware;
