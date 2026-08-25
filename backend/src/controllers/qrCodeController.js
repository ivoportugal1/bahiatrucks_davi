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
