import React, { useState, useEffect } from 'react';
import { ArrowLeft, Loader, Check } from 'lucide-react';
import { wallet, qrCodes } from './api';

const styles = `
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;

export default function ValidarQR({ codigoQR, onVoltar }) {
  const [dados, setDados] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);
  const [adicionandoCartao, setAdicionandoCartao] = useState(false);
  const [ganhandoPontos, setGanhandoPontos] = useState(false);
  const [pontoGanho, setPontoGanho] = useState(false);

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

  const ganharPontos = async (e) => {
    e.preventDefault();
    setGanhandoPontos(true);
    try {
      const resultado = await qrCodes.escanearPublico(codigoQR, nome, email);
      if (resultado.cliente) {
        setDados({
          programa: resultado.programa,
          cliente: resultado.cliente,
          status: 'utilizado'
        });
        setPontoGanho(true);
        setFormularioVisivel(false);
        setErro(null);
      } else {
        setErro(resultado.erro || 'Erro ao ganhar pontos');
      }
    } catch (err) {
      setErro('Erro ao ganhar pontos: ' + err.message);
    } finally {
      setGanhandoPontos(false);
    }
  };

  const adicionarAoGoogleWallet = async () => {
    setAdicionandoCartao(true);
    try {
      const resultado = await wallet.gerarLinkQRCode(codigoQR);
      if (resultado.deepLink) {
        window.location.href = resultado.deepLink;
      } else {
        alert('Erro: ' + (resultado.erro || 'Não foi possível gerar o link'));
      }
    } catch (err) {
      alert('Erro ao adicionar ao Google Wallet: ' + err.message);
    } finally {
      setAdicionandoCartao(false);
    }
  };

  if (carregando) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        background: 'linear-gradient(to bottom right, rgb(15, 23, 42), rgb(26, 58, 50), rgb(15, 23, 42))',
        color: 'white',
        padding: '20px'
      }}>
        <div style={{ textAlign: 'center', fontSize: '18px' }}>
          Carregando...
        </div>
      </div>
    );
  }

  if (erro && !dados) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        background: 'linear-gradient(to bottom right, rgb(15, 23, 42), rgb(26, 58, 50), rgb(15, 23, 42))',
        color: 'white',
        padding: '20px'
      }}>
        <div style={{
          background: 'rgba(239, 68, 68, 0.2)',
          border: '1px solid #ef4444',
          borderRadius: '12px',
          padding: '30px 20px',
          maxWidth: '400px',
          width: '100%',
          textAlign: 'center',
          marginBottom: '30px'
        }}>
          <h2 style={{
            fontSize: '24px',
            fontWeight: 'bold',
            marginBottom: '10px'
          }}>
            Erro! ❌
          </h2>
          <p style={{
            color: '#fca5a5',
            marginBottom: '20px'
          }}>
            {erro}
          </p>
          <button
            onClick={onVoltar}
            style={{
              background: 'rgba(90, 157, 125, 0.5)',
              border: '1px solid #5a9d7d',
              color: '#5a9d7d',
              padding: '10px 20px',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '600'
            }}
          >
            ← Voltar
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <style>{styles}</style>
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        background: 'linear-gradient(to bottom right, rgb(15, 23, 42), rgb(26, 58, 50), rgb(15, 23, 42))',
        color: 'white',
        padding: '20px'
      }}>
        {/* Header */}
        <div style={{
          width: '100%',
          maxWidth: '400px',
          marginBottom: '30px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <button
            onClick={onVoltar}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#5a9d7d',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
              fontSize: '14px',
              fontWeight: '600'
            }}
          >
            <ArrowLeft size={20} />
            Voltar
          </button>
        </div>

        {/* Card Principal */}
        <div style={{
          background: 'rgba(45, 90, 74, 0.3)',
          border: '1px solid rgba(90, 157, 125, 0.2)',
          borderRadius: '16px',
          padding: '40px 20px',
          maxWidth: '400px',
          width: '100%',
          textAlign: 'center'
        }}>
          {/* Programa */}
          {dados?.programa && (
            <div style={{
              marginBottom: '30px',
              paddingBottom: '20px',
              borderBottom: '1px solid rgba(90, 157, 125, 0.2)'
            }}>
              <div style={{
                fontSize: '48px',
                marginBottom: '10px'
              }}>
                {dados.programa.emoji || '🎁'}
              </div>
              <h2 style={{
                fontSize: '24px',
                fontWeight: 'bold',
                marginBottom: '8px'
              }}>
                {dados.programa.nome}
              </h2>
              <p style={{
                color: '#9ca3af',
                fontSize: '14px'
              }}>
                {dados.programa.descricao}
              </p>
            </div>
          )}

          {/* Formulário */}
          {formularioVisivel && (
            <form onSubmit={ganharPontos} style={{ marginBottom: '30px' }}>
              <div style={{ marginBottom: '15px' }}>
                <label style={{
                  display: 'block',
                  marginBottom: '8px',
                  fontSize: '14px',
                  color: '#d1d5db',
                  textAlign: 'left'
                }}>
                  Seu Nome
                </label>
                <input
                  type="text"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  placeholder="João Silva"
                  required
                  style={{
                    width: '100%',
                    padding: '12px',
                    background: 'rgba(0, 0, 0, 0.3)',
                    border: '1px solid rgba(90, 157, 125, 0.2)',
                    borderRadius: '8px',
                    color: 'white',
                    fontSize: '14px',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{
                  display: 'block',
                  marginBottom: '8px',
                  fontSize: '14px',
                  color: '#d1d5db',
                  textAlign: 'left'
                }}>
                  Seu Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu@email.com"
                  required
                  style={{
                    width: '100%',
                    padding: '12px',
                    background: 'rgba(0, 0, 0, 0.3)',
                    border: '1px solid rgba(90, 157, 125, 0.2)',
                    borderRadius: '8px',
                    color: 'white',
                    fontSize: '14px',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <button
                type="submit"
                disabled={ganhandoPontos}
                style={{
                  width: '100%',
                  padding: '14px',
                  background: ganhandoPontos ? '#6b7280' : 'linear-gradient(to right, #5a9d7d, #4a8c6a)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '16px',
                  fontWeight: '600',
                  cursor: ganhandoPontos ? 'not-allowed' : 'pointer',
                  boxShadow: '0 4px 12px rgba(90, 157, 125, 0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px'
                }}
              >
                {ganhandoPontos ? (
                  <>
                    <Loader size={18} style={{ animation: 'spin 1s linear infinite' }} />
                    Ganhando Pontos...
                  </>
                ) : (
                  '🎉 Ganhar Pontos'
                )}
              </button>
            </form>
          )}

          {/* Resultado */}
          {!formularioVisivel && pontoGanho && (
            <>
              <div style={{
                background: 'rgba(34, 197, 94, 0.2)',
                border: '2px solid rgba(34, 197, 94, 0.5)',
                borderRadius: '12px',
                padding: '20px',
                marginBottom: '30px',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '48px', marginBottom: '10px' }}>
                  <Check size={48} color="#22c55e" />
                </div>
                <p style={{
                  fontSize: '18px',
                  fontWeight: '600',
                  color: '#86efac',
                  marginBottom: '5px'
                }}>
                  Pontos Ganhos! 🎉
                </p>
              </div>
            </>
          )}

          {/* Saldo de Pontos */}
          <div style={{
            background: 'rgba(90, 157, 125, 0.2)',
            border: '2px solid rgba(90, 157, 125, 0.4)',
            borderRadius: '12px',
            padding: '30px 20px',
            marginBottom: '30px'
          }}>
            <p style={{
              color: '#9ca3af',
              fontSize: '14px',
              marginBottom: '10px',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>
              Seus Pontos
            </p>
            <div style={{
              fontSize: '56px',
              fontWeight: 'bold',
              color: '#5a9d7d',
              marginBottom: '5px'
            }}>
              {dados?.cliente?.pontos || 0}
            </div>
            <p style={{
              color: '#6b7280',
              fontSize: '12px'
            }}>
              Pontos acumulados
            </p>
          </div>

          {/* Compras Realizadas */}
          <div style={{
            background: 'rgba(100, 116, 139, 0.2)',
            border: '1px solid rgba(100, 116, 139, 0.3)',
            borderRadius: '12px',
            padding: '20px',
            marginBottom: '30px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <div style={{ textAlign: 'left' }}>
              <p style={{
                color: '#9ca3af',
                fontSize: '12px',
                marginBottom: '5px'
              }}>
                Compras Realizadas
              </p>
              <div style={{
                fontSize: '28px',
                fontWeight: 'bold'
              }}>
                {dados?.cliente?.totalCompras || 0}
              </div>
            </div>
            <div style={{ fontSize: '48px' }}>
              🛍️
            </div>
          </div>

          {/* Cliente */}
          <div style={{
            background: 'rgba(45, 90, 74, 0.2)',
            borderRadius: '12px',
            padding: '20px',
            marginBottom: '30px',
            textAlign: 'left'
          }}>
            <p style={{
              color: '#9ca3af',
              fontSize: '12px',
              marginBottom: '8px',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>
              Cliente
            </p>
            <p style={{
              fontSize: '18px',
              fontWeight: '600',
              color: '#fff'
            }}>
              {dados?.cliente?.nome}
            </p>
          </div>

          {/* Status */}
          <div style={{
            background: dados?.status === 'disponivel' ? 'rgba(34, 197, 94, 0.2)' : 'rgba(107, 114, 128, 0.2)',
            border: `1px solid ${dados?.status === 'disponivel' ? '#22c55e' : '#6b7280'}`,
            borderRadius: '8px',
            padding: '12px',
            marginBottom: '30px'
          }}>
            <p style={{
              fontSize: '14px',
              color: dados?.status === 'disponivel' ? '#86efac' : '#d1d5db',
              fontWeight: '600'
            }}>
              Status: <span style={{ textTransform: 'uppercase' }}>
                {dados?.status === 'disponivel' ? '✅ Disponível' : '✓ Utilizado'}
              </span>
            </p>
          </div>

          {/* CTA - Google Wallet */}
          {!formularioVisivel && (
            <button
              onClick={adicionarAoGoogleWallet}
              disabled={adicionandoCartao}
              style={{
                width: '100%',
                padding: '14px',
                background: adicionandoCartao ? '#6b7280' : 'linear-gradient(to right, #5a9d7d, #4a8c6a)',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '16px',
                fontWeight: '600',
                cursor: adicionandoCartao ? 'not-allowed' : 'pointer',
                boxShadow: '0 4px 12px rgba(90, 157, 125, 0.3)',
                marginBottom: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
            >
              {adicionandoCartao ? (
                <>
                  <Loader size={18} style={{ animation: 'spin 1s linear infinite' }} />
                  Adicionando...
                </>
              ) : (
                '📱 Adicionar ao Google Wallet'
              )}
            </button>
          )}

          {/* CTA - Compartilhar */}
          {!formularioVisivel && (
            <button
              onClick={() => {
                if (window.navigator.share) {
                  window.navigator.share({
                    title: `${dados?.programa?.nome} - Meu Cartão de Pontos`,
                    text: `Tenho ${dados?.cliente?.pontos || 0} pontos!`,
                    url: window.location.href
                  });
                } else {
                  alert('Link: ' + window.location.href);
                }
              }}
              style={{
                width: '100%',
                padding: '14px',
                background: 'transparent',
                color: '#5a9d7d',
                border: '2px solid rgba(90, 157, 125, 0.3)',
                borderRadius: '8px',
                fontSize: '16px',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              Compartilhar
            </button>
          )}
        </div>

        {/* Rodapé */}
        <div style={{
          marginTop: '40px',
          textAlign: 'center',
          color: '#6b7280',
          fontSize: '12px',
          maxWidth: '400px'
        }}>
          <p>
            Fidelizarei - Programa de Lealdade Digital
          </p>
          <p style={{ marginTop: '5px' }}>
            QR Code: {codigoQR}
          </p>
        </div>
      </div>
    </>
  );
}
