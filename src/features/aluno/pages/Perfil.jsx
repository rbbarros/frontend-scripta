import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAlunoDashboard } from "../hooks/useAlunoDashboard";

export default function Perfil() {
  const navigate = useNavigate();
  const { perfil, projetos, loading } = useAlunoDashboard();

  const meusProjetos = projetos.filter((p) => perfil?.id && p.aluno_responsavel_id === perfil.id);
  const projetosAprovados = meusProjetos.filter(p => p.status === "aprovado");

  return (
    <div className="max-w-6xl mx-auto flex flex-col gap-6 animate-in fade-in zoom-in-95 duration-200">
      
      {/* HEADER DO PERFIL */}
      <div className="bg-white rounded-[2rem] border border-gray-100 p-8 shadow-sm flex flex-col md:flex-row items-center md:items-start justify-between gap-6">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
          <div className="w-24 h-24 bg-[#f19f17] rounded-full flex items-center justify-center text-white text-4xl shadow-sm shrink-0">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
          </div>
          <div className="text-center md:text-left">
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight mb-2">
              {perfil?.nome || "Ana Carolina Silva"}
            </h1>
            <p className="text-sm text-gray-600 flex items-center justify-center md:justify-start gap-2 mb-3">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"></path></svg>
              {perfil?.curso || "Engenharia de Software"} • 6º Semestre
            </p>
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-xs font-medium text-gray-500">
              <span className="flex items-center gap-1 hover:text-gray-800 transition-colors cursor-pointer">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                {perfil?.email || "ana.silva@instituicao.edu.br"}
              </span>
              <span className="flex items-center gap-1 hover:text-[#f19f17] transition-colors cursor-pointer">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>
                GitHub
              </span>
              <span className="flex items-center gap-1 hover:text-[#f19f17] transition-colors cursor-pointer">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
                LinkedIn
              </span>
            </div>
          </div>
        </div>
        <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-[#f19f17] text-[#f19f17] text-sm font-bold hover:bg-amber-50 transition-colors">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
          Configurações
        </button>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-[2rem] border border-gray-100 p-6 flex flex-col items-center justify-center shadow-sm">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#f19f17] mb-2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
          <p className="text-3xl font-bold text-gray-900">{meusProjetos.length}</p>
          <p className="text-xs text-gray-500 font-medium">Projetos</p>
        </div>
        <div className="bg-white rounded-[2rem] border border-gray-100 p-6 flex flex-col items-center justify-center shadow-sm">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#f19f17] mb-2"><circle cx="12" cy="8" r="7"></circle><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"></polyline></svg>
          <p className="text-3xl font-bold text-gray-900">{projetosAprovados.length}</p>
          <p className="text-xs text-gray-500 font-medium">Certificados</p>
        </div>
        <div className="bg-white rounded-[2rem] border border-gray-100 p-6 flex flex-col items-center justify-center shadow-sm">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#f19f17] mb-2"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>
          <p className="text-3xl font-bold text-gray-900">3</p>
          <p className="text-xs text-gray-500 font-medium">Empresas Interessadas</p>
        </div>
      </div>

      {/* CONTENT WITH SIDEBAR */}
      <div className="flex flex-col lg:flex-row gap-6">
        
        {/* SIDEBAR */}
        <div className="w-full lg:w-64 shrink-0">
          <div className="bg-white rounded-3xl border border-gray-100 p-3 shadow-sm flex flex-col">
            <h3 className="px-4 py-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Menu</h3>
            <div className="space-y-1">
              <button className="w-full text-left px-4 py-2.5 rounded-xl text-sm font-bold text-[#f19f17] bg-amber-50">
                Meus Projetos
              </button>
              <Link to="/aluno/certificados" className="block w-full text-left px-4 py-2.5 rounded-xl text-sm font-bold text-gray-600 hover:bg-gray-50 transition-colors">
                Certificados
              </Link>
              <Link to="/aluno/portfolio" className="block w-full text-left px-4 py-2.5 rounded-xl text-sm font-bold text-gray-600 hover:bg-gray-50 transition-colors">
                Portfólio
              </Link>
              <button className="w-full text-left px-4 py-2.5 rounded-xl text-sm font-bold text-gray-600 hover:bg-gray-50 transition-colors">
                Empresas
              </button>
            </div>
          </div>
        </div>

        {/* MAIN AREA */}
        <div className="flex-1 bg-white rounded-3xl border border-gray-100 p-8 shadow-sm">
          <div className="flex items-center justify-between mb-8 border-b border-gray-100 pb-4">
            <h2 className="text-lg font-bold text-gray-900">Meus Projetos</h2>
            <Link to="/aluno/submeter" className="px-4 py-2 bg-[#f19f17] text-white text-sm font-bold rounded-xl hover:bg-amber-600 transition-colors">
              Novo Projeto
            </Link>
          </div>

          <div className="space-y-4">
            {loading ? (
              <p className="text-gray-400 text-sm">Carregando...</p>
            ) : meusProjetos.length > 0 ? (
              meusProjetos.map(p => (
                <div key={p.id} className="flex items-center justify-between p-4 rounded-2xl border border-gray-100 hover:border-amber-200 transition-colors group">
                  <div>
                    <h3 className="font-bold text-gray-900 text-sm mb-2">{p.titulo}</h3>
                    <div className="flex items-center gap-3">
                      {p.status === "aprovado" ? (
                        <span className="bg-emerald-50 text-emerald-700 px-2.5 py-0.5 rounded-full text-xs font-bold border border-emerald-100">
                          Aprovado
                        </span>
                      ) : (
                        <span className="bg-amber-50 text-amber-700 px-2.5 py-0.5 rounded-full text-xs font-bold border border-amber-100">
                          Em avaliação
                        </span>
                      )}
                      <span className="text-xs text-gray-500">Nota: {p.nota || "—"}</span>
                    </div>
                  </div>
                  <Link to="/aluno/projetos" className="text-sm font-bold text-gray-400 group-hover:text-[#f19f17] transition-colors">
                    Ver detalhes
                  </Link>
                </div>
              ))
            ) : (
              <p className="text-gray-400 text-sm">Você ainda não tem projetos submetidos.</p>
            )}
          </div>
        </div>

      </div>

    </div>
  );
}
