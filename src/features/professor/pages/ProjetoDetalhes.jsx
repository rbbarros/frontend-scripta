import React, { useState } from "react";
import { Link, useParams } from "react-router-dom";
import RealizarAvaliacao from "./RealizarAvaliacao";

export default function ProjetoDetalhes() {
  const { id } = useParams();
  const [showModal, setShowModal] = useState(false);

  // Mock dados do projeto para a tela de detalhes
  const projeto = {
    titulo: "Sistema de IA para Diagnóstico Médico",
    curso: "Engenharia de Software - ESW-2A - 1º/2025",
    status: "Pendente",
    descricao: "Projeto integrador desenvolvido com foco em resolução de problemas reais utilizando tecnologia de ponta. A solução aborda desafios contemporâneos com abordagem prática e metodologia ágil.",
    arquivos: ["Relatório_Final.pdf", "Apresentação.pptx", "Código_Fonte.zip"],
    historico: [
      { versao: "v1.0", data: "28/05/2025", detalhe: "Versão final com correções" },
      { versao: "v0.8", data: "15/05/2025", detalhe: "Adicionada documentação técnica" },
      { versao: "v0.5", data: "01/05/2025", detalhe: "Submissão inicial" }
    ],
    integrantes: "João Silva, Maria Santos, Pedro Costa, Ana Lima",
    professorFocal: "Prof. Ana Silva",
    area: "Inteligência Artificial - Saúde"
  };

  return (
    <div className="animate-in fade-in zoom-in-95 duration-200">
      <div className="mb-6">
        <Link to="/professor/projetos" className="text-sm font-semibold text-[#f19f17] hover:text-[#d68a12] flex items-center gap-1 transition-colors">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
          Voltar para lista
        </Link>
      </div>

      <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm relative">
        {/* Badge Pendente */}
        <div className="absolute top-8 right-8">
          <span className="bg-amber-50 text-amber-700 border border-amber-100 px-3 py-1 rounded-lg text-xs font-bold">
            {projeto.status}
          </span>
        </div>

        <h1 className="text-2xl font-bold text-gray-900 tracking-tight pr-24">{projeto.titulo}</h1>
        <p className="text-sm text-gray-500 mt-1 mb-8">{projeto.curso}</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Coluna Esquerda: Descrição, Arquivos, Histórico */}
          <div className="md:col-span-2 space-y-8">
            <div>
              <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Descrição</h3>
              <p className="text-sm text-gray-700 leading-relaxed">{projeto.descricao}</p>
            </div>

            <div>
              <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Arquivos Enviados</h3>
              <div className="flex flex-wrap gap-4">
                {projeto.arquivos.map((arq, i) => (
                  <button key={i} className="flex items-center gap-2 text-sm text-gray-600 hover:text-[#f19f17] transition-colors">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline></svg>
                    {arq}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Histórico de Versões</h3>
              <div className="space-y-4">
                {projeto.historico.map((hist, i) => (
                  <div key={i} className="flex items-center gap-4 text-sm">
                    <span className="font-bold text-[#f19f17]">{hist.versao}</span>
                    <span className="text-gray-400">{hist.data}</span>
                    <span className="text-gray-600">{hist.detalhe}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4">
              <button 
                onClick={() => setShowModal(true)}
                className="px-6 py-3 bg-[#f19f17] text-white font-bold rounded-xl hover:bg-amber-600 transition-colors shadow-sm shadow-amber-500/20 flex items-center gap-2"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                Avaliar Projeto
              </button>
            </div>
          </div>

          {/* Coluna Direita: Metadados */}
          <div className="space-y-6">
            <div>
              <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Integrantes</h3>
              <p className="text-sm text-gray-700">{projeto.integrantes}</p>
            </div>
            <div>
              <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Professor Focal</h3>
              <p className="text-sm text-gray-700">{projeto.professorFocal}</p>
            </div>
            <div>
              <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Área de Conhecimento</h3>
              <p className="text-sm text-gray-700">{projeto.area}</p>
            </div>
          </div>
        </div>
      </div>

      {showModal && <RealizarAvaliacao projetoId={id} onClose={() => setShowModal(false)} />}
    </div>
  );
}
