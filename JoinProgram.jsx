import React, { useState, useEffect } from 'react';
import { ArrowLeft, Loader, Check } from 'lucide-react';
import { qrCodes } from './api';

const styles = `
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;

export default function JoinProgram({ codigoQR, onVoltar }) {
  const [dados, setDados] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);
  const [processando, setProcessando] = useState(false);
  const [sucesso, setSucesso] = useState(false);

  // Formulário
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [formularioVisivel, setFormularioVisivel] = useState(true);

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

  const aderir = async (e) => {
    e.preventDefault();
    if (!nome || !email) {
      setErro('Nome e email são obrigatórios');
      return;
    }

    setProcessando(true);
    try {
      const resultado = await qrCodes.join(codigoQR, nome, email);

      if (resultado.mensagem) {
        setDados({
          programa: resultado.programa,
          cliente: resultado.cliente,
          status: 'utilizado'
        });
        setSucesso(true);
        setFormularioVisivel(false);
        setErro(null);
      } else {
        setErro(resultado.erro || 'Erro ao aderir ao programa');
      }
    } catch (err) {
      setErro('Erro ao aderir: ' + err.message);
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
          <p className="text-gray-600 mt-4">Carregando programa...</p>
        </div>
      </div>
    );
  }

  if (erro && !sucesso) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-8 max-w-md w-full">
          <h2 className="text-xl font-bold text-red-600 mb-4">Erro</h2>
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
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Bem-vindo!</h2>
          <p className="text-gray-600 mb-2">
            {dados?.cliente?.nome}, você agora é membro de
          </p>
          <p className="text-2xl font-bold text-[#5a9d7d] mb-6">
            {dados?.programa?.emoji} {dados?.programa?.nome}
          </p>
          <p className="text-sm text-gray-500 mb-6">
            Agora você pode ganhar pontos a cada compra!
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
            {dados?.programa?.emoji} {dados?.programa?.nome}
          </h2>
          <button
            onClick={onVoltar}
            className="text-gray-500 hover:text-gray-700"
          >
            <ArrowLeft size={24} />
          </button>
        </div>

        {/* Descrição */}
        <div className="mb-6 p-4 bg-green-50 rounded-lg border border-green-200">
          <p className="text-green-800 font-semibold">Bem-vindo ao programa!</p>
          <p className="text-green-700 text-sm mt-2">{dados?.programa?.descricao}</p>
        </div>

        {/* Formulário */}
        {formularioVisivel && (
          <form onSubmit={aderir} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Nome
              </label>
              <input
                type="text"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                placeholder="Seu nome"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5a9d7d]"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Email
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

            {erro && (
              <div className="p-3 bg-red-100 border border-red-300 rounded-lg">
                <p className="text-red-700 text-sm">{erro}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={processando}
              className="w-full bg-[#5a9d7d] hover:bg-[#4a8c6a] text-white font-semibold py-2 px-4 rounded-lg transition disabled:opacity-50"
            >
              {processando ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader size={18} style={{ animation: 'spin 1s linear infinite' }} />
                  Processando...
                </span>
              ) : (
                'Aderir ao Programa'
              )}
            </button>

            <button
              type="button"
              onClick={onVoltar}
              className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded-lg transition"
            >
              Cancelar
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
