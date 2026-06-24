import React, { useState } from "react";
import { useCoordenacaoProjetos } from "../hooks/useCoordenacaoProjetos";
import { Trophy, Medal, Search, Filter } from "lucide-react";

export default function Ranking() {
  const { projetos: allProjetos, loading } = useCoordenacaoProjetos();
  const [filtros, setFiltros] = useState({
    curso: "Todos",
    turma: "Todos",
    semestre: "Todos"
  });

  // Mocking extra ranking specific data
  const projetos = allProjetos.map((p, idx) => ({
    ...p,
    nota: p.nota || (96 - idx * 2), // mock score
    conceito: p.conceito || (idx < 2 ? "Excelente" : idx < 4 ? "Ótimo" : "Bom"),
    avaliacoes: p.avaliacoes?.length || Math.floor(Math.random() * 5) + 1
  })).sort((a, b) => b.nota - a.nota);

  const getBadgeColor = (conceito) => {
    switch (conceito?.toLowerCase()) {
      case "excelente": return "bg-emerald-100 text-emerald-700";
      case "ótimo": return "bg-blue-100 text-blue-700";
      case "bom": return "bg-amber-100 text-amber-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  const top3 = projetos.slice(0, 3);
  const rest = projetos.slice(3);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Ranking Geral</h1>
        <p className="text-gray-500">Classificação geral dos projetos integradores da instituição</p>
      </div>

      {/* Filtros */}
      <div className="bg-white/70 backdrop-blur-lg p-4 rounded-2xl border flex flex-wrap gap-4 items-center">
        {["Curso", "Turma", "Semestre"].map((filtro) => (
          <div key={filtro} className="flex-1 min-w-[200px]">
            <label className="block text-xs font-medium text-gray-500 mb-1">{filtro}</label>
            <select className="w-full p-2 border rounded-xl bg-white focus:ring-2 focus:ring-[#f19f17] outline-none">
              <option>Todos</option>
            </select>
          </div>
        ))}
      </div>

      {/* Pódio */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* 1o Lugar */}
        {top3[0] && (
          <div className="bg-white/70 backdrop-blur-lg p-6 rounded-2xl border-2 border-[#f19f17] shadow-lg flex flex-col items-center text-center relative overflow-hidden">
            <div className="absolute top-0 w-full h-1 bg-[#f19f17]"></div>
            <Trophy className="w-12 h-12 text-[#f19f17] mb-2" />
            <span className="text-3xl font-bold text-gray-900 mb-4">1º</span>
            <h3 className="font-bold text-gray-900 mb-1 line-clamp-2">{top3[0].titulo}</h3>
            <p className="text-sm text-gray-500 mb-4">{top3[0].curso}</p>
            <div className="flex items-center gap-2 mt-auto">
              <span className="text-2xl font-bold text-gray-900">{top3[0].nota}%</span>
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getBadgeColor(top3[0].conceito)}`}>
                {top3[0].conceito}
              </span>
            </div>
          </div>
        )}

        {/* 2o Lugar */}
        {top3[1] && (
          <div className="bg-white/70 backdrop-blur-lg p-6 rounded-2xl border shadow-sm flex flex-col items-center text-center mt-4">
            <Medal className="w-10 h-10 text-slate-400 mb-2" />
            <span className="text-2xl font-bold text-gray-900 mb-4">2º</span>
            <h3 className="font-bold text-gray-900 mb-1 line-clamp-2">{top3[1].titulo}</h3>
            <p className="text-sm text-gray-500 mb-4">{top3[1].curso}</p>
            <div className="flex items-center gap-2 mt-auto">
              <span className="text-xl font-bold text-gray-900">{top3[1].nota}%</span>
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getBadgeColor(top3[1].conceito)}`}>
                {top3[1].conceito}
              </span>
            </div>
          </div>
        )}

        {/* 3o Lugar */}
        {top3[2] && (
          <div className="bg-white/70 backdrop-blur-lg p-6 rounded-2xl border shadow-sm flex flex-col items-center text-center mt-8">
            <Medal className="w-10 h-10 text-amber-700 mb-2" />
            <span className="text-2xl font-bold text-gray-900 mb-4">3º</span>
            <h3 className="font-bold text-gray-900 mb-1 line-clamp-2">{top3[2].titulo}</h3>
            <p className="text-sm text-gray-500 mb-4">{top3[2].curso}</p>
            <div className="flex items-center gap-2 mt-auto">
              <span className="text-xl font-bold text-gray-900">{top3[2].nota}%</span>
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getBadgeColor(top3[2].conceito)}`}>
                {top3[2].conceito}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Classificação Completa */}
      <div className="bg-white/70 backdrop-blur-lg rounded-2xl border shadow-sm overflow-hidden">
        <div className="p-4 border-b">
          <h2 className="font-bold text-gray-900">Classificação Completa ({projetos.length})</h2>
        </div>
        <div className="divide-y">
          {rest.map((projeto, index) => (
            <div key={projeto.id} className="p-4 flex items-center gap-4 hover:bg-gray-50 transition-colors">
              <div className="w-12 text-center font-bold text-gray-500">{index + 4}º</div>
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900">{projeto.titulo}</h4>
                <p className="text-sm text-gray-500">{projeto.curso} • {projeto.avaliacoes} avaliações</p>
              </div>
              <div className="text-right flex items-center gap-4">
                <div>
                  <span className="text-lg font-bold text-gray-900">{projeto.nota}%</span>
                  <p className="text-xs text-gray-500">Média</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getBadgeColor(projeto.conceito)}`}>
                  {projeto.conceito}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
