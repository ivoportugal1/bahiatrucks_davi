require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/database');

const app = express();
const PORT = process.env.PORT || 5000;

// Conectar ao MongoDB
connectDB();

// Middlewares
app.use(cors({
  origin: ['https://bahiatrucks-davi.vercel.app', 'http://localhost:3000'],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rota de teste
app.get('/api/health', (req, res) => {
  res.json({
    status: '✅ API funcionando!',
    version: '1.0.0',
    timestamp: new Date()
  });
});

// Rotas
app.use('/api/auth', require('./routes/auth'));
app.use('/api/programas', require('./routes/programa'));
app.use('/api/clientes', require('./routes/cliente'));
app.use('/api/qrcodes', require('./routes/qrcode'));
app.use('/api/recompensas', require('./routes/recompensa'));
app.use('/api/wallet', require('./routes/wallet'));

// Middleware de erro
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    erro: err.message || 'Erro interno do servidor'
  });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`
🚀 Fidelizarei Backend rodando!
   URL: http://localhost:${PORT}
   API: http://localhost:${PORT}/api
   Health check: http://localhost:${PORT}/api/health
  `);
});
