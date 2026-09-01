// Configuração da API
const API_URL = 'https://bahiatrucks-davi.onrender.com/api';

// Armazenar token no localStorage
const setToken = (token) => {
  localStorage.setItem('token', token);
};

const getToken = () => {
  return localStorage.getItem('token');
};

const removeToken = () => {
  localStorage.removeItem('token');
};

// Header com autenticação
const getHeaders = () => {
  const token = getToken();
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` })
  };
};

// AUTENTICAÇÃO
export const auth = {
  registrar: async (nome, email, senha, confirmacaoSenha) => {
    const response = await fetch(`${API_URL}/auth/registrar`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nome, email, senha, confirmacaoSenha })
    });
    const data = await response.json();
    if (data.token) setToken(data.token);
    return data;
  },

  login: async (email, senha) => {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, senha })
    });
    const data = await response.json();
    if (data.token) setToken(data.token);
    return data;
  },

  validar: async () => {
    const response = await fetch(`${API_URL}/auth/validar`, {
      headers: getHeaders()
    });
    return await response.json();
  },

  logout: () => {
    removeToken();
  }
};

// PROGRAMAS
export const programas = {
  criar: async (nome, descricao, regraPrograma, comprasNecessarias, recompensaPontos, emoji) => {
    const response = await fetch(`${API_URL}/programas`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({
        nome,
        descricao,
        regraPrograma,
        comprasNecessarias,
        recompensaPontos,
        emoji
      })
    });
    return await response.json();
  },

  listar: async () => {
    const response = await fetch(`${API_URL}/programas`, {
      headers: getHeaders()
    });
    return await response.json();
  },

  obter: async (id) => {
    const response = await fetch(`${API_URL}/programas/${id}`, {
      headers: getHeaders()
    });
    return await response.json();
  },

  atualizar: async (id, dados) => {
    const response = await fetch(`${API_URL}/programas/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(dados)
    });
    return await response.json();
  },

  deletar: async (id) => {
    const response = await fetch(`${API_URL}/programas/${id}`, {
      method: 'DELETE',
      headers: getHeaders()
    });
    return await response.json();
  }
};

// CLIENTES
export const clientes = {
  criar: async (nome, email, telefone, programaId) => {
    const response = await fetch(`${API_URL}/clientes`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ nome, email, telefone, programaId })
    });
    return await response.json();
  },

  listar: async () => {
    const response = await fetch(`${API_URL}/clientes`, {
      headers: getHeaders()
    });
    return await response.json();
  },

  obter: async (id) => {
    const response = await fetch(`${API_URL}/clientes/${id}`, {
      headers: getHeaders()
    });
    return await response.json();
  },

  adicionarPontos: async (clienteId, programaId, pontos) => {
    const response = await fetch(`${API_URL}/clientes/pontos/adicionar`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ clienteId, programaId, pontos })
    });
    return await response.json();
  },

  atualizar: async (id, dados) => {
    const response = await fetch(`${API_URL}/clientes/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(dados)
    });
    return await response.json();
  },

  deletar: async (id) => {
    const response = await fetch(`${API_URL}/clientes/${id}`, {
      method: 'DELETE',
      headers: getHeaders()
    });
    return await response.json();
  }
};

// QR CODES
export const qrCodes = {
  gerarLote: async (programaId, quantidade, tipo = 'pontuacao') => {
    const response = await fetch(`${API_URL}/qrcodes/gerar-lote`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ programaId, quantidade, tipo })
    });
    return await response.json();
  },

  listar: async (status = null, programaId = null) => {
    let url = `${API_URL}/qrcodes`;
    const params = new URLSearchParams();
    if (status) params.append('status', status);
    if (programaId) params.append('programaId', programaId);
    if (params.toString()) url += `?${params.toString()}`;

    const response = await fetch(url, {
      headers: getHeaders()
    });
    return await response.json();
  },

  escanear: async (codigo, clienteId) => {
    const response = await fetch(`${API_URL}/qrcodes/escanear`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ codigo, clienteId })
    });
    return await response.json();
  },

  escanearPublico: async (codigo, nome, email) => {
    const response = await fetch(`${API_URL}/qrcodes/escanear-publico`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ codigo, nome, email })
    });
    return await response.json();
  },

  join: async (codigo, nome, email) => {
    const response = await fetch(`${API_URL}/qrcodes/join`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ codigo, nome, email })
    });
    return await response.json();
  },

  earn: async (codigo) => {
    const response = await fetch(`${API_URL}/qrcodes/earn`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ codigo })
    });
    return await response.json();
  },

  estatisticas: async (programaId = null) => {
    let url = `${API_URL}/qrcodes/estatisticas`;
    if (programaId) url += `?programaId=${programaId}`;

    const response = await fetch(url, {
      headers: getHeaders()
    });
    return await response.json();
  }
};

// RECOMPENSAS
export const recompensas = {
  criar: async (programaId, nome, descricao, pontosNecessarios, quantidade, emoji) => {
    const response = await fetch(`${API_URL}/recompensas`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({
        programaId,
        nome,
        descricao,
        pontosNecessarios,
        quantidade,
        emoji
      })
    });
    return await response.json();
  },

  listar: async (programaId = null, ativo = null) => {
    let url = `${API_URL}/recompensas`;
    const params = new URLSearchParams();
    if (programaId) params.append('programaId', programaId);
    if (ativo !== null) params.append('ativo', ativo);
    if (params.toString()) url += `?${params.toString()}`;

    const response = await fetch(url, {
      headers: getHeaders()
    });
    return await response.json();
  },

  obter: async (id) => {
    const response = await fetch(`${API_URL}/recompensas/${id}`, {
      headers: getHeaders()
    });
    return await response.json();
  },

  resgatar: async (recompensaId, clienteId) => {
    const response = await fetch(`${API_URL}/recompensas/resgatar`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ recompensaId, clienteId })
    });
    return await response.json();
  },

  atualizar: async (id, dados) => {
    const response = await fetch(`${API_URL}/recompensas/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(dados)
    });
    return await response.json();
  },

  deletar: async (id) => {
    const response = await fetch(`${API_URL}/recompensas/${id}`, {
      method: 'DELETE',
      headers: getHeaders()
    });
    return await response.json();
  }
};

// GOOGLE WALLET
export const wallet = {
  gerarCartao: async (clienteId, programaId) => {
    const response = await fetch(`${API_URL}/wallet/gerar-cartao`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ clienteId, programaId })
    });
    return await response.json();
  },

  gerarLinkQRCode: async (codigo) => {
    const response = await fetch(`${API_URL}/wallet/link-qrcode/${codigo}`);
    return await response.json();
  }
};

// Health check
export const health = async () => {
  const response = await fetch(`${API_URL.replace('/api', '')}/api/health`);
  return await response.json();
};
