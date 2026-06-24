import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, User, Mail, ExternalLink } from "lucide-react";
import { useEmpresaPortfolios } from "../hooks/useEmpresaPortfolios";

export default function Talentos() {
  const { alunos, loading } = useEmpresaPortfolios();
  const [busca, setBusca] = useState("");
  const navigate = useNavigate();

  const talentosFiltrados = alunos.filter(a => 
    a.nome.toLowerCase().includes(busca.toLowerCase()) || 
    (a.curso && a.curso.toLowerCase().includes(busca.toLowerCase()))
  );

  return (
    <div className="animate-in fade-in zoom-in-95 duration-200 pb-12">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Talentos</h1>
        <p className="text-sm text-gray-500 mt-1">Identifique estudantes com competências alinhadas ao seu negócio</p>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Buscar por nome ou competência..." 
            value={busca} 
            onChange={e => setBusca(e.target.value)} 
            className="w-full pl-11 pr-4 py-3.5 bg-white border border-gray-200 focus:border-[#f19f17] rounded-2xl text-sm font-medium outline-none transition-colors shadow-sm" 
          />
        </div>
        <select className="px-4 py-3.5 bg-white border border-gray-200 focus:border-[#f19f17] rounded-2xl text-sm font-medium text-gray-700 outline-none w-full md:w-64 shadow-sm appearance-none cursor-pointer">
          <option>Todos os cursos</option>
        </select>
      </div>

      {loading ? (
        <div className="text-center py-12 text-gray-400 font-semibold animate-pulse">Carregando talentos...</div>
      ) : (
        <div className="space-y-4">
          {talentosFiltrados.map((t, i) => {
            const mockTechs = (t.competencias || "IA/ML, Python, React, Liderança").split(',').map(c => c.trim()).slice(0, 4);
            const mediaMock = ["92%", "88%", "96%", "85%"][i % 4];
            const projMock = ["2", "2", "3", "1"][i % 4];
            const contatoAutorizado = i !== 2; // Simula que o terceiro não autorizou

            return (
              <div key={t.id} className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm hover:border-gray-300 transition-colors flex flex-col lg:flex-row lg:items-center gap-6">
                
                {/* Foto Redonda */}
                <div className="w-16 h-16 rounded-full bg-emerald-500 text-white flex items-center justify-center text-2xl shadow-sm shrink-0">
                  <User size={30} />
                </div>
                
                {/* Info Principal */}
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-gray-900 leading-snug">{t.nome}</h3>
                  <p className="text-xs text-gray-500 mt-1 mb-3">{t.curso} · 4º semestre</p>
                  
                  <div className="flex flex-wrap gap-2 mb-3">
                    {mockTechs.map((h, j) => (
                      <span key={j} className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-100 px-2.5 py-1 rounded-full">{h}</span>
                    ))}
                  </div>

                  <div className="flex items-center gap-2 text-xs font-semibold">
                    <Mail size={14} className="text-gray-400" />
                    {contatoAutorizado ? (
                      <>
                        <a href={`mailto:${t.email}`} className="text-[#f19f17] hover:underline">{t.email}</a>
                        <span className="text-emerald-500 bg-emerald-50 px-2 py-0.5 rounded ml-2">Contato autorizado</span>
                      </>
                    ) : (
                      <span className="text-gray-400">Contato não autorizado pelo aluno</span>
                    )}
                  </div>
                </div>

                {/* Métricas e Ação */}
                <div className="flex lg:flex-col items-center lg:items-end justify-between lg:justify-center border-t border-gray-100 pt-4 lg:pt-0 lg:border-none lg:pl-6 shrink-0 gap-4">
                  <div className="text-right">
                    <span className="text-[#f19f17] font-bold">{mediaMock}</span> <span className="text-gray-400 text-xs font-semibold">média</span>
                    <span className="text-gray-300 mx-2">•</span>
                    <span className="text-gray-900 font-bold">{projMock}</span> <span className="text-gray-400 text-xs font-semibold">projetos</span>
                  </div>
                  
                  <button 
                    onClick={() => navigate(`/empresa/portfolios/${t.id}`)}
                    className="flex items-center gap-2 text-[#f19f17] font-bold text-sm hover:text-amber-600 transition-colors"
                  >
                    Ver portfólio
                    <ExternalLink size={16} />
                  </button>
                </div>

              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
