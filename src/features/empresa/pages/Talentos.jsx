import React, { useState } from "react";

export default function Talentos() {
  const [busca, setBusca] = useState("");

  const talentos = [
    { nome: "Ana Carolina Silva", curso: "Engenharia de Software", semestre: "6º Semestre", hab: ["React", "Node.js", "Python"], foto: "A" },
    { nome: "Pedro Henrique Costa", curso: "Ciência da Computação", semestre: "8º Semestre", hab: ["Java", "Spring Boot", "AWS"], foto: "P" },
    { nome: "Mariana Mendes", curso: "Design Digital", semestre: "4º Semestre", hab: ["Figma", "UI/UX", "Adobe XD"], foto: "M" },
    { nome: "Lucas Pereira", curso: "Sistemas de Informação", semestre: "5º Semestre", hab: ["SQL", "PowerBI", "Python"], foto: "L" },
  ];

  return (
    <div className="animate-in fade-in zoom-in-95 duration-200">
      <div className="mb-8 flex flex-col md:flex-row justify-between md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Banco de Talentos</h1>
          <p className="text-sm text-gray-500 mt-1">Descubra e recrute os melhores talentos da instituição</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-3xl border border-gray-100 mb-8 shadow-sm">
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <div className="relative flex-1">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
            <input type="text" placeholder="Buscar por nome, habilidade..." value={busca} onChange={e => setBusca(e.target.value)} className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 focus:border-[#f19f17] rounded-xl text-sm outline-none transition-colors" />
          </div>
          <select className="px-4 py-3 bg-white border border-gray-200 focus:border-[#f19f17] rounded-xl text-sm font-medium text-gray-700 outline-none w-full md:w-48"><option>Todos os Cursos</option></select>
          <select className="px-4 py-3 bg-white border border-gray-200 focus:border-[#f19f17] rounded-xl text-sm font-medium text-gray-700 outline-none w-full md:w-48"><option>Semestre</option></select>
          <select className="px-4 py-3 bg-white border border-gray-200 focus:border-[#f19f17] rounded-xl text-sm font-medium text-gray-700 outline-none w-full md:w-48"><option>Habilidades</option></select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {talentos.map((t, i) => (
          <div key={i} className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm hover:border-[#f19f17] transition-colors group flex flex-col">
            <div className="flex flex-col items-center mb-4">
              <div className="w-20 h-20 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-3xl font-bold mb-4 shadow-sm">
                {t.foto}
              </div>
              <h3 className="text-sm font-bold text-gray-900 text-center leading-snug">{t.nome}</h3>
              <p className="text-[10px] text-gray-500 text-center font-bold uppercase tracking-widest mt-1">{t.curso}</p>
              <p className="text-xs text-gray-400 text-center mt-1">{t.semestre}</p>
            </div>
            
            <div className="flex flex-wrap justify-center gap-1.5 mb-6 mt-auto">
              {t.hab.map((h, j) => (
                <span key={j} className="text-[10px] font-bold text-gray-600 bg-gray-100 px-2 py-1 rounded-md border border-gray-200">{h}</span>
              ))}
            </div>

            <button className="w-full py-2.5 rounded-xl border-2 border-[#f19f17] text-[#f19f17] text-sm font-bold hover:bg-amber-50 transition-colors mt-auto group-hover:bg-[#f19f17] group-hover:text-white">
              Ver perfil completo
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
