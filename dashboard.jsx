import React, { useState } from 'react';
import { Menu, X, LogOut, Settings, BarChart3, Users, Gift, QrCode, Zap, TrendingUp, Download, Plus, Search, Eye, Edit2, Trash2, Home } from 'lucide-react';

const mossColors = {
  primary: '#5a9d7d',
  secondary: '#4a8c6a',
  accent: '#6aa88e',
  dark: '#2d5a4a',
  darker: '#1f3f35',
  border: 'rgba(90, 157, 125, 0.2)',
  borderHover: 'rgba(90, 157, 125, 0.5)',
  bg: 'linear-gradient(to bottom right, rgb(15, 23, 42), rgb(26, 58, 50), rgb(15, 23, 42))',
};

export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activePage, setActivePage] = useState('resumo');
  const [selectedReward, setSelectedReward] = useState(null);

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
      case 'resumo':
        return <ResumoPage />;
      case 'clientes':
        return <ClientesPage />;
      case 'programas':
        return <ProgramasPage />;
      case 'qr-codes':
        return <QRCodesPage />;
      case 'recompensas':
        return <RecompensasPage />;
      case 'relatorios':
        return <RelatoriosPage />;
      case 'configuracoes':
        return <ConfiguracoesPage />;
      default:
        return <ResumoPage />;
    }
  };

  return (
    <div className="min-h-screen text-white flex" style={{background: mossColors.bg}}>
      {/* Sidebar */}
      <aside className={`${sidebarOpen ? 'w-64' : 'w-20'} transition-all duration-300 flex flex-col`} style={{backgroundColor: 'rgba(31, 63, 53, 0.8)', borderRightColor: mossColors.border, borderRightWidth: '1px'}}>
        <div className="p-6 flex items-center justify-between">
          {sidebarOpen && <div className="text-xl font-bold text-moss-400" style={{color: mossColors.primary">Fidelizarei</div>}
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="hover:bg-slate-800 p-2 rounded">
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        <nav className="flex-1 px-4 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setActivePage(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                  activePage === item.id
                    ? 'bg-emerald-500/20 border border-emerald-500/50 text-emerald-300'
                    : 'hover:bg-slate-800/50 text-gray-400 hover:text-white'
                }`}
              >
                <Icon size={20} />
                {sidebarOpen && <span>{item.label}</span>}
              </button>
            );
          })}
        </nav>

        {sidebarOpen && (
          <div className="p-4 border-t border-emerald-500/20">
            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-800/50 text-gray-400 hover:text-red-400 transition">
              <LogOut size={20} />
              <span>Sair</span>
            </button>
          </div>
        )}
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        {/* Top Bar */}
        <div className="bg-slate-900/50 border-b border-emerald-500/20 px-8 py-4 flex justify-between items-center sticky top-0 z-40">
          <h1 className="text-2xl font-bold capitalize">{activePage}</h1>
          <div className="flex items-center gap-4">
            <div className="relative hidden md:block">
              <Search size={18} className="absolute left-3 top-3 text-gray-500" />
              <input type="text" placeholder="Buscar..." className="bg-slate-800/50 border border-emerald-500/20 rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-emerald-500/50" />
            </div>
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center font-bold">
              C
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="p-8">
          {renderContent()}
        </div>
      </main>
    </div>
  );
}

// RESUMO PAGE
function ResumoPage() {
  return (
    <div className="space-y-8">
      {/* Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Clientes Ativos', value: '2.847', change: '+12%', icon: Users, color: 'from-emerald-500' },
          { label: 'QRs Escaneados', value: '14.293', change: '+8%', icon: QrCode, color: 'from-teal-500' },
          { label: 'Pontos Emitidos', value: '89.234', change: '+23%', icon: Zap, color: 'from-cyan-500' },
          { label: 'Taxa de Retorno', value: '67%', change: '+5%', icon: TrendingUp, color: 'from-emerald-400' }
        ].map((metric, i) => {
          const Icon = metric.icon;
          return (
            <div key={i} className="bg-slate-800/50 border border-emerald-500/20 rounded-xl p-6 hover:border-emerald-500/50 transition">
              <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${metric.color} to-emerald-600 flex items-center justify-center mb-4`}>
                <Icon size={24} />
              </div>
              <div className="text-sm text-gray-400 mb-1">{metric.label}</div>
              <div className="text-3xl font-bold mb-2">{metric.value}</div>
              <div className="text-xs text-moss-400" style={{color: mossColors.primary">{metric.change} vs mês anterior</div>
            </div>
          );
        })}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Evolution Chart */}
        <div className="bg-slate-800/50 border border-emerald-500/20 rounded-xl p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold">Evolução de Pontos</h3>
            <select className="bg-slate-700/50 border border-emerald-500/20 rounded px-3 py-1 text-sm focus:outline-none">
              <option>Últimos 30 dias</option>
              <option>Últimos 90 dias</option>
              <option>Últimos 6 meses</option>
            </select>
          </div>
          <div className="h-64 flex items-end justify-between gap-2">
            {[65, 72, 58, 81, 76, 88, 95, 82, 91, 87, 94, 89].map((h, i) => (
              <div
                key={i}
                className="flex-1 rounded-t-lg bg-gradient-to-t from-emerald-500 to-emerald-400 hover:from-emerald-600 hover:to-emerald-500 transition"
                style={{height: `${h}%`}}
              ></div>
            ))}
          </div>
          <div className="flex justify-between text-xs text-gray-400 mt-4">
            <span>01/05</span>
            <span>31/05</span>
          </div>
        </div>

        {/* Distribution */}
        <div className="bg-slate-800/50 border border-emerald-500/20 rounded-xl p-6">
          <h3 className="text-lg font-semibold mb-6">Distribuição de Pontos</h3>
          <div className="flex items-center justify-center h-64">
            <div className="relative w-40 h-40">
              <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
                <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" strokeWidth="10" strokeDasharray="94.25 314" className="text-emerald-500" />
                <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" strokeWidth="10" strokeDasharray="62.8 314" strokeDashoffset="-94.25" className="text-teal-500" />
                <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" strokeWidth="10" strokeDasharray="47.1 314" strokeDashoffset="-157.05" className="text-cyan-500" />
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
                <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                <span>Compras</span>
              </div>
              <span className="font-semibold">60%</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-teal-500"></div>
                <span>Bônus</span>
              </div>
              <span className="font-semibold">25%</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-cyan-500"></div>
                <span>Indicações</span>
              </div>
              <span className="font-semibold">15%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-slate-800/50 border border-emerald-500/20 rounded-xl p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold">Atividade Recente</h3>
          <button className="text-moss-400" style={{color: mossColors.primary hover:text-emerald-300 text-sm flex items-center gap-2">
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
            <div key={i} className="flex justify-between items-center p-4 bg-black/30 rounded-lg hover:bg-black/50 transition">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center font-bold text-sm">
                  {activity.name.split(' ')[0][0]}
                </div>
                <div>
                  <div className="font-semibold">{activity.name}</div>
                  <div className="text-xs text-gray-400">{activity.action}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs text-gray-400">{activity.time}</div>
                <div className="font-semibold text-moss-400" style={{color: mossColors.primary">{activity.points}</div>
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
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold mb-2">Seus Clientes</h2>
          <p className="text-gray-400">Total de 2.847 clientes ativos</p>
        </div>
        <button className="bg-gradient-to-r from-emerald-500 to-teal-600 px-6 py-2 rounded-lg font-semibold flex items-center gap-2 hover:from-emerald-600 hover:to-teal-700">
          <Plus size={20} />
          Importar Clientes
        </button>
      </div>

      <div className="bg-slate-800/50 border border-emerald-500/20 rounded-xl overflow-hidden">
        <table className="w-full">
          <thead className="bg-black/50 border-b border-emerald-500/20">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold">Nome</th>
              <th className="px-6 py-4 text-left text-sm font-semibold">Pontos</th>
              <th className="px-6 py-4 text-left text-sm font-semibold">Compras</th>
              <th className="px-6 py-4 text-left text-sm font-semibold">Última Compra</th>
              <th className="px-6 py-4 text-right text-sm font-semibold">Ações</th>
            </tr>
          </thead>
          <tbody>
            {[
              { name: 'Marina Costa', points: 850, purchases: 34, lastPurchase: '2 horas' },
              { name: 'João Silva', points: 720, purchases: 28, lastPurchase: '1 dia' },
              { name: 'Pedro Almeida', points: 650, purchases: 26, lastPurchase: '3 dias' },
              { name: 'Ana Santos', points: 920, purchases: 37, lastPurchase: '5 horas' },
            ].map((client, i) => (
              <tr key={i} className="border-b border-emerald-500/10 hover:bg-black/30 transition">
                <td className="px-6 py-4">{client.name}</td>
                <td className="px-6 py-4 font-semibold text-moss-400" style={{color: mossColors.primary">{client.points}</td>
                <td className="px-6 py-4">{client.purchases}</td>
                <td className="px-6 py-4 text-gray-400">{client.lastPurchase}</td>
                <td className="px-6 py-4 text-right flex justify-end gap-2">
                  <button className="hover:bg-emerald-500/20 p-2 rounded transition">
                    <Eye size={18} />
                  </button>
                  <button className="hover:bg-red-500/20 p-2 rounded transition">
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// PROGRAMAS PAGE
function ProgramasPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold mb-2">Programas de Fidelidade</h2>
          <p className="text-gray-400">Gerencie seus programas e recompensas</p>
        </div>
        <button className="bg-gradient-to-r from-emerald-500 to-teal-600 px-6 py-2 rounded-lg font-semibold flex items-center gap-2 hover:from-emerald-600 hover:to-teal-700">
          <Plus size={20} />
          Novo Programa
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[
          { name: 'Café Grátis', desc: 'A cada 7 compras, ganhe 1 café', members: 2847, status: 'Ativo', progress: 85 },
          { name: 'Desconto 10%', desc: 'Ganhe 10% de desconto na compra', members: 1924, status: 'Ativo', progress: 60 },
        ].map((program, i) => (
          <div key={i} className="bg-slate-800/50 border border-emerald-500/20 rounded-xl p-6 hover:border-emerald-500/50 transition">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold">{program.name}</h3>
                <p className="text-sm text-gray-400">{program.desc}</p>
              </div>
              <button className="hover:bg-slate-700/50 p-2 rounded transition">
                <Edit2 size={18} />
              </button>
            </div>
            <div className="space-y-4">
              <div className="bg-black/30 rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-400">Clientes Participantes</span>
                  <span className="font-semibold">{program.members.toLocaleString()}</span>
                </div>
                <div className="w-full bg-slate-700 rounded-full h-2 overflow-hidden">
                  <div className="bg-gradient-to-r from-emerald-500 to-teal-500 h-full" style={{width: `${program.progress}%`}}></div>
                </div>
              </div>
              <div className="flex gap-2">
                <span className="inline-block bg-emerald-500/20 text-emerald-300 text-xs px-3 py-1 rounded-full">{program.status}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// QR CODES PAGE
function QRCodesPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold mb-2">QR Codes</h2>
          <p className="text-gray-400">Gere e gerencie seus QR Codes</p>
        </div>
        <button className="bg-gradient-to-r from-emerald-500 to-teal-600 px-6 py-2 rounded-lg font-semibold flex items-center gap-2 hover:from-emerald-600 hover:to-teal-700">
          <Plus size={20} />
          Gerar Novos QR Codes
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { total: '14.293', label: 'Total de QR Codes Gerados', color: 'from-emerald-500' },
          { total: '12.847', label: 'QR Codes Utilizados', color: 'from-teal-500' },
          { total: '1.446', label: 'QR Codes Disponíveis', color: 'from-cyan-500' },
        ].map((stat, i) => (
          <div key={i} className={`bg-gradient-to-br ${stat.color} to-emerald-600 rounded-xl p-6`}>
            <div className="text-3xl font-bold mb-2">{stat.total}</div>
            <div className="text-sm opacity-90">{stat.label}</div>
          </div>
        ))}
      </div>

      <div className="bg-slate-800/50 border border-emerald-500/20 rounded-xl p-6">
        <h3 className="text-lg font-semibold mb-6">QR Codes Recentes</h3>
        <div className="space-y-3">
          {[
            { id: 'QR-2024-001', status: 'Utilizado', date: '23/05/2024' },
            { id: 'QR-2024-002', status: 'Utilizado', date: '23/05/2024' },
            { id: 'QR-2024-003', status: 'Disponível', date: '23/05/2024' },
            { id: 'QR-2024-004', status: 'Utilizado', date: '22/05/2024' },
          ].map((qr, i) => (
            <div key={i} className="flex justify-between items-center p-4 bg-black/30 rounded-lg hover:bg-black/50 transition">
              <span className="font-mono text-sm">{qr.id}</span>
              <div className="flex items-center gap-4">
                <span className={`text-xs px-3 py-1 rounded-full ${qr.status === 'Utilizado' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-gray-500/20 text-gray-300'}`}>
                  {qr.status}
                </span>
                <span className="text-sm text-gray-400">{qr.date}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// RECOMPENSAS PAGE
function RecompensasPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold mb-2">Recompensas</h2>
          <p className="text-gray-400">Crie e gerencie as recompensas dos clientes</p>
        </div>
        <button className="bg-gradient-to-r from-emerald-500 to-teal-600 px-6 py-2 rounded-lg font-semibold flex items-center gap-2 hover:from-emerald-600 hover:to-teal-700">
          <Plus size={20} />
          Nova Recompensa
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[
          { name: 'Café Grátis', required: 7, redeemed: 156, icon: '☕' },
          { name: 'Desconto 10%', required: 5, redeemed: 234, icon: '💰' },
          { name: 'Café + Pão', required: 10, redeemed: 89, icon: '🍞' },
          { name: 'Bebida Grátis', required: 12, redeemed: 45, icon: '🥤' },
        ].map((reward, i) => (
          <div key={i} className="bg-slate-800/50 border border-emerald-500/20 rounded-xl p-6 hover:border-emerald-500/50 transition">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <div className="text-3xl">{reward.icon}</div>
                <div>
                  <h3 className="text-lg font-semibold">{reward.name}</h3>
                  <p className="text-sm text-gray-400">{reward.required} pontos</p>
                </div>
              </div>
              <button className="hover:bg-slate-700/50 p-2 rounded transition">
                <Edit2 size={18} />
              </button>
            </div>
            <div className="bg-black/30 rounded-lg p-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-400">Resgatadas</span>
                <span className="font-bold text-moss-400" style={{color: mossColors.primary">{reward.redeemed}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// RELATORIOS PAGE
function RelatoriosPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold mb-2">Relatórios</h2>
          <p className="text-gray-400">Analise dados e gere relatórios</p>
        </div>
        <button className="bg-gradient-to-r from-emerald-500 to-teal-600 px-6 py-2 rounded-lg font-semibold flex items-center gap-2 hover:from-emerald-600 hover:to-teal-700">
          <Download size={20} />
          Exportar
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-slate-800/50 border border-emerald-500/20 rounded-xl p-6">
          <h3 className="text-lg font-semibold mb-4">Clientes por Período</h3>
          <div className="h-40 flex items-end justify-between gap-2">
            {[45, 52, 48, 61, 55, 68, 72].map((h, i) => (
              <div key={i} className="flex-1 rounded-t-lg bg-gradient-to-t from-emerald-500 to-emerald-400" style={{height: `${h}%`}}></div>
            ))}
          </div>
        </div>

        <div className="bg-slate-800/50 border border-emerald-500/20 rounded-xl p-6">
          <h3 className="text-lg font-semibold mb-4">Resgates por Mês</h3>
          <div className="space-y-3">
            {[
              { month: 'Janeiro', count: 234 },
              { month: 'Fevereiro', count: 289 },
              { month: 'Março', count: 312 },
            ].map((item, i) => (
              <div key={i} className="flex items-center justify-between">
                <span className="text-gray-400">{item.month}</span>
                <div className="w-48 bg-slate-700 rounded-full h-2 overflow-hidden">
                  <div className="bg-gradient-to-r from-emerald-500 to-teal-500 h-full" style={{width: `${(item.count / 312) * 100}%`}}></div>
                </div>
                <span className="font-semibold text-right w-12">{item.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
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
          <div className="bg-slate-800/50 border border-emerald-500/20 rounded-xl p-6">
            <h3 className="text-lg font-semibold mb-4">Informações Básicas</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-2">Nome da Empresa</label>
                <input type="text" defaultValue="Café do João" className="w-full bg-black/30 border border-emerald-500/20 rounded-lg px-4 py-2 focus:outline-none focus:border-emerald-500/50" />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">Email</label>
                <input type="email" defaultValue="contato@cafejoao.com" className="w-full bg-black/30 border border-emerald-500/20 rounded-lg px-4 py-2 focus:outline-none focus:border-emerald-500/50" />
              </div>
            </div>
          </div>

          <div className="bg-slate-800/50 border border-emerald-500/20 rounded-xl p-6">
            <h3 className="text-lg font-semibold mb-4">Personalização</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-2">Cor Primária</label>
                <div className="flex gap-4">
                  {['#10b981', '#14b8a6', '#06b6d4', '#3b82f6'].map((color) => (
                    <button key={color} className="w-12 h-12 rounded-lg border-2 border-emerald-500" style={{backgroundColor: color}}></button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-slate-800/50 border border-emerald-500/20 rounded-xl p-6">
            <h3 className="text-lg font-semibold mb-4">Plano Atual</h3>
            <div className="bg-black/30 rounded-lg p-4">
              <div className="flex justify-between items-center">
                <div>
                  <div className="font-semibold">Plano Pro</div>
                  <div className="text-sm text-gray-400">R$ 79,90/mês</div>
                </div>
                <button className="text-moss-400" style={{color: mossColors.primary hover:text-emerald-300 text-sm">Gerenciar Plano</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
