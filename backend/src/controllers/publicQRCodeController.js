const Cliente = require('../models/Cliente');
const Programa = require('../models/Programa');
const QRCode = require('../models/QRCode');
const LoyaltyMembership = require('../models/LoyaltyMembership');

// Adesão ao programa (criar membership)
exports.joinProgram = async (req, res) => {
  try {
    const { codigo, nome, email } = req.body;

    if (!codigo || !nome || !email) {
      return res.status(400).json({
        erro: 'código, nome e email são obrigatórios'
      });
    }

    const qrCode = await QRCode.findOne({ codigo }).populate('programaId empresaId');

    if (!qrCode) {
      return res.status(404).json({
        erro: 'QR Code não encontrado'
      });
    }

    if (qrCode.tipo !== 'adesao') {
      return res.status(400).json({
        erro: 'Este QR Code é para ganho de pontos, não para adesão'
      });
    }

    if (qrCode.status !== 'disponivel') {
      return res.status(400).json({
        erro: `QR Code já foi ${qrCode.status}`
      });
    }

    // Buscar ou criar cliente
    let cliente = await Cliente.findOne({ email, empresaId: qrCode.empresaId._id });

    if (!cliente) {
      cliente = new Cliente({
        nome,
        email,
        telefone: '',
        empresaId: qrCode.empresaId._id
      });
      await cliente.save();
    }

    // Verificar se já tem membership ativo
    let membership = await LoyaltyMembership.findOne({
      clienteId: cliente._id,
      programaId: qrCode.programaId._id
    });

    if (membership) {
      return res.status(400).json({
        erro: 'Você já é membro deste programa!'
      });
    }

    // Criar novo membership (pontos iniciais = 0, sem pontos de adesão)
    membership = new LoyaltyMembership({
      clienteId: cliente._id,
      programaId: qrCode.programaId._id,
      empresaId: qrCode.empresaId._id,
      statusMembership: 'ativo',
      pontosAtuais: 0,
      comprasRealizadas: 0,
      dataAdesao: new Date()
    });
    await membership.save();

    // Marcar QR como utilizado
    qrCode.status = 'utilizado';
    qrCode.clienteId = cliente._id;
    qrCode.dataUtilizado = new Date();
    await qrCode.save();

    // Atualizar programa
    const programa = await Programa.findById(qrCode.programaId);
    if (programa) {
      programa.clientesAtivos = (programa.clientesAtivos || 0) + 1;
      await programa.save();
    }

    res.json({
      mensagem: 'Bem-vindo ao programa! Agora você pode ganhar pontos.',
      cliente: {
        nome: cliente.nome,
        email: cliente.email
      },
      programa: {
        nome: programa?.nome,
        emoji: programa?.emoji,
        descricao: programa?.descricao
      },
      membership: {
        id: membership._id,
        pontosAtuais: 0,
        statusMembership: 'ativo'
      }
    });
  } catch (error) {
    console.error('Erro ao aderir ao programa:', error);
    res.status(500).json({
      erro: error.message || 'Erro ao aderir ao programa'
    });
  }
};

// Ganhar pontos (apenas para membros ativos)
exports.earnPoints = async (req, res) => {
  try {
    const { codigo, email } = req.body;

    if (!codigo) {
      return res.status(400).json({
        erro: 'Código do QR é obrigatório'
      });
    }

    const qrCode = await QRCode.findOne({ codigo }).populate('programaId empresaId');

    if (!qrCode) {
      return res.status(404).json({
        erro: 'QR Code não encontrado'
      });
    }

    if (qrCode.tipo !== 'pontuacao') {
      return res.status(400).json({
        erro: 'Este QR Code é para adesão, não para ganho de pontos'
      });
    }

    if (qrCode.status !== 'disponivel') {
      return res.status(400).json({
        erro: `QR Code já foi ${qrCode.status}`
      });
    }

    // Se o QR não está vinculado, usa email para identificar cliente
    let clienteId = qrCode.clienteId;
    if (!clienteId && email) {
      const cliente = await Cliente.findOne({ email, empresaId: qrCode.empresaId._id });
      if (cliente) {
        clienteId = cliente._id;
      }
    }

    if (!clienteId) {
      return res.status(400).json({
        erro: 'Email é obrigatório para ganhar pontos'
      });
    }

    // Verificar se cliente é membro ativo
    const membership = await LoyaltyMembership.findOne({
      clienteId: clienteId,
      programaId: qrCode.programaId._id,
      statusMembership: 'ativo'
    });

    if (!membership) {
      return res.status(403).json({
        erro: 'Você precisa aderir ao programa primeiro para ganhar pontos'
      });
    }

    // Adicionar pontos
    const pontosGanhos = qrCode.pontosAtribuidos || 10;
    membership.pontosAtuais += pontosGanhos;
    membership.comprasRealizadas += 1;
    membership.ultimaCompra = new Date();
    await membership.save();

    // Marcar QR como utilizado
    qrCode.status = 'utilizado';
    qrCode.dataUtilizado = new Date();
    await qrCode.save();

    // Atualizar programa
    const programa = await Programa.findById(qrCode.programaId);
    if (programa) {
      programa.pontosEmitidos += pontosGanhos;
      await programa.save();
    }

    // Buscar dados do cliente para resposta
    const cliente = await Cliente.findById(clienteId);

    res.json({
      mensagem: 'Pontos adicionados com sucesso!',
      pontosGanhos,
      membership: {
        id: membership._id,
        pontosAtuais: membership.pontosAtuais,
        comprasRealizadas: membership.comprasRealizadas
      },
      cliente: {
        nome: cliente?.nome,
        email: cliente?.email
      },
      programa: {
        nome: programa?.nome,
        emoji: programa?.emoji
      }
    });
  } catch (error) {
    console.error('Erro ao ganhar pontos:', error);
    res.status(500).json({
      erro: error.message || 'Erro ao ganhar pontos'
    });
  }
};

// Validar QR (informações públicas)
exports.validarPublico = async (req, res) => {
  try {
    const { codigo } = req.params;

    if (!codigo) {
      return res.status(400).json({
        erro: 'Código do QR é obrigatório'
      });
    }

    const qrCode = await QRCode.findOne({ codigo }).populate('programaId', 'nome emoji descricao');

    if (!qrCode) {
      return res.status(404).json({
        erro: 'QR Code não encontrado'
      });
    }

    const resposta = {
      programa: qrCode.programaId ? {
        nome: qrCode.programaId.nome,
        emoji: qrCode.programaId.emoji,
        descricao: qrCode.programaId.descricao
      } : null,
      tipo: qrCode.tipo,
      status: qrCode.status
    };

    res.json(resposta);
  } catch (error) {
    console.error('Erro ao validar QR:', error);
    res.status(500).json({
      erro: error.message || 'Erro ao validar QR'
    });
  }
};
