import React, { useEffect, useState } from "react";

import { ArrowRight, Trophy } from "lucide-react";

import { useNavigate } from "react-router-dom";

import { getDestaques } from "../../../lib/rankingApi";

export default function EmDestaque() {
  const navigate = useNavigate();

  const [projetos, setProjetos] = useState([]);

  const [loading, setLoading] = useState(true);

  const [erro, setErro] = useState("");

  useEffect(() => {
    let componenteAtivo = true;

    async function carregarDestaques() {
      setLoading(true);
      setErro("");

      try {
        const data = await getDestaques({}, 20);

        if (!componenteAtivo) {
          return;
        }

        setProjetos(Array.isArray(data?.destaques) ? data.destaques : []);
      } catch (error) {
        if (!componenteAtivo) {
          return;
        }

        setProjetos([]);

        setErro(error.message || "Não foi possível carregar os destaques.");
      } finally {
        if (componenteAtivo) {
          setLoading(false);
        }
      }
    }

    carregarDestaques();

    return () => {
      componenteAtivo = false;
    };
  }, []);

  if (loading) {
    return (
      <div className="py-12 text-center text-sm font-semibold text-gray-400">
        Carregando projetos em destaque...
      </div>
    );
  }

  return (
    <div className="pb-12">
      <header className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">
          Projetos em destaque
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          Ranking dos projetos públicos com as maiores médias de avaliação.
        </p>
      </header>

      {erro && (
        <div className="mb-6 rounded-2xl border border-red-100 bg-red-50 p-4 text-sm font-medium text-red-600">
          {erro}
        </div>
      )}

      {projetos.length > 0 ? (
        <div className="space-y-4">
          {projetos.map((projeto) => (
            <article
              key={projeto.projeto_id}
              className="flex flex-col justify-between gap-6 rounded-3xl border border-gray-100 bg-white p-6 shadow-sm md:flex-row md:items-center"
            >
              <div className="flex items-start gap-5">
                <div
                  className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl font-black ${
                    projeto.posicao === 1
                      ? "bg-amber-50 text-amber-600"
                      : projeto.posicao === 2
                        ? "bg-gray-100 text-gray-600"
                        : projeto.posicao === 3
                          ? "bg-orange-50 text-orange-600"
                          : "bg-blue-50 text-blue-600"
                  }`}
                >
                  {projeto.posicao}º
                </div>

                <div>
                  <h2 className="text-lg font-bold text-gray-900">
                    {projeto.titulo}
                  </h2>

                  <p className="mt-1 text-sm text-gray-500">
                    {projeto.curso} • {projeto.semestre}
                  </p>

                  <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-xs text-gray-500">
                    <span>Área: {projeto.area_conhecimento}</span>

                    <span>Responsável: {projeto.aluno_responsavel}</span>

                    <span>{projeto.total_avaliacoes} avaliação(ões)</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between gap-6 md:justify-end">
                <div className="text-right">
                  <p className="text-2xl font-bold text-[#f19f17]">
                    {Number(projeto.media_geral).toFixed(2)}
                  </p>

                  <p className="text-xs text-gray-400">Média geral</p>
                </div>

                <button
                  type="button"
                  onClick={() => navigate("/empresa/projetos")}
                  className="flex items-center gap-1 text-sm font-bold text-[#f19f17] hover:text-amber-700"
                >
                  Explorar
                  <ArrowRight size={16} />
                </button>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="rounded-3xl border border-dashed border-gray-200 bg-white p-14 text-center">
          <Trophy size={42} className="mx-auto text-gray-300" />

          <h2 className="mt-5 text-lg font-bold text-gray-700">
            Nenhum destaque disponível
          </h2>

          <p className="mx-auto mt-2 max-w-md text-sm text-gray-500">
            Ainda não existem projetos públicos com avaliações disponíveis no
            ranking.
          </p>
        </div>
      )}
    </div>
  );
}
