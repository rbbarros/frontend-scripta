import React from "react";

import {
  ArrowLeft,
  Briefcase,
  ExternalLink,
  GraduationCap,
  User,
} from "lucide-react";

import { useNavigate, useParams } from "react-router-dom";

import { usePortfolioDetalhes } from "../hooks/usePortfolioDetalhes";

export default function PortfolioDetalhes() {
  const { id } = useParams();

  const navigate = useNavigate();

  const { portfolio, projeto, links, loading, erro } = usePortfolioDetalhes(id);

  if (loading) {
    return (
      <div className="rounded-3xl border border-gray-100 bg-white p-10 text-center shadow-sm">
        <p className="text-sm text-gray-500">Carregando portfólio...</p>
      </div>
    );
  }

  if (erro || !portfolio) {
    return (
      <div className="rounded-3xl border border-red-100 bg-red-50 p-8">
        <h1 className="text-lg font-bold text-red-700">
          Não foi possível carregar este portfólio
        </h1>

        <p className="mt-2 text-sm text-red-600">
          {erro || "Portfólio não encontrado."}
        </p>

        <button
          type="button"
          onClick={() => navigate("/empresa/portfolios")}
          className="mt-5 text-sm font-bold text-red-700 hover:underline"
        >
          Voltar para portfólios
        </button>
      </div>
    );
  }

  return (
    <div className="pb-12">
      <button
        type="button"
        onClick={() => navigate("/empresa/portfolios")}
        className="mb-6 flex items-center font-semibold text-[#f19f17] hover:text-amber-600"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Voltar para portfólios
      </button>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[280px_1fr]">
        <aside>
          <div className="rounded-3xl border border-gray-100 bg-white p-7 text-center shadow-sm">
            <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
              <User size={42} />
            </div>

            <h1 className="mt-5 text-xl font-bold text-gray-900">
              {portfolio.nome_aluno}
            </h1>

            <p className="mt-2 text-sm text-gray-500">{portfolio.curso}</p>

            <div className="mt-6 rounded-2xl bg-gray-50 p-4">
              <div className="flex items-center justify-center gap-2 text-gray-600">
                <GraduationCap size={17} />

                <span className="text-sm font-semibold">
                  {portfolio.semestre}
                </span>
              </div>
            </div>
          </div>
        </aside>

        <main className="space-y-6">
          <section className="rounded-3xl border border-gray-100 bg-white p-8 shadow-sm">
            <div className="flex items-center gap-2 text-[#f19f17]">
              <Briefcase size={20} />

              <span className="text-xs font-bold uppercase tracking-wider">
                Projeto aprovado
              </span>
            </div>

            <h2 className="mt-4 text-2xl font-bold text-gray-900">
              {portfolio.titulo_projeto}
            </h2>

            {projeto ? (
              <>
                <p className="mt-5 whitespace-pre-line text-sm leading-7 text-gray-600">
                  {projeto.descricao}
                </p>

                <div className="mt-7 grid grid-cols-1 gap-4 border-t border-gray-100 pt-6 sm:grid-cols-2">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wide text-gray-400">
                      Área de conhecimento
                    </p>

                    <p className="mt-1 text-sm font-semibold text-gray-700">
                      {projeto.area_conhecimento}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs font-bold uppercase tracking-wide text-gray-400">
                      Turma
                    </p>

                    <p className="mt-1 text-sm font-semibold text-gray-700">
                      {projeto.turma}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs font-bold uppercase tracking-wide text-gray-400">
                      Professor orientador
                    </p>

                    <p className="mt-1 text-sm font-semibold text-gray-700">
                      {projeto.professor_orientador}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs font-bold uppercase tracking-wide text-gray-400">
                      Status
                    </p>

                    <p className="mt-1 text-sm font-semibold text-emerald-700">
                      Aprovado
                    </p>
                  </div>
                </div>
              </>
            ) : (
              <p className="mt-5 text-sm text-gray-500">
                Os detalhes completos do projeto não estão disponíveis.
              </p>
            )}
          </section>

          <section className="rounded-3xl border border-gray-100 bg-white p-8 shadow-sm">
            <h2 className="text-lg font-bold text-gray-900">
              Links do projeto
            </h2>

            {links.length > 0 ? (
              <div className="mt-5 space-y-3">
                {links.map((link) => (
                  <a
                    key={link.id}
                    href={link.url}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-between rounded-2xl border border-gray-100 bg-gray-50 p-4 text-sm font-semibold text-gray-700 hover:border-[#f19f17] hover:text-[#f19f17]"
                  >
                    <span>{link.descricao || link.url}</span>

                    <ExternalLink size={16} />
                  </a>
                ))}
              </div>
            ) : (
              <p className="mt-4 text-sm text-gray-500">
                Nenhum link público foi cadastrado para este projeto.
              </p>
            )}
          </section>
        </main>
      </div>
    </div>
  );
}
