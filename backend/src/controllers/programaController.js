const Programa = require('../models/Programa');

// Criar programa
exports.criar = async (req, res) => {
  try {
    const { nome, descricao, regraPrograma, comprasNecessarias, recompensaPontos, emoji } = req.body;
    const empresaId = req.user.id;

    if (!nome || !regraPrograma || !comprasNecessarias || !recompensaPontos) {
      return res.status(400).json({
        erro: 'Nome, regra, compras necessárias e pontos de recompensa são obrigatórios'
      });
    }

    const programa = new Programa({
      empresaId,
      nome,
      descricao,
      regraPrograma,
      comprasNecessarias,
      recompensaPontos,
      emoji: emoji || '☕',
    });

    await programa.save();

    res.status(201).json({
      mensagem: 'Programa criado com sucesso!',
      programa
    });
  } catch (error) {
    console.error('Erro ao criar programa:', error);
    res.status(500).json({
      erro: error.message || 'Erro ao criar programa'
    });
  }
};

// Listar programas da empresa
exports.listar = async (req, res) => {
  try {
    const empresaId = req.user.id;

    const programas = await Programa.find({ empresaId }).sort({ createdAt: -1 });

    res.json({
      total: programas.length,
      programas
    });
  } catch (error) {
    console.error('Erro ao listar programas:', error);
    res.status(500).json({
      erro: error.message || 'Erro ao listar programas'
    });
  }
};

// Obter programa por ID
exports.obter = async (req, res) => {
  try {
    const { id } = req.params;
    const empresaId = req.user.id;

    const programa = await Programa.findOne({ _id: id, empresaId });

    if (!programa) {
      return res.status(404).json({
        erro: 'Programa não encontrado'
      });
    }

    res.json(programa);
  } catch (error) {
    console.error('Erro ao obter programa:', error);
    res.status(500).json({
      erro: error.message || 'Erro ao obter programa'
    });
  }
};

// Atualizar programa
exports.atualizar = async (req, res) => {
  try {
    const { id } = req.params;
    const empresaId = req.user.id;
    const { nome, descricao, regraPrograma, ativo, emoji } = req.body;

    const programa = await Programa.findOneAndUpdate(
      { _id: id, empresaId },
      { nome, descricao, regraPrograma, ativo, emoji },
      { new: true }
    );

    if (!programa) {
      return res.status(404).json({
        erro: 'Programa não encontrado'
      });
    }

    res.json({
      mensagem: 'Programa atualizado com sucesso!',
      programa
    });
  } catch (error) {
    console.error('Erro ao atualizar programa:', error);
    res.status(500).json({
      erro: error.message || 'Erro ao atualizar programa'
    });
  }
};

// Deletar programa
exports.deletar = async (req, res) => {
  try {
    const { id } = req.params;
    const empresaId = req.user.id;

    const programa = await Programa.findOneAndDelete({ _id: id, empresaId });

    if (!programa) {
      return res.status(404).json({
        erro: 'Programa não encontrado'
      });
    }

    res.json({
      mensagem: 'Programa deletado com sucesso!'
    });
  } catch (error) {
    console.error('Erro ao deletar programa:', error);
    res.status(500).json({
      erro: error.message || 'Erro ao deletar programa'
    });
  }
};
