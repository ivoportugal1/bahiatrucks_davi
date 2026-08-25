const mongoose = require('mongoose');

const recompensaSchema = new mongoose.Schema(
  {
    empresaId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Empresa',
      required: true,
    },
    programaId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Programa',
      required: true,
    },
    nome: {
      type: String,
      required: true,
      trim: true,
    },
    descricao: {
      type: String,
      default: null,
    },
    pontosNecessarios: {
      type: Number,
      required: true,
      min: 1,
    },
    quantidade: {
      type: Number,
      default: null,
    },
    quantidadeUtilizada: {
      type: Number,
      default: 0,
    },
    quantidadeDisponivel: {
      type: Number,
      default: null,
    },
    emoji: {
      type: String,
      default: '🎁',
    },
    cor: {
      type: String,
      default: '#5a9d7d',
    },
    ativo: {
      type: Boolean,
      default: true,
    },
    dataInicio: {
      type: Date,
      default: Date.now,
    },
    dataFim: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Recompensa', recompensaSchema);
