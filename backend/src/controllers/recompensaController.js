const Recompensa = require('../models/Recompensa');
const Cliente = require('../models/Cliente');

// Criar recompensa
exports.criar = async (req, res) => {
  try {
    const { programaId, nome, descricao, pontosNecessarios, quantidade, emoji } = req.body;
    const empresaId = req.user.id;

    if (!programaId || !nome || !pontosNecessarios) {
      return res.status(400).json({
        erro: 'programaId, nome e pontosNecessarios são obrigatórios'
      });
    }

    const recompensa = new Recompensa({
      empresaId,
      programaId,
      nome,
      descricao,
      pontosNecessarios,
      quantidade,
      quantidadeDisponivel: quantidade,
      emoji: emoji || '🎁',
    });

    await recompensa.save();

    res.status(201).json({
      mensagem: 'Recompensa criada com sucesso!',
      recompensa
    });
  } catch (error) {
    console.error('Erro ao criar recompensa:', error);
    res.status(500).json({
      erro: error.message || 'Erro ao criar recompensa'
    });
  }
};

// Listar recompensas da empresa
exports.listar = async (req, res) => {
  try {
    const empresaId = req.user.id;
    const { programaId, ativo } = req.query;

    let filtro = { empresaId };
    if (programaId) filtro.programaId = programaId;
    if (ativo !== undefined) filtro.ativo = ativo === 'true';

    const recompensas = await Recompensa.find(filtro)
      .populate('programaId', 'nome')
      .sort({ pontosNecessarios: 1 });

    res.json({
      total: recompensas.length,
      recompensas
    });
  } catch (error) {
    console.error('Erro ao listar recompensas:', error);
    res.status(500).json({
      erro: error.message || 'Erro ao listar recompensas'
    });
  }
};

// Obter recompensa por ID
exports.obter = async (req, res) => {
  try {
    const { id } = req.params;
    const empresaId = req.user.id;

    const recompensa = await Recompensa.findOne({ _id: id, empresaId })
      .populate('programaId');

    if (!recompensa) {
      return res.status(404).json({
        erro: 'Recompensa não encontrada'
      });
    }

    res.json(recompensa);
  } catch (error) {
    console.error('Erro ao obter recompensa:', error);
    res.status(500).json({
      erro: error.message || 'Erro ao obter recompensa'
    });
  }
};

// Resgate de recompensa pelo cliente
exports.resgatar = async (req, res) => {
  try {
    const { recompensaId, clienteId } = req.body;

    if (!recompensaId || !clienteId) {
      return res.status(400).json({
        erro: 'recompensaId e clienteId são obrigatórios'
      });
    }

    const recompensa = await Recompensa.findById(recompensaId);
    if (!recompensa) {
      return res.status(404).json({
        erro: 'Recompensa não encontrada'
      });
    }

    if (!recompensa.ativo) {
      return res.status(400).json({
        erro: 'Recompensa não está mais disponível'
      });
    }

    if (recompensa.quantidadeDisponivel !== null && recompensa.quantidadeDisponivel <= 0) {
      return res.status(400).json({
        erro: 'Recompensa esgotada'
      });
    }

    const cliente = await Cliente.findById(clienteId);
    if (!cliente) {
      return res.status(404).json({
        erro: 'Cliente não encontrado'
      });
    }

    const participacao = cliente.programasParticipantes.find(
      p => p.programaId.toString() === recompensa.programaId.toString()
    );

    if (!participacao) {
      return res.status(400).json({
        erro: 'Cliente não participa deste programa'
      });
    }

    if (participacao.pontos < recompensa.pontosNecessarios) {
      return res.status(400).json({
        erro: `Você precisa de ${recompensa.pontosNecessarios} pontos. Você tem ${participacao.pontos}`
      });
    }

    // Descontar pontos
    participacao.pontos -= recompensa.pontosNecessarios;
    participacao.recompensasResgatadas += 1;
    await cliente.save();

    // Atualizar recompensa
    if (recompensa.quantidadeDisponivel !== null) {
      recompensa.quantidadeDisponivel -= 1;
    }
    recompensa.quantidadeUtilizada += 1;
    await recompensa.save();

    res.json({
      mensagem: 'Recompensa resgatada com sucesso!',
      recompensa: {
        nome: recompensa.nome,
        emoji: recompensa.emoji,
        descricao: recompensa.descricao,
      },
      pontosRestantes: participacao.pontos,
      cliente
    });
  } catch (error) {
    console.error('Erro ao resgatar recompensa:', error);
    res.status(500).json({
      erro: error.message || 'Erro ao resgatar recompensa'
    });
  }
};

// Atualizar recompensa
exports.atualizar = async (req, res) => {
  try {
    const { id } = req.params;
    const empresaId = req.user.id;
    const { nome, descricao, pontosNecessarios, quantidade, ativo, emoji } = req.body;

    const recompensa = await Recompensa.findOneAndUpdate(
      { _id: id, empresaId },
      { nome, descricao, pontosNecessarios, quantidade, quantidadeDisponivel: quantidade, ativo, emoji },
      { new: true }
    );

    if (!recompensa) {
      return res.status(404).json({
        erro: 'Recompensa não encontrada'
      });
    }

    res.json({
      mensagem: 'Recompensa atualizada com sucesso!',
      recompensa
    });
  } catch (error) {
    console.error('Erro ao atualizar recompensa:', error);
    res.status(500).json({
      erro: error.message || 'Erro ao atualizar recompensa'
    });
  }
};

// Deletar recompensa
exports.deletar = async (req, res) => {
  try {
    const { id } = req.params;
    const empresaId = req.user.id;

    const recompensa = await Recompensa.findOneAndDelete({ _id: id, empresaId });

    if (!recompensa) {
      return res.status(404).json({
        erro: 'Recompensa não encontrada'
      });
    }

    res.json({
      mensagem: 'Recompensa deletada com sucesso!'
    });
  } catch (error) {
    console.error('Erro ao deletar recompensa:', error);
    res.status(500).json({
      erro: error.message || 'Erro ao deletar recompensa'
    });
  }
};
