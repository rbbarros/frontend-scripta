import React, { useMemo, useState } from "react";
import { useAlunoDashboard } from "../hooks/useAlunoDashboard";

export default function Certificados() {
  const { perfil, projetos } = useAlunoDashboard();
  const [baixando, setBaixando] = useState(null);

  const projetosDoAluno = useMemo(
    () => projetos.filter((p) =>
      perfil?.nome && p.aluno_responsavel?.toLowerCase().includes(perfil.nome.toLowerCase())
    ),
    [projetos, perfil]
  );

  const certificados = useMemo(
    () => projetosDoAluno.filter((p) => (p.status || "").toLowerCase() === "aprovado"),
    [projetosDoAluno]
  );

  const handleBaixar = (id) => {
    setBaixando(id);
    setTimeout(() => {
      setBaixando(null);
      alert("Funcionalidade de download de certificado em breve!");
    }, 1200);
  };

  const stats = [
    { label: "Total de Certificados", value: 6, icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400"><path d="M12 15v5s-2 2-2 4h4s0-2-2-4v-5"></path><path d="M7 6v2a5 5 0 1 0 10 0V6a5 5 0 0 0-10 0z"></path></svg> },
    { label: "Projetos Destaque", value: 3, icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#f19f17]"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg> },
    { label: "Média Geral", value: "9.0", icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-500"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"></path><path d="M9 12l2 2 4-4"></path></svg> },
    { label: "Último Certificado", value: "2026", icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-500"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg> },
  ];

  return (
    <section className="mx-auto flex max-w-5xl flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Meus Certificados</h1>
        <p className="mt-2 text-sm text-gray-500">Certificados de projetos integradores concluídos</p>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        {stats.map((s) => (
          <div key={s.label} className="rounded-3xl border border-gray-100 bg-white p-6 flex flex-col items-center justify-center text-center shadow-sm">
            <div className="mb-4">{s.icon}</div>
            <p className="text-2xl font-bold text-gray-800">{s.value}</p>
            <p className="text-xs text-gray-400 mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Lista de Certificados */}
      <div>
        <h2 className="text-lg font-bold text-gray-800 mb-4">Todos os Certificados</h2>

        {certificados.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {certificados.map((projeto, i) => (
              <article key={projeto.id} className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <div className="w-12 h-12 rounded-full bg-[#f19f17] flex items-center justify-center text-white shadow-sm shrink-0">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 15v5s-2 2-2 4h4s0-2-2-4v-5"></path><path d="M7 6v2a5 5 0 1 0 10 0V6a5 5 0 0 0-10 0z"></path></svg>
                    </div>
                    {i === 0 && (
                      <span className="flex items-center gap-1 bg-amber-50 text-[#c67c00] px-3 py-1 rounded-full text-[10px] font-bold border border-amber-100 uppercase tracking-widest">
                        ⭐ Destaque
                      </span>
                    )}
                  </div>
                  
                  <h3 className="text-base font-bold text-gray-900 mb-1">Projeto Integrador - {projeto.titulo}</h3>
                  <p className="text-xs text-gray-500 mb-4">{projeto.curso || "Engenharia de Software"}</p>
                  
                  <div className="flex flex-wrap items-center gap-3 text-xs font-medium text-gray-400 mb-6">
                    <span className="flex items-center gap-1">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                      15/03/2026
                    </span>
                    <span className="flex items-center gap-1">
                      Nota: {projeto.nota || "9.5"}
                    </span>
                    <span className="flex items-center gap-1">
                      {projeto.semestre || "6º"} Semestre
                    </span>
                  </div>
                </div>

                <div className="flex gap-3 pt-4 border-t border-gray-50">
                  <button
                    onClick={() => handleBaixar(projeto.id)}
                    disabled={baixando === projeto.id}
                    className="flex-1 flex justify-center items-center gap-2 rounded-xl border border-[#f19f17] bg-white px-4 py-2.5 text-sm font-bold text-[#f19f17] hover:bg-amber-50 transition-colors disabled:opacity-60"
                  >
                    {baixando === projeto.id ? (
                      <span className="animate-spin inline-block w-4 h-4 border-2 border-[#f19f17] border-t-transparent rounded-full"></span>
                    ) : (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                    )}
                    Download
                  </button>
                  <button className="flex-1 flex justify-center items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-bold text-gray-700 hover:bg-gray-50 transition-colors">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="18" cy="5" r="3"></circle><circle cx="6" cy="12" r="3"></circle><circle cx="18" cy="19" r="3"></circle><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line></svg>
                    Compartilhar
                  </button>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="rounded-3xl border border-dashed border-gray-200 bg-white p-16 text-center shadow-sm">
            <div className="text-5xl mb-4">🎯</div>
            <h3 className="text-lg font-bold text-gray-700 mb-2">Nenhum certificado ainda</h3>
            <p className="text-sm text-gray-500 max-w-xs mx-auto">
              Seus certificados aparecerão aqui assim que seus projetos forem avaliados e aprovados pelos professores.
            </p>
          </div>
        )}
      </div>

      {/* Projetos pendentes */}
      {projetosDoAluno.filter(p => (p.status || "").toLowerCase() !== "aprovado").length > 0 && (
        <div>
          <h2 className="text-lg font-bold text-gray-800 mb-4">Projetos em andamento</h2>
          <div className="space-y-3">
            {projetosDoAluno.filter(p => (p.status || "").toLowerCase() !== "aprovado").map((projeto) => (
              <div key={projeto.id} className="rounded-2xl border border-gray-100 bg-white p-4 flex items-center justify-between gap-4 shadow-sm">
                <div>
                  <h3 className="text-sm font-semibold text-gray-800">{projeto.titulo}</h3>
                  <p className="text-xs text-gray-500 mt-0.5">{projeto.area_conhecimento || "Área não informada"}</p>
                </div>
                <span className={`rounded-full px-3 py-1 text-xs font-bold ${
                  (projeto.status || "").toLowerCase() === "reprovado"
                    ? "bg-red-50 text-red-600 border border-red-100"
                    : (projeto.status || "").toLowerCase() === "em_revisao"
                    ? "bg-blue-50 text-blue-600 border border-blue-100"
                    : "bg-amber-50 text-amber-700 border border-amber-100"
                }`}>
                  {projeto.status || "Rascunho"}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}