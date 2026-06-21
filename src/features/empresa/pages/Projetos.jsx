import React, { useEffect, useState } from "react";
import { getProjetos } from "../../../lib/authService";

export default function Projetos() {
  const [projetos, setProjetos] = useState([]);
  const [busca, setBusca] = useState("");

  useEffect(() => {
    getProjetos()
      .then((data) => setProjetos(Array.isArray(data) ? data : []))
      .catch(() => setProjetos([]));
  }, []);

  // Mock de Projetos se a API não retornar nada
  const mockProjetos = [
    { id: 1, titulo: "Sistema de IA para Diagnóstico Médico", curso: "Engenharia de Software - Inteligência Artificial - 1º/2025", tags: ["Python", "TensorFlow", "React", "FastAPI"], aval: "Excelente", color: "bg-emerald-50 text-emerald-700" },
    { id: 2, titulo: "Plataforma de Blockchain para Certificados", curso: "Ciência da Computação - Blockchain - 2º/2024", tags: ["Solidity", "Ethereum", "Node.js", "React"], aval: "Excelente", color: "bg-emerald-50 text-emerald-700" },
    { id: 3, titulo: "App de Realidade Aumentada Educacional", curso: "Design Digital - Mobile - 1º/2025", tags: ["Unity", "ARKit", "ARCore", "C#"], aval: "Ótimo", color: "bg-blue-50 text-blue-700" },
    { id: 4, titulo: "App de Mobilidade Urbana Inteligente", curso: "Sistemas de Informação - Desenvolvimento Web - 1º/2025", tags: ["React Native", "Node.js", "PostgreSQL", "Maps API"], aval: "Bom", color: "bg-amber-50 text-amber-700" },
  ];

  const exibidos = projetos.length > 0 ? projetos : mockProjetos;

  return (
    <>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Projetos</h1>
        <p className="text-sm text-gray-500 mt-1">Explore projetos acadêmicos autorizados para visualização</p>
      </div>

      <div className="bg-white p-4 rounded-2xl border border-gray-100 flex flex-col md:flex-row gap-4 mb-8 shadow-sm">
        <div className="relative flex-1">
          <svg className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
          <input type="text" placeholder="Tema, tecnologia ou palavra-chave..." value={busca} onChange={e => setBusca(e.target.value)} className="w-full pl-11 pr-4 py-3 bg-gray-50 border-transparent focus:bg-white rounded-xl text-sm outline-none transition-colors border focus:border-[#f19f17]" />
        </div>
        <select className="px-4 py-3 bg-gray-50 border border-transparent focus:bg-white focus:border-[#f19f17] rounded-xl text-sm font-medium text-gray-700 outline-none w-full md:w-64">
          <option>Todas as áreas</option>
          <option>Tecnologia</option>
          <option>Design</option>
        </select>
        <select className="px-4 py-3 bg-gray-50 border border-transparent focus:bg-white focus:border-[#f19f17] rounded-xl text-sm font-medium text-gray-700 outline-none w-full md:w-64">
          <option>Todos os cursos</option>
          <option>Eng. Software</option>
          <option>Ciência da Computação</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {(Array.isArray(exibidos) ? exibidos : []).map((p, i) => {
          const rawTags = p.tags || ["Tecnologia", "Acadêmico", "Web"];
          const tags = Array.isArray(rawTags) ? rawTags : [rawTags];
          const aval = p.aval || "Excelente";
          const color = p.color || "bg-emerald-50 text-emerald-700";

          return (
            <article key={p.id || i} className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm hover:border-[#f19f17] transition-all group flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start mb-3">
                  <h3 className="font-bold text-gray-900 leading-snug">{p.titulo}</h3>
                  <span className={`px-2 py-1 rounded text-[10px] font-bold ${color}`}>{aval}</span>
                </div>
                <p className="text-xs text-gray-500 mb-6">{p.curso || "Curso não informado"}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                {tags.map((t, idx) => (
                  <span key={idx} className="px-3 py-1 bg-gray-50 text-gray-500 rounded-lg text-[10px] font-semibold">{t}</span>
                ))}
              </div>
            </article>
          );
        })}
      </div>
    </>
  );
}
