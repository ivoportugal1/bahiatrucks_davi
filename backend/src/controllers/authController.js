const jwt = require('jsonwebtoken');
const Empresa = require('../models/Empresa');

// Gerar token JWT
const gerarToken = (empresaId) => {
  return jwt.sign(
    { id: empresaId },
    process.env.JWT_SECRET || 'chave-secreta-padrao',
    { expiresIn: '7d' }
  );
};

// Registrar nova empresa
exports.registrar = async (req, res) => {
  try {
    const { nome, email, senha, confirmacaoSenha } = req.body;

    // Validações básicas
    if (!nome || !email || !senha) {
      return res.status(400).json({
        erro: 'Nome, email e senha são obrigatórios'
      });
    }

    if (senha !== confirmacaoSenha) {
      return res.status(400).json({
        erro: 'As senhas não conferem'
      });
    }

    // Verificar se email já existe
    const empresaExistente = await Empresa.findOne({ email });
    if (empresaExistente) {
      return res.status(400).json({
        erro: 'Email já cadastrado'
      });
    }

    // Criar empresa
    const empresa = new Empresa({
      nome,
      email,
      senha,
    });

    await empresa.save();

    // Gerar token
    const token = gerarToken(empresa._id);

    res.status(201).json({
      mensagem: 'Empresa cadastrada com sucesso!',
      token,
      empresa: empresa.toJSON()
    });
  } catch (error) {
    console.error('Erro ao registrar:', error);
    res.status(500).json({
      erro: error.message || 'Erro ao registrar empresa'
    });
  }
};

// Login
exports.login = async (req, res) => {
  try {
    const { email, senha } = req.body;

    // Validações
    if (!email || !senha) {
      return res.status(400).json({
        erro: 'Email e senha são obrigatórios'
      });
    }

    // Buscar empresa
    const empresa = await Empresa.findOne({ email });
    if (!empresa) {
      return res.status(401).json({
        erro: 'Email ou senha incorretos'
      });
    }

    // Verificar senha
    const senhaValida = await empresa.compararSenha(senha);
    if (!senhaValida) {
      return res.status(401).json({
        erro: 'Email ou senha incorretos'
      });
    }

    // Atualizar última login
    empresa.dataUltimaLogin = new Date();
    await empresa.save();

    // Gerar token
    const token = gerarToken(empresa._id);

    res.json({
      mensagem: 'Login realizado com sucesso!',
      token,
      empresa: empresa.toJSON()
    });
  } catch (error) {
    console.error('Erro ao fazer login:', error);
    res.status(500).json({
      erro: error.message || 'Erro ao fazer login'
    });
  }
};

// Validar token
exports.validarToken = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({
        erro: 'Token não fornecido'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'chave-secreta-padrao');
    const empresa = await Empresa.findById(decoded.id);

    if (!empresa) {
      return res.status(401).json({
        erro: 'Empresa não encontrada'
      });
    }

    res.json({
      valido: true,
      empresa: empresa.toJSON()
    });
  } catch (error) {
    res.status(401).json({
      erro: 'Token inválido ou expirado'
    });
  }
};
