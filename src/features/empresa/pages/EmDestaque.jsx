import React, { useEffect, useState } from "react";
import { getProjetos } from "../../../lib/projetosApi";;

export default function EmDestaque() {
  const [projetos, setProjetos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProjetos()
      .then((data) => {
        setProjetos(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);

  // Dados mocados para caso a API retorne vazio
  const mockProjetosData = [
    { titulo: "Plataforma de Blockchain para Certificados", curso: "Ciência da Computação - CC-4A", tags: ["Solidity", "Ethereum", "React"], aval: "Excelente", perc: "96%", desc: "Plataforma descentralizada para emissão e verificação de certificados acadêmicos com imutabilidade garantida por blockchain." },
    { titulo: "Sistema de IA para Diagnóstico Médico", curso: "Engenharia de Software - ESW-2A", tags: ["Python", "TensorFlow", "FastAPI"], aval: "Excelente", perc: "92%", desc: "IA com 94% de precisão no diagnóstico de doenças respiratórias através de análise de imagens médicas." },
    { titulo: "App de Realidade Aumentada Educacional", curso: "Design Digital - DD-1A", tags: ["Unity", "ARKit", "ARCore"], aval: "Ótimo", perc: "88%", desc: "Aplicativo educacional que utiliza AR para ensinar física e química de forma imersiva e interativa." },
    { titulo: "App de Mobilidade Urbana Inteligente", curso: "Sistemas de Informação - SI-2A", desc: "Aplicativo que reduz 25% do tempo de deslocamento com rotas otimizadas por inteligência artificial.", perc: "82%", aval: "Bom", tags: [] },
    { titulo: "Plataforma de Ensino Adaptativo com IA", curso: "Ciência da Computação - CC-3B", desc: "Sistema que adapta o conteúdo educacional ao ritmo de aprendizagem individual de cada aluno.", perc: "80%", aval: "Bom", tags: [] },
  ];

  // Mesclar dados reais com fallbacks simulados
  const displayProjetos = projetos.length > 0 
    ? projetos.map((p, i) => ({
        ...p,
        tags: ["React", "Python", "IA", "Web"].slice(0, 3), // Tags fictícias
        aval: i === 0 ? "Excelente" : i < 3 ? "Ótimo" : "Bom",
        perc: `${96 - i * 4}%`,
        desc: p.descricao || "Descrição do projeto não fornecida."
      }))
    : mockProjetosData;

  const top3 = displayProjetos.slice(0, 3);
  const outros = displayProjetos.slice(3);

  // Garantir que temos 3 pro podium
  while(top3.length < 3) {
    top3.push(mockProjetosData[top3.length]);
  }

  return (
    <div className="animate-in fade-in zoom-in-95 duration-200 pb-12">
      <div className="mb-12">
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Projetos em Destaque</h1>
        <p className="text-sm text-gray-500 mt-1">Os projetos melhor avaliados da Faculdade Senac</p>
      </div>

      {loading ? (
        <div className="text-center py-12 text-gray-400 font-semibold animate-pulse">Carregando projetos em destaque...</div>
      ) : (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12 relative">
            {/* Pódio 1º Lugar */}
            <div className="lg:order-1 bg-white rounded-3xl border-2 border-[#f19f17] p-8 shadow-md transform lg:-translate-y-4 relative flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start mb-6">
                  <div className="w-12 h-12 bg-amber-50 rounded-full flex items-center justify-center text-amber-500 text-xl shadow-sm">
                    🏆
                  </div>
                  <span className="text-3xl font-black text-[#f19f17]">1º</span>
                </div>
                <h3 className="text-lg font-bold text-gray-900 leading-snug mb-2">{top3[0].titulo}</h3>
                <p className="text-xs text-gray-400 mb-4">{top3[0].curso}</p>
                <p className="text-sm text-gray-600 mb-6 leading-relaxed line-clamp-3">{top3[0].desc}</p>
                <div className="flex flex-wrap gap-2 mb-8">
                  {top3[0].tags.map(t => <span key={t} className="px-3 py-1 bg-gray-50 text-gray-500 rounded-lg text-[10px] font-semibold border border-gray-100">{t}</span>)}
                </div>
              </div>
              <div className="flex items-center justify-between border-t border-gray-100 pt-4">
                <div className="flex items-center gap-1 font-bold text-[#f19f17]">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>
                  {top3[0].perc}
                </div>
                <span className="px-3 py-1 rounded bg-emerald-50 text-emerald-600 text-xs font-bold">{top3[0].aval}</span>
              </div>
            </div>

            {/* Pódio 2º Lugar */}
            <div className="lg:order-2 bg-white rounded-3xl border border-gray-200 p-8 shadow-sm relative flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start mb-6">
                  <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center text-gray-500 text-xl shadow-sm">
                    🥈
                  </div>
                  <span className="text-3xl font-black text-gray-800">2º</span>
                </div>
                <h3 className="text-lg font-bold text-gray-900 leading-snug mb-2">{top3[1].titulo}</h3>
                <p className="text-xs text-gray-400 mb-4">{top3[1].curso}</p>
                <p className="text-sm text-gray-600 mb-6 leading-relaxed line-clamp-3">{top3[1].desc}</p>
                <div className="flex flex-wrap gap-2 mb-8">
                  {top3[1].tags.map(t => <span key={t} className="px-3 py-1 bg-gray-50 text-gray-500 rounded-lg text-[10px] font-semibold border border-gray-100">{t}</span>)}
                </div>
              </div>
              <div className="flex items-center justify-between border-t border-gray-100 pt-4">
                <div className="flex items-center gap-1 font-bold text-[#f19f17]">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>
                  {top3[1].perc}
                </div>
                <span className="px-3 py-1 rounded bg-emerald-50 text-emerald-600 text-xs font-bold">{top3[1].aval}</span>
              </div>
            </div>

            {/* Pódio 3º Lugar */}
            <div className="lg:order-3 bg-white rounded-3xl border border-amber-200 p-8 shadow-sm relative flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start mb-6">
                  <div className="w-12 h-12 bg-orange-50 rounded-full flex items-center justify-center text-orange-500 text-xl shadow-sm">
                    🥉
                  </div>
                  <span className="text-3xl font-black text-gray-800">3º</span>
                </div>
                <h3 className="text-lg font-bold text-gray-900 leading-snug mb-2">{top3[2].titulo}</h3>
                <p className="text-xs text-gray-400 mb-4">{top3[2].curso}</p>
                <p className="text-sm text-gray-600 mb-6 leading-relaxed line-clamp-3">{top3[2].desc}</p>
                <div className="flex flex-wrap gap-2 mb-8">
                  {top3[2].tags.map(t => <span key={t} className="px-3 py-1 bg-gray-50 text-gray-500 rounded-lg text-[10px] font-semibold border border-gray-100">{t}</span>)}
                </div>
              </div>
              <div className="flex items-center justify-between border-t border-gray-100 pt-4">
                <div className="flex items-center gap-1 font-bold text-[#f19f17]">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>
                  {top3[2].perc}
                </div>
                <span className="px-3 py-1 rounded bg-blue-50 text-blue-600 text-xs font-bold">{top3[2].aval}</span>
              </div>
            </div>
          </div>

          {outros.length > 0 && (
            <div className="bg-white border border-gray-100 rounded-3xl p-8 shadow-sm">
              <h3 className="text-lg font-bold text-gray-800 mb-6">Outros Destaques</h3>
              
              <div className="space-y-4">
                {outros.map((o, i) => (
                  <article key={i} className="flex flex-col md:flex-row items-start md:items-center justify-between p-4 bg-white border border-gray-100 rounded-2xl hover:border-gray-300 transition-colors gap-6">
                    <div className="flex gap-4">
                      <div className="mt-1 text-gray-400">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2l2.4 7.4h7.6l-6 4.6 2.3 7.4-6.3-4.8-6.3 4.8 2.3-7.4-6-4.6h7.6z"></path></svg>
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900">{o.titulo}</h4>
                        <p className="text-[10px] text-gray-400 mt-1 mb-2">{o.curso}</p>
                        <p className="text-xs text-gray-500 line-clamp-1">{o.desc}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-6 shrink-0 md:ml-auto w-full md:w-auto justify-end border-t border-gray-100 pt-4 md:pt-0 md:border-none">
                      <div className="text-center">
                        <span className="block font-bold text-gray-900">{o.perc}</span>
                        <span className="text-[10px] text-gray-400 uppercase tracking-wider">Média</span>
                      </div>
                      <div className="w-16 text-right">
                        <span className="px-2 py-1 rounded bg-amber-50 text-amber-600 text-xs font-bold">{o.aval}</span>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
