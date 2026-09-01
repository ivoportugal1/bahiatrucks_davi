import React, { useState, useEffect } from 'react';
import { ArrowLeft, Loader, Check, AlertCircle } from 'lucide-react';
import { qrCodes } from './api';

const styles = `
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;

export default function EarnPoints({ codigoQR, onVoltar }) {
  const [dados, setDados] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);
  const [processando, setProcessando] = useState(false);
  const [sucesso, setSucesso] = useState(false);
  const [pontoGanho, setPontoGanho] = useState(0);
  const [email, setEmail] = useState('');

  useEffect(() => {
    const carregarDados = async () => {
      try {
        const response = await fetch(
          `https://bahiatrucks-davi.onrender.com/api/qrcodes/validar/${codigoQR}`
        );
        const resultado = await response.json();

        if (response.ok) {
          setDados(resultado);
          setErro(null);
        } else {
          setErro(resultado.erro || 'QR Code não encontrado');
          setDados(null);
        }
      } catch (err) {
        setErro('Erro ao conectar com o servidor');
        setDados(null);
      } finally {
        setCarregando(false);
      }
    };

    if (codigoQR) {
      carregarDados();
    }
  }, [codigoQR]);

  const ganharPontos = async () => {
    if (!email) {
      setErro('Email é obrigatório');
      return;
    }

    setProcessando(true);
    try {
      const resultado = await qrCodes.earn(codigoQR, email);

      if (resultado.pontosGanhos) {
        setPontoGanho(resultado.pontosGanhos);
        setDados({
          programa: resultado.programa,
          cliente: resultado.cliente,
          membership: resultado.membership,
          status: 'utilizado'
        });
        setSucesso(true);
        setErro(null);
      } else {
        setErro(resultado.erro || 'Erro ao ganhar pontos');
      }
    } catch (err) {
      setErro('Erro ao ganhar pontos: ' + err.message);
    } finally {
      setProcessando(false);
    }
  };

  if (carregando) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-8 max-w-md w-full text-center">
          <style>{styles}</style>
          <div className="animate-spin" style={{ animation: 'spin 1s linear infinite' }}>
            <Loader size={40} className="text-[#5a9d7d] mx-auto" />
          </div>
          <p className="text-gray-600 mt-4">Validando QR Code...</p>
        </div>
      </div>
    );
  }

  if (erro && !sucesso) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-8 max-w-md w-full">
          <div className="flex gap-3 mb-4">
            <AlertCircle size={24} className="text-red-600 flex-shrink-0" />
            <h2 className="text-xl font-bold text-red-600">Erro</h2>
          </div>
          <p className="text-gray-700 mb-6">{erro}</p>
          <button
            onClick={onVoltar}
            className="w-full bg-[#5a9d7d] hover:bg-[#4a8c6a] text-white font-semibold py-2 px-4 rounded-lg transition"
          >
            Voltar
          </button>
        </div>
      </div>
    );
  }

  if (sucesso) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-8 max-w-md w-full text-center">
          <div className="mb-6">
            <Check size={48} className="text-green-600 mx-auto" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Pontos Ganhos!</h2>
          <div className="mb-6 p-6 bg-[#5a9d7d]/10 rounded-lg">
            <p className="text-5xl font-bold text-[#5a9d7d]">+{pontoGanho}</p>
            <p className="text-gray-600 mt-2">pontos</p>
          </div>
          <p className="text-sm text-gray-600 mb-2">
            Total: {dados?.membership?.pontosAtuais} pontos
          </p>
          <p className="text-sm text-gray-600 mb-6">
            Compras: {dados?.membership?.comprasRealizadas}
          </p>
          <button
            onClick={onVoltar}
            className="w-full bg-[#5a9d7d] hover:bg-[#4a8c6a] text-white font-semibold py-2 px-4 rounded-lg transition"
          >
            Fechar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-md w-full">
        <style>{styles}</style>

        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            {dados?.programa?.emoji} Ganhe Pontos
          </h2>
          <button
            onClick={onVoltar}
            className="text-gray-500 hover:text-gray-700"
          >
            <ArrowLeft size={24} />
          </button>
        </div>

        {/* Info */}
        <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-blue-800 font-semibold">Escaneado com sucesso!</p>
          <p className="text-blue-700 text-sm mt-2">
            {dados?.programa?.nome} - Esta compra vale pontos
          </p>
        </div>

        {/* Email Field */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Email (para identificar você)
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="seu@email.com"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5a9d7d]"
            required
          />
        </div>

        {/* Confirmação */}
        <div className="mb-6 space-y-4">
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600">Programa</p>
            <p className="text-lg font-semibold text-gray-800">
              {dados?.programa?.nome}
            </p>
          </div>

          <div className="p-4 bg-[#5a9d7d]/5 rounded-lg border border-[#5a9d7d]">
            <p className="text-sm text-gray-600">Pontos desta compra</p>
            <p className="text-3xl font-bold text-[#5a9d7d]">+10</p>
          </div>
        </div>

        {erro && (
          <div className="p-3 bg-red-100 border border-red-300 rounded-lg mb-4">
            <p className="text-red-700 text-sm">{erro}</p>
          </div>
        )}

        {/* Botões */}
        <div className="flex gap-3">
          <button
            onClick={ganharPontos}
            disabled={processando}
            className="flex-1 bg-[#5a9d7d] hover:bg-[#4a8c6a] text-white font-semibold py-2 px-4 rounded-lg transition disabled:opacity-50"
          >
            {processando ? (
              <span className="flex items-center justify-center gap-2">
                <Loader size={18} style={{ animation: 'spin 1s linear infinite' }} />
                Ganhando...
              </span>
            ) : (
              'Confirmar'
            )}
          </button>
          <button
            onClick={onVoltar}
            disabled={processando}
            className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded-lg transition disabled:opacity-50"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}
