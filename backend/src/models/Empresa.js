const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const empresaSchema = new mongoose.Schema(
  {
    nome: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      match: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
    },
    senha: {
      type: String,
      required: true,
      minlength: 6,
    },
    telefone: {
      type: String,
      default: null,
    },
    descricao: {
      type: String,
      default: null,
    },
    logo: {
      type: String,
      default: null,
    },
    corPrimaria: {
      type: String,
      default: '#5a9d7d', // Verde musgo
    },
    corSecundaria: {
      type: String,
      default: '#4a8c6a',
    },
    website: {
      type: String,
      default: null,
    },
    ativa: {
      type: Boolean,
      default: true,
    },
    plano: {
      type: String,
      enum: ['gratuito', 'pro', 'premium'],
      default: 'gratuito',
    },
    dataUltimaLogin: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

// Hash da senha antes de salvar
empresaSchema.pre('save', async function (next) {
  if (!this.isModified('senha')) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.senha = await bcrypt.hash(this.senha, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Método para comparar senhas
empresaSchema.methods.compararSenha = async function (senhaInformada) {
  return await bcrypt.compare(senhaInformada, this.senha);
};

// Remover senha da resposta
empresaSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.senha;
  return obj;
};

module.exports = mongoose.model('Empresa', empresaSchema);
