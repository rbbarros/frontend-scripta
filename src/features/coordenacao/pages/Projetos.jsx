import React, { useEffect, useState } from "react";
import { getProjetos } from "../../../lib/authService";

export default function Projetos() {
  const [projetos, setProjetos] = useState([]);
  
  useEffect(() => {
    getProjetos().then(res => setProjetos(Array.isArray(res) ? res : [])).catch(() => {});
  }, []);

  const mock = [
    { titulo: "Sistema de IA para Diagnóstico Médico", curso: "Engenharia de Software", prof: "Prof. Ana Silva", status: "Submetido", data: "28/05/2025" },
    { titulo: "Plataforma Blockchain para Certificados", curso: "Ciência da Computação", prof: "Prof. Carlos Mendes", status: "Aprovado", data: "25/05/2025" },
    { titulo: "App de Mobilidade Urbana Inteligente", curso: "Sistemas de Informação", prof: "Prof. Roberto Costa", status: "Em avaliação", data: "22/05/2025" }
  ];
  
  const exibidos = projetos.length > 0 ? projetos.map(p => ({
    titulo: p.titulo, curso: p.curso || "Engenharia", prof: p.professor_orientador || "Prof. João", status: p.status || "Submetido", data: "Recente"
  })) : mock;

  return (
    <div className="animate-in fade-in zoom-in-95 duration-200">
      <div className="mb-8 flex flex-col md:flex-row justify-between md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Projetos Submetidos</h1>
          <p className="text-sm text-gray-500 mt-1">Visão geral de todos os projetos acadêmicos</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-bold text-gray-700 hover:bg-gray-50 transition-colors shadow-sm">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
          Exportar
        </button>
      </div>

      <div className="bg-white p-6 rounded-3xl border border-gray-100 mb-8 shadow-sm">
        <h3 className="flex items-center gap-2 font-bold text-gray-800 text-sm mb-4">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#f19f17]"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon></svg>
          Filtros
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">Curso</label>
            <select className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-sm text-gray-600 outline-none"><option>Todos os cursos</option></select>
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">Semestre</label>
            <select className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-sm text-gray-600 outline-none"><option>Todos os semestres</option></select>
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">Status</label>
            <select className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-sm text-gray-600 outline-none"><option>Qualquer status</option></select>
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">Ordenar por</label>
            <select className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-sm text-gray-600 outline-none"><option>Mais recentes</option></select>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100 text-[10px] uppercase tracking-widest text-gray-500 font-bold">
                <th className="py-4 px-6">Projeto</th>
                <th className="py-4 px-6">Curso</th>
                <th className="py-4 px-6">Professor</th>
                <th className="py-4 px-6">Status</th>
                <th className="py-4 px-6">Data</th>
                <th className="py-4 px-6"></th>
              </tr>
            </thead>
            <tbody>
              {exibidos.map((p, i) => (
                <tr key={i} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                  <td className="py-4 px-6 font-bold text-sm text-gray-900">{p.titulo}</td>
                  <td className="py-4 px-6 text-sm text-gray-600">{p.curso}</td>
                  <td className="py-4 px-6 text-sm text-gray-600">{p.prof}</td>
                  <td className="py-4 px-6">
                    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-md border ${p.status.toLowerCase() === 'aprovado' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-amber-50 text-amber-700 border-amber-200'}`}>
                      {p.status}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-sm text-gray-500">{p.data}</td>
                  <td className="py-4 px-6 text-right">
                    <button className="text-sm font-bold text-[#f19f17] hover:underline">Ver detalhes</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
