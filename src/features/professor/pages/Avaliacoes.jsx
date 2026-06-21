import React, { useEffect, useState } from "react";
import { getProjetos, getProfessorPerfil } from "../../../lib/authService";

export default function Avaliacoes() {
  const [projetos, setProjetos] = useState([]);
  const [perfil, setPerfil] = useState(null);

  useEffect(() => {
    getProjetos()
      .then((data) => setProjetos(Array.isArray(data) ? data : []))
      .catch(() => setProjetos([]));
      
    getProfessorPerfil()
      .then(setPerfil)
      .catch(() => {});
  }, []);

  const profName = perfil?.nome || "Ana Silva";

  const mockAvaliacoes = [
    {
      titulo: "Plataforma de Blockchain para Certificados",
      curso: "Ciência da Computação - CC-4A",
      data: "28/05/2025",
      badge: "Excelente",
      badgeColor: "bg-emerald-50 text-emerald-600",
      inovacao: 97,
      qualidade: 95,
      aplicabilidade: 96,
      clareza: 95,
      media: 96,
      parecer: "Projeto de alta qualidade técnica, com inovação real e aplicabilidade comprovada. A documentação é clara e completa."
    },
    {
      titulo: "App de Realidade Aumentada Educacional",
      curso: "Design Digital - DD-1A",
      data: "20/05/2025",
      badge: "Ótimo",
      badgeColor: "bg-blue-50 text-blue-600",
      inovacao: 92,
      qualidade: 85,
      aplicabilidade: 88,
      clareza: 87,
      media: 88,
      parecer: "Ótima aplicação das tecnologias emergentes no contexto educacional. Recomendo aprimorar a usabilidade."
    }
  ];

  return (
    <div className="animate-in fade-in zoom-in-95 duration-200">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Histórico de Avaliações</h1>
        <p className="text-sm text-gray-500 mt-1">Todas as avaliações realizadas por você na plataforma</p>
      </div>

      <div className="space-y-6">
        {mockAvaliacoes.map((a, i) => (
          <article key={i} className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm">
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-8">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center text-orange-400 shrink-0">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-lg leading-snug mb-1">{a.titulo}</h3>
                  <p className="text-xs text-gray-500">{a.curso}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 md:ml-auto">
                <span className="text-xs text-gray-400 font-medium">{a.data}</span>
                <span className={`px-3 py-1.5 rounded-lg text-xs font-bold ${a.badgeColor}`}>{a.badge}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-6">
              <div>
                <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-1">Inovação</p>
                <p className="text-lg font-bold text-gray-900">{a.inovacao}%</p>
              </div>
              <div>
                <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-1">Qualidade técnica</p>
                <p className="text-lg font-bold text-gray-900">{a.qualidade}%</p>
              </div>
              <div>
                <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-1">Aplicabilidade</p>
                <p className="text-lg font-bold text-gray-900">{a.aplicabilidade}%</p>
              </div>
              <div>
                <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-1">Clareza da solução</p>
                <p className="text-lg font-bold text-gray-900">{a.clareza}%</p>
              </div>
            </div>

            <div className="w-full bg-gray-100 rounded-full h-2.5 mb-2 flex overflow-hidden">
               <div className="bg-[#f19f17] h-2.5 rounded-full" style={{ width: `${a.media}%` }}></div>
            </div>
            <div className="text-right mb-8">
              <span className="text-sm font-bold text-gray-900">{a.media}% média</span>
            </div>

            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Parecer</p>
              <p className="text-sm text-gray-700 leading-relaxed mb-4">{a.parecer}</p>
              <p className="text-xs text-gray-400 italic">Avaliado por Prof. {profName} - {a.data}</p>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
