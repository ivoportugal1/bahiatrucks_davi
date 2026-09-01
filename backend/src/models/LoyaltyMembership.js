const mongoose = require('mongoose');

const loyaltyMembershipSchema = new mongoose.Schema({
  clienteId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Cliente',
    required: true
  },
  programaId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Programa',
    required: true
  },
  empresaId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Empresa',
    required: true
  },
  statusMembership: {
    type: String,
    enum: ['ativo', 'suspenso', 'cancelado'],
    default: 'ativo'
  },
  dataAdesao: {
    type: Date,
    default: Date.now
  },
  pontosAtuais: {
    type: Number,
    default: 0
  },
  comprasRealizadas: {
    type: Number,
    default: 0
  },
  googleWalletObjectId: {
    type: String,
    default: null
  },
  lastGoogleWalletSync: {
    type: Date,
    default: null
  },
  ultimaCompra: {
    type: Date,
    default: null
  }
}, { timestamps: true });

// Índice para busca rápida cliente + programa
loyaltyMembershipSchema.index({ clienteId: 1, programaId: 1 }, { unique: true });
loyaltyMembershipSchema.index({ empresaId: 1, programaId: 1 });

module.exports = mongoose.model('LoyaltyMembership', loyaltyMembershipSchema);
