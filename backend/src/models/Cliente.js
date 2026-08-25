const mongoose = require('mongoose');

const clienteSchema = new mongoose.Schema(
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
    email: {
      type: String,
      default: null,
    },
    telefone: {
      type: String,
      default: null,
    },
    programasParticipantes: [
      {
        programaId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Programa',
        },
        pontos: {
          type: Number,
          default: 0,
        },
        comprasRealizadas: {
          type: Number,
          default: 0,
        },
        recompensasResgatadas: {
          type: Number,
          default: 0,
        },
        dataInscricao: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    totalPontos: {
      type: Number,
      default: 0,
    },
    totalCompras: {
      type: Number,
      default: 0,
    },
    ultimaCompra: {
      type: Date,
      default: null,
    },
    ativo: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Cliente', clienteSchema);
