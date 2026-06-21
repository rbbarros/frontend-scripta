import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getProjetos } from "../../../lib/authService";

export default function MeusProjetos() {
  const [projetos, setProjetos] = useState([]);
  const [activeTab, setActiveTab] = useState("Rascunhos");

  useEffect(() => {
    getProjetos()
      .then((data) => setProjetos(Array.isArray(data) ? data : []))
      .catch(() => setProjetos([]));
  }, []);

  const tabs = [
    { id: "Rascunhos", label: "Rascunhos", count: 1, icon: "M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z", activeColor: "bg-[#f19f17] text-white border-[#f19f17]", inactiveColor: "text-gray-500 hover:bg-gray-50" },
    { id: "Submetidos", label: "Submetidos", count: 1, icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z", activeColor: "bg-gray-100 text-gray-800 border-gray-200", inactiveColor: "text-gray-500 hover:bg-gray-50" },
    { id: "Em revisão", label: "Em revisão", count: 1, icon: "M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z", activeColor: "bg-blue-50 text-blue-600 border-blue-200", inactiveColor: "text-gray-500 hover:bg-gray-50" },
    { id: "Aprovados", label: "Aprovados", count: 1, icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z", activeColor: "bg-emerald-50 text-emerald-600 border-emerald-200", inactiveColor: "text-gray-500 hover:bg-gray-50" },
    { id: "Reprovados", label: "Reprovados", count: 1, icon: "M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z", activeColor: "bg-red-50 text-red-600 border-red-200", inactiveColor: "text-gray-500 hover:bg-gray-50" },
  ];

  const mockRascunho = {
    titulo: "Rascunho - Sistema de Gestão de Projetos Ágeis",
    badge: "Rascunho",
    curso: "Engenharia de Software - 1º/2025",
    atualizado: "01/06/2025",
    descricao: "Rascunho inicial do projeto de desenvolvimento de sistema de gerenciamento de projetos com metodologia ágil e dashboards analíticos em tempo real.",
  };

  return (
    <div className="animate-in fade-in zoom-in-95 duration-200 max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Meus Projetos</h1>
        <p className="text-sm text-gray-500 mt-1">Acompanhe e gerencie todos os seus projetos integradores</p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-2 mb-8 flex flex-wrap gap-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all border ${
              activeTab === tab.id ? tab.activeColor : `border-transparent ${tab.inactiveColor}`
            }`}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              {tab.icon.split(' M').map((path, i) => (
                <path key={i} d={i > 0 ? `M${path}` : path} />
              ))}
            </svg>
            {tab.label}
            <span className={`px-2 py-0.5 rounded-md text-xs bg-white/20 ${activeTab !== tab.id ? 'bg-gray-100 text-gray-500' : ''}`}>
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      <div className="space-y-6 mb-8">
        {activeTab === "Rascunhos" && (
          <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm">
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-6">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h2 className="text-lg font-bold text-gray-900">{mockRascunho.titulo}</h2>
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-gray-100 text-gray-600">{mockRascunho.badge}</span>
                </div>
                <p className="text-xs text-gray-500">{mockRascunho.curso} - Atualizado em {mockRascunho.atualizado}</p>
              </div>
              <button className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-[#f19f17] border border-[#f19f17] rounded-xl hover:bg-amber-50 transition-colors md:ml-auto">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>
                Editar
              </button>
            </div>

            <p className="text-sm text-gray-600 leading-relaxed mb-8">
              {mockRascunho.descricao}
            </p>

            <div className="flex flex-col md:flex-row items-center justify-between pt-6 border-t border-gray-100">
              <span className="text-xs text-gray-400 mb-4 md:mb-0">Rascunho salvo. Submeta quando estiver pronto.</span>
              <Link to="/aluno/submeter" className="text-sm font-semibold text-[#f19f17] hover:text-[#d68a12] flex items-center gap-1 transition-colors">
                Submeter projeto <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </Link>
            </div>
          </div>
        )}
        
        {activeTab !== "Rascunhos" && (
          <div className="bg-white rounded-3xl border border-gray-100 p-12 text-center shadow-sm">
            <p className="text-gray-500">Nenhum projeto {activeTab.toLowerCase()} encontrado.</p>
          </div>
        )}
      </div>

      <div className="flex justify-center">
        <Link to="/aluno/submeter" className="flex items-center gap-2 px-6 py-3 text-sm font-semibold text-[#f19f17] border border-[#f19f17] rounded-xl hover:bg-amber-50 transition-colors">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
          Iniciar novo projeto
        </Link>
      </div>
    </div>
  );
}