import React from "react";
import { Link } from "react-router-dom";
import { useProfessorDashboard } from "../hooks/useProfessorDashboard";

export default function Dashboard() {
  const { perfil, projetos, loading } = useProfessorDashboard();

  const aguardando = projetos.filter(p => (p.status || "").toLowerCase() === "aguardando avaliação").length || 8;
  const avaliados = projetos.filter(p => (p.status || "").toLowerCase() === "avaliado").length || 34;
  const total = projetos.length || 42;

  const mockRecentes = [
    { titulo: "Sistema de IA para Diagnóstico Médico", curso: "Engenharia de Software - ESW-2A", status: "Aguardando", color: "text-amber-600 bg-amber-50" },
    { titulo: "Marketplace Sustentável", curso: "Sistemas de Informação - SI-3B", status: "Aguardando", color: "text-amber-600 bg-amber-50" },
    { titulo: "App de Realidade Aumentada", curso: "Design Digital - DD-1A", status: "Avaliado", color: "text-emerald-600 bg-emerald-50" }
  ];

  return (
    <div className="animate-in fade-in zoom-in-95 duration-200">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1">
          Bem-vindo, Prof. {perfil?.nome?.split(" ")[0] || "Ana Silva"}. Acompanhe suas atividades de avaliação.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Card 1 */}
        <div className="bg-white rounded-3xl border border-gray-100 p-6 flex items-center gap-5 shadow-sm">
          <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-500 flex items-center justify-center">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
          </div>
          <div>
            <span className="block text-2xl font-bold text-gray-900 leading-none mb-1">{aguardando}</span>
            <span className="text-xs text-gray-500 font-medium">Aguardando avaliação</span>
          </div>
        </div>

        {/* Card 2 */}
        <div className="bg-white rounded-3xl border border-emerald-100 p-6 flex items-center gap-5 shadow-sm relative overflow-hidden">
          <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-500 flex items-center justify-center">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
          </div>
          <div>
            <span className="block text-2xl font-bold text-gray-900 leading-none mb-1">{avaliados}</span>
            <span className="text-xs text-gray-500 font-medium">Avaliações realizadas</span>
          </div>
        </div>

        {/* Card 3 */}
        <div className="bg-white rounded-3xl border border-gray-100 p-6 flex items-center gap-5 shadow-sm">
          <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-500 flex items-center justify-center">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
          </div>
          <div>
            <span className="block text-2xl font-bold text-gray-900 leading-none mb-1">{total}</span>
            <span className="text-xs text-gray-500 font-medium">Total de projetos</span>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="w-full lg:w-2/3">
          <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm h-full">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-bold text-gray-800">Projetos Avaliados Recentemente</h2>
              <Link to="/professor/avaliacoes" className="text-sm font-semibold text-gray-500 hover:text-[#f19f17] flex items-center gap-1 transition-colors">
                Ver todos →
              </Link>
            </div>
            
            <div className="space-y-4">
              {mockRecentes.map((r, i) => (
                <div key={i} className="flex items-center justify-between p-4 bg-white border border-gray-100 rounded-2xl hover:border-gray-200 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center text-orange-400">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 text-sm">{r.titulo}</h3>
                      <p className="text-[10px] text-gray-400">{r.curso}</p>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded text-[10px] font-bold ${r.color}`}>
                    {r.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="w-full lg:w-1/3 space-y-6">
          <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm">
            <h2 className="text-lg font-bold text-gray-800 mb-4">Ações Rápidas</h2>
            <div className="space-y-3">
              <Link to="/professor/avaliacoes" className="flex items-center gap-3 w-full p-4 border border-[#f19f17] rounded-2xl text-sm font-semibold text-[#f19f17] hover:bg-amber-50 transition-colors">
                 <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path></svg>
                 Ver projetos pendentes
              </Link>
              <Link to="/professor/avaliacoes" className="flex items-center gap-3 w-full p-4 border border-[#f19f17] rounded-2xl text-sm font-semibold text-[#f19f17] hover:bg-amber-50 transition-colors">
                 <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                 Histórico de avaliações
              </Link>
              <Link to="/professor/ranking" className="flex items-center gap-3 w-full p-4 border border-[#f19f17] rounded-2xl text-sm font-semibold text-[#f19f17] hover:bg-amber-50 transition-colors">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"></path><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"></path><path d="M4 22h16"></path><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"></path><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"></path><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"></path></svg>
                 Ver ranking
              </Link>
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm">
            <h2 className="text-lg font-bold text-gray-800 mb-4">Notificações</h2>
            <div className="space-y-4">
              <div className="p-4 bg-amber-50 border border-amber-100 rounded-2xl">
                <p className="text-sm font-semibold text-amber-600">3 projetos aguardam avaliação</p>
                <p className="text-xs text-amber-600 mt-1">Prazo: 5 dias</p>
              </div>
              <div className="p-4 bg-white border border-gray-100 rounded-2xl">
                <p className="text-sm font-semibold text-gray-900">Novo projeto submetido em ESW-2A</p>
                <p className="text-xs text-gray-400 mt-1">Há 2 horas</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
