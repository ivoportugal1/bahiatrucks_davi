const Cliente = require('../models/Cliente');
const LoyaltyMembership = require('../models/LoyaltyMembership');

const FIDEL_API_KEY = process.env.FIDEL_API_KEY;
const FIDEL_PROGRAM_ID = process.env.FIDEL_PROGRAM_ID;
const FIDEL_API_URL = 'https://api.fidel.com.br/v1';

async function criarCartaoFidel(cliente, programa, membership) {
  try {
    if (!FIDEL_API_KEY || !FIDEL_PROGRAM_ID) {
      console.log('[FIDEL] Credenciais não configuradas');
      return null;
    }

    console.log('[FIDEL] Criando cartão para cliente:', cliente.email);

    const response = await fetch(`${FIDEL_API_URL}/programs/${FIDEL_PROGRAM_ID}/cards`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${FIDEL_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: cliente.email,
        firstName: cliente.nome.split(' ')[0],
        lastName: cliente.nome.split(' ').slice(1).join(' ') || cliente.nome,
        phone: cliente.telefone || '',
        metadata: {
          membership_id: membership._id.toString(),
          programa_id: programa._id.toString()
        }
      })
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('[FIDEL] Erro ao criar cartão:', data);
      return null;
    }

    console.log('[FIDEL] Cartão criado com ID:', data.id);

    // Salvar ID do cartão Fidel no membership
    membership.googleWalletObjectId = data.id;
    membership.lastGoogleWalletSync = new Date();
    await membership.save();

    // Retornar link do cartão
    const walletLink = `https://api.fidel.com.br/wallet/${data.id}`;
    console.log('[FIDEL] Link gerado:', walletLink);

    return walletLink;
  } catch (error) {
    console.error('[FIDEL] Erro:', error.message);
    return null;
  }
}

module.exports = {
  criarCartaoFidel
};
