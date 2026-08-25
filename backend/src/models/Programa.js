const mongoose = require('mongoose');

const programaSchema = new mongoose.Schema(
  {
    empresaId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Empresa',
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
    regraPrograma: {
      type: String,
      required: true,
      example: 'A cada 7 compras, ganhe 1 café',
    },
    comprasNecessarias: {
      type: Number,
      required: true,
      min: 1,
    },
    recompensaPontos: {
      type: Number,
      required: true,
      min: 1,
    },
    ativo: {
      type: Boolean,
      default: true,
    },
    clientesParticipantes: {
      type: Number,
      default: 0,
    },
    pontosEmitidos: {
      type: Number,
      default: 0,
    },
    corPrimaria: {
      type: String,
      default: '#5a9d7d',
    },
    corSecundaria: {
      type: String,
      default: '#4a8c6a',
    },
    emoji: {
      type: String,
      default: '☕',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Programa', programaSchema);
