const QRCode = require('../models/QRCode');
const Cliente = require('../models/Cliente');
const Programa = require('../models/Programa');
const crypto = require('crypto');

// Gerar QR Codes em lote
exports.gerarLote = async (req, res) => {
  try {
    const { programaId, quantidade } = req.body;
    const empresaId = req.user.id;

    if (!programaId || !quantidade || quantidade < 1) {
      return res.status(400).json({
        erro: 'programaId e quantidade são obrigatórios'
      });
    }

    const programa = await Programa.findOne({ _id: programaId, empresaId });
    if (!programa) {
      return res.status(404).json({
        erro: 'Programa não encontrado'
      });
    }

    const loteId = `LOTE-${Date.now()}`;
    const qrCodes = [];

    for (let i = 0; i < quantidade; i++) {
      const codigo = `QR-${empresaId.toString().slice(-4)}-${programaId.toString().slice(-4)}-${crypto.randomBytes(4).toString('hex').toUpperCase()}`;

      qrCodes.push({
        empresaId,
        programaId,
        codigo,
        lote: loteId,
      });
    }

    await QRCode.insertMany(qrCodes);

    res.status(201).json({
      mensagem: `${quantidade} QR Codes gerados com sucesso!`,
      lote: loteId,
      quantidade,
      qrCodes
    });
  } catch (error) {
    console.error('Erro ao gerar QR Codes:', error);
    res.status(500).json({
      erro: error.message || 'Erro ao gerar QR Codes'
    });
  }
};

// Listar QR Codes da empresa
exports.listar = async (req, res) => {
  try {
    const empresaId = req.user.id;
    const { status, programaId } = req.query;

    let filtro = { empresaId };
    if (status) filtro.status = status;
    if (programaId) filtro.programaId = programaId;

    const qrCodes = await QRCode.find(filtro)
      .populate('programaId', 'nome')
      .populate('clienteId', 'nome email')
      .sort({ createdAt: -1 });

    res.json({
      total: qrCodes.length,
      qrCodes
    });
  } catch (error) {
    console.error('Erro ao listar QR Codes:', error);
    res.status(500).json({
      erro: error.message || 'Erro ao listar QR Codes'
    });
  }
};

// Escanear QR Code (cliente)
exports.escanear = async (req, res) => {
  try {
    const { codigo, clienteId } = req.body;

    if (!codigo || !clienteId) {
      return res.status(400).json({
        erro: 'codigo e clienteId são obrigatórios'
      });
    }

    const qrCode = await QRCode.findOne({ codigo });

    if (!qrCode) {
      return res.status(404).json({
        erro: 'QR Code não encontrado'
      });
    }

    if (qrCode.status !== 'disponivel') {
      return res.status(400).json({
        erro: `QR Code já foi ${qrCode.status}`
      });
    }

    // Marcar como utilizado
    qrCode.status = 'utilizado';
    qrCode.clienteId = clienteId;
    qrCode.dataUtilizado = new Date();
    await qrCode.save();

    // Adicionar pontos ao cliente
    const cliente = await Cliente.findById(clienteId);
    const programa = await Programa.findById(qrCode.programaId);

    if (cliente && programa) {
      const participacao = cliente.programasParticipantes.find(
        p => p.programaId.toString() === qrCode.programaId.toString()
      );

      if (participacao) {
        participacao.pontos += qrCode.pontosAtribuidos;
        participacao.comprasRealizadas += 1;
        cliente.totalPontos += qrCode.pontosAtribuidos;
        cliente.totalCompras += 1;
        cliente.ultimaCompra = new Date();
        await cliente.save();

        programa.pontosEmitidos += qrCode.pontosAtribuidos;
        await programa.save();
      }
    }

    res.json({
      mensagem: 'QR Code escaneado com sucesso!',
      qrCode,
      pontosAdicionados: qrCode.pontosAtribuidos,
      cliente: cliente ? cliente.toJSON() : null
    });
  } catch (error) {
    console.error('Erro ao escanear QR Code:', error);
    res.status(500).json({
      erro: error.message || 'Erro ao escanear QR Code'
    });
  }
};

// Validar QR Code e obter informações públicas
exports.validarPublico = async (req, res) => {
  try {
    const { codigo } = req.params;

    if (!codigo) {
      return res.status(400).json({
        erro: 'Código do QR Code é obrigatório'
      });
    }

    const qrCode = await QRCode.findOne({ codigo }).populate('programaId', 'nome emoji descricao');

    if (!qrCode) {
      return res.status(404).json({
        erro: 'QR Code não encontrado ou inválido'
      });
    }

    let cliente = null;
    if (qrCode.clienteId) {
      cliente = await Cliente.findById(qrCode.clienteId);
    }

    const resposta = {
      programa: qrCode.programaId ? {
        nome: qrCode.programaId.nome,
        emoji: qrCode.programaId.emoji,
        descricao: qrCode.programaId.descricao
      } : null,
      status: qrCode.status,
      cliente: cliente ? {
        nome: cliente.nome,
        pontos: cliente.programasParticipantes.find(p => p.programaId.toString() === qrCode.programaId._id.toString())?.pontos || 0,
        totalCompras: cliente.totalCompras
      } : {
        nome: 'Cliente não registrado',
        pontos: 0,
        totalCompras: 0
      }
    };

    res.json(resposta);
  } catch (error) {
    console.error('Erro ao validar QR Code:', error);
    res.status(500).json({
      erro: error.message || 'Erro ao validar QR Code'
    });
  }
};

// Escanear QR Code e registrar cliente (público)
exports.escanearPublico = async (req, res) => {
  try {
    const { codigo, nome, email } = req.body;

    if (!codigo || !nome || !email) {
      return res.status(400).json({
        erro: 'código, nome e email são obrigatórios'
      });
    }

    const qrCode = await QRCode.findOne({ codigo }).populate('programaId');

    if (!qrCode) {
      return res.status(404).json({
        erro: 'QR Code não encontrado'
      });
    }

    if (qrCode.status !== 'disponivel') {
      return res.status(400).json({
        erro: `QR Code já foi ${qrCode.status}`
      });
    }

    // Buscar ou criar cliente
    let cliente = await Cliente.findOne({ email });

    if (!cliente) {
      cliente = new Cliente({
        nome,
        email,
        telefone: '',
        programasParticipantes: [
          {
            programaId: qrCode.programaId._id,
            pontos: 0,
            comprasRealizadas: 0
          }
        ]
      });
    } else {
      // Se cliente já existe, adicionar programa se não tiver
      const jaTemPrograma = cliente.programasParticipantes.find(
        p => p.programaId.toString() === qrCode.programaId._id.toString()
      );

      if (!jaTemPrograma) {
        cliente.programasParticipantes.push({
          programaId: qrCode.programaId._id,
          pontos: 0,
          comprasRealizadas: 0
        });
      }
    }

    // Marcar QR code como utilizado
    qrCode.status = 'utilizado';
    qrCode.clienteId = cliente._id;
    qrCode.dataUtilizado = new Date();
    await qrCode.save();

    // Adicionar pontos ao cliente
    const programa = await Programa.findById(qrCode.programaId);
    const participacao = cliente.programasParticipantes.find(
      p => p.programaId.toString() === qrCode.programaId.toString()
    );

    if (participacao) {
      participacao.pontos += qrCode.pontosAtribuidos || 10; // 10 pontos padrão se não especificado
      participacao.comprasRealizadas += 1;
      cliente.totalPontos += qrCode.pontosAtribuidos || 10;
      cliente.totalCompras += 1;
      cliente.ultimaCompra = new Date();
    }

    await cliente.save();

    if (programa) {
      programa.pontosEmitidos += qrCode.pontosAtribuidos || 10;
      await programa.save();
    }

    const pontosGanhos = qrCode.pontosAtribuidos || 10;

    res.json({
      mensagem: 'QR Code escaneado com sucesso!',
      cliente: {
        nome: cliente.nome,
        pontos: participacao?.pontos || 0,
        totalCompras: cliente.totalCompras
      },
      pontosGanhos,
      programa: {
        nome: programa?.nome,
        emoji: programa?.emoji
      }
    });
  } catch (error) {
    console.error('Erro ao escanear QR Code público:', error);
    res.status(500).json({
      erro: error.message || 'Erro ao escanear QR Code'
    });
  }
};

// Obter estatísticas de QR Codes
exports.estatisticas = async (req, res) => {
  try {
    const empresaId = req.user.id;
    const { programaId } = req.query;

    let filtro = { empresaId };
    if (programaId) filtro.programaId = programaId;

    const total = await QRCode.countDocuments(filtro);
    const utilizados = await QRCode.countDocuments({ ...filtro, status: 'utilizado' });
    const disponiveis = await QRCode.countDocuments({ ...filtro, status: 'disponivel' });
    const cancelados = await QRCode.countDocuments({ ...filtro, status: 'cancelado' });

    res.json({
      total,
      utilizados,
      disponiveis,
      cancelados,
      taxaUtilizacao: total > 0 ? ((utilizados / total) * 100).toFixed(2) + '%' : '0%'
    });
  } catch (error) {
    console.error('Erro ao obter estatísticas:', error);
    res.status(500).json({
      erro: error.message || 'Erro ao obter estatísticas'
    });
  }
};
