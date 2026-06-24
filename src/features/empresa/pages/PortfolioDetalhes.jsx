import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { User, ArrowLeft, Briefcase, FileText, Code, CheckCircle, Award, Mail } from "lucide-react";
import { usePortfolioDetalhes } from "../hooks/usePortfolioDetalhes";

export default function PortfolioDetalhes() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { aluno, loading } = usePortfolioDetalhes(id);

  if (loading) {
    return <div className="p-8 text-center text-gray-500 animate-pulse">Carregando portfólio...</div>;
  }

  if (!aluno) {
    return <div className="p-8 text-center text-red-500">Aluno não encontrado.</div>;
  }

  // Fallbacks mockados para dados que não existem no backend ainda
  const mockProjetos = [
    { titulo: "Sistema de IA para Diagnóstico Médico", desc: "Desenvolvimento de IA com Python e FastAPI para área médica." },
    { titulo: "App de Gestão Escolar", desc: "Aplicativo mobile feito com React Native para controle de faltas." }
  ];
  
  const mockCompetencias = (aluno.competencias || "Liderança, Resolução de Problemas, Trabalho em Equipe, Inovação").split(',').map(c => c.trim());
  const mockTechs = ["Python", "TensorFlow", "React", "Node.js", "PostgreSQL"];
  const mockExps = ["Monitor de Algoritmos (2024)", "Hackathon Senac 1º lugar (2024)"];
  const mockCerts = ["Certificado de Projeto Integrador - 1º/2025", "Certificado de IA Avançada"];

  return (
    <div className="animate-in fade-in zoom-in-95 duration-200 pb-12">
      <button 
        onClick={() => navigate("/empresa/portfolios")}
        className="flex items-center text-[#f19f17] font-semibold hover:text-amber-600 mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Voltar para portfólios
      </button>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Painel Esquerdo (Perfil) */}
        <aside className="lg:w-1/3">
          <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm flex flex-col items-center">
            <div className="w-24 h-24 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-4xl mb-6 shadow-sm">
              <User size={48} />
            </div>
            
            <h1 className="text-xl font-bold text-gray-900 text-center">{aluno.nome}</h1>
            <p className="text-sm text-gray-500 text-center mt-1">{aluno.curso}</p>
            <p className="text-xs text-gray-400 text-center mt-1">4º semestre</p>

            <div className="flex gap-4 mt-4">
              <a href={aluno.github_url || "#"} className="text-gray-400 hover:text-gray-700 flex items-center gap-1 text-xs font-semibold">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg> GitHub
              </a>
              <a href={aluno.linkedin_url || "#"} className="text-blue-500 hover:text-blue-600 flex items-center gap-1 text-xs font-semibold">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg> LinkedIn
              </a>
            </div>

            <div className="w-full grid grid-cols-3 gap-2 mt-8 border-t border-gray-100 pt-6">
              <div className="text-center">
                <span className="block font-bold text-gray-900 text-lg">2</span>
                <span className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">Projetos</span>
              </div>
              <div className="text-center">
                <span className="block font-bold text-gray-900 text-lg">2</span>
                <span className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">Cert.</span>
              </div>
              <div className="text-center">
                <span className="block font-bold text-[#f19f17] text-lg">92%</span>
                <span className="text-[10px] text-[#f19f17] uppercase font-bold tracking-wider">Média</span>
              </div>
            </div>

            <button className="w-full mt-8 flex items-center justify-center gap-2 py-3 rounded-xl bg-[#f19f17] text-white font-bold hover:bg-amber-500 transition-colors">
              <Mail size={16} />
              Contatar Aluno
            </button>
          </div>
        </aside>

        {/* Painel Direito (Conteúdo) */}
        <main className="lg:w-2/3 space-y-6">
          
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
            <h3 className="flex items-center gap-2 text-lg font-bold text-gray-900 mb-4">
              <Briefcase className="text-[#f19f17]" size={20} />
              Projetos Desenvolvidos
            </h3>
            <div className="space-y-3">
              {mockProjetos.map((p, i) => (
                <div key={i} className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100">
                  <div className="text-[#f19f17] mt-1"><Award size={16} /></div>
                  <div>
                    <h4 className="font-bold text-gray-800 text-sm">{p.titulo}</h4>
                    <p className="text-xs text-gray-500 mt-0.5">{p.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
            <h3 className="flex items-center gap-2 text-lg font-bold text-gray-900 mb-4">
              <Code className="text-gray-400" size={20} />
              Tecnologias
            </h3>
            <div className="flex flex-wrap gap-2">
              {mockTechs.map(t => (
                <span key={t} className="px-3 py-1 bg-orange-50 text-orange-600 rounded-lg text-xs font-bold">{t}</span>
              ))}
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
            <h3 className="flex items-center gap-2 text-lg font-bold text-gray-900 mb-4">
              <CheckCircle className="text-[#f19f17]" size={20} />
              Competências
            </h3>
            <div className="flex flex-wrap gap-2">
              {mockCompetencias.map(c => (
                <span key={c} className="px-3 py-1 border border-gray-200 text-gray-600 rounded-lg text-xs font-semibold">{c}</span>
              ))}
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
            <h3 className="flex items-center gap-2 text-lg font-bold text-gray-900 mb-4">
              <Briefcase className="text-gray-400" size={20} />
              Experiências
            </h3>
            <ul className="list-disc list-inside space-y-2 text-sm text-gray-600 font-medium">
              {mockExps.map((e, i) => <li key={i}>{e}</li>)}
            </ul>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
            <h3 className="flex items-center gap-2 text-lg font-bold text-gray-900 mb-4">
              <FileText className="text-[#f19f17]" size={20} />
              Certificados ({mockCerts.length})
            </h3>
            <ul className="space-y-3">
              {mockCerts.map((c, i) => (
                <li key={i} className="flex items-center gap-3 text-sm text-gray-700 font-medium p-3 border border-gray-100 rounded-xl bg-gray-50">
                   <Award className="text-[#f19f17]" size={16} />
                   {c}
                </li>
              ))}
            </ul>
          </div>

        </main>
      </div>
    </div>
  );
}
