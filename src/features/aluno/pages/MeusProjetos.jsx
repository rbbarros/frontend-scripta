import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAlunoProjetos } from "../hooks/useAlunoProjetos";

const STATUS_TABS = [
  { id: "rascunho",    label: "Rascunhos",   color: "bg-[#f19f17] text-white border-[#f19f17]",      inactive: "text-gray-500" },
  { id: "submetido",   label: "Submetidos",  color: "bg-blue-50 text-blue-700 border-blue-200",      inactive: "text-gray-500" },
  { id: "em_avaliacao",label: "Em revisão",  color: "bg-purple-50 text-purple-700 border-purple-200",inactive: "text-gray-500" },
  { id: "aprovado",    label: "Aprovados",   color: "bg-emerald-50 text-emerald-700 border-emerald-200", inactive: "text-gray-500" },
  { id: "reprovado",   label: "Reprovados",  color: "bg-red-50 text-red-700 border-red-200",         inactive: "text-gray-500" },
];

function statusBadge(status) {
  const s = (status || "").toLowerCase();
  if (s === "aprovado")    return "bg-emerald-50 text-emerald-700 border border-emerald-200";
  if (s === "reprovado")   return "bg-red-50 text-red-700 border border-red-200";
  if (s === "submetido")   return "bg-blue-50 text-blue-700 border border-blue-200";
  if (s === "em_avaliacao")return "bg-purple-50 text-purple-700 border border-purple-200";
  return "bg-gray-100 text-gray-600 border border-gray-200";
}

function statusLabel(status) {
  const map = {
    rascunho: "Rascunho",
    submetido: "Submetido",
    em_avaliacao: "Em revisão",
    aprovado: "Aprovado",
    reprovado: "Reprovado",
  };
  return map[(status || "").toLowerCase()] || status || "Rascunho";
}

export default function MeusProjetos() {
  const { meusProjetos, loading } = useAlunoProjetos();
  const [activeTab, setActiveTab] = useState("rascunho");

  const projetosFiltrados = meusProjetos.filter(
    (p) => (p.status || "rascunho").toLowerCase() === activeTab
  );

  const countByStatus = (tabId) =>
    meusProjetos.filter((p) => (p.status || "rascunho").toLowerCase() === tabId).length;

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Meus Projetos</h1>
        <p className="text-sm text-gray-500 mt-1">
          Acompanhe e gerencie todos os seus projetos integradores
        </p>
      </div>

      {/* Tabs de status */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-2 mb-8 flex flex-wrap gap-2">
        {STATUS_TABS.map((tab) => {
          const count = countByStatus(tab.id);
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all border ${
                isActive ? tab.color : `border-transparent ${tab.inactive} hover:bg-gray-50`
              }`}
            >
              {tab.label}
              <span className={`px-2 py-0.5 rounded-md text-xs font-bold ${isActive ? "bg-white/30" : "bg-gray-100 text-gray-500"}`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Lista de projetos */}
      <div className="space-y-4 mb-8">
        {loading ? (
          <div className="bg-white rounded-3xl border border-gray-100 p-12 text-center shadow-sm">
            <p className="text-gray-400 text-sm">Carregando projetos...</p>
          </div>
        ) : projetosFiltrados.length > 0 ? (
          projetosFiltrados.map((projeto) => (
            <div key={projeto.id} className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <h2 className="text-lg font-bold text-gray-900">{projeto.titulo}</h2>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${statusBadge(projeto.status)}`}>
                      {statusLabel(projeto.status)}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500">
                    {projeto.curso || "Curso não informado"} · {projeto.turma || ""} · Semestre {projeto.semestre || "—"}
                  </p>
                </div>
              </div>

              {projeto.descricao && (
                <p className="text-sm text-gray-600 leading-relaxed mb-6 line-clamp-2">{projeto.descricao}</p>
              )}

              <div className="flex flex-col md:flex-row items-start md:items-center justify-between pt-4 gap-3">
                <span className="text-xs text-gray-400">
                  Prof. {projeto.professor_orientador || "Orientador não informado"} · {projeto.area_conhecimento || "Área não informada"}
                </span>
                {activeTab === "rascunho" && (
                  <Link
                    to="/aluno/submeter"
                    className="text-sm font-semibold text-[#f19f17] hover:text-[#d68a12] flex items-center gap-1 transition-colors"
                  >
                    Submeter projeto
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 12h14M12 5l7 7-7 7"/>
                    </svg>
                  </Link>
                )}
              </div>

              {/* Seção de Avaliações (apenas se não for rascunho) */}
              {activeTab !== "rascunho" && (
                <div className="mt-6 pt-6 border-t border-gray-100">
                  <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Avaliações dos Professores</h4>
                  <div className="space-y-2">
                    {/* Mock de avaliadores para bater com o layout */}
                    <div className="flex items-center justify-between bg-gray-50/50 rounded-xl p-3 border border-gray-100">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full border border-gray-200 bg-white flex items-center justify-center text-gray-400">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                        </div>
                        <div>
                          <p className="text-sm font-bold text-gray-800">Prof. Ana Silva</p>
                          <p className="text-xs text-gray-500">28/05/2025</p>
                        </div>
                      </div>
                      <span className="flex items-center gap-1 bg-emerald-50 border border-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-xs font-bold">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                        Aprovado
                      </span>
                    </div>
                    {activeTab === "aprovado" && (
                      <div className="flex items-center justify-between bg-gray-50/50 rounded-xl p-3 border border-gray-100">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full border border-gray-200 bg-white flex items-center justify-center text-gray-400">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                          </div>
                          <div>
                            <p className="text-sm font-bold text-gray-800">Prof. Carlos Mendes</p>
                            <p className="text-xs text-gray-500">26/05/2025</p>
                          </div>
                        </div>
                        <span className="flex items-center gap-1 bg-emerald-50 border border-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-xs font-bold">
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                          Aprovado
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="bg-white rounded-3xl border border-gray-100 p-12 text-center shadow-sm">
            <p className="text-gray-400 text-sm mb-2">
              Nenhum projeto {STATUS_TABS.find((t) => t.id === activeTab)?.label.toLowerCase()} encontrado.
            </p>
            {activeTab === "rascunho" && (
              <Link to="/aluno/submeter" className="text-sm font-semibold text-[#f19f17] hover:underline">
                Submeter um novo projeto →
              </Link>
            )}
          </div>
        )}
      </div>

      {/* Iniciar novo projeto */}
      <div className="flex justify-center">
        <Link
          to="/aluno/submeter"
          className="flex items-center gap-2 px-6 py-3 text-sm font-semibold text-[#f19f17] border border-[#f19f17] rounded-xl hover:bg-amber-50 transition-colors"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
          Iniciar novo projeto
        </Link>
      </div>
    </div>
  );
}