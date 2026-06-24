import React, { useState } from "react";
import { Search, ArrowLeft, User, TrendingUp, Code, Users } from "lucide-react";
import { useEmpresaProjetos } from "../hooks/useEmpresaProjetos";

export default function Projetos() {
  const { projetos, loading } = useEmpresaProjetos();
  const [busca, setBusca] = useState("");
  const [projetoSelecionado, setProjetoSelecionado] = useState(null);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500"></div>
      </div>
    );
  }

  // Mock de Projetos se a API não retornar nada ou para preencher dados faltantes
  const mockProjetos = [
    { id: 1, titulo: "Sistema de IA para Diagnóstico Médico", curso: "Engenharia de Software - Inteligência Artificial - 1º/2025", tags: ["Python", "TensorFlow", "React", "FastAPI"], aval: "Excelente", color: "bg-emerald-50 text-emerald-700", resultados: "Alcançamos 94% de precisão no diagnóstico de doenças respiratórias em imagens de raio-X, reduzindo o tempo de triagem em 40%.", integrantes: ["João Silva", "Maria Santos", "Pedro Costa", "Ana Lima"] },
    { id: 2, titulo: "Plataforma de Blockchain para Certificados", curso: "Ciência da Computação - Blockchain - 2º/2024", tags: ["Solidity", "Ethereum", "Node.js", "React"], aval: "Excelente", color: "bg-emerald-50 text-emerald-700", resultados: "Plataforma funcional que emitiu mais de 500 certificados de teste em rede testnet com tempo de validação inferior a 2 segundos.", integrantes: ["Carlos Eduardo", "Fernanda Souza"] },
    { id: 3, titulo: "App de Realidade Aumentada Educacional", curso: "Design Digital - Mobile - 1º/2025", tags: ["Unity", "ARKit", "ARCore", "C#"], aval: "Ótimo", color: "bg-blue-50 text-blue-700", resultados: "Protótipo testado com 50 alunos do ensino médio, resultando em um aumento de 25% no engajamento nas aulas de química.", integrantes: ["Lucas Mendes", "Mariana Oliveira", "Tiago Silva"] },
    { id: 4, titulo: "App de Mobilidade Urbana Inteligente", curso: "Sistemas de Informação - Desenvolvimento Web - 1º/2025", tags: ["React Native", "Node.js", "PostgreSQL", "Maps API"], aval: "Bom", color: "bg-amber-50 text-amber-700", resultados: "Mapeamento completo de 3 rotas universitárias integradas ao transporte público municipal via API.", integrantes: ["Beatriz Costa", "Rafael Gomes"] },
  ];

  const exibidos = projetos.length > 0 ? projetos.map((p, i) => ({
    ...p,
    id: p.id || i + 1,
    curso: p.curso || mockProjetos[i % mockProjetos.length].curso,
    tags: p.tags || mockProjetos[i % mockProjetos.length].tags,
    aval: mockProjetos[i % mockProjetos.length].aval,
    color: mockProjetos[i % mockProjetos.length].color,
    resultados: p.descricao || mockProjetos[i % mockProjetos.length].resultados,
    integrantes: mockProjetos[i % mockProjetos.length].integrantes
  })) : mockProjetos;

  const projetosFiltrados = exibidos.filter(p => 
    p.titulo.toLowerCase().includes(busca.toLowerCase()) ||
    (p.tags && p.tags.some(t => t.toLowerCase().includes(busca.toLowerCase())))
  );

  if (projetoSelecionado) {
    return (
      <div className="animate-in fade-in zoom-in-95 duration-200 pb-12">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Projetos</h1>
          <p className="text-sm text-gray-500 mt-1">Explore projetos acadêmicos autorizados para visualização</p>
        </div>

        <button 
          onClick={() => setProjetoSelecionado(null)}
          className="flex items-center text-[#f19f17] font-semibold hover:text-amber-600 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar para lista
        </button>

        <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm">
          <div className="flex justify-between items-start mb-2">
            <h2 className="text-xl font-bold text-gray-900">{projetoSelecionado.titulo}</h2>
            <span className={`px-3 py-1 rounded-full text-xs font-bold ${projetoSelecionado.color}`}>{projetoSelecionado.aval}</span>
          </div>
          <p className="text-sm text-gray-500 mb-8 pb-8 border-b border-gray-100">{projetoSelecionado.curso}</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              <h3 className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">
                <TrendingUp className="text-[#f19f17]" size={16} />
                Resultados Alcançados
              </h3>
              <p className="text-sm text-gray-700 leading-relaxed">
                {projetoSelecionado.resultados}
              </p>
            </div>

            <div>
              <h3 className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">
                <Code className="text-[#f19f17]" size={16} />
                Tecnologias
              </h3>
              <div className="flex flex-wrap gap-2">
                {projetoSelecionado.tags.map((t, idx) => (
                  <span key={idx} className="px-3 py-1 bg-amber-50 text-amber-600 rounded-lg text-xs font-bold">{t}</span>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-gray-100">
            <h3 className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">
              <Users className="text-[#f19f17]" size={16} />
              Integrantes
            </h3>
            <div className="flex flex-wrap gap-4">
              {projetoSelecionado.integrantes.map((int, idx) => (
                <div key={idx} className="flex items-center gap-2 bg-gray-50 border border-gray-100 rounded-full pr-4 pl-1 py-1">
                  <div className="w-6 h-6 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center">
                    <User size={12} />
                  </div>
                  <span className="text-xs font-bold text-gray-700">{int}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in zoom-in-95 duration-200 pb-12">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Projetos</h1>
        <p className="text-sm text-gray-500 mt-1">Explore projetos acadêmicos autorizados para visualização</p>
      </div>

      <div className="bg-white p-4 rounded-2xl border border-gray-100 flex flex-col md:flex-row gap-4 mb-8 shadow-sm">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Tema, tecnologia ou palavra-chave..." 
            value={busca} 
            onChange={e => setBusca(e.target.value)} 
            className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 focus:border-[#f19f17] rounded-xl text-sm outline-none transition-colors" 
          />
        </div>
        <select className="px-4 py-3 bg-white border border-gray-200 focus:border-[#f19f17] rounded-xl text-sm font-medium text-gray-700 outline-none w-full md:w-64">
          <option>Todas as áreas</option>
          <option>Tecnologia</option>
          <option>Design</option>
        </select>
        <select className="px-4 py-3 bg-white border border-gray-200 focus:border-[#f19f17] rounded-xl text-sm font-medium text-gray-700 outline-none w-full md:w-64">
          <option>Todos os cursos</option>
          <option>Eng. Software</option>
          <option>Ciência da Computação</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {projetosFiltrados.map((p) => {
          return (
            <article 
              key={p.id} 
              className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm hover:border-[#f19f17] hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
              onClick={() => setProjetoSelecionado(p)}
            >
              <div>
                <div className="flex justify-between items-start mb-3">
                  <h3 className="font-bold text-gray-900 leading-snug group-hover:text-[#f19f17] transition-colors">{p.titulo}</h3>
                  <span className={`px-2 py-1 rounded-full text-[10px] font-bold ${p.color}`}>{p.aval}</span>
                </div>
                <p className="text-xs text-gray-500 mb-6">{p.curso}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                {p.tags.map((t, idx) => (
                  <span key={idx} className="px-3 py-1 bg-gray-50 text-gray-500 rounded-lg text-[10px] font-semibold border border-gray-100">{t}</span>
                ))}
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
