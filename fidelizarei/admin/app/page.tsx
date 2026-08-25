'use client';
import { useState } from 'react';

export default function Home() {
  const [programas, setProgramas] = useState([
    { id: 1, nome: 'Café da Semana', pontos: 7, recompensa: '1 café grátis' },
  ]);
  const [nome, setNome] = useState('');
  const [recompensa, setRecompensa] = useState('');
  const [pontos, setPontos] = useState('7');

  const criar = () => {
    if (!nome || !recompensa) return;
    setProgramas([...programas, { id: Date.now(), nome, pontos: parseInt(pontos), recompensa }]);
    setNome('');
    setRecompensa('');
    setPontos('7');
  };

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: 20, fontFamily: 'sans-serif' }}>
      <h1>🎫 Fidelizarei</h1>

      <div style={{ background: '#f0f0f0', padding: 20, borderRadius: 8, marginBottom: 20 }}>
        <h2>Novo Programa</h2>
        <div style={{ marginBottom: 10 }}>
          <label>Nome: </label>
          <input value={nome} onChange={(e) => setNome(e.target.value)} style={{ marginLeft: 10, padding: 8 }} />
        </div>
        <div style={{ marginBottom: 10 }}>
          <label>Pontos: </label>
          <input value={pontos} onChange={(e) => setPontos(e.target.value)} type="number" style={{ marginLeft: 10, padding: 8, width: 100 }} />
        </div>
        <div style={{ marginBottom: 10 }}>
          <label>Recompensa: </label>
          <input value={recompensa} onChange={(e) => setRecompensa(e.target.value)} style={{ marginLeft: 10, padding: 8 }} />
        </div>
        <button onClick={criar} style={{ padding: '10px 20px', background: '#2563eb', color: 'white', border: 'none', borderRadius: 4, cursor: 'pointer' }}>
          Criar Programa
        </button>
      </div>

      <h2>Programas ({programas.length})</h2>
      {programas.map((p) => (
        <div key={p.id} style={{ background: 'white', padding: 15, marginBottom: 10, borderRadius: 4, border: '1px solid #ddd' }}>
          <h3>{p.nome}</h3>
          <p>{p.pontos} pontos = {p.recompensa}</p>
          <button style={{ padding: '8px 16px', background: '#10b981', color: 'white', border: 'none', borderRadius: 4, cursor: 'pointer' }}>
            Gerar QR Codes
          </button>
        </div>
      ))}
    </div>
  );
}
