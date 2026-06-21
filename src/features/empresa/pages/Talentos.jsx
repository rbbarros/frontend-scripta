import React, { useEffect, useState } from "react";
import { getPortfolioList } from "../../../lib/authService";

export default function Talentos() {
  const [portfolios, setPortfolios] = useState([]);
  const [busca, setBusca] = useState("");

  useEffect(() => {
    getPortfolioList()
      .then((data) => setPortfolios(Array.isArray(data) ? data : []))
      .catch(() => setPortfolios([]));
  }, []);

  const mockTalentos = [
    { nome: "João Silva", curso: "Engenharia de Software - 4º semestre", tags: ["IA/ML", "Python", "React", "Liderança"], email: "joao.silva@portfolio.senac.edu.br", media: "92%", proj: 2, status: "Contato autorizado" },
    { nome: "Maria Santos", curso: "Sistemas de Informação - 6º semestre", tags: ["UX Design", "Vue.js", "Python", "Gestão Ágil"], email: "maria.santos@portfolio.senac.edu.br", media: "88%", proj: 2, status: "Contato autorizado" },
    { nome: "Pedro Costa", curso: "Ciência da Computação - 8º semestre", tags: ["Blockchain", "Go", "Rust", "Arquitetura de Sistemas"], email: "Contato não autorizado pelo aluno", media: "96%", proj: 3, status: "Não autorizado" }
  ];

  const exibidos = portfolios.length > 0 ? portfolios : mockTalentos;

  return (
    <>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Talentos</h1>
        <p className="text-sm text-gray-500 mt-1">Identifique estudantes com competências alinhadas ao seu negócio</p>
      </div>

      <div className="bg-white p-4 rounded-2xl border border-gray-100 flex flex-col md:flex-row gap-4 mb-8 shadow-sm">
        <div className="relative flex-1">
          <svg className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
          <input type="text" placeholder="Buscar por nome ou competência..." value={busca} onChange={e => setBusca(e.target.value)} className="w-full pl-11 pr-4 py-3 bg-gray-50 border-transparent focus:bg-white rounded-xl text-sm outline-none transition-colors border focus:border-[#f19f17]" />
        </div>
        <select className="px-4 py-3 bg-gray-50 border border-transparent focus:bg-white focus:border-[#f19f17] rounded-xl text-sm font-medium text-gray-700 outline-none w-full md:w-64">
          <option>Todos os cursos</option>
          <option>Eng. Software</option>
          <option>Ciência da Computação</option>
        </select>
      </div>

      <div className="space-y-4">
        {(Array.isArray(exibidos) ? exibidos : []).map((t, i) => {
          const rawTags = t.tags || ["Tecnologia"];
          const tags = Array.isArray(rawTags) ? rawTags : [rawTags];
          
          return (
          <article key={i} className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex items-start gap-6 w-full md:w-auto">
              <div className="w-14 h-14 bg-[#10b981] rounded-full flex items-center justify-center text-white shrink-0 shadow-sm">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-gray-900 leading-snug">{t.nome || "Estudante"}</h3>
                <p className="text-xs text-gray-500 mt-1 mb-3">{t.curso || "Curso não informado"}</p>
                
                <div className="flex flex-wrap gap-2 mb-3">
                  {tags.map((tag, idx) => (
                    <span key={idx} className="px-3 py-1 bg-emerald-50 text-emerald-700 rounded-lg text-[10px] font-semibold border border-emerald-100/50">{tag}</span>
                  ))}
                </div>
                
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                  {t.email || "Email não informado"}
                  {t.status === "Contato autorizado" && <span className="text-emerald-500 font-bold ml-1 bg-emerald-50 px-2 py-0.5 rounded">Contato autorizado</span>}
                </div>
              </div>
            </div>

            <div className="flex flex-row md:flex-col items-center md:items-end justify-between w-full md:w-auto gap-4 md:gap-0 h-full">
               <div className="text-right md:mb-6 flex gap-2">
                 <span className="font-bold text-amber-500 text-sm">{t.media || "92%"} média</span>
                 <span className="text-gray-400 text-sm">·</span>
                 <span className="text-gray-500 text-sm">{t.proj || 2} projetos</span>
               </div>
               
               <button className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-amber-600 border border-amber-500 rounded-xl hover:bg-amber-50 transition-colors">
                  Ver portfólio
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
               </button>
            </div>
          </article>
        )})}
      </div>
    </>
  );
}
