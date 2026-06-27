import { useMemo, useState } from "react";

import {
  AlertTriangle,
  BarChart3,
  Filter,
  LoaderCircle,
  Medal,
  RefreshCw,
  Trophy,
} from "lucide-react";

import { useAlunoRanking } from "../hooks/useAlunoRanking";

const FILTROS_INICIAIS = {
  curso: "",
  turma: "",
  semestre: "",
};

const selectClasses =
  "w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-700 outline-none transition-colors focus:border-[#f19f17] focus:ring-2 focus:ring-orange-100";

function formatarMedia(valor) {
  const numero = Number(valor);

  return Number.isFinite(numero) ? numero.toFixed(2) : "—";
}

function valoresUnicos(itens, campo) {
  return [...new Set(itens.map((item) => item[campo]).filter(Boolean))].sort(
    (a, b) => String(a).localeCompare(String(b), "pt-BR"),
  );
}

function obterClassesPosicao(posicao) {
  if (posicao === 1) {
    return {
      card: "border-[#f19f17] shadow-md",
      numero: "bg-amber-50 text-[#f19f17]",
      icone: "text-[#f19f17]",
    };
  }

  if (posicao === 2) {
    return {
      card: "border-gray-300",
      numero: "bg-gray-100 text-gray-600",
      icone: "text-gray-400",
    };
  }

  if (posicao === 3) {
    return {
      card: "border-orange-200",
      numero: "bg-orange-50 text-orange-700",
      icone: "text-orange-700",
    };
  }

  return {
    card: "border-gray-100",
    numero: "bg-blue-50 text-blue-600",
    icone: "text-gray-400",
  };
}

function Campo({ label, children }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-semibold text-gray-600">
        {label}
      </span>

      {children}
    </label>
  );
}

function CardPodio({ projeto }) {
  const classes = obterClassesPosicao(projeto.posicao);

  const Icone = projeto.posicao === 1 ? Trophy : Medal;

  return (
    <article
      className={`flex min-h-80 flex-col items-center rounded-3xl border-2 bg-white p-7 text-center ${classes.card}`}
    >
      <Icone size={projeto.posicao === 1 ? 44 : 38} className={classes.icone} />

      <div
        className={`mt-4 flex h-14 w-14 items-center justify-center rounded-2xl text-xl font-black ${classes.numero}`}
      >
        {projeto.posicao}º
      </div>

      <h2 className="mt-5 text-base font-bold leading-snug text-gray-900">
        {projeto.titulo}
      </h2>

      <p className="mt-2 text-sm text-gray-500">{projeto.curso}</p>

      <p className="mt-1 text-xs text-gray-400">
        {projeto.turma} • {projeto.semestre}
      </p>

      <p className="mt-3 text-xs text-gray-400">{projeto.area_conhecimento}</p>

      <div className="mt-auto pt-6">
        <p className="text-3xl font-bold text-[#f19f17]">
          {formatarMedia(projeto.media_geral)}
        </p>

        <p className="mt-1 text-[10px] font-bold uppercase tracking-wider text-gray-400">
          Média geral
        </p>

        <p className="mt-3 text-xs text-gray-500">
          {projeto.total_avaliacoes} avaliação(ões)
        </p>
      </div>
    </article>
  );
}

export default function Ranking() {
  const {
    ranking,
    rankingCompleto,
    totalProjetos,
    loading,
    atualizando,
    erro,
    aplicarFiltros,
  } = useAlunoRanking();

  const [filtros, setFiltros] = useState(FILTROS_INICIAIS);

  const cursos = useMemo(
    () => valoresUnicos(rankingCompleto, "curso"),
    [rankingCompleto],
  );

  const turmas = useMemo(
    () => valoresUnicos(rankingCompleto, "turma"),
    [rankingCompleto],
  );

  const semestres = useMemo(
    () => valoresUnicos(rankingCompleto, "semestre"),
    [rankingCompleto],
  );

  const tresPrimeiros = ranking.slice(0, 3);

  function alterarFiltro(campo, valor) {
    setFiltros((anteriores) => ({
      ...anteriores,
      [campo]: valor,
    }));
  }

  async function filtrar() {
    try {
      await aplicarFiltros(filtros);
    } catch {
      // O hook já exibe o erro.
    }
  }

  async function limparFiltros() {
    setFiltros(FILTROS_INICIAIS);

    try {
      await aplicarFiltros(FILTROS_INICIAIS);
    } catch {
      // O hook já exibe o erro.
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <LoaderCircle className="h-8 w-8 animate-spin text-[#f19f17]" />
      </div>
    );
  }

  return (
    <div className="pb-12">
      <header className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">
          Ranking de projetos
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          Classificação dos projetos aprovados com base nas médias das
          avaliações registradas.
        </p>
      </header>

      {erro && (
        <div className="mb-6 flex items-start gap-3 rounded-2xl border border-red-100 bg-red-50 p-4 text-sm font-medium text-red-600">
          <AlertTriangle size={18} className="mt-0.5 shrink-0" />

          {erro}
        </div>
      )}

      <section className="mb-8 rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
        <header className="mb-5 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
          <div>
            <h2 className="flex items-center gap-2 font-bold text-gray-900">
              <Filter size={19} className="text-[#f19f17]" />
              Filtros do ranking
            </h2>

            <p className="mt-1 text-xs text-gray-500">
              As posições são recalculadas conforme os filtros aplicados.
            </p>
          </div>

          <button
            type="button"
            onClick={limparFiltros}
            disabled={atualizando}
            className="text-sm font-semibold text-gray-500 hover:text-[#f19f17] disabled:opacity-50"
          >
            Limpar filtros
          </button>
        </header>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <Campo label="Curso">
            <select
              value={filtros.curso}
              onChange={(event) => alterarFiltro("curso", event.target.value)}
              className={selectClasses}
            >
              <option value="">Todos os cursos</option>

              {cursos.map((curso) => (
                <option key={curso} value={curso}>
                  {curso}
                </option>
              ))}
            </select>
          </Campo>

          <Campo label="Turma">
            <select
              value={filtros.turma}
              onChange={(event) => alterarFiltro("turma", event.target.value)}
              className={selectClasses}
            >
              <option value="">Todas as turmas</option>

              {turmas.map((turma) => (
                <option key={turma} value={turma}>
                  {turma}
                </option>
              ))}
            </select>
          </Campo>

          <Campo label="Semestre">
            <select
              value={filtros.semestre}
              onChange={(event) =>
                alterarFiltro("semestre", event.target.value)
              }
              className={selectClasses}
            >
              <option value="">Todos os semestres</option>

              {semestres.map((semestre) => (
                <option key={semestre} value={semestre}>
                  {semestre}
                </option>
              ))}
            </select>
          </Campo>
        </div>

        <div className="mt-5 flex justify-end">
          <button
            type="button"
            onClick={filtrar}
            disabled={atualizando}
            className="flex items-center justify-center gap-2 rounded-xl bg-[#f19f17] px-5 py-2.5 text-sm font-bold text-white hover:bg-amber-600 disabled:opacity-50"
          >
            {atualizando ? (
              <LoaderCircle size={17} className="animate-spin" />
            ) : (
              <RefreshCw size={17} />
            )}
            Aplicar filtros
          </button>
        </div>
      </section>

      {atualizando ? (
        <div className="flex min-h-80 items-center justify-center">
          <LoaderCircle className="h-8 w-8 animate-spin text-[#f19f17]" />
        </div>
      ) : ranking.length > 0 ? (
        <>
          <section className="mb-10">
            <header className="mb-5 flex items-center justify-between gap-4">
              <h2 className="flex items-center gap-2 text-lg font-bold text-gray-900">
                <Trophy size={21} className="text-[#f19f17]" />
                Projetos mais bem avaliados
              </h2>

              <span className="text-sm font-semibold text-gray-400">
                {totalProjetos} projeto(s)
              </span>
            </header>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              {tresPrimeiros.map((projeto) => (
                <CardPodio key={projeto.projeto_id} projeto={projeto} />
              ))}
            </div>
          </section>

          <section className="rounded-3xl border border-gray-100 bg-white p-7 shadow-sm">
            <header className="mb-6 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
              <div>
                <h2 className="flex items-center gap-2 text-lg font-bold text-gray-900">
                  <BarChart3 size={20} className="text-[#f19f17]" />
                  Classificação completa
                </h2>

                <p className="mt-1 text-xs text-gray-500">
                  Projetos aprovados que possuem avaliações registradas.
                </p>
              </div>

              <span className="text-sm font-semibold text-gray-400">
                {ranking.length} resultado(s)
              </span>
            </header>

            <div className="space-y-4">
              {ranking.map((projeto) => {
                const classes = obterClassesPosicao(projeto.posicao);

                return (
                  <article
                    key={projeto.projeto_id}
                    className="flex flex-col justify-between gap-5 rounded-2xl border border-gray-100 p-5 transition-colors hover:border-orange-200 md:flex-row md:items-center"
                  >
                    <div className="flex min-w-0 items-start gap-5">
                      <div
                        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl font-bold ${classes.numero}`}
                      >
                        {projeto.posicao}º
                      </div>

                      <div className="min-w-0">
                        <h3 className="font-bold text-gray-900">
                          {projeto.titulo}
                        </h3>

                        <p className="mt-1 text-xs text-gray-500">
                          {projeto.curso} • {projeto.turma} • {projeto.semestre}
                        </p>

                        <p className="mt-2 text-xs text-gray-400">
                          Área: {projeto.area_conhecimento}
                        </p>

                        <p className="mt-1 text-xs text-gray-400">
                          Responsável: {projeto.aluno_responsavel}
                        </p>

                        <p className="mt-1 text-xs text-gray-400">
                          Orientador: {projeto.professor_orientador}
                        </p>
                      </div>
                    </div>

                    <div className="flex shrink-0 flex-wrap items-center gap-6">
                      <div className="text-center">
                        <strong className="block text-lg text-[#f19f17]">
                          {formatarMedia(projeto.media_geral)}
                        </strong>

                        <span className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">
                          Média
                        </span>
                      </div>

                      <div className="text-center">
                        <strong className="block text-lg text-gray-900">
                          {projeto.total_avaliacoes}
                        </strong>

                        <span className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">
                          Avaliações
                        </span>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </section>
        </>
      ) : (
        <div className="rounded-3xl border border-dashed border-gray-200 bg-white p-14 text-center">
          <Trophy size={42} className="mx-auto text-gray-300" />

          <h2 className="mt-5 text-lg font-bold text-gray-700">
            Nenhum projeto no ranking
          </h2>

          <p className="mx-auto mt-2 max-w-md text-sm text-gray-500">
            Ainda não existem projetos aprovados com avaliações ou nenhum
            resultado corresponde aos filtros selecionados.
          </p>
        </div>
      )}
    </div>
  );
}
