const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');
const Cliente = require('../models/Cliente');
const Programa = require('../models/Programa');
const QRCode = require('../models/QRCode');

let serviceAccount;
try {
  if (process.env.GOOGLE_WALLET_KEY) {
    serviceAccount = JSON.parse(process.env.GOOGLE_WALLET_KEY);
  } else {
    const keyPath = path.join(__dirname, '../../google-wallet-key.json');
    serviceAccount = JSON.parse(fs.readFileSync(keyPath, 'utf8'));
  }
} catch (error) {
  console.error('Erro ao carregar Google Wallet credentials:', error.message);
  serviceAccount = null;
}

const ISSUER_ID = '100243854108295429596';
const PROJECT_ID = serviceAccount.project_id;

async function getAccessToken() {
  if (!serviceAccount) {
    throw new Error('Google Wallet credentials not configured. Set GOOGLE_WALLET_KEY environment variable.');
  }

  const now = Math.floor(Date.now() / 1000);
  const payload = {
    iss: serviceAccount.client_email,
    sub: serviceAccount.client_email,
    aud: 'https://oauth2.googleapis.com/token',
    iat: now,
    exp: now + 3600,
    scope: 'https://www.googleapis.com/auth/wallet.loyaltyprogram'
  };

  const token = jwt.sign(payload, serviceAccount.private_key, {
    algorithm: 'RS256',
    header: {
      typ: 'JWT'
    }
  });

  const response = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion: token
    })
  });

  const data = await response.json();
  return data.access_token;
}

exports.gerarCartao = async (req, res) => {
  try {
    const { clienteId, programaId } = req.body;

    if (!clienteId || !programaId) {
      return res.status(400).json({
        erro: 'clienteId e programaId são obrigatórios'
      });
    }

    const cliente = await Cliente.findById(clienteId);
    const programa = await Programa.findById(programaId);

    if (!cliente || !programa) {
      return res.status(404).json({
        erro: 'Cliente ou Programa não encontrado'
      });
    }

    const accessToken = await getAccessToken();

    // ID únicos para classe e objeto
    const classId = `${ISSUER_ID}.programa_${programaId}`;
    const objectId = `${ISSUER_ID}.cliente_${clienteId}`;

    // Criar classe se não existir
    const classPayload = {
      id: classId,
      issuerName: 'Fidelizarei',
      programName: programa.nome,
      programLogo: {
        sourceUri: {
          uri: 'https://bahiatrucks-davi.vercel.app/logo.png'
        }
      },
      rewardsTierLabel: 'Pontos'
    };

    try {
      await fetch(
        `https://walletobjects.googleapis.com/walletobjects/v1/loyaltyClass/${classId}`,
        {
          method: 'GET',
          headers: { Authorization: `Bearer ${accessToken}` }
        }
      );
    } catch (err) {
      await fetch('https://walletobjects.googleapis.com/walletobjects/v1/loyaltyClass', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(classPayload)
      });
    }

    // Criar objeto (cartão do cliente)
    const pontos = cliente.programasParticipantes.find(
      p => p.programaId.toString() === programaId.toString()
    )?.pontos || 0;

    const objectPayload = {
      id: objectId,
      classId: classId,
      state: 'ACTIVE',
      heroImage: {
        sourceUri: {
          uri: 'https://bahiatrucks-davi.vercel.app/hero.png'
        }
      },
      textModulesData: [
        {
          header: 'Cliente',
          body: cliente.nome
        }
      ],
      infoModuleData: {
        labelValueRows: [
          {
            columns: [
              {
                label: 'Pontos',
                value: pontos.toString()
              },
              {
                label: 'Compras',
                value: cliente.totalCompras.toString()
              }
            ]
          }
        ]
      },
      accountId: cliente._id.toString(),
      accountDisplayName: cliente.nome,
      loyaltyPoints: {
        label: 'Pontos',
        balance: {
          int: pontos
        }
      }
    };

    const objectResponse = await fetch(
      'https://walletobjects.googleapis.com/walletobjects/v1/loyaltyObject',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(objectPayload)
      }
    );

    const objectData = await objectResponse.json();

    if (!objectResponse.ok) {
      console.error('Erro do Google Wallet:', {
        status: objectResponse.status,
        statusText: objectResponse.statusText,
        data: objectData,
        payload: objectPayload
      });
      throw new Error(`Erro Google Wallet ${objectResponse.status}: ${objectData.error?.message || JSON.stringify(objectData)}`);
    }

    // Criar JWT para deep link
    const deepLinkPayload = {
      iss: ISSUER_ID,
      aud: 'google',
      typ: 'savetowallet',
      origins: ['bahiatrucks-davi.vercel.app'],
      payload: {
        loyaltyObjects: [
          {
            id: objectId
          }
        ]
      }
    };

    const deepLinkJwt = jwt.sign(deepLinkPayload, serviceAccount.private_key, {
      algorithm: 'RS256',
      header: {
        typ: 'JWT',
        kid: serviceAccount.private_key_id
      }
    });

    const deepLink = `https://pay.google.com/gp/v/save/${deepLinkJwt}`;

    res.json({
      mensagem: 'Cartão gerado com sucesso!',
      deepLink,
      addToGoogleWalletLink: deepLink,
      cliente: cliente.nome,
      programa: programa.nome,
      pontos
    });
  } catch (error) {
    console.error('Erro ao gerar cartão Google Wallet:', error);
    res.status(500).json({
      erro: error.message || 'Erro ao gerar cartão'
    });
  }
};

exports.gerarLinkQRCode = async (req, res) => {
  try {
    const { codigo } = req.params;

    if (!codigo) {
      return res.status(400).json({
        erro: 'Código do QR Code é obrigatório'
      });
    }

    const qrCode = await QRCode.findOne({ codigo });

    if (!qrCode) {
      return res.status(404).json({
        erro: 'QR Code não encontrado'
      });
    }

    let cliente = null;
    if (qrCode.clienteId) {
      cliente = await Cliente.findById(qrCode.clienteId);
    } else {
      // Se não tem cliente ainda, retornar erro
      return res.status(400).json({
        erro: 'QR Code não está associado a um cliente ainda'
      });
    }

    const programa = await Programa.findById(qrCode.programaId);

    if (!programa || !cliente) {
      return res.status(404).json({
        erro: 'Programa ou Cliente não encontrado'
      });
    }

    const accessToken = await getAccessToken();

    // IDs únicos
    const classId = `${PROJECT_ID}.programa_${qrCode.programaId}`;
    const objectId = `${PROJECT_ID}.cliente_${qrCode.clienteId}`;

    // Criar classe se não existir
    const classPayload = {
      id: classId,
      issuerName: 'Fidelizarei',
      programName: programa.nome,
      programLogo: {
        sourceUri: {
          uri: 'https://bahiatrucks-davi.vercel.app/logo.png'
        }
      },
      rewardsTierLabel: 'Pontos'
    };

    try {
      await fetch(
        `https://walletobjects.googleapis.com/walletobjects/v1/loyaltyClass/${classId}`,
        {
          method: 'GET',
          headers: { Authorization: `Bearer ${accessToken}` }
        }
      );
    } catch (err) {
      await fetch('https://walletobjects.googleapis.com/walletobjects/v1/loyaltyClass', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(classPayload)
      });
    }

    // Criar objeto (cartão do cliente)
    const pontos = cliente.programasParticipantes.find(
      p => p.programaId.toString() === qrCode.programaId.toString()
    )?.pontos || 0;

    const objectPayload = {
      id: objectId,
      classId: classId,
      state: 'ACTIVE',
      heroImage: {
        sourceUri: {
          uri: 'https://bahiatrucks-davi.vercel.app/hero.png'
        }
      },
      textModulesData: [
        {
          header: 'Cliente',
          body: cliente.nome
        }
      ],
      infoModuleData: {
        labelValueRows: [
          {
            columns: [
              {
                label: 'Pontos',
                value: pontos.toString()
              },
              {
                label: 'Compras',
                value: cliente.totalCompras.toString()
              }
            ]
          }
        ]
      },
      accountId: cliente._id.toString(),
      accountDisplayName: cliente.nome,
      loyaltyPoints: {
        label: 'Pontos',
        balance: {
          int: pontos
        }
      }
    };

    const objectResponse = await fetch(
      'https://walletobjects.googleapis.com/walletobjects/v1/loyaltyObject',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(objectPayload)
      }
    );

    const objectData = await objectResponse.json();

    if (!objectResponse.ok) {
      console.error('Erro do Google Wallet (gerarLinkQRCode):', {
        status: objectResponse.status,
        statusText: objectResponse.statusText,
        data: objectData,
        payload: objectPayload
      });
      throw new Error(`Erro Google Wallet ${objectResponse.status}: ${objectData.error?.message || JSON.stringify(objectData)}`);
    }

    // Criar JWT para deep link
    const deepLinkPayload = {
      iss: ISSUER_ID,
      aud: 'google',
      typ: 'savetowallet',
      origins: ['bahiatrucks-davi.vercel.app'],
      payload: {
        loyaltyObjects: [
          {
            id: objectId
          }
        ]
      }
    };

    const deepLinkJwt = jwt.sign(deepLinkPayload, serviceAccount.private_key, {
      algorithm: 'RS256',
      header: {
        typ: 'JWT',
        kid: serviceAccount.private_key_id
      }
    });

    const deepLink = `https://pay.google.com/gp/v/save/${deepLinkJwt}`;

    res.json({
      mensagem: 'Link gerado com sucesso!',
      deepLink,
      addToGoogleWalletLink: deepLink
    });
  } catch (error) {
    console.error('Erro ao gerar link QR Code:', error);
    res.status(500).json({
      erro: error.message || 'Erro ao gerar link'
    });
  }
};
