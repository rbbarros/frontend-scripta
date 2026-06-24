import React from "react";
import { useNavigate } from "react-router-dom";
import { ExternalLink, User } from "lucide-react";
import { useEmpresaPortfolios } from "../hooks/useEmpresaPortfolios";

export default function Portfolios() {
  const { alunos, loading } = useEmpresaPortfolios();
  const navigate = useNavigate();

  // Dados mockados complementares pois o backend não envia métricas de projetos/certificados na rota /alunos/
  const mockTechs = ["Python", "TensorFlow", "React", "+2"];

  return (
    <div className="animate-in fade-in zoom-in-95 duration-200 pb-12">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Portfólios</h1>
        <p className="text-sm text-gray-500 mt-1">Visualize a trajetória acadêmica dos estudantes da Faculdade Senac</p>
      </div>

      {loading ? (
        <div className="text-center py-12 text-gray-400 font-semibold animate-pulse">Carregando portfólios...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {alunos.map((aluno) => {
            return (
              <div 
                key={aluno.id} 
                className="bg-white rounded-[2rem] border border-gray-100 p-8 shadow-sm hover:shadow-md hover:border-gray-200 transition-all flex flex-col items-center cursor-pointer group"
                onClick={() => navigate(`/empresa/portfolios/${aluno.id}`)}
              >
                <div className="w-20 h-20 rounded-full bg-emerald-500 text-white flex items-center justify-center text-3xl mb-4 shadow-sm group-hover:scale-105 transition-transform">
                  <User size={36} />
                </div>
                
                <h3 className="font-bold text-gray-900 text-lg leading-snug text-center">{aluno.nome}</h3>
                <p className="text-xs text-gray-500 text-center mt-1">{aluno.curso}</p>
                <p className="text-[10px] text-gray-400 text-center mt-1 font-semibold uppercase tracking-wider">4º semestre</p>

                <div className="flex gap-4 mt-4 mb-6">
                  <a 
                    href={aluno.github_url || "#"} 
                    className="text-gray-400 hover:text-gray-700 flex items-center gap-1 text-xs font-semibold"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg> GitHub
                  </a>
                  <a 
                    href={aluno.linkedin_url || "#"} 
                    className="text-blue-500 hover:text-blue-600 flex items-center gap-1 text-xs font-semibold"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg> LinkedIn
                  </a>
                </div>

                <div className="w-full space-y-3 mb-6">
                  <div className="flex justify-between items-center text-sm font-semibold text-gray-500">
                    <span>Projetos</span>
                    <span className="text-gray-900 font-bold">2</span>
                  </div>
                  <div className="flex justify-between items-center text-sm font-semibold text-gray-500">
                    <span>Certificados</span>
                    <span className="text-gray-900 font-bold">2</span>
                  </div>
                  <div className="flex justify-between items-center text-sm font-semibold text-gray-500">
                    <span>Média geral</span>
                    <span className="text-[#f19f17] font-bold">92%</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mt-auto justify-center w-full">
                  {mockTechs.map((t, idx) => (
                    <span key={idx} className="bg-gray-50 text-gray-500 px-3 py-1 rounded-full text-[10px] font-bold border border-gray-100">{t}</span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
