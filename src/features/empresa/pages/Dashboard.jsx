import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Folder, Users, CheckCircle, Clock, ArrowRight, Settings, FileText, Award, BarChart2, TrendingUp, Briefcase } from 'lucide-react';
import { useDashboardData } from '../hooks/useDashboardData';

export default function Dashboard() {
  const navigate = useNavigate();
  const { perfil, projetos, portfolios, loading } = useDashboardData();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500"></div>
      </div>
    );
  }

  // Cálculos de KPI
  const numProjetos = projetos.length || 45; 
  const numPortfolios = portfolios.length || 128;
  const projetosDestaque = projetos.filter(p => p.status === 'aprovado');
  const numDestaques = projetosDestaque.length || 12;

  const destaquesExibicao = projetosDestaque.slice(0, 3);
  
  const mockDestaques = [
    { id: 'm1', titulo: 'Sistema de Recomendação IA', curso: 'Ciência da Computação', nota: 96 },
    { id: 'm2', titulo: 'App de Mobilidade Sustentável', curso: 'Engenharia de Software', nota: 92 },
    { id: 'm3', titulo: 'Plataforma IoT para Agro', curso: 'Sistemas de Informação', nota: 88 }
  ];

  const itensDestaque = destaquesExibicao.length >= 3 ? destaquesExibicao : mockDestaques;

  const getBadgeNota = (nota) => {
    const num = Number(nota) || 0;
    if (num >= 95) return { text: 'Excelente', classes: 'bg-emerald-50 text-emerald-700 border-emerald-100' };
    if (num >= 85) return { text: 'Ótimo', classes: 'bg-amber-50 text-amber-700 border-amber-100' };
    return { text: 'Bom', classes: 'bg-blue-50 text-blue-700 border-blue-100' };
  };

  const areasDisponiveis = [
    { nome: 'Inteligência Artificial', count: 38 },
    { nome: 'Desenvolvimento Web', count: 32 },
    { nome: 'Mobile', count: 20 },
    { nome: 'IoT', count: 18 },
    { nome: 'Blockchain', count: 12 }
  ];

  return (
    <div className="animate-in fade-in zoom-in-95 duration-200">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1">
          Bem-vindo, {perfil?.nome_empresa || 'Empresa'}. Explore talentos e projetos acadêmicos.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex items-center gap-4 hover:border-emerald-200 transition-colors">
          <div className="w-12 h-12 flex items-center justify-center bg-emerald-50 rounded-2xl">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-600"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path></svg>
          </div>
          <div>
            <div className="text-3xl font-bold text-gray-900">{numProjetos}</div>
            <div className="text-xs font-semibold text-gray-500 mt-1 uppercase tracking-wider">Projetos disponíveis</div>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex items-center gap-4 hover:border-blue-200 transition-colors">
          <div className="w-12 h-12 flex items-center justify-center bg-blue-50 rounded-2xl">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-600"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>
          </div>
          <div>
            <div className="text-3xl font-bold text-gray-900">{numPortfolios}</div>
            <div className="text-xs font-semibold text-gray-500 mt-1 uppercase tracking-wider">Portfólios disponíveis</div>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex items-center gap-4 hover:border-amber-200 transition-colors">
          <div className="w-12 h-12 flex items-center justify-center bg-amber-50 rounded-2xl">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-amber-600"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"></path><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"></path><path d="M4 22h16"></path><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"></path><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"></path><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"></path></svg>
          </div>
          <div>
            <div className="text-3xl font-bold text-gray-900">{numDestaques}</div>
            <div className="text-xs font-semibold text-gray-500 mt-1 uppercase tracking-wider">Projetos em destaque</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Section - Projetos em Destaque (2/3 width) */}
        <div className="lg:col-span-2 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-900">Projetos em Destaque</h2>
            <button 
              onClick={() => navigate('/empresa/destaque')}
              className="text-[#f19f17] hover:text-amber-700 font-bold text-sm flex items-center transition-colors"
            >
              Ver todos <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-1"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
            </button>
          </div>

          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden flex-1">
            <div className="divide-y divide-gray-100">
              {itensDestaque.map((item) => {
                const nota = item.nota || 90;
                const badge = getBadgeNota(nota);
                
                return (
                  <div key={item.id} className="p-6 flex flex-col md:flex-row md:items-center justify-between hover:bg-gray-50/50 transition-colors gap-4">
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-amber-50 rounded-xl shrink-0 mt-1 md:mt-0">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-amber-500"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900 leading-snug">{item.titulo}</h3>
                        <p className="text-xs text-gray-500 mt-1">{item.curso || 'Curso de Tecnologia'}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4 self-end md:self-auto shrink-0">
                      <div className="text-right">
                        <div className="text-lg font-bold text-gray-900">{nota}%</div>
                      </div>
                      <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold border ${badge.classes}`}>
                        {badge.text}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Sidebar (1/3 width) */}
        <div className="space-y-8">
          
          {/* Explorar Section */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center gap-2 mb-6">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#f19f17]"><circle cx="12" cy="12" r="10"></circle><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"></polygon></svg>
              <h2 className="text-lg font-bold text-gray-900">Explorar</h2>
            </div>
            
            <div className="space-y-3">
              <button 
                onClick={() => navigate('/empresa/projetos')}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl border-2 border-[#f19f17] text-[#f19f17] font-bold hover:bg-amber-50 transition-colors"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path></svg>
                Buscar projetos
              </button>
              
              <button 
                onClick={() => navigate('/empresa/portfolios')}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl border-2 border-[#f19f17] text-[#f19f17] font-bold hover:bg-amber-50 transition-colors"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>
                Ver portfólios
              </button>

              <button 
                onClick={() => navigate('/empresa/talentos')}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl border-2 border-[#f19f17] text-[#f19f17] font-bold hover:bg-amber-50 transition-colors"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
                Identificar talentos
              </button>
            </div>
          </div>

          {/* Áreas Disponíveis */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-lg font-bold text-gray-900 mb-6">Áreas Disponíveis</h2>
            
            <div className="space-y-4">
              {areasDisponiveis.map((area, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-gray-600">{area.nome}</span>
                  <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded-lg text-xs font-bold border border-gray-200">
                    {area.count}
                  </span>
                </div>
              ))}
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}
