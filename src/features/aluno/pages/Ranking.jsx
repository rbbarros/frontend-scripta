import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getProjetos } from "../../../lib/projetosApi";;

export default function Ranking() {
  const navigate = useNavigate();
  const [projetos, setProjetos] = useState([]);
  
  // Filtros (Visuais para compor o layout do Figma)
  const [periodo, setPeriodo] = useState("");
  const [curso, setCurso] = useState("");
  const [area, setArea] = useState("");

  useEffect(() => {
    if (!localStorage.getItem("scripta_token")) {
      navigate("/");
      return;
    }

    getProjetos().then(setProjetos).catch(() => setProjetos([]));
  }, [navigate]);

  const ranking = useMemo(() => {
    // Adicionando mocks de notas para exibir no Ranking, já que o backend atual não fornece notas exatas
    const projetosComNota = projetos.map(p => {
      // Mock properties
      const nota = p.nota || parseFloat((Math.random() * (10 - 8) + 8).toFixed(1));
      const avaliacoes = Math.floor(Math.random() * 20) + 5;
      const projCurso = p.curso || "Engenharia de Software";
      
      return { ...p, _nota: nota, _avaliacoes: avaliacoes, _curso: projCurso };
    });

    // Ordenar pela nota (maior para menor)
    return projetosComNota.sort((a, b) => b._nota - a._nota);
  }, [projetos]);

  // Pegamos os 3 primeiros para o pódio
  const top3 = ranking.slice(0, 3);
  // O restante vai para a lista completa
  const listaCompleta = ranking;

  return (
    <section className="mx-auto flex max-w-5xl flex-col gap-8">
      <div className="mb-2">
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Ranking de Projetos</h1>
        <p className="mt-2 text-sm text-gray-500">Projetos mais bem avaliados da plataforma</p>
      </div>

      {/* Pódio Top 3 */}
      {top3.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
          {/* 2º Lugar */}
          {top3[1] && (
            <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm flex flex-col items-center text-center order-2 md:order-1 h-full justify-between">
              <div className="flex flex-col items-center">
                <span className="text-gray-400 mb-1">🥈</span>
                <h2 className="text-2xl font-bold text-gray-700 mb-4">2º</h2>
                <h3 className="text-sm font-bold text-gray-800 mb-1">{top3[1].titulo}</h3>
                <p className="text-xs text-gray-500">{top3[1]._curso}</p>
              </div>
              <div className="mt-6 flex items-center gap-4 text-sm">
                <span className="font-bold text-gray-800 flex items-center gap-1">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#f19f17]"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                  {top3[1]._nota.toFixed(1)}
                </span>
                <span className="text-gray-500">{top3[1]._avaliacoes} avaliações</span>
              </div>
            </div>
          )}

          {/* 1º Lugar */}
          <div className="rounded-3xl border-2 border-[#f19f17] bg-white p-8 shadow-md flex flex-col items-center text-center order-1 md:order-2 transform md:-translate-y-4">
            <div className="flex flex-col items-center">
              <span className="text-[#f19f17] text-xl mb-1">🏆</span>
              <h2 className="text-4xl font-bold text-[#f19f17] mb-4">1º</h2>
              <h3 className="text-base font-bold text-gray-900 mb-1">{top3[0].titulo}</h3>
              <p className="text-xs text-gray-500">{top3[0]._curso}</p>
            </div>
            <div className="mt-6 flex items-center gap-4 text-sm bg-white px-4 py-2 rounded-full border border-gray-100">
              <span className="font-bold text-gray-800 flex items-center gap-1">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#f19f17]"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                {top3[0]._nota.toFixed(1)}
              </span>
              <span className="text-gray-500 font-medium">{top3[0]._avaliacoes} avaliações</span>
            </div>
          </div>

          {/* 3º Lugar */}
          {top3[2] && (
            <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm flex flex-col items-center text-center order-3 h-full justify-between">
              <div className="flex flex-col items-center">
                <span className="text-amber-700 mb-1">🥉</span>
                <h2 className="text-2xl font-bold text-gray-700 mb-4">3º</h2>
                <h3 className="text-sm font-bold text-gray-800 mb-1">{top3[2].titulo}</h3>
                <p className="text-xs text-gray-500">{top3[2]._curso}</p>
              </div>
              <div className="mt-6 flex items-center gap-4 text-sm">
                <span className="font-bold text-gray-800 flex items-center gap-1">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#f19f17]"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                  {top3[2]._nota.toFixed(1)}
                </span>
                <span className="text-gray-500">{top3[2]._avaliacoes} avaliações</span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Listagem com Sidebar */}
      <div className="flex flex-col md:flex-row gap-8 items-start mt-4">
        {/* Sidebar Filtros */}
        <div className="w-full md:w-64 shrink-0 bg-white border border-gray-100 rounded-3xl p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-6">
            <span className="text-[#f19f17]">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>
            </span>
            <h2 className="font-bold text-gray-800">Filtros</h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Período</label>
              <select value={periodo} onChange={(e) => setPeriodo(e.target.value)} className="w-full border border-gray-200 rounded-xl p-2.5 text-sm outline-none focus:border-[#f19f17] bg-white">
                <option value="">Todo o tempo</option>
                <option value="mes">Último mês</option>
                <option value="ano">Último ano</option>
              </select>
            </div>
            
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Curso</label>
              <select value={curso} onChange={(e) => setCurso(e.target.value)} className="w-full border border-gray-200 rounded-xl p-2.5 text-sm outline-none focus:border-[#f19f17] bg-white">
                <option value="">Todos os cursos</option>
                <option value="Engenharia de Software">Engenharia de Software</option>
                <option value="Ciência da Computação">Ciência da Computação</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Área de conhecimento</label>
              <select value={area} onChange={(e) => setArea(e.target.value)} className="w-full border border-gray-200 rounded-xl p-2.5 text-sm outline-none focus:border-[#f19f17] bg-white">
                <option value="">Todas as áreas</option>
                <option value="Tecnologia">Tecnologia</option>
                <option value="Negócios">Negócios</option>
              </select>
            </div>
          </div>
        </div>

        {/* Lista Completa */}
        <div className="flex-1 w-full bg-white border border-gray-100 rounded-3xl p-6 shadow-sm">
          <h2 className="text-lg font-bold text-gray-800 border-b border-gray-100 pb-4 mb-4">Classificação Completa</h2>
          
          <div className="space-y-0">
            {listaCompleta.map((projeto, index) => (
              <div key={projeto.id} className="flex items-center justify-between py-4 border-b border-gray-50 last:border-0 hover:bg-gray-50 px-2 rounded-xl transition-colors">
                <div className="flex items-center gap-4">
                  <div className={`w-8 text-center font-bold ${index === 0 ? 'text-[#f19f17] text-xl' : index === 1 ? 'text-gray-400 text-lg' : index === 2 ? 'text-amber-700 text-lg' : 'text-gray-300'}`}>
                    {index === 0 ? '🏆' : index === 1 ? '🥈' : index === 2 ? '🥉' : `${index + 1}º`}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-gray-800">{projeto.titulo}</h3>
                    <p className="text-xs text-gray-500">{projeto._curso}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-6 text-right">
                  <div>
                    <div className="text-sm font-bold text-gray-800 flex items-center justify-end gap-1">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#f19f17]"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                      {projeto._nota.toFixed(1)}
                    </div>
                    <div className="text-[10px] text-gray-400 uppercase tracking-wide">Nota</div>
                  </div>
                  <div className="w-16">
                    <div className="text-sm font-bold text-gray-700">{projeto._avaliacoes}</div>
                    <div className="text-[10px] text-gray-400 uppercase tracking-wide">Avaliações</div>
                  </div>
                </div>
              </div>
            ))}
            {!listaCompleta.length && (
              <div className="py-8 text-center text-sm text-gray-500">
                Nenhum projeto disponível para ranking.
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}