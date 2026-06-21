import React, { useEffect, useState } from "react";
import { getProjetos } from "../../../lib/authService";

export default function Ranking() {
  const [projetos, setProjetos] = useState([]);

  useEffect(() => {
    getProjetos()
      .then((data) => setProjetos(Array.isArray(data) ? data : []))
      .catch(() => setProjetos([]));
  }, []);

  const rankingCompleto = [
    { rank: 1, titulo: "Plataforma de Blockchain para Certificados", curso: "Ciência da Computação", media: "96%", avaliacoes: 3, badge: "Excelente", badgeColor: "text-emerald-600 bg-emerald-50", icon: "🏆", border: "border-[#f19f17]" },
    { rank: 2, titulo: "Sistema de IA para Diagnóstico Médico", curso: "Engenharia de Software", media: "92%", avaliacoes: 4, badge: "Excelente", badgeColor: "text-emerald-600 bg-emerald-50", icon: "🥈", border: "border-gray-300" },
    { rank: 3, titulo: "App de Realidade Aumentada Educacional", curso: "Design Digital", media: "88%", avaliacoes: 2, badge: "Ótimo", badgeColor: "text-blue-600 bg-blue-50", icon: "🥉", border: "border-amber-200" },
    { rank: 4, titulo: "Sistema de Gestão Hospitalar", curso: "Engenharia de Software", media: "75%", avaliacoes: 3, badge: "Bom", badgeColor: "text-amber-600 bg-amber-50", icon: "4º", border: "border-gray-100" }
  ];

  return (
    <div className="animate-in fade-in zoom-in-95 duration-200">
      <div className="mb-12">
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Ranking de Projetos</h1>
        <p className="text-sm text-gray-500 mt-1">Classificação dos projetos com base nas avaliações registradas</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {rankingCompleto.slice(0, 3).map((r, i) => (
          <div key={i} className={`bg-white rounded-3xl border-2 ${r.border} p-8 shadow-sm flex flex-col items-center text-center`}>
            <div className="text-4xl mb-4">{r.icon}</div>
            <span className="text-2xl font-black text-gray-900 mb-2">{r.rank}º</span>
            <h3 className="font-bold text-gray-900 text-sm mb-1 leading-snug">{r.titulo}</h3>
            <p className="text-[10px] text-gray-400 mb-6">{r.curso}</p>
            <div className="flex items-center gap-2 mt-auto">
              <span className="font-bold text-[#f19f17] flex items-center gap-1">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                {r.media}
              </span>
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${r.badgeColor}`}>{r.badge}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm">
        <h3 className="text-lg font-bold text-gray-800 mb-6">Classificação Completa</h3>
        <div className="space-y-4">
          {rankingCompleto.map((r, i) => (
            <div key={i} className="flex flex-col md:flex-row items-start md:items-center justify-between p-4 bg-white border border-gray-100 rounded-2xl hover:border-gray-200 transition-colors gap-4">
              <div className="flex items-center gap-6 w-full md:w-auto">
                <div className="w-10 text-center font-bold text-gray-400 text-lg">
                  {i < 3 ? r.icon : r.icon}
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 text-sm mb-1">{r.titulo}</h4>
                  <p className="text-xs text-gray-500">{r.curso}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-6 shrink-0 md:ml-auto w-full md:w-auto justify-end border-t border-gray-50 pt-4 md:pt-0 md:border-none">
                 <div className="text-center">
                   <span className="block font-bold text-gray-900">{r.media}</span>
                   <span className="text-[10px] text-gray-400 uppercase tracking-wider">Média</span>
                 </div>
                 <div className="text-center">
                   <span className="block font-bold text-gray-900">{r.avaliacoes}</span>
                   <span className="text-[10px] text-gray-400 uppercase tracking-wider">Avaliações</span>
                 </div>
                 <div className="w-20 text-right">
                   <span className={`px-3 py-1 rounded-lg text-xs font-bold ${r.badgeColor}`}>{r.badge}</span>
                 </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
