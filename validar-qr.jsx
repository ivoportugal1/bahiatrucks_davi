import React, { useState, useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';

export default function ValidarQR({ codigoQR, onVoltar }) {
  const [dados, setDados] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);

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
        <div style={{
          textAlign: 'center',
          fontSize: '18px'
        }}>
          Carregando...
        </div>
      </div>
    );
  }

  if (erro) {
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
          <div style={{
            fontSize: '48px'
          }}>
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

        {/* CTA */}
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
            background: 'linear-gradient(to right, #5a9d7d, #4a8c6a)',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '16px',
            fontWeight: '600',
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(90, 157, 125, 0.3)'
          }}
        >
          Compartilhar
        </button>
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
  );
}
