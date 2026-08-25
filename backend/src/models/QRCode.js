const mongoose = require('mongoose');

const qrCodeSchema = new mongoose.Schema(
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
    codigo: {
      type: String,
      unique: true,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      enum: ['disponivel', 'utilizado', 'cancelado'],
      default: 'disponivel',
    },
    clienteId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Cliente',
      default: null,
    },
    dataUtilizado: {
      type: Date,
      default: null,
    },
    pontosAtribuidos: {
      type: Number,
      default: 1,
    },
    lote: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('QRCode', qrCodeSchema);
