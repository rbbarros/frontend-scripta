import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useProfessorProjetos } from "../hooks/useProfessorProjetos";

export default function Projetos() {
  const { projetos, loading } = useProfessorProjetos();
  const [busca, setBusca] = useState("");

  const mockProjetos = [
    { id: 1, titulo: "Sistema de IA para Diagnóstico Médico", curso: "Engenharia de Software - ESW-2A - 1º/2025 - Matutino", integrantes: 4, status: "Pendente", color: "bg-amber-50 text-amber-700" },
    { id: 2, titulo: "Marketplace Sustentável", curso: "Sistemas de Informação - SI-3B - 1º/2025 - Noturno", integrantes: 3, status: "Pendente", color: "bg-amber-50 text-amber-700" },
    { id: 3, titulo: "App de Realidade Aumentada", curso: "Design Digital - DD-1A - 1º/2025 - Matutino", integrantes: 5, status: "Avaliado", color: "bg-emerald-50 text-emerald-700" },
    { id: 4, titulo: "Plataforma de Blockchain para Certificados", curso: "Ciência da Computação - CC-4A - 2º/2024 - Vespertino", integrantes: 3, status: "Avaliado", color: "bg-emerald-50 text-emerald-700" },
  ];

  const exibidos = projetos.length > 0 ? projetos : mockProjetos;

  return (
    <div className="animate-in fade-in zoom-in-95 duration-200">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Projetos</h1>
        <p className="text-sm text-gray-500 mt-1">Gerencie e avalie os projetos integradores</p>
      </div>

      <div className="bg-white p-6 rounded-3xl border border-gray-100 mb-8 shadow-sm">
        <h3 className="flex items-center gap-2 font-bold text-gray-800 text-sm mb-4">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#f19f17]"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon></svg>
          Filtros
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">Curso</label>
            <select className="w-full px-3 py-2.5 bg-white border border-gray-200 focus:border-[#f19f17] rounded-xl text-sm text-gray-600 outline-none">
              <option>Todos</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">Turma</label>
            <select className="w-full px-3 py-2.5 bg-white border border-gray-200 focus:border-[#f19f17] rounded-xl text-sm text-gray-600 outline-none">
              <option>Todos</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">Semestre</label>
            <select className="w-full px-3 py-2.5 bg-white border border-gray-200 focus:border-[#f19f17] rounded-xl text-sm text-gray-600 outline-none">
              <option>Todos</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">Período</label>
            <select className="w-full px-3 py-2.5 bg-white border border-gray-200 focus:border-[#f19f17] rounded-xl text-sm text-gray-600 outline-none">
              <option>Todos</option>
            </select>
          </div>
        </div>

        <div className="relative">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
          <input type="text" placeholder="Buscar por título..." value={busca} onChange={e => setBusca(e.target.value)} className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 focus:border-[#f19f17] rounded-xl text-sm outline-none transition-colors" />
        </div>
      </div>

      <div>
        <h2 className="text-lg font-bold text-gray-800 mb-4">Projetos ({exibidos.length})</h2>
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
          {exibidos.map((p, i) => {
            const isLast = i === exibidos.length - 1;
            return (
              <Link key={p.id || i} to={`/professor/projetos/${p.id || 1}`} className={`flex flex-col md:flex-row md:items-center justify-between p-6 hover:bg-gray-50 transition-colors ${!isLast ? 'border-b border-gray-50' : ''}`}>
                <div className="flex items-start gap-4 mb-3 md:mb-0">
                  <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center text-[#f19f17] shrink-0">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 text-sm mb-1">{p.titulo}</h3>
                    <p className="text-xs text-gray-500">{p.curso}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1 text-xs text-gray-500 font-medium bg-gray-100 px-2 py-1 rounded-lg">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
                    {p.integrantes || 4}
                  </span>
                  <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold ${p.color || "bg-amber-50 text-amber-700"}`}>
                    {p.status || "Pendente"}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
