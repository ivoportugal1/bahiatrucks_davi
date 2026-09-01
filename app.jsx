import React, { useState, useEffect } from 'react';
import Landing from './landing';
import Dashboard from './dashboard-new';
import ValidarQR from './validar-qr';
import JoinProgram from './JoinProgram';
import EarnPoints from './EarnPoints';
import { auth } from './api';

export default function App() {
  const [currentPage, setCurrentPage] = useState('landing');
  const [usuario, setUsuario] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);
  const [codigoQR, setCodigoQR] = useState(null);

  // Verificar se está em rota /validar/:codigo, /join/:codigo ou /earn/:codigo
  useEffect(() => {
    const pathname = window.location.pathname;
    if (pathname.startsWith('/join/')) {
      const codigo = pathname.replace('/join/', '');
      if (codigo) {
        setCodigoQR(codigo);
        setCurrentPage('join');
        setCarregando(false);
        return;
      }
    }
    if (pathname.startsWith('/earn/')) {
      const codigo = pathname.replace('/earn/', '');
      if (codigo) {
        setCodigoQR(codigo);
        setCurrentPage('earn');
        setCarregando(false);
        return;
      }
    }
    if (pathname.startsWith('/validar/')) {
      const codigo = pathname.replace('/validar/', '');
      if (codigo) {
        setCodigoQR(codigo);
        setCurrentPage('validar');
        setCarregando(false);
        return;
      }
    }

    // Verificar se tem token ao carregar
    const verificarLogin = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const resultado = await auth.validar();
          if (resultado.empresa) {
            setUsuario(resultado.empresa);
            setCurrentPage('dashboard');
          } else {
            localStorage.removeItem('token');
          }
        } catch (err) {
          localStorage.removeItem('token');
        }
      }
      setCarregando(false);
    };
    verificarLogin();
  }, []);

  const handleLogin = async (email, senha) => {
    setErro(null);
    setCarregando(true);
    try {
      const resultado = await auth.login(email, senha);
      if (resultado.empresa) {
        setUsuario(resultado.empresa);
        setCurrentPage('dashboard');
      } else {
        setErro(resultado.erro || 'Erro ao fazer login');
      }
    } catch (err) {
      setErro('Erro ao conectar com o servidor');
    }
    setCarregando(false);
  };

  const handleRegistro = async (nome, email, senha, confirmacaoSenha) => {
    setErro(null);
    setCarregando(true);
    try {
      const resultado = await auth.registrar(nome, email, senha, confirmacaoSenha);
      if (resultado.empresa) {
        setUsuario(resultado.empresa);
        setCurrentPage('dashboard');
      } else {
        setErro(resultado.erro || 'Erro ao registrar');
      }
    } catch (err) {
      setErro('Erro ao conectar com o servidor');
    }
    setCarregando(false);
  };

  const handleLogout = () => {
    auth.logout();
    setUsuario(null);
    setCurrentPage('landing');
  };

  if (carregando) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        background: 'linear-gradient(to bottom right, rgb(15, 23, 42), rgb(26, 58, 50), rgb(15, 23, 42))',
        color: 'white',
        fontSize: '18px'
      }}>
        Carregando...
      </div>
    );
  }

  return (
    <>
      {currentPage === 'join' && codigoQR && (
        <JoinProgram
          codigoQR={codigoQR}
          onVoltar={() => {
            window.location.href = '/';
          }}
        />
      )}

      {currentPage === 'earn' && codigoQR && (
        <EarnPoints
          codigoQR={codigoQR}
          onVoltar={() => {
            window.location.href = '/';
          }}
        />
      )}

      {currentPage === 'validar' && codigoQR && (
        <ValidarQR
          codigoQR={codigoQR}
          onVoltar={() => {
            window.location.href = '/';
          }}
        />
      )}

      {currentPage === 'landing' && (
        <>
          <Landing
            onLogin={() => setCurrentPage('login')}
            onRegistro={() => setCurrentPage('registro')}
          />
          {usuario && (
            <div style={{position: 'fixed', bottom: '20px', right: '20px', zIndex: 999}}>
              <button
                onClick={() => setCurrentPage('dashboard')}
                style={{
                  padding: '10px 20px',
                  background: 'linear-gradient(to right, #5a9d7d, #4a8c6a)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '600',
                  boxShadow: '0 4px 12px rgba(90, 157, 125, 0.3)'
                }}
              >
                → Admin
              </button>
            </div>
          )}
        </>
      )}

      {currentPage === 'login' && (
        <LoginPage
          onLogin={handleLogin}
          onVoltar={() => setCurrentPage('landing')}
          onRegistro={() => setCurrentPage('registro')}
          erro={erro}
          carregando={carregando}
        />
      )}

      {currentPage === 'registro' && (
        <RegistroPage
          onRegistro={handleRegistro}
          onVoltar={() => setCurrentPage('landing')}
          onLogin={() => setCurrentPage('login')}
          erro={erro}
          carregando={carregando}
        />
      )}

      {currentPage === 'dashboard' && usuario && (
        <>
          <Dashboard usuario={usuario} />
          <div style={{position: 'fixed', bottom: '20px', right: '20px', zIndex: 999}}>
            <button
              onClick={handleLogout}
              style={{
                padding: '10px 20px',
                background: '#ef4444',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '600',
                boxShadow: '0 4px 12px rgba(239, 68, 68, 0.3)'
              }}
            >
              Logout
            </button>
          </div>
        </>
      )}
    </>
  );
}

// Página de Login
function LoginPage({ onLogin, onVoltar, onRegistro, erro, carregando }) {
  const [email, setEmail] = React.useState('');
  const [senha, setSenha] = React.useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onLogin(email, senha);
  };

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
        background: 'rgba(45, 90, 74, 0.3)',
        border: '1px solid rgba(90, 157, 125, 0.2)',
        borderRadius: '12px',
        padding: '40px',
        maxWidth: '400px',
        width: '100%'
      }}>
        <h2 style={{ textAlign: 'center', marginBottom: '30px', fontSize: '28px', fontWeight: 'bold' }}>Login</h2>

        {erro && (
          <div style={{
            background: 'rgba(239, 68, 68, 0.2)',
            border: '1px solid #ef4444',
            borderRadius: '8px',
            padding: '12px',
            marginBottom: '20px',
            color: '#fca5a5'
          }}>
            {erro}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px' }}>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu@email.com"
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
              required
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px' }}>Senha</label>
            <input
              type="password"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              placeholder="••••••••"
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
              required
            />
          </div>

          <button
            type="submit"
            disabled={carregando}
            style={{
              width: '100%',
              padding: '12px',
              background: 'linear-gradient(to right, #5a9d7d, #4a8c6a)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: carregando ? 'not-allowed' : 'pointer',
              opacity: carregando ? 0.6 : 1
            }}
          >
            {carregando ? 'Entrando...' : 'Entrar'}
          </button>
        </form>

        <div style={{ marginTop: '20px', textAlign: 'center' }}>
          <p style={{ marginBottom: '10px', color: '#d1d5db' }}>Não tem conta?</p>
          <button
            onClick={onRegistro}
            style={{
              background: 'transparent',
              border: '1px solid rgba(90, 157, 125, 0.5)',
              color: '#5a9d7d',
              padding: '10px 20px',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '600'
            }}
          >
            Cadastre-se aqui
          </button>
        </div>

        <button
          onClick={onVoltar}
          style={{
            width: '100%',
            marginTop: '20px',
            padding: '10px',
            background: 'transparent',
            border: 'none',
            color: '#5a9d7d',
            cursor: 'pointer',
            fontSize: '14px',
            textDecoration: 'underline'
          }}
        >
          ← Voltar
        </button>
      </div>
    </div>
  );
}

// Página de Registro
function RegistroPage({ onRegistro, onVoltar, onLogin, erro, carregando }) {
  const [nome, setNome] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [senha, setSenha] = React.useState('');
  const [confirmacao, setConfirmacao] = React.useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onRegistro(nome, email, senha, confirmacao);
  };

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
        background: 'rgba(45, 90, 74, 0.3)',
        border: '1px solid rgba(90, 157, 125, 0.2)',
        borderRadius: '12px',
        padding: '40px',
        maxWidth: '400px',
        width: '100%'
      }}>
        <h2 style={{ textAlign: 'center', marginBottom: '30px', fontSize: '28px', fontWeight: 'bold' }}>Cadastro</h2>

        {erro && (
          <div style={{
            background: 'rgba(239, 68, 68, 0.2)',
            border: '1px solid #ef4444',
            borderRadius: '8px',
            padding: '12px',
            marginBottom: '20px',
            color: '#fca5a5'
          }}>
            {erro}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px' }}>Nome da Empresa</label>
            <input
              type="text"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="Sua Empresa"
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
              required
            />
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px' }}>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu@email.com"
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
              required
            />
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px' }}>Senha</label>
            <input
              type="password"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              placeholder="••••••••"
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
              required
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px' }}>Confirmar Senha</label>
            <input
              type="password"
              value={confirmacao}
              onChange={(e) => setConfirmacao(e.target.value)}
              placeholder="••••••••"
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
              required
            />
          </div>

          <button
            type="submit"
            disabled={carregando}
            style={{
              width: '100%',
              padding: '12px',
              background: 'linear-gradient(to right, #5a9d7d, #4a8c6a)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: carregando ? 'not-allowed' : 'pointer',
              opacity: carregando ? 0.6 : 1
            }}
          >
            {carregando ? 'Cadastrando...' : 'Cadastrar'}
          </button>
        </form>

        <div style={{ marginTop: '20px', textAlign: 'center' }}>
          <p style={{ marginBottom: '10px', color: '#d1d5db' }}>Já tem conta?</p>
          <button
            onClick={onLogin}
            style={{
              background: 'transparent',
              border: '1px solid rgba(90, 157, 125, 0.5)',
              color: '#5a9d7d',
              padding: '10px 20px',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '600'
            }}
          >
            Faça login aqui
          </button>
        </div>

        <button
          onClick={onVoltar}
          style={{
            width: '100%',
            marginTop: '20px',
            padding: '10px',
            background: 'transparent',
            border: 'none',
            color: '#5a9d7d',
            cursor: 'pointer',
            fontSize: '14px',
            textDecoration: 'underline'
          }}
        >
          ← Voltar
        </button>
      </div>
    </div>
  );
}
