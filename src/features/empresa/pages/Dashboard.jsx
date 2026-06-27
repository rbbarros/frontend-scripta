import { useMemo } from "react";

import { ArrowRight, Briefcase, FolderOpen, Trophy } from "lucide-react";

import { useNavigate } from "react-router-dom";

import { useDashboardData } from "../hooks/useDashboardData";

export default function Dashboard() {
  const navigate = useNavigate();

  const { perfil, projetos, portfolios, destaques, loading, erro } =
    useDashboardData();

  const areasDisponiveis = useMemo(() => {
    const contagem = projetos.reduce((resultado, projeto) => {
      const area = projeto.area_conhecimento || "Não informada";

      resultado[area] = (resultado[area] || 0) + 1;

      return resultado;
    }, {});

    return Object.entries(contagem)
      .map(([nome, quantidade]) => ({
        nome,
        quantidade,
      }))
      .sort((a, b) => b.quantidade - a.quantidade);
  }, [projetos]);

  const totalProjetosPublicos = useMemo(
    () =>
      new Set(
        portfolios
          .map((portfolio) => portfolio.projeto_id)
          .filter((id) => id !== undefined && id !== null),
      ).size,
    [portfolios],
  );

  const totalPortfoliosPublicos = useMemo(
    () =>
      new Set(
        portfolios
          .map((portfolio) => portfolio.aluno_id)
          .filter((id) => id !== undefined && id !== null),
      ).size,
    [portfolios],
  );

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-amber-500" />
      </div>
    );
  }

  return (
    <div className="pb-12">
      <header className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">
          Dashboard
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          Bem-vindo, {perfil?.nome_empresa || "Empresa"}. Explore projetos e
          portfólios do Senac.
        </p>
      </header>

      {erro && (
        <div className="mb-6 rounded-2xl border border-red-100 bg-red-50 p-4 text-sm font-medium text-red-600">
          {erro}
        </div>
      )}

      <section className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="flex items-center gap-4 rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
            <FolderOpen size={24} />
          </div>

          <div>
            <p className="text-3xl font-bold text-gray-900">
              {totalProjetosPublicos}
            </p>

            <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-gray-500">
              Projetos públicos
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
            <Briefcase size={24} />
          </div>

          <div>
            <p className="text-3xl font-bold text-gray-900">
              {totalPortfoliosPublicos}
            </p>

            <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-gray-500">
              Portfólios públicos
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-50 text-amber-600">
            <Trophy size={24} />
          </div>

          <div>
            <p className="text-3xl font-bold text-gray-900">
              {destaques.length}
            </p>

            <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-gray-500">
              Destaques exibidos
            </p>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 gap-8 xl:grid-cols-[2fr_1fr]">
        <section>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-900">
              Projetos em destaque
            </h2>

            <button
              type="button"
              onClick={() => navigate("/empresa/destaque")}
              className="flex items-center gap-1 text-sm font-bold text-[#f19f17] hover:text-amber-700"
            >
              Ver todos
              <ArrowRight size={16} />
            </button>
          </div>

          {destaques.length > 0 ? (
            <div className="overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm">
              {destaques.map((projeto, index) => (
                <article
                  key={projeto.projeto_id}
                  className="flex flex-col justify-between gap-5 border-b border-gray-100 p-6 last:border-b-0 md:flex-row md:items-center"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-amber-50 font-bold text-amber-600">
                      {index + 1}º
                    </div>

                    <div>
                      <h3 className="font-bold text-gray-900">
                        {projeto.titulo}
                      </h3>

                      <p className="mt-1 text-xs text-gray-500">
                        {projeto.curso} • {projeto.semestre}
                      </p>

                      <p className="mt-2 text-xs text-gray-400">
                        Responsável: {projeto.aluno_responsavel}
                      </p>
                    </div>
                  </div>

                  <div className="shrink-0 text-left md:text-right">
                    <p className="text-xl font-bold text-[#f19f17]">
                      {Number(projeto.media_geral).toFixed(2)}
                    </p>

                    <p className="text-xs text-gray-400">Média geral</p>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="rounded-3xl border border-dashed border-gray-200 bg-white p-10 text-center">
              <Trophy size={36} className="mx-auto text-gray-300" />

              <p className="mt-4 text-sm text-gray-500">
                Nenhum projeto público avaliado está disponível.
              </p>
            </div>
          )}
        </section>

        <aside className="space-y-6">
          <section className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-bold text-gray-900">Explorar</h2>

            <div className="mt-5 space-y-3">
              <button
                type="button"
                onClick={() => navigate("/empresa/projetos")}
                className="w-full rounded-xl border-2 border-[#f19f17] px-4 py-3 text-sm font-bold text-[#f19f17] hover:bg-amber-50"
              >
                Buscar projetos
              </button>

              <button
                type="button"
                onClick={() => navigate("/empresa/portfolios")}
                className="w-full rounded-xl border-2 border-[#f19f17] px-4 py-3 text-sm font-bold text-[#f19f17] hover:bg-amber-50"
              >
                Ver portfólios
              </button>
            </div>
          </section>

          <section className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-bold text-gray-900">
              Áreas disponíveis
            </h2>

            {areasDisponiveis.length > 0 ? (
              <div className="mt-5 space-y-4">
                {areasDisponiveis.map((area) => (
                  <div
                    key={area.nome}
                    className="flex items-center justify-between gap-4"
                  >
                    <span className="text-sm font-semibold text-gray-600">
                      {area.nome}
                    </span>

                    <span className="rounded-lg border border-gray-200 bg-gray-100 px-2 py-0.5 text-xs font-bold text-gray-600">
                      {area.quantidade}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="mt-4 text-sm text-gray-500">
                Nenhuma área disponível.
              </p>
            )}
          </section>
        </aside>
      </div>
    </div>
  );
}
