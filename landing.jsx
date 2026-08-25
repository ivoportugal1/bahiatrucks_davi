import React, { useState } from 'react';
import { ChevronRight, Smartphone, QrCode, Zap, BarChart3, Users, Sparkles, Apple, CheckCircle2 } from 'lucide-react';
import './colors.css';

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

export default function Fidelizarei({ onLogin, onRegistro }) {
  return (
    <div className="min-h-screen text-white overflow-hidden" style={{background: mossColors.bg}}>
      {/* Header */}
      <header className="fixed w-full top-0 z-50 backdrop-blur-md" style={{backgroundColor: 'rgba(0, 0, 0, 0.4)', borderBottomColor: mossColors.border, borderBottomWidth: '1px'}}>
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="text-2xl font-bold" style={{background: `linear-gradient(to right, ${mossColors.primary}, ${mossColors.accent})`, backgroundClip: 'text', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'}}>
            Fidelizarei
          </div>
          <nav className="hidden md:flex gap-8 text-sm">
            <a href="#como-funciona" className="transition" style={{color: '#9ca3af', cursor: 'pointer'}} onMouseEnter={(e) => e.target.style.color = mossColors.primary} onMouseLeave={(e) => e.target.style.color = '#9ca3af'}>Como funciona</a>
            <a href="#beneficios" className="transition" style={{color: '#9ca3af', cursor: 'pointer'}} onMouseEnter={(e) => e.target.style.color = mossColors.primary} onMouseLeave={(e) => e.target.style.color = '#9ca3af'}>Benefícios</a>
            <a href="#preco" className="transition" style={{color: '#9ca3af', cursor: 'pointer'}} onMouseEnter={(e) => e.target.style.color = mossColors.primary} onMouseLeave={(e) => e.target.style.color = '#9ca3af'}>Preço</a>
          </nav>
          <button className="px-6 py-2 rounded-lg text-sm font-semibold transition transform hover:scale-105" style={{background: `linear-gradient(to right, ${mossColors.primary}, ${mossColors.secondary})`, color: 'white'}}>
            Começar Agora
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6 max-w-7xl mx-auto">
        <div className="absolute top-20 right-10 w-72 h-72 rounded-full blur-3xl opacity-50" style={{background: `radial-gradient(circle, ${mossColors.primary}33, transparent)`}}></div>
        <div className="absolute bottom-10 left-10 w-96 h-96 rounded-full blur-3xl opacity-50" style={{background: `radial-gradient(circle, ${mossColors.accent}22, transparent)`}}></div>

        <div className="relative z-10 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-block mb-6 px-4 py-2 rounded-full text-sm" style={{backgroundColor: 'rgba(90, 157, 125, 0.2)', borderColor: mossColors.border, borderWidth: '1px', color: mossColors.accent}}>
              <span>✨ A forma mais simples de fidelizar clientes</span>
            </div>

            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
              Fidelização sem <span style={{background: `linear-gradient(to right, ${mossColors.primary}, ${mossColors.accent})`, backgroundClip: 'text', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'}}>aplicativo</span>
            </h1>

            <p className="text-xl text-gray-300 mb-8 leading-relaxed">
              QR Code na embalagem → Cliente escaneia → Ponto automático → Carteirinha atualiza na Wallet. Simples assim.
            </p>

            <div className="flex gap-4 mb-12">
              <button onClick={onLogin} className="px-8 py-3 rounded-lg font-semibold transition transform hover:scale-105 flex items-center gap-2 text-white" style={{background: `linear-gradient(to right, ${mossColors.primary}, ${mossColors.secondary})`}}>
                Começar teste grátis
                <ChevronRight size={20} />
              </button>
              <button onClick={onRegistro} className="px-8 py-3 rounded-lg font-semibold transition" style={{borderColor: mossColors.primary, borderWidth: '1px', backgroundColor: `rgba(90, 157, 125, 0.1)`}}>
                Ver demo
              </button>
            </div>

            <div className="flex gap-8 text-sm text-gray-400">
              <div>✓ Sem código de programação</div>
              <div>✓ Setup em minutos</div>
              <div>✓ Funciona com Delivery</div>
            </div>
          </div>

          <div className="relative">
            <div className="rounded-2xl p-1" style={{background: `linear-gradient(to bottom right, rgba(90, 157, 125, 0.3), rgba(106, 168, 142, 0.3))`, backdropFilter: 'blur(10px)', borderColor: 'rgba(90, 157, 125, 0.3)', borderWidth: '1px'}}>
              <div className="rounded-xl p-8 space-y-6" style={{backgroundColor: 'rgba(15, 23, 42, 0.8)'}}>
                <div className="flex items-center gap-4">
                  <Smartphone className="w-12 h-12" style={{color: mossColors.primary}} />
                  <div>
                    <div className="text-sm text-gray-400">Cliente escaneia</div>
                    <div className="font-semibold">QR Code</div>
                  </div>
                </div>

                <div className="h-px" style={{background: `linear-gradient(to right, transparent, ${mossColors.primary}, transparent)`}}></div>

                <div className="flex items-center gap-4">
                  <Zap className="w-12 h-12 text-yellow-400" />
                  <div>
                    <div className="text-sm text-gray-400">Recebe automaticamente</div>
                    <div className="font-semibold">+1 Ponto</div>
                  </div>
                </div>

                <div className="h-px" style={{background: `linear-gradient(to right, transparent, ${mossColors.primary}, transparent)`}}></div>

                <div className="flex items-center gap-4">
                  <Apple className="w-12 h-12 text-gray-300" />
                  <div>
                    <div className="text-sm text-gray-400">Carteirinha atualiza na</div>
                    <div className="font-semibold">Apple/Google Wallet</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Como Funciona */}
      <section id="como-funciona" className="py-20 px-6 max-w-7xl mx-auto">
        <h2 className="text-4xl font-bold text-center mb-16">Como funciona</h2>

        <div className="grid md:grid-cols-4 gap-8">
          {[
            { num: '1', title: 'Empresa cria programa', desc: 'A cada 7 compras, ganhe 1 café' },
            { num: '2', title: 'Sistema gera QR Codes', desc: 'Um QR único por compra/pedido' },
            { num: '3', title: 'Cliente escaneia', desc: 'Câmera do celular, sem app' },
            { num: '4', title: 'Ponto automático', desc: 'Carteirinha atualiza na Wallet' }
          ].map((step, i) => (
            <div key={i} className="relative group">
              <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-20 transition duration-300 blur" style={{background: `linear-gradient(to right, ${mossColors.primary}, ${mossColors.secondary})`, opacity: '0'}} onMouseEnter={(e) => e.currentTarget.style.opacity = '0.2'} onMouseLeave={(e) => e.currentTarget.style.opacity = '0'}></div>
              <div className="relative rounded-xl p-8 transition" style={{backgroundColor: 'rgba(45, 90, 74, 0.3)', borderColor: mossColors.border, borderWidth: '1px'}}>
                <div className="w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold mb-4 text-white" style={{background: `linear-gradient(to right, ${mossColors.primary}, ${mossColors.secondary})`}}>
                  {step.num}
                </div>
                <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
                <p className="text-gray-400">{step.desc}</p>
              </div>
              {i < 3 && <div className="hidden md:block absolute -right-4 top-1/2 transform -translate-y-1/2" style={{color: `rgba(90, 157, 125, 0.3)`}}>→</div>}
            </div>
          ))}
        </div>
      </section>

      {/* Benefícios */}
      <section id="beneficios" className="py-20 px-6 max-w-7xl mx-auto">
        <h2 className="text-4xl font-bold text-center mb-16">Por que Fidelizarei?</h2>

        <div className="grid md:grid-cols-2 gap-8">
          {[
            { icon: QrCode, title: 'Sem aplicativo', desc: 'Cliente não precisa baixar nada. Camera + Wallet = tudo que precisa' },
            { icon: Smartphone, title: 'Funciona em Delivery', desc: 'QR Code na embalagem = cliente ganha ponto direto em casa' },
            { icon: Zap, title: 'Setup rápido', desc: 'Crie programa, customize carteirinha e comece a gerar QR em minutos' },
            { icon: Users, title: 'Sem funcionário registrar', desc: 'Processo 100% automático. Zero chance de erro ou fraude' },
            { icon: BarChart3, title: 'Dashboard completo', desc: 'Métricas, histórico de pontos, controle de recompensas tudo em um lugar' },
            { icon: Sparkles, title: 'Identidade visual', desc: 'Carteirinha totalmente personalizada com suas cores e logo' }
          ].map((benefit, i) => {
            const Icon = benefit.icon;
            return (
              <div key={i} className="group p-8 rounded-xl transition" style={{backgroundColor: 'rgba(45, 90, 74, 0.3)', borderColor: mossColors.border, borderWidth: '1px'}}>
                <div className="w-14 h-14 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition transform text-white" style={{background: `linear-gradient(to right, ${mossColors.primary}, ${mossColors.secondary})`}}>
                  <Icon className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{benefit.title}</h3>
                <p className="text-gray-400">{benefit.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Demo Visual */}
      <section className="py-20 px-6 max-w-7xl mx-auto">
        <h2 className="text-4xl font-bold text-center mb-16">Veja na prática</h2>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Carteirinha Demo */}
          <div className="flex justify-center">
            <div className="relative w-64 h-96 rounded-3xl p-1 shadow-2xl transform hover:scale-105 transition" style={{background: `linear-gradient(to bottom right, ${mossColors.primary}, ${mossColors.secondary})`}}>
              <div className="w-full h-full rounded-3xl p-6 flex flex-col justify-between overflow-hidden relative" style={{background: `linear-gradient(to bottom right, ${mossColors.primary}, ${mossColors.secondary})`}}>
                <div className="absolute top-0 left-0 w-full h-full opacity-10" style={{backgroundImage: 'radial-gradient(circle at 20% 50%, white, transparent)'}}></div>
                <div className="relative z-10">
                  <div className="text-sm font-semibold opacity-90">CAFÉ DO JOÃO</div>
                  <h3 className="text-2xl font-bold mt-2">Seu Café Favorito</h3>
                </div>

                <div className="relative z-10 rounded-xl p-4 space-y-4" style={{backgroundColor: 'rgba(0, 0, 0, 0.2)', backdropFilter: 'blur(10px)'}}>
                  <div>
                    <div className="text-xs opacity-75 mb-2">Seu progresso</div>
                    <div className="text-3xl font-bold">6/7</div>
                    <div className="text-sm opacity-90 mt-1">Falta 1 compra!</div>
                  </div>

                  <div className="w-full rounded-full h-3 overflow-hidden" style={{backgroundColor: 'rgba(255, 255, 255, 0.2)'}}>
                    <div className="h-full w-5/6 rounded-full" style={{backgroundColor: 'white'}}></div>
                  </div>

                  <div className="text-xs opacity-75 text-center">
                    ☕ Próximo: Café grátis
                  </div>
                </div>

                <div className="relative z-10 text-center text-xs opacity-75">
                  Adicione à Wallet
                </div>
              </div>
            </div>
          </div>

          {/* QR Code Demo */}
          <div className="flex flex-col items-center justify-center">
            <div className="bg-white rounded-2xl p-8 mb-6 w-64 h-64 flex items-center justify-center shadow-xl hover:shadow-2xl transition transform hover:scale-105">
              <div className="w-56 h-56 rounded-xl flex items-center justify-center relative overflow-hidden" style={{background: 'linear-gradient(to bottom right, rgb(15, 23, 42), rgb(20, 45, 40))'}}>
                <svg viewBox="0 0 200 200" className="w-full h-full">
                  <rect width="200" height="200" fill="white"/>
                  <g fill="black">
                    <rect width="40" height="40"/>
                    <rect x="160" width="40" height="40"/>
                    <rect y="160" width="40" height="40"/>
                    <rect x="50" y="50" width="100" height="100"/>
                    <circle cx="100" cy="100" r="30" fill="white"/>
                  </g>
                </svg>
              </div>
            </div>
            <div className="text-center">
              <div className="text-sm text-gray-400">QR Code único</div>
              <div className="font-semibold">por cada pedido</div>
            </div>
          </div>

          {/* Admin Dashboard Demo */}
          <div className="rounded-2xl p-6 h-96 flex flex-col transition" style={{backgroundColor: 'rgba(45, 90, 74, 0.3)', borderColor: mossColors.border, borderWidth: '1px'}}>
            <h3 className="font-semibold mb-4">Seu Dashboard</h3>
            <div className="space-y-3 flex-1">
              <div className="flex justify-between items-center p-3 rounded-lg" style={{backgroundColor: 'rgba(45, 90, 74, 0.5)'}}>
                <span className="text-sm">Clientes ativos</span>
                <span className="font-bold" style={{color: mossColors.primary}}>142</span>
              </div>
              <div className="flex justify-between items-center p-3 rounded-lg" style={{backgroundColor: 'rgba(45, 90, 74, 0.5)'}}>
                <span className="text-sm">QR's escaneados</span>
                <span className="font-bold" style={{color: mossColors.accent}}>1.247</span>
              </div>
              <div className="flex justify-between items-center p-3 rounded-lg" style={{backgroundColor: 'rgba(45, 90, 74, 0.5)'}}>
                <span className="text-sm">Recompensas resgatadas</span>
                <span className="font-bold" style={{color: mossColors.primary}}>34</span>
              </div>
              <div className="flex justify-between items-center p-3 rounded-lg" style={{backgroundColor: 'rgba(45, 90, 74, 0.5)'}}>
                <span className="text-sm">Ticket médio</span>
                <span className="font-bold" style={{color: mossColors.accent}}>R$ 47,80</span>
              </div>
            </div>
            <button className="w-full py-2 rounded-lg text-sm font-semibold mt-4 text-white transition" style={{background: `linear-gradient(to right, ${mossColors.primary}, ${mossColors.secondary})`}}>
              Acessar painel
            </button>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="preco" className="py-20 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-6">Plano Simples</h2>
          <p className="text-xl text-gray-400">Todos os recursos por um preço justo</p>
        </div>

        <div className="max-w-md mx-auto">
          <div className="relative group">
            <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-20 transition duration-300 blur-lg" style={{background: `linear-gradient(to right, ${mossColors.primary}, ${mossColors.secondary})`}} onMouseEnter={(e) => e.currentTarget.style.opacity = '0.2'} onMouseLeave={(e) => e.currentTarget.style.opacity = '0'}></div>
            <div className="relative rounded-2xl p-10 transition" style={{backgroundColor: 'rgba(45, 90, 74, 0.3)', borderColor: mossColors.border, borderWidth: '1px'}}>
              <div className="absolute top-6 right-6 text-xs font-bold px-3 py-1 rounded-full text-white" style={{background: `linear-gradient(to right, ${mossColors.primary}, ${mossColors.secondary})`}}>
                MELHOR CUSTO-BENEFÍCIO
              </div>

              <h3 className="text-2xl font-bold mb-2">Plano Pro</h3>
              <p className="text-gray-400 text-sm mb-6">Tudo que sua empresa precisa</p>

              <div className="mb-8">
                <span className="text-5xl font-bold">R$ 79,90</span>
                <span className="text-gray-400 ml-2">/mês</span>
              </div>

              <button onClick={onLogin} className="w-full py-3 rounded-lg font-semibold mb-8 transition transform hover:scale-105 text-white" style={{background: `linear-gradient(to right, ${mossColors.primary}, ${mossColors.secondary})`}}>
                Começar teste grátis
              </button>

              <div className="space-y-4">
                {[
                  'Programas de fidelidade ilimitados',
                  'Carteira personalizada com sua identidade',
                  'Geração ilimitada de QR Codes',
                  'Dashboard com todas as métricas',
                  'Controle de recompensas',
                  'Suporte por email',
                  'Sem taxa por cliente',
                  'Sem taxa por escanteio'
                ].map((feature, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <CheckCircle2 size={20} style={{color: mossColors.primary}} className="flex-shrink-0" />
                    <span className="text-gray-300">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <p className="text-center text-gray-400 mt-8">
          Teste grátis por 14 dias. Sem cartão de crédito necessário.
        </p>
      </section>

      {/* CTA Final */}
      <section className="py-20 px-6 max-w-7xl mx-auto">
        <div className="relative overflow-hidden rounded-2xl p-1" style={{background: `linear-gradient(to right, ${mossColors.primary}, ${mossColors.secondary})`}}>
          <div className="relative rounded-xl p-16 text-center" style={{backgroundColor: 'rgba(15, 23, 42, 0.8)', backdropFilter: 'blur(10px)'}}>
            <h2 className="text-4xl font-bold mb-6">Pronto para começar?</h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Aumente suas vendas com um programa de fidelização que realmente funciona. Sem aplicativo, sem complicações.
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <button onClick={onLogin} className="px-8 py-4 rounded-lg font-semibold transition transform hover:scale-105 flex items-center gap-2 text-white" style={{background: `linear-gradient(to right, ${mossColors.primary}, ${mossColors.secondary})`}}>
                Começar agora
                <ChevronRight size={20} />
              </button>
              <button className="px-8 py-4 rounded-lg font-semibold transition" style={{borderColor: '#6b7280', borderWidth: '1px', color: '#9ca3af'}}>
                Agendar demo
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 text-center text-gray-400" style={{borderTopColor: mossColors.border, borderTopWidth: '1px'}}>
        <p>© 2024 Fidelizarei. Todos os direitos reservados.</p>
      </footer>
    </div>
  );
}
