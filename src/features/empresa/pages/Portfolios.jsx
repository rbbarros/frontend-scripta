import React from "react";

export default function Portfolios() {
  const portfolios = [
    { titulo: "Sistema de IA para Diagnóstico Médico", area: "Inteligência Artificial", status: "Aprovado", tags: ["Python", "TensorFlow", "React", "FastAPI"], aval: "Excelente", pessoas: 4, score: "9.8" },
    { titulo: "Plataforma de Blockchain para Certificados", area: "Segurança da Informação", status: "Aprovado", tags: ["Solidity", "Ethereum", "Node.js", "React"], aval: "Excelente", pessoas: 3, score: "9.5" },
    { titulo: "App de Realidade Aumentada Educacional", area: "Design Digital", status: "Aprovado", tags: ["Unity", "ARKit", "ARCore", "C#"], aval: "Ótimo", pessoas: 5, score: "8.9" },
    { titulo: "App de Mobilidade Urbana Inteligente", area: "Desenvolvimento Web", status: "Aprovado", tags: ["React Native", "Node.js", "PostgreSQL", "Maps API"], aval: "Ótimo", pessoas: 4, score: "8.5" },
  ];

  const gradients = [
    "from-blue-500 to-indigo-600",
    "from-emerald-500 to-teal-600",
    "from-purple-500 to-pink-600",
    "from-amber-400 to-orange-500",
  ];

  return (
    <div className="animate-in fade-in zoom-in-95 duration-200">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Portfólios Acadêmicos</h1>
        <p className="text-sm text-gray-500 mt-1">Explore os projetos dos alunos e descubra inovações</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {portfolios.map((p, i) => {
          const gradient = gradients[i % gradients.length];
          return (
            <article key={i} className="rounded-3xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-shadow bg-white flex flex-col group">
              {/* Card Header com gradiente */}
              <div className={`bg-gradient-to-br ${gradient} p-5 h-32 flex flex-col justify-end relative`}>
                <button className="absolute top-4 right-4 bg-white/20 hover:bg-white/40 rounded-full p-2 text-white transition-colors">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
                </button>
              </div>

              {/* Card Body */}
              <div className="p-6 flex flex-col flex-1">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-gray-900 text-sm leading-snug line-clamp-2">{p.titulo}</h3>
                </div>
                
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-4">{p.area}</p>

                <div className="flex flex-wrap gap-1.5 mb-6">
                  {p.tags.map((t, idx) => (
                    <span key={idx} className="bg-gray-50 text-gray-600 px-2.5 py-1 rounded-md text-[10px] font-bold border border-gray-100">{t}</span>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-100 mt-auto mb-4">
                  <div className="flex items-center gap-2">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-amber-500"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                    <span className="text-xs font-bold text-gray-700">{p.score}</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${p.aval === 'Excelente' ? 'bg-emerald-50 text-emerald-700' : 'bg-blue-50 text-blue-700'}`}>{p.aval}</span>
                  </div>
                  <div className="flex items-center gap-1 text-gray-400">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
                    <span className="text-xs">{p.pessoas} alunos</span>
                  </div>
                </div>

                <button className="w-full py-2.5 rounded-xl border border-gray-200 bg-white text-gray-700 text-sm font-bold hover:border-[#f19f17] hover:text-[#f19f17] transition-colors mt-auto group-hover:bg-[#f19f17] group-hover:text-white group-hover:border-transparent flex justify-center items-center gap-2">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                  Entrar em contato
                </button>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
