import React, { useMemo, useState } from "react";
import { Briefcase, Search, User } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { useEmpresaPortfolios } from "../hooks/useEmpresaPortfolios";

export default function Portfolios() {
  const { portfolios, loading, erro } = useEmpresaPortfolios();

  const navigate = useNavigate();

  const [busca, setBusca] = useState("");

  const portfoliosFiltrados = useMemo(() => {
    const termo = busca.trim().toLowerCase();

    if (!termo) {
      return portfolios;
    }

    return portfolios.filter(
      (portfolio) =>
        portfolio.nome_aluno?.toLowerCase().includes(termo) ||
        portfolio.titulo_projeto?.toLowerCase().includes(termo) ||
        portfolio.curso?.toLowerCase().includes(termo) ||
        portfolio.semestre?.toLowerCase().includes(termo),
    );
  }, [busca, portfolios]);

  if (loading) {
    return (
      <div className="rounded-3xl border border-gray-100 bg-white p-10 text-center shadow-sm">
        <p className="text-sm font-semibold text-gray-400">
          Carregando portfólios públicos...
        </p>
      </div>
    );
  }

  return (
    <div className="pb-12">
      <header className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">
          Portfólios
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          Conheça projetos aprovados que estudantes disponibilizaram
          publicamente.
        </p>
      </header>

      {erro && (
        <div className="mb-6 rounded-2xl border border-red-100 bg-red-50 p-4 text-sm font-medium text-red-600">
          {erro}
        </div>
      )}

      <div className="mb-7 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
        <div className="flex items-center gap-3">
          <Search size={18} className="text-gray-400" />

          <input
            type="search"
            value={busca}
            onChange={(event) => setBusca(event.target.value)}
            placeholder="Buscar por aluno, projeto, curso ou semestre"
            className="w-full bg-transparent text-sm text-gray-700 outline-none placeholder:text-gray-400"
          />
        </div>
      </div>

      {portfoliosFiltrados.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {portfoliosFiltrados.map((portfolio) => (
            <article
              key={portfolio.id}
              className="flex flex-col rounded-[2rem] border border-gray-100 bg-white p-7 shadow-sm transition-all hover:border-emerald-100 hover:shadow-md"
            >
              <div className="flex items-start gap-4">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
                  <User size={26} />
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                    Estudante
                  </p>

                  <h2 className="mt-1 font-bold text-gray-900">
                    {portfolio.nome_aluno}
                  </h2>
                </div>
              </div>

              <div className="mt-6 flex-1">
                <div className="flex items-center gap-2 text-[#f19f17]">
                  <Briefcase size={17} />

                  <span className="text-xs font-bold uppercase tracking-wide">
                    Projeto aprovado
                  </span>
                </div>

                <h3 className="mt-3 text-lg font-bold leading-snug text-gray-900">
                  {portfolio.titulo_projeto}
                </h3>

                <div className="mt-4 space-y-1 text-sm text-gray-500">
                  <p>Curso: {portfolio.curso}</p>

                  <p>Semestre: {portfolio.semestre}</p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => navigate(`/empresa/portfolios/${portfolio.id}`)}
                className="mt-7 rounded-xl bg-[#f19f17] px-5 py-3 text-sm font-bold text-white hover:bg-amber-600"
              >
                Visualizar portfólio
              </button>
            </article>
          ))}
        </div>
      ) : (
        <div className="rounded-3xl border border-dashed border-gray-200 bg-white p-14 text-center shadow-sm">
          <Briefcase size={42} className="mx-auto text-gray-300" />

          <h2 className="mt-5 text-lg font-bold text-gray-700">
            Nenhum portfólio encontrado
          </h2>

          <p className="mx-auto mt-2 max-w-md text-sm text-gray-500">
            Não existem projetos públicos compatíveis com a busca realizada.
          </p>
        </div>
      )}
    </div>
  );
}
