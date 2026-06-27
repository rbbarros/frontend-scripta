import { useMemo, useState } from "react";

import { Briefcase, Layers3, Search, User } from "lucide-react";

import { useNavigate } from "react-router-dom";

import { agruparPortfoliosPorAluno } from "../../../lib/portfolioUtils";

import { useEmpresaPortfolios } from "../hooks/useEmpresaPortfolios";

export default function Portfolios() {
  const { portfolios, loading, erro } = useEmpresaPortfolios();

  const navigate = useNavigate();

  const [busca, setBusca] = useState("");

  const portfoliosAgrupados = useMemo(
    () => agruparPortfoliosPorAluno(portfolios),
    [portfolios],
  );

  const portfoliosFiltrados = useMemo(() => {
    const termo = busca.trim().toLowerCase();

    if (!termo) {
      return portfoliosAgrupados;
    }

    return portfoliosAgrupados.filter(
      (portfolio) =>
        portfolio.nome_aluno?.toLowerCase().includes(termo) ||
        portfolio.cursos.some((curso) => curso.toLowerCase().includes(termo)) ||
        portfolio.semestres.some((semestre) =>
          semestre.toLowerCase().includes(termo),
        ) ||
        portfolio.projetos.some((projeto) =>
          projeto.titulo?.toLowerCase().includes(termo),
        ),
    );
  }, [busca, portfoliosAgrupados]);

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
          Conheça estudantes e os projetos que disponibilizaram publicamente.
        </p>
      </header>

      {erro && (
        <div className="mb-6 rounded-2xl border border-red-100 bg-red-50 p-4 text-sm font-medium text-red-600">
          {erro}
        </div>
      )}

      <section className="mb-7 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
        <div className="flex items-center gap-3">
          <Search size={18} className="text-gray-400" />

          <input
            type="search"
            value={busca}
            onChange={(event) => setBusca(event.target.value)}
            placeholder="Buscar por estudante, projeto, curso ou semestre"
            className="w-full bg-transparent text-sm text-gray-700 outline-none placeholder:text-gray-400"
          />
        </div>
      </section>

      {portfoliosFiltrados.length > 0 ? (
        <section className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {portfoliosFiltrados.map((portfolio) => (
            <article
              key={portfolio.aluno_id}
              className="flex flex-col rounded-[2rem] border border-gray-100 bg-white p-7 shadow-sm transition-all hover:border-emerald-100 hover:shadow-md"
            >
              <div className="flex items-start gap-4">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
                  <User size={26} />
                </div>

                <div className="min-w-0">
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                    Estudante
                  </p>

                  <h2 className="mt-1 font-bold text-gray-900">
                    {portfolio.nome_aluno}
                  </h2>

                  <p className="mt-1 text-xs text-gray-500">
                    {portfolio.cursos.join(", ") || "Curso não informado"}
                  </p>
                </div>
              </div>

              <div className="mt-6 flex items-center gap-2 text-[#f19f17]">
                <Briefcase size={17} />

                <span className="text-xs font-bold uppercase tracking-wide">
                  {portfolio.projetos.length} projeto(s) público(s)
                </span>
              </div>

              <div className="mt-4 flex-1 space-y-2">
                {portfolio.projetos.slice(0, 2).map((projeto) => (
                  <div
                    key={projeto.portfolio_id}
                    className="rounded-xl border border-gray-100 bg-gray-50 p-3"
                  >
                    <p className="text-sm font-semibold text-gray-700">
                      {projeto.titulo}
                    </p>

                    <p className="mt-1 text-xs text-gray-400">
                      {projeto.semestre}
                    </p>
                  </div>
                ))}

                {portfolio.projetos.length > 2 && (
                  <p className="px-1 text-xs font-semibold text-gray-400">
                    +{portfolio.projetos.length - 2} outro(s) projeto(s)
                  </p>
                )}
              </div>

              <button
                type="button"
                onClick={() =>
                  navigate(`/empresa/portfolios/aluno/${portfolio.aluno_id}`)
                }
                className="mt-7 flex items-center justify-center gap-2 rounded-xl bg-[#f19f17] px-5 py-3 text-sm font-bold text-white hover:bg-amber-600"
              >
                <Layers3 size={17} />
                Visualizar portfólio
              </button>
            </article>
          ))}
        </section>
      ) : (
        <div className="rounded-3xl border border-dashed border-gray-200 bg-white p-14 text-center shadow-sm">
          <Briefcase size={42} className="mx-auto text-gray-300" />

          <h2 className="mt-5 text-lg font-bold text-gray-700">
            Nenhum portfólio encontrado
          </h2>

          <p className="mx-auto mt-2 max-w-md text-sm text-gray-500">
            Não existem portfólios públicos compatíveis com a busca realizada.
          </p>
        </div>
      )}
    </div>
  );
}
