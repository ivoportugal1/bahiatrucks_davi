import React, { useState, useEffect } from 'react';
import { Menu, X, LogOut, Settings, BarChart3, Users, Gift, QrCode, Zap, TrendingUp, Download, Plus, Search, Eye, Edit2, Trash2, Home } from 'lucide-react';
import { programas as apiProgramas, clientes as apiClientes, qrCodes as apiQRCodes, recompensas as apiRecompensas } from './api';
import QRCodeModal from './QRCodeModal';

const moss = {
  bg: 'linear-gradient(to bottom right, rgb(15, 23, 42), rgb(26, 58, 50), rgb(15, 23, 42))',
  primary: '#5a9d7d',
  secondary: '#4a8c6a',
  accent: '#6aa88e',
  border: 'rgba(90, 157, 125, 0.2)',
};

export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activePage, setActivePage] = useState('resumo');

  const menuItems = [
    { id: 'resumo', label: 'Resumo', icon: Home },
    { id: 'clientes', label: 'Clientes', icon: Users },
    { id: 'programas', label: 'Programas', icon: Gift },
    { id: 'qr-codes', label: 'QR Codes', icon: QrCode },
    { id: 'recompensas', label: 'Recompensas', icon: Zap },
    { id: 'relatorios', label: 'Relatórios', icon: BarChart3 },
    { id: 'configuracoes', label: 'Configurações', icon: Settings },
  ];

  const renderContent = () => {
    switch(activePage) {
      case 'resumo': return <ResumoPage />;
      case 'clientes': return <ClientesPage />;
      case 'programas': return <ProgramasPage />;
      case 'qr-codes': return <QRCodesPage />;
      case 'recompensas': return <RecompensasPage />;
      case 'relatorios': return <RelatoriosPage />;
      case 'configuracoes': return <ConfiguracoesPage />;
      default: return <ResumoPage />;
    }
  };

  return (
    <div className="min-h-screen text-white flex" style={{background: moss.bg}}>
      {/* Sidebar - Hidden on mobile */}
      <aside className={`${sidebarOpen ? 'w-64' : 'w-20'} transition-all duration-300 flex flex-col hidden md:flex`} style={{backgroundColor: 'rgba(31, 63, 53, 0.8)', borderRight: `1px solid ${moss.border}`}}>
        <div className="p-6 flex items-center justify-between">
          {sidebarOpen && <div className="text-xl font-bold" style={{color: moss.primary}}>Fidelizarei</div>}
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 rounded hover:opacity-75">
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        <nav className="flex-1 px-4 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activePage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActivePage(item.id)}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg transition"
                style={{
                  backgroundColor: isActive ? `${moss.primary}20` : 'transparent',
                  borderColor: isActive ? moss.primary : 'transparent',
                  borderWidth: '1px',
                  color: isActive ? moss.primary : '#9ca3af',
                }}
              >
                <Icon size={20} />
                {sidebarOpen && <span>{item.label}</span>}
              </button>
            );
          })}
        </nav>

        {sidebarOpen && (
          <div className="p-4" style={{borderTop: `1px solid ${moss.border}`}}>
            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:opacity-75 text-gray-400" style={{color: '#9ca3af'}}>
              <LogOut size={20} />
              <span>Sair</span>
            </button>
          </div>
        )}
      </aside>

      {/* Mobile Menu - Visible on mobile only */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 md:hidden z-30" style={{backgroundColor: 'rgba(0, 0, 0, 0.5)'}} onClick={() => setMobileMenuOpen(false)}>
          <nav className="flex flex-col p-4 space-y-2 max-h-screen overflow-y-auto" style={{backgroundColor: 'rgba(31, 63, 53, 0.95)', borderRight: `1px solid ${moss.border}`}}>
            <div className="px-4 py-3 font-bold text-lg mb-2" style={{color: moss.primary}}>Fidelizarei</div>
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activePage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActivePage(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-lg transition"
                  style={{
                    backgroundColor: isActive ? `${moss.primary}20` : 'transparent',
                    borderColor: isActive ? moss.primary : 'transparent',
                    borderWidth: '1px',
                    color: isActive ? moss.primary : '#9ca3af',
                  }}
                >
                  <Icon size={20} />
                  <span>{item.label}</span>
                </button>
              );
            })}
            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:opacity-75 mt-4" style={{color: '#9ca3af', borderTop: `1px solid ${moss.border}`}}>
              <LogOut size={20} />
              <span>Sair</span>
            </button>
          </nav>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 overflow-auto w-full">
        {/* Top Bar */}
        <div className="px-4 md:px-8 py-4 flex justify-between items-center sticky top-0 z-40" style={{backgroundColor: 'rgba(15, 23, 42, 0.7)', borderBottom: `1px solid ${moss.border}`}}>
          <div className="flex items-center gap-2 md:gap-0">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded md:hidden mr-2"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            <h1 className="text-xl md:text-2xl font-bold capitalize">{activePage}</h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative hidden md:block">
              <Search size={18} className="absolute left-3 top-3 text-gray-500" />
              <input type="text" placeholder="Buscar..." className="rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none" style={{backgroundColor: 'rgba(45, 90, 74, 0.3)', border: `1px solid ${moss.border}`, color: 'white'}} />
            </div>
            <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-white" style={{background: `linear-gradient(to bottom right, ${moss.primary}, ${moss.secondary})`}}>
              C
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="p-4 md:p-8">
          {renderContent()}
        </div>
      </main>
    </div>
  );
}

// RESUMO PAGE
function ResumoPage() {
  const [dados, setDados] = useState({
    programas: 0,
    clientes: 0,
    qrcodes: 0,
    recompensas: 0
  });

  useEffect(() => {
    const carregarDados = async () => {
      try {
        const [prog, cli, qr, rec] = await Promise.all([
          apiProgramas.listar(),
          apiClientes.listar(),
          apiQRCodes.listar(),
          apiRecompensas.listar()
        ]);
        setDados({
          programas: prog.total || 0,
          clientes: cli.total || 0,
          qrcodes: qr.total || 0,
          recompensas: rec.total || 0
        });
      } catch (err) {
        console.error('Erro ao carregar dados:', err);
      }
    };
    carregarDados();
  }, []);

  return (
    <div className="space-y-8">
      {/* Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Total de Clientes', value: dados.clientes.toString(), icon: Users },
          { label: 'QRs Gerados', value: dados.qrcodes.toString(), icon: QrCode },
          { label: 'Programas Ativos', value: dados.programas.toString(), icon: Gift },
          { label: 'Recompensas', value: dados.recompensas.toString(), icon: Zap }
        ].map((metric, i) => {
          const Icon = metric.icon;
          return (
            <div key={i} className="rounded-xl p-6 transition" style={{backgroundColor: 'rgba(45, 90, 74, 0.3)', border: `1px solid ${moss.border}`}}>
              <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-4 text-white" style={{background: `linear-gradient(to bottom right, ${moss.primary}, ${moss.secondary})`}}>
                <Icon size={24} />
              </div>
              <div className="text-sm text-gray-400 mb-1">{metric.label}</div>
              <div className="text-3xl font-bold mb-2">{metric.value}</div>
            </div>
          );
        })}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Evolution Chart */}
        <div className="rounded-xl p-6" style={{backgroundColor: 'rgba(45, 90, 74, 0.3)', border: `1px solid ${moss.border}`}}>
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold">Evolução de Pontos</h3>
            <select className="rounded px-3 py-1 text-sm focus:outline-none" style={{backgroundColor: 'rgba(45, 90, 74, 0.5)', border: `1px solid ${moss.border}`, color: 'white'}}>
              <option>Últimos 30 dias</option>
              <option>Últimos 90 dias</option>
              <option>Últimos 6 meses</option>
            </select>
          </div>
          <div className="h-64 flex items-end justify-between gap-2">
            {[65, 72, 58, 81, 76, 88, 95, 82, 91, 87, 94, 89].map((h, i) => (
              <div
                key={i}
                className="flex-1 rounded-t-lg hover:opacity-80 transition"
                style={{height: `${h}%`, background: `linear-gradient(to top, ${moss.primary}, ${moss.accent})`}}
              ></div>
            ))}
          </div>
          <div className="flex justify-between text-xs text-gray-400 mt-4">
            <span>01/05</span>
            <span>31/05</span>
          </div>
        </div>

        {/* Distribution */}
        <div className="rounded-xl p-6" style={{backgroundColor: 'rgba(45, 90, 74, 0.3)', border: `1px solid ${moss.border}`}}>
          <h3 className="text-lg font-semibold mb-6">Distribuição de Pontos</h3>
          <div className="flex items-center justify-center h-64">
            <div className="relative w-40 h-40">
              <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
                <circle cx="50" cy="50" r="40" fill="none" stroke={moss.primary} strokeWidth="10" strokeDasharray="94.25 314" />
                <circle cx="50" cy="50" r="40" fill="none" stroke={moss.secondary} strokeWidth="10" strokeDasharray="62.8 314" strokeDashoffset="-94.25" />
                <circle cx="50" cy="50" r="40" fill="none" stroke={moss.accent} strokeWidth="10" strokeDasharray="47.1 314" strokeDashoffset="-157.05" />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-2xl font-bold">89k</div>
                  <div className="text-xs text-gray-400">total</div>
                </div>
              </div>
            </div>
          </div>
          <div className="space-y-2 text-sm mt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{backgroundColor: moss.primary}}></div>
                <span>Compras</span>
              </div>
              <span className="font-semibold">60%</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{backgroundColor: moss.secondary}}></div>
                <span>Bônus</span>
              </div>
              <span className="font-semibold">25%</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{backgroundColor: moss.accent}}></div>
                <span>Indicações</span>
              </div>
              <span className="font-semibold">15%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="rounded-xl p-6" style={{backgroundColor: 'rgba(45, 90, 74, 0.3)', border: `1px solid ${moss.border}`}}>
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold">Atividade Recente</h3>
          <button className="text-sm flex items-center gap-2" style={{color: moss.primary}}>
            Ver tudo <Eye size={16} />
          </button>
        </div>
        <div className="space-y-4">
          {[
            { name: 'Marina Costa', action: 'resgatou Café Grátis', time: '2 horas atrás', points: '+50' },
            { name: 'João Silva', action: 'ganhou ponto', time: '4 horas atrás', points: '+1' },
            { name: 'Pedro Almeida', action: 'resgatou Desconto 10%', time: '1 dia atrás', points: '+100' },
            { name: 'Ana Santos', action: 'ganhou ponto', time: '1 dia atrás', points: '+1' }
          ].map((activity, i) => (
            <div key={i} className="flex justify-between items-center p-4 rounded-lg transition" style={{backgroundColor: 'rgba(0, 0, 0, 0.3)'}}>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm text-white" style={{background: `linear-gradient(to bottom right, ${moss.primary}, ${moss.secondary})`}}>
                  {activity.name.split(' ')[0][0]}
                </div>
                <div>
                  <div className="font-semibold">{activity.name}</div>
                  <div className="text-xs text-gray-400">{activity.action}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs text-gray-400">{activity.time}</div>
                <div className="font-semibold" style={{color: moss.primary}}>{activity.points}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// CLIENTES PAGE
function ClientesPage() {
  const [lista, setLista] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [mostraForm, setMostraForm] = useState(false);
  const [form, setForm] = useState({
    nome: '',
    email: '',
    telefone: ''
  });

  useEffect(() => {
    carregarClientes();
  }, []);

  const carregarClientes = async () => {
    try {
      setCarregando(true);
      const resultado = await apiClientes.listar();
      setLista(resultado.clientes || []);
    } catch (err) {
      console.error('Erro ao carregar clientes:', err);
    }
    setCarregando(false);
  };

  const criarCliente = async (e) => {
    e.preventDefault();
    try {
      await apiClientes.criar(form.nome, form.email, form.telefone);
      setMostraForm(false);
      setForm({ nome: '', email: '', telefone: '' });
      await carregarClientes();
      alert('Cliente criado com sucesso!');
    } catch (err) {
      alert('Erro ao criar cliente: ' + err.message);
    }
  };

  const deletarCliente = async (id) => {
    if (confirm('Tem certeza que deseja deletar este cliente?')) {
      try {
        await apiClientes.deletar(id);
        await carregarClientes();
        alert('Cliente deletado com sucesso!');
      } catch (err) {
        alert('Erro ao deletar: ' + err.message);
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold mb-2">Seus Clientes</h2>
          <p className="text-gray-400">Total de {lista.length} clientes</p>
        </div>
        <button onClick={() => setMostraForm(!mostraForm)} className="px-6 py-2 rounded-lg font-semibold flex items-center gap-2 text-white" style={{background: `linear-gradient(to right, ${moss.primary}, ${moss.secondary})`}}>
          <Plus size={20} />
          Novo Cliente
        </button>
      </div>

      {mostraForm && (
        <form onSubmit={criarCliente} className="rounded-xl p-6" style={{backgroundColor: 'rgba(45, 90, 74, 0.3)', border: `1px solid ${moss.border}`}}>
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Nome do Cliente"
              value={form.nome}
              onChange={(e) => setForm({...form, nome: e.target.value})}
              required
              style={{width: '100%', padding: '10px', background: 'rgba(0,0,0,0.3)', border: `1px solid ${moss.border}`, borderRadius: '8px', color: 'white'}}
            />
            <input
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={(e) => setForm({...form, email: e.target.value})}
              required
              style={{width: '100%', padding: '10px', background: 'rgba(0,0,0,0.3)', border: `1px solid ${moss.border}`, borderRadius: '8px', color: 'white'}}
            />
            <input
              type="tel"
              placeholder="Telefone"
              value={form.telefone}
              onChange={(e) => setForm({...form, telefone: e.target.value})}
              style={{width: '100%', padding: '10px', background: 'rgba(0,0,0,0.3)', border: `1px solid ${moss.border}`, borderRadius: '8px', color: 'white'}}
            />
            <button type="submit" className="w-full py-2 rounded-lg font-semibold text-white" style={{background: `linear-gradient(to right, ${moss.primary}, ${moss.secondary})`}}>
              Criar Cliente
            </button>
            <button type="button" onClick={() => setMostraForm(false)} className="w-full py-2 rounded-lg font-semibold" style={{background: 'rgba(45, 90, 74, 0.5)', color: 'white'}}>
              Cancelar
            </button>
          </div>
        </form>
      )}

      {carregando ? (
        <div style={{textAlign: 'center', color: '#9ca3af'}}>Carregando...</div>
      ) : lista.length === 0 ? (
        <div style={{textAlign: 'center', color: '#9ca3af', padding: '40px 20px'}}>
          Nenhum cliente criado ainda. Clique em "Novo Cliente" para começar!
        </div>
      ) : (
        <div className="rounded-xl overflow-hidden" style={{backgroundColor: 'rgba(45, 90, 74, 0.3)', border: `1px solid ${moss.border}`}}>
          <table className="w-full">
            <thead style={{backgroundColor: 'rgba(0, 0, 0, 0.5)', borderBottom: `1px solid ${moss.border}`}}>
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold">Nome</th>
                <th className="px-6 py-4 text-left text-sm font-semibold">Pontos Totais</th>
                <th className="px-6 py-4 text-left text-sm font-semibold">Compras</th>
                <th className="px-6 py-4 text-left text-sm font-semibold">Última Compra</th>
                <th className="px-6 py-4 text-right text-sm font-semibold">Ações</th>
              </tr>
            </thead>
            <tbody>
              {lista.map((client) => (
                <tr key={client._id} style={{borderBottom: `1px solid ${moss.border}`}}>
                  <td className="px-6 py-4">{client.nome}</td>
                  <td className="px-6 py-4 font-semibold" style={{color: moss.primary}}>{client.totalPontos || 0}</td>
                  <td className="px-6 py-4">{client.totalCompras || 0}</td>
                  <td className="px-6 py-4 text-gray-400">{client.ultimaCompra ? new Date(client.ultimaCompra).toLocaleDateString('pt-BR') : '-'}</td>
                  <td className="px-6 py-4 text-right flex justify-end gap-2">
                    <button className="p-2 rounded transition" style={{color: moss.primary}}>
                      <Eye size={18} />
                    </button>
                    <button onClick={() => deletarCliente(client._id)} className="p-2 rounded transition" style={{color: '#ef4444'}}>
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// PROGRAMAS PAGE
function ProgramasPage() {
  const [lista, setLista] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [mostraForm, setMostraForm] = useState(false);
  const [form, setForm] = useState({
    nome: '',
    descricao: '',
    regraPrograma: '',
    comprasNecessarias: 7,
    recompensaPontos: 1,
    emoji: '☕'
  });

  useEffect(() => {
    carregarProgramas();
  }, []);

  const carregarProgramas = async () => {
    try {
      setCarregando(true);
      const resultado = await apiProgramas.listar();
      setLista(resultado.programas || []);
    } catch (err) {
      console.error('Erro ao carregar programas:', err);
    }
    setCarregando(false);
  };

  const criarPrograma = async (e) => {
    e.preventDefault();
    try {
      await apiProgramas.criar(
        form.nome,
        form.descricao,
        form.regraPrograma,
        form.comprasNecessarias,
        form.recompensaPontos,
        form.emoji
      );
      setMostraForm(false);
      setForm({
        nome: '',
        descricao: '',
        regraPrograma: '',
        comprasNecessarias: 7,
        recompensaPontos: 1,
        emoji: '☕'
      });
      await carregarProgramas();
      alert('Programa criado com sucesso!');
    } catch (err) {
      alert('Erro ao criar programa: ' + err.message);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold mb-2">Programas de Fidelidade</h2>
          <p className="text-gray-400">Gerencie seus programas e recompensas</p>
        </div>
        <button onClick={() => setMostraForm(!mostraForm)} className="px-6 py-2 rounded-lg font-semibold flex items-center gap-2 text-white" style={{background: `linear-gradient(to right, ${moss.primary}, ${moss.secondary})`}}>
          <Plus size={20} />
          Novo Programa
        </button>
      </div>

      {mostraForm && (
        <form onSubmit={criarPrograma} className="rounded-xl p-6" style={{backgroundColor: 'rgba(45, 90, 74, 0.3)', border: `1px solid ${moss.border}`}}>
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Nome"
              value={form.nome}
              onChange={(e) => setForm({...form, nome: e.target.value})}
              required
              style={{width: '100%', padding: '10px', background: 'rgba(0,0,0,0.3)', border: `1px solid ${moss.border}`, borderRadius: '8px', color: 'white'}}
            />
            <input
              type="text"
              placeholder="Regra (ex: A cada 7 compras, ganhe 1 café)"
              value={form.regraPrograma}
              onChange={(e) => setForm({...form, regraPrograma: e.target.value})}
              required
              style={{width: '100%', padding: '10px', background: 'rgba(0,0,0,0.3)', border: `1px solid ${moss.border}`, borderRadius: '8px', color: 'white'}}
            />
            <input
              type="number"
              placeholder="Compras necessárias"
              value={form.comprasNecessarias}
              onChange={(e) => setForm({...form, comprasNecessarias: parseInt(e.target.value)})}
              style={{width: '100%', padding: '10px', background: 'rgba(0,0,0,0.3)', border: `1px solid ${moss.border}`, borderRadius: '8px', color: 'white'}}
            />
            <button type="submit" className="w-full py-2 rounded-lg font-semibold text-white" style={{background: `linear-gradient(to right, ${moss.primary}, ${moss.secondary})`}}>
              Criar Programa
            </button>
            <button type="button" onClick={() => setMostraForm(false)} className="w-full py-2 rounded-lg font-semibold" style={{background: 'rgba(45, 90, 74, 0.5)', color: 'white'}}>
              Cancelar
            </button>
          </div>
        </form>
      )}

      {carregando ? (
        <div style={{textAlign: 'center', color: '#9ca3af'}}>Carregando...</div>
      ) : lista.length === 0 ? (
        <div style={{textAlign: 'center', color: '#9ca3af', padding: '40px 20px'}}>
          Nenhum programa criado ainda. Clique em "Novo Programa" para começar!
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {lista.map((program) => (
            <div key={program._id} className="rounded-xl p-6 transition" style={{backgroundColor: 'rgba(45, 90, 74, 0.3)', border: `1px solid ${moss.border}`}}>
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold">{program.emoji} {program.nome}</h3>
                  <p className="text-sm text-gray-400">{program.regraPrograma}</p>
                </div>
                <button className="p-2 rounded transition" style={{backgroundColor: 'rgba(45, 90, 74, 0.5)'}}>
                  <Edit2 size={18} />
                </button>
              </div>
              <div className="space-y-4">
                <div className="rounded-lg p-4" style={{backgroundColor: 'rgba(0, 0, 0, 0.3)'}}>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-400">Clientes Participantes</span>
                    <span className="font-semibold">{program.clientesParticipantes?.length || 0}</span>
                  </div>
                  <div className="w-full rounded-full h-2 overflow-hidden" style={{backgroundColor: 'rgba(45, 90, 74, 0.5)'}}>
                    <div style={{width: `${Math.min((program.clientesParticipantes?.length || 0) * 10, 100)}%`, background: `linear-gradient(to right, ${moss.primary}, ${moss.secondary})`, height: '100%'}}></div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <span className="inline-block text-xs px-3 py-1 rounded-full text-white" style={{backgroundColor: `${moss.primary}33`, color: moss.primary}}>{program.ativo ? 'Ativo' : 'Inativo'}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// QR CODES PAGE
function QRCodesPage() {
  const [lista, setLista] = useState([]);
  const [stats, setStats] = useState({ total: 0, utilizados: 0, disponiveis: 0 });
  const [carregando, setCarregando] = useState(true);
  const [mostraForm, setMostraForm] = useState(false);
  const [selectedQR, setSelectedQR] = useState(null);
  const [form, setForm] = useState({
    programaId: '',
    quantidade: 100
  });
  const [listaProgramas, setListaProgramas] = useState([]);

  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = async () => {
    try {
      setCarregando(true);
      const [qrResult, progResult, statsResult] = await Promise.all([
        apiQRCodes.listar(),
        apiProgramas.listar(),
        apiQRCodes.estatisticas()
      ]);
      setLista((qrResult.qrCodes || []).slice(0, 10));
      setListaProgramas(progResult.programas || []);
      setStats(statsResult);
    } catch (err) {
      console.error('Erro ao carregar:', err);
    }
    setCarregando(false);
  };

  const gerarLote = async (e) => {
    e.preventDefault();
    if (!form.programaId) {
      alert('Selecione um programa');
      return;
    }
    try {
      await apiQRCodes.gerarLote(form.programaId, form.quantidade);
      setMostraForm(false);
      setForm({ programaId: '', quantidade: 100 });
      await carregarDados();
      alert(`${form.quantidade} QR Codes gerados com sucesso!`);
    } catch (err) {
      alert('Erro ao gerar: ' + err.message);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold mb-2">QR Codes</h2>
          <p className="text-gray-400">Gere e gerencie seus QR Codes</p>
        </div>
        <button onClick={() => setMostraForm(!mostraForm)} className="px-6 py-2 rounded-lg font-semibold flex items-center gap-2 text-white" style={{background: `linear-gradient(to right, ${moss.primary}, ${moss.secondary})`}}>
          <Plus size={20} />
          Gerar Novos QR Codes
        </button>
      </div>

      {mostraForm && (
        <form onSubmit={gerarLote} className="rounded-xl p-6" style={{backgroundColor: 'rgba(45, 90, 74, 0.3)', border: `1px solid ${moss.border}`}}>
          <div className="space-y-4">
            <select
              value={form.programaId}
              onChange={(e) => setForm({...form, programaId: e.target.value})}
              required
              style={{width: '100%', padding: '10px', background: 'rgba(0,0,0,0.3)', border: `1px solid ${moss.border}`, borderRadius: '8px', color: 'white'}}
            >
              <option value="">Selecione um programa</option>
              {listaProgramas.map((p) => (
                <option key={p._id} value={p._id}>{p.nome}</option>
              ))}
            </select>
            <input
              type="number"
              placeholder="Quantidade"
              value={form.quantidade}
              onChange={(e) => setForm({...form, quantidade: parseInt(e.target.value)})}
              required
              min="1"
              style={{width: '100%', padding: '10px', background: 'rgba(0,0,0,0.3)', border: `1px solid ${moss.border}`, borderRadius: '8px', color: 'white'}}
            />
            <button type="submit" className="w-full py-2 rounded-lg font-semibold text-white" style={{background: `linear-gradient(to right, ${moss.primary}, ${moss.secondary})`}}>
              Gerar QR Codes
            </button>
            <button type="button" onClick={() => setMostraForm(false)} className="w-full py-2 rounded-lg font-semibold" style={{background: 'rgba(45, 90, 74, 0.5)', color: 'white'}}>
              Cancelar
            </button>
          </div>
        </form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { total: stats.total.toString(), label: 'Total de QR Codes Gerados' },
          { total: stats.utilizados.toString(), label: 'QR Codes Utilizados' },
          { total: stats.disponiveis.toString(), label: 'QR Codes Disponíveis' },
        ].map((stat, i) => (
          <div key={i} className="rounded-xl p-6 text-white" style={{background: `linear-gradient(to bottom right, ${moss.primary}, ${moss.secondary})`}}>
            <div className="text-3xl font-bold mb-2">{stat.total}</div>
            <div className="text-sm opacity-90">{stat.label}</div>
          </div>
        ))}
      </div>

      {carregando ? (
        <div style={{textAlign: 'center', color: '#9ca3af'}}>Carregando...</div>
      ) : (
        <div className="rounded-xl p-6" style={{backgroundColor: 'rgba(45, 90, 74, 0.3)', border: `1px solid ${moss.border}`}}>
          <h3 className="text-lg font-semibold mb-6">QR Codes Recentes ({stats.total} gerados)</h3>
          <div className="space-y-2">
            {lista.length === 0 ? (
              <div style={{textAlign: 'center', color: '#9ca3af', padding: '20px'}}>Nenhum QR Code gerado ainda</div>
            ) : (
              lista.map((qr, i) => (
                <div
                  key={i}
                  onClick={() => setSelectedQR(qr)}
                  className="flex justify-between items-center p-3 rounded text-sm cursor-pointer hover:bg-opacity-40 transition"
                  style={{backgroundColor: 'rgba(0, 0, 0, 0.2)'}}
                >
                  <span className="font-mono text-gray-300 truncate">{qr.codigo}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-xs" style={{color: qr.status === 'utilizado' ? moss.primary : '#9ca3af'}}>
                      {qr.status === 'utilizado' ? '✓ Utilizado' : '○ Disponível'}
                    </span>
                    <Eye size={16} style={{color: moss.primary}} />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {selectedQR && (
        <QRCodeModal
          qrCode={selectedQR}
          onClose={() => setSelectedQR(null)}
        />
      )}
    </div>
  );
}

// RECOMPENSAS PAGE
function RecompensasPage() {
  const [lista, setLista] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [mostraForm, setMostraForm] = useState(false);
  const [form, setForm] = useState({
    programaId: '',
    nome: '',
    descricao: '',
    pontosNecessarios: 7,
    quantidade: 50,
    emoji: '☕'
  });
  const [listaProgramas, setListaProgramas] = useState([]);

  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = async () => {
    try {
      setCarregando(true);
      const [recompResult, progResult] = await Promise.all([
        apiRecompensas.listar(),
        apiProgramas.listar()
      ]);
      setLista(recompResult.recompensas || []);
      setListaProgramas(progResult.programas || []);
    } catch (err) {
      console.error('Erro ao carregar:', err);
    }
    setCarregando(false);
  };

  const criarRecompensa = async (e) => {
    e.preventDefault();
    if (!form.programaId) {
      alert('Selecione um programa');
      return;
    }
    try {
      await apiRecompensas.criar(
        form.programaId,
        form.nome,
        form.descricao,
        form.pontosNecessarios,
        form.quantidade,
        form.emoji
      );
      setMostraForm(false);
      setForm({
        programaId: '',
        nome: '',
        descricao: '',
        pontosNecessarios: 7,
        quantidade: 50,
        emoji: '☕'
      });
      await carregarDados();
      alert('Recompensa criada com sucesso!');
    } catch (err) {
      alert('Erro ao criar: ' + err.message);
    }
  };

  const deletarRecompensa = async (id) => {
    if (confirm('Tem certeza que deseja deletar esta recompensa?')) {
      try {
        await apiRecompensas.deletar(id);
        await carregarDados();
        alert('Recompensa deletada com sucesso!');
      } catch (err) {
        alert('Erro ao deletar: ' + err.message);
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold mb-2">Recompensas</h2>
          <p className="text-gray-400">Crie e gerencie as recompensas dos clientes</p>
        </div>
        <button onClick={() => setMostraForm(!mostraForm)} className="px-6 py-2 rounded-lg font-semibold flex items-center gap-2 text-white" style={{background: `linear-gradient(to right, ${moss.primary}, ${moss.secondary})`}}>
          <Plus size={20} />
          Nova Recompensa
        </button>
      </div>

      {mostraForm && (
        <form onSubmit={criarRecompensa} className="rounded-xl p-6" style={{backgroundColor: 'rgba(45, 90, 74, 0.3)', border: `1px solid ${moss.border}`}}>
          <div className="space-y-4">
            <select
              value={form.programaId}
              onChange={(e) => setForm({...form, programaId: e.target.value})}
              required
              style={{width: '100%', padding: '10px', background: 'rgba(0,0,0,0.3)', border: `1px solid ${moss.border}`, borderRadius: '8px', color: 'white'}}
            >
              <option value="">Selecione um programa</option>
              {listaProgramas.map((p) => (
                <option key={p._id} value={p._id}>{p.nome}</option>
              ))}
            </select>
            <input
              type="text"
              placeholder="Nome da Recompensa"
              value={form.nome}
              onChange={(e) => setForm({...form, nome: e.target.value})}
              required
              style={{width: '100%', padding: '10px', background: 'rgba(0,0,0,0.3)', border: `1px solid ${moss.border}`, borderRadius: '8px', color: 'white'}}
            />
            <input
              type="text"
              placeholder="Descrição"
              value={form.descricao}
              onChange={(e) => setForm({...form, descricao: e.target.value})}
              style={{width: '100%', padding: '10px', background: 'rgba(0,0,0,0.3)', border: `1px solid ${moss.border}`, borderRadius: '8px', color: 'white'}}
            />
            <input
              type="number"
              placeholder="Pontos Necessários"
              value={form.pontosNecessarios}
              onChange={(e) => setForm({...form, pontosNecessarios: parseInt(e.target.value)})}
              required
              min="1"
              style={{width: '100%', padding: '10px', background: 'rgba(0,0,0,0.3)', border: `1px solid ${moss.border}`, borderRadius: '8px', color: 'white'}}
            />
            <input
              type="number"
              placeholder="Quantidade"
              value={form.quantidade}
              onChange={(e) => setForm({...form, quantidade: parseInt(e.target.value)})}
              required
              min="1"
              style={{width: '100%', padding: '10px', background: 'rgba(0,0,0,0.3)', border: `1px solid ${moss.border}`, borderRadius: '8px', color: 'white'}}
            />
            <input
              type="text"
              placeholder="Emoji"
              value={form.emoji}
              onChange={(e) => setForm({...form, emoji: e.target.value})}
              style={{width: '100%', padding: '10px', background: 'rgba(0,0,0,0.3)', border: `1px solid ${moss.border}`, borderRadius: '8px', color: 'white'}}
            />
            <button type="submit" className="w-full py-2 rounded-lg font-semibold text-white" style={{background: `linear-gradient(to right, ${moss.primary}, ${moss.secondary})`}}>
              Criar Recompensa
            </button>
            <button type="button" onClick={() => setMostraForm(false)} className="w-full py-2 rounded-lg font-semibold" style={{background: 'rgba(45, 90, 74, 0.5)', color: 'white'}}>
              Cancelar
            </button>
          </div>
        </form>
      )}

      {carregando ? (
        <div style={{textAlign: 'center', color: '#9ca3af'}}>Carregando...</div>
      ) : lista.length === 0 ? (
        <div style={{textAlign: 'center', color: '#9ca3af', padding: '40px 20px'}}>
          Nenhuma recompensa criada ainda. Clique em "Nova Recompensa" para começar!
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {lista.map((reward) => (
            <div key={reward._id} className="rounded-xl p-6 transition" style={{backgroundColor: 'rgba(45, 90, 74, 0.3)', border: `1px solid ${moss.border}`}}>
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="text-3xl">{reward.emoji}</div>
                  <div>
                    <h3 className="text-lg font-semibold">{reward.nome}</h3>
                    <p className="text-sm text-gray-400">{reward.pontosNecessarios} pontos</p>
                  </div>
                </div>
                <button onClick={() => deletarRecompensa(reward._id)} className="p-2 rounded transition" style={{backgroundColor: 'rgba(45, 90, 74, 0.5)', color: '#ef4444'}}>
                  <Trash2 size={18} />
                </button>
              </div>
              <div className="rounded-lg p-4" style={{backgroundColor: 'rgba(0, 0, 0, 0.3)'}}>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-400">Resgatadas</span>
                  <span className="font-bold" style={{color: moss.primary}}>{reward.quantidadeUtilizada || 0}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// RELATORIOS PAGE
function RelatoriosPage() {
  const [dados, setDados] = useState({
    totalClientes: 0,
    totalProgramas: 0,
    totalQRCodes: 0,
    qrCodesUtilizados: 0,
    totalRecompensas: 0,
    recompensasResgatadas: 0
  });
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    carregarDadosRelatorio();
  }, []);

  const carregarDadosRelatorio = async () => {
    try {
      setCarregando(true);
      const [clientes, programas, qrcodes, recompensas] = await Promise.all([
        apiClientes.listar(),
        apiProgramas.listar(),
        apiQRCodes.listar(),
        apiRecompensas.listar()
      ]);

      const qrUtilizados = (qrcodes.qrCodes || []).filter(qr => qr.status === 'utilizado').length;
      const recompResgatadas = (recompensas.recompensas || []).reduce((sum, r) => sum + (r.quantidadeUtilizada || 0), 0);

      setDados({
        totalClientes: clientes.clientes?.length || 0,
        totalProgramas: programas.programas?.length || 0,
        totalQRCodes: qrcodes.qrCodes?.length || 0,
        qrCodesUtilizados: qrUtilizados,
        totalRecompensas: recompensas.recompensas?.length || 0,
        recompensasResgatadas: recompResgatadas
      });
    } catch (err) {
      console.error('Erro ao carregar relatório:', err);
    }
    setCarregando(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold mb-2">Relatórios</h2>
          <p className="text-gray-400">Analise dados e métricas</p>
        </div>
      </div>

      {carregando ? (
        <div style={{textAlign: 'center', color: '#9ca3af'}}>Carregando relatório...</div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { label: 'Total de Clientes', value: dados.totalClientes },
              { label: 'Programas Ativos', value: dados.totalProgramas },
              { label: 'QR Codes Gerados', value: dados.totalQRCodes },
              { label: 'QR Codes Utilizados', value: dados.qrCodesUtilizados },
              { label: 'Recompensas Criadas', value: dados.totalRecompensas },
              { label: 'Recompensas Resgatadas', value: dados.recompensasResgatadas },
            ].map((stat, i) => (
              <div key={i} className="rounded-xl p-6 text-white" style={{background: `linear-gradient(to bottom right, ${moss.primary}, ${moss.secondary})`}}>
                <div className="text-3xl font-bold mb-2">{stat.value}</div>
                <div className="text-sm opacity-90">{stat.label}</div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="rounded-xl p-6" style={{backgroundColor: 'rgba(45, 90, 74, 0.3)', border: `1px solid ${moss.border}`}}>
              <h3 className="text-lg font-semibold mb-4">Taxa de Utilização de QR Codes</h3>
              <div className="text-center">
                <div className="text-4xl font-bold" style={{color: moss.primary}}>
                  {dados.totalQRCodes > 0 ? Math.round((dados.qrCodesUtilizados / dados.totalQRCodes) * 100) : 0}%
                </div>
                <p className="text-gray-400 mt-2">{dados.qrCodesUtilizados} de {dados.totalQRCodes} utilizados</p>
              </div>
            </div>

            <div className="rounded-xl p-6" style={{backgroundColor: 'rgba(45, 90, 74, 0.3)', border: `1px solid ${moss.border}`}}>
              <h3 className="text-lg font-semibold mb-4">Resumo Rápido</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Clientes Ativos</span>
                  <span className="font-semibold">{dados.totalClientes}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">QR Codes Disponíveis</span>
                  <span className="font-semibold">{dados.totalQRCodes - dados.qrCodesUtilizados}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Recompensas Resgatadas</span>
                  <span className="font-semibold">{dados.recompensasResgatadas}</span>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

// CONFIGURACOES PAGE
function ConfiguracoesPage() {
  return (
    <div className="space-y-8 max-w-2xl">
      <div>
        <h2 className="text-xl font-semibold mb-6">Configurações da Empresa</h2>

        <div className="space-y-6">
          <div className="rounded-xl p-6" style={{backgroundColor: 'rgba(45, 90, 74, 0.3)', border: `1px solid ${moss.border}`}}>
            <h3 className="text-lg font-semibold mb-4">Informações Básicas</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-2">Nome da Empresa</label>
                <input type="text" defaultValue="Café do João" className="w-full rounded-lg px-4 py-2 focus:outline-none" style={{backgroundColor: 'rgba(0, 0, 0, 0.3)', border: `1px solid ${moss.border}`, color: 'white', focusBorderColor: moss.primary}} />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">Email</label>
                <input type="email" defaultValue="contato@cafejoao.com" className="w-full rounded-lg px-4 py-2 focus:outline-none" style={{backgroundColor: 'rgba(0, 0, 0, 0.3)', border: `1px solid ${moss.border}`, color: 'white'}} />
              </div>
            </div>
          </div>

          <div className="rounded-xl p-6" style={{backgroundColor: 'rgba(45, 90, 74, 0.3)', border: `1px solid ${moss.border}`}}>
            <h3 className="text-lg font-semibold mb-4">Paleta de Cores</h3>
            <div className="flex gap-4">
              {['#2d5a4a', '#3d7a5a', '#5a9d7d', '#6aa88e', '#8fbfa8'].map((color) => (
                <button key={color} className="w-12 h-12 rounded-lg transition hover:scale-110" style={{backgroundColor: color, border: `2px solid ${moss.primary}`}}></button>
              ))}
            </div>
          </div>

          <div className="rounded-xl p-6" style={{backgroundColor: 'rgba(45, 90, 74, 0.3)', border: `1px solid ${moss.border}`}}>
            <h3 className="text-lg font-semibold mb-4">Plano Atual</h3>
            <div className="rounded-lg p-4" style={{backgroundColor: 'rgba(0, 0, 0, 0.3)'}}>
              <div className="flex justify-between items-center">
                <div>
                  <div className="font-semibold">Plano Pro</div>
                  <div className="text-sm text-gray-400">R$ 79,90/mês</div>
                </div>
                <button className="text-sm" style={{color: moss.primary}}>Gerenciar Plano</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
