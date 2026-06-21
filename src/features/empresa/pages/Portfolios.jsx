import React, { useEffect, useState } from "react";
import { getPortfolioList } from "../../../lib/authService";

export default function Portfolios() {
  const [portfolios, setPortfolios] = useState([]);

  useEffect(() => {
    getPortfolioList()
      .then((data) => setPortfolios(Array.isArray(data) ? data : []))
      .catch(() => setPortfolios([]));
  }, []);

  const mockPortfolios = [
    { nome: "João Silva", curso: "Engenharia de Software", sem: "4º semestre", proj: 2, cert: 2, media: "92%", tags: ["Python", "TensorFlow", "React", "+2"] },
    { nome: "Maria Santos", curso: "Sistemas de Informação", sem: "6º semestre", proj: 2, cert: 3, media: "88%", tags: ["React", "Vue.js", "Python", "+2"] },
    { nome: "Pedro Costa", curso: "Ciência da Computação", sem: "8º semestre", proj: 3, cert: 4, media: "96%", tags: ["Solidity", "Go", "Rust", "+3"] },
  ];

  const exibidos = portfolios.length > 0 ? portfolios : mockPortfolios;

  return (
    <>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Portfólios</h1>
        <p className="text-sm text-gray-500 mt-1">Visualize a trajetória acadêmica dos estudantes da Faculdade Senac</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {(Array.isArray(exibidos) ? exibidos : []).map((p, i) => {
          const rawTags = p.tags || ["React", "Python", "Node"];
          const tags = Array.isArray(rawTags) ? rawTags : [rawTags];
          
          return (
          <article key={i} className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm hover:shadow-md transition-all flex flex-col items-center">
            <div className="w-16 h-16 bg-[#10b981] rounded-full flex items-center justify-center text-white mb-4 shadow-sm">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
            </div>
            
            <h3 className="text-lg font-bold text-gray-900">{p.nome || "Estudante"}</h3>
            <p className="text-xs text-gray-500 mt-1 text-center">{p.curso || "Engenharia de Software"}<br/>{p.sem || "4º semestre"}</p>
            
            <div className="flex gap-3 mt-3 mb-6">
              <a href="#" className="flex items-center gap-1 text-[10px] font-bold text-gray-500 hover:text-blue-600"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg> GitHub</a>
              <a href="#" className="flex items-center gap-1 text-[10px] font-bold text-blue-600 hover:underline"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg> LinkedIn</a>
            </div>

            <div className="w-full space-y-3 mb-6 border-t border-gray-50 pt-6">
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-500 font-medium">Projetos</span>
                <span className="font-bold text-gray-900">{p.proj || 2}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-500 font-medium">Certificados</span>
                <span className="font-bold text-gray-900">{p.cert || 2}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-500 font-medium">Média geral</span>
                <span className="font-bold text-amber-500">{p.media || "92%"}</span>
              </div>
            </div>

            <div className="flex gap-2 w-full justify-center">
              {tags.map((t, idx) => (
                <span key={idx} className="px-3 py-1 bg-gray-50 text-gray-500 rounded-lg text-[10px] font-semibold">{t}</span>
              ))}
            </div>
          </article>
        )})}
      </div>
    </>
  );
}
