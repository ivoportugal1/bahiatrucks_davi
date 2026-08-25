const Cliente = require('../models/Cliente');
const Programa = require('../models/Programa');

// Criar cliente
exports.criar = async (req, res) => {
  try {
    const { nome, email, telefone, programaId } = req.body;
    const empresaId = req.user.id;

    if (!nome) {
      return res.status(400).json({
        erro: 'Nome do cliente é obrigatório'
      });
    }

    const cliente = new Cliente({
      empresaId,
      nome,
      email,
      telefone,
    });

    // Se informou programa, adiciona o cliente ao programa
    if (programaId) {
      const programa = await Programa.findOne({ _id: programaId, empresaId });
      if (programa) {
        cliente.programasParticipantes.push({
          programaId,
          pontos: 0,
          comprasRealizadas: 0,
        });
        programa.clientesParticipantes += 1;
        await programa.save();
      }
    }

    await cliente.save();

    res.status(201).json({
      mensagem: 'Cliente criado com sucesso!',
      cliente
    });
  } catch (error) {
    console.error('Erro ao criar cliente:', error);
    res.status(500).json({
      erro: error.message || 'Erro ao criar cliente'
    });
  }
};

// Listar clientes da empresa
exports.listar = async (req, res) => {
  try {
    const empresaId = req.user.id;

    const clientes = await Cliente.find({ empresaId })
      .populate('programasParticipantes.programaId')
      .sort({ createdAt: -1 });

    res.json({
      total: clientes.length,
      clientes
    });
  } catch (error) {
    console.error('Erro ao listar clientes:', error);
    res.status(500).json({
      erro: error.message || 'Erro ao listar clientes'
    });
  }
};

// Obter cliente por ID
exports.obter = async (req, res) => {
  try {
    const { id } = req.params;
    const empresaId = req.user.id;

    const cliente = await Cliente.findOne({ _id: id, empresaId })
      .populate('programasParticipantes.programaId');

    if (!cliente) {
      return res.status(404).json({
        erro: 'Cliente não encontrado'
      });
    }

    res.json(cliente);
  } catch (error) {
    console.error('Erro ao obter cliente:', error);
    res.status(500).json({
      erro: error.message || 'Erro ao obter cliente'
    });
  }
};

// Adicionar pontos ao cliente
exports.adicionarPontos = async (req, res) => {
  try {
    const { clienteId, programaId, pontos } = req.body;
    const empresaId = req.user.id;

    if (!clienteId || !programaId || !pontos) {
      return res.status(400).json({
        erro: 'clienteId, programaId e pontos são obrigatórios'
      });
    }

    const cliente = await Cliente.findOne({ _id: clienteId, empresaId });
    if (!cliente) {
      return res.status(404).json({
        erro: 'Cliente não encontrado'
      });
    }

    const programa = cliente.programasParticipantes.find(
      p => p.programaId.toString() === programaId
    );

    if (!programa) {
      return res.status(404).json({
        erro: 'Cliente não participa deste programa'
      });
    }

    programa.pontos += pontos;
    programa.comprasRealizadas += 1;
    cliente.totalPontos += pontos;
    cliente.totalCompras += 1;
    cliente.ultimaCompra = new Date();

    await cliente.save();

    res.json({
      mensagem: 'Pontos adicionados com sucesso!',
      cliente,
      pontosAtuais: programa.pontos
    });
  } catch (error) {
    console.error('Erro ao adicionar pontos:', error);
    res.status(500).json({
      erro: error.message || 'Erro ao adicionar pontos'
    });
  }
};

// Atualizar cliente
exports.atualizar = async (req, res) => {
  try {
    const { id } = req.params;
    const empresaId = req.user.id;
    const { nome, email, telefone, ativo } = req.body;

    const cliente = await Cliente.findOneAndUpdate(
      { _id: id, empresaId },
      { nome, email, telefone, ativo },
      { new: true }
    );

    if (!cliente) {
      return res.status(404).json({
        erro: 'Cliente não encontrado'
      });
    }

    res.json({
      mensagem: 'Cliente atualizado com sucesso!',
      cliente
    });
  } catch (error) {
    console.error('Erro ao atualizar cliente:', error);
    res.status(500).json({
      erro: error.message || 'Erro ao atualizar cliente'
    });
  }
};

// Deletar cliente
exports.deletar = async (req, res) => {
  try {
    const { id } = req.params;
    const empresaId = req.user.id;

    const cliente = await Cliente.findOneAndDelete({ _id: id, empresaId });

    if (!cliente) {
      return res.status(404).json({
        erro: 'Cliente não encontrado'
      });
    }

    res.json({
      mensagem: 'Cliente deletado com sucesso!'
    });
  } catch (error) {
    console.error('Erro ao deletar cliente:', error);
    res.status(500).json({
      erro: error.message || 'Erro ao deletar cliente'
    });
  }
};
