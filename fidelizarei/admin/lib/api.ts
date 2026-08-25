import axios, { AxiosInstance } from 'axios';
import { useAuthStore } from './store';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export const api: AxiosInstance = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use((config) => {
  const state = useAuthStore.getState();
  const token = state.token || localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export async function signup(nome: string, email: string, password: string) {
  const response = await api.post('/api/auth/signup', { nome, email, password });
  return response.data;
}

export async function login(email: string, password: string) {
  const response = await api.post('/api/auth/login', { email, password });
  return response.data;
}

export async function criarPrograma(dados: {
  nome: string;
  descricao?: string;
  pontosParaRecompensa?: number;
  recompensa: string;
  validadeDias?: number;
}) {
  const response = await api.post('/api/programas', dados);
  return response.data;
}

export async function listarProgramas() {
  const response = await api.get('/api/programas');
  return response.data;
}

export async function atualizarPrograma(
  id: string,
  dados: Partial<{
    nome: string;
    descricao: string;
    pontosParaRecompensa: number;
    recompensa: string;
    ativo: boolean;
  }>
) {
  const response = await api.put(`/api/programas/${id}`, dados);
  return response.data;
}

export async function gerarQRCodes(programaId: string, quantidade: number) {
  const response = await api.post('/api/qrcodes/generate', { programaId, quantidade });
  return response.data;
}

export async function listarQRCodes(programaId: string) {
  const response = await api.get(`/api/qrcodes/programa/${programaId}`);
  return response.data;
}
