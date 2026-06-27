import React, { useMemo, useState } from "react";

import { Search, Trophy } from "lucide-react";

import { Link } from "react-router-dom";

import { useProfessorRanking } from "../hooks/useProfessorRanking";

function obterPosicaoClasses(posicao) {
  if (posicao === 1) {
    return {
      card: "border-[#f19f17]",
      numero: "bg-amber-50 text-amber-600",
    };
  }

  if (posicao === 2) {
    return {
      card: "border-gray-300",
      numero: "bg-gray-100 text-gray-600",
    };
  }

  if (posicao === 3) {
    return {
      card: "border-orange-200",
      numero: "bg-orange-50 text-orange-600",
    };
  }

  return {
    card: "border-gray-100",
    numero: "bg-blue-50 text-blue-600",
  };
}

export default function Ranking() {
  const { ranking, loading, erro } = useProfessorRanking();

  const [busca, setBusca] = useState("");

  const [curso, setCurso] = useState("");

  const [turma, setTurma] = useState("");

  const [semestre, setSemestre] = useState("");

  const cursos = useMemo(
    () =>
      [
        ...new Set(ranking.map((projeto) => projeto.curso).filter(Boolean)),
      ].sort(),
    [ranking],
  );

  const turmas = useMemo(
    () =>
      [
        ...new Set(ranking.map((projeto) => projeto.turma).filter(Boolean)),
      ].sort(),
    [ranking],
  );

  const semestres = useMemo(
    () =>
      [
        ...new Set(ranking.map((projeto) => projeto.semestre).filter(Boolean)),
      ].sort(),
    [ranking],
  );

  const rankingFiltrado = useMemo(() => {
    const termo = busca.trim().toLowerCase();

    return ranking.filter((projeto) => {
      const correspondeBusca =
        !termo ||
        projeto.titulo?.toLowerCase().includes(termo) ||
        projeto.curso?.toLowerCase().includes(termo) ||
        projeto.area_conhecimento?.toLowerCase().includes(termo) ||
        projeto.aluno_responsavel?.toLowerCase().includes(termo) ||
        projeto.professor_orientador?.toLowerCase().includes(termo);

      const correspondeCurso = !curso || projeto.curso === curso;

      const correspondeTurma = !turma || projeto.turma === turma;

      const correspondeSemestre = !semestre || projeto.semestre === semestre;

      return (
        correspondeBusca &&
        correspondeCurso &&
        correspondeTurma &&
        correspondeSemestre
      );
    });
  }, [ranking, busca, curso, turma, semestre]);

  const tresPrimeiros = rankingFiltrado.slice(0, 3);

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
          Ranking de projetos
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          Classificação dos projetos com base nas médias das avaliações
          registradas.
        </p>
      </header>

      {erro && (
        <div className="mb-6 rounded-2xl border border-red-100 bg-red-50 p-4 text-sm font-medium text-red-600">
          {erro}
        </div>
      )}

      <section className="mb-8 rounded-3xl border border-gray-100 bg-white p-5 shadow-sm">
        <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1fr_220px_220px_220px]">
          <div className="relative">
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              type="search"
              value={busca}
              onChange={(event) => setBusca(event.target.value)}
              placeholder="Buscar por projeto, aluno, professor ou área"
              className="w-full rounded-xl border border-gray-200 py-3 pl-11 pr-4 text-sm outline-none focus:border-[#f19f17]"
            />
          </div>

          <select
            value={curso}
            onChange={(event) => setCurso(event.target.value)}
            className="rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-700 outline-none focus:border-[#f19f17]"
          >
            <option value="">Todos os cursos</option>

            {cursos.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>

          <select
            value={turma}
            onChange={(event) => setTurma(event.target.value)}
            className="rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-700 outline-none focus:border-[#f19f17]"
          >
            <option value="">Todas as turmas</option>

            {turmas.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>

          <select
            value={semestre}
            onChange={(event) => setSemestre(event.target.value)}
            className="rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-700 outline-none focus:border-[#f19f17]"
          >
            <option value="">Todos os semestres</option>

            {semestres.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>
      </section>

      {tresPrimeiros.length > 0 && (
        <section className="mb-10 grid grid-cols-1 gap-6 md:grid-cols-3">
          {tresPrimeiros.map((projeto) => {
            const posicao = obterPosicaoClasses(projeto.posicao);

            return (
              <Link
                key={projeto.projeto_id}
                to={`/professor/projetos/${projeto.projeto_id}`}
                className={`flex flex-col items-center rounded-3xl border-2 bg-white p-7 text-center shadow-sm transition-all hover:shadow-md ${posicao.card}`}
              >
                <div
                  className={`flex h-14 w-14 items-center justify-center rounded-2xl text-xl font-black ${posicao.numero}`}
                >
                  {projeto.posicao}º
                </div>

                <h2 className="mt-5 text-sm font-bold leading-snug text-gray-900">
                  {projeto.titulo}
                </h2>

                <p className="mt-2 text-xs text-gray-500">{projeto.curso}</p>

                <p className="mt-1 text-xs text-gray-400">
                  {projeto.turma} • {projeto.semestre}
                </p>

                <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
                  <span className="text-lg font-bold text-[#f19f17]">
                    {Number(projeto.media_geral).toFixed(2)}
                  </span>
                </div>

                <p className="mt-3 text-xs text-gray-400">
                  {projeto.total_avaliacoes} avaliação(ões)
                </p>
              </Link>
            );
          })}
        </section>
      )}

      {rankingFiltrado.length > 0 ? (
        <section className="rounded-3xl border border-gray-100 bg-white p-7 shadow-sm">
          <div className="mb-6 flex items-center justify-between gap-4">
            <h2 className="text-lg font-bold text-gray-800">
              Classificação completa
            </h2>

            <span className="text-sm font-semibold text-gray-400">
              {rankingFiltrado.length} projeto(s)
            </span>
          </div>

          <div className="space-y-4">
            {rankingFiltrado.map((projeto) => {
              const posicao = obterPosicaoClasses(projeto.posicao);

              return (
                <Link
                  key={projeto.projeto_id}
                  to={`/professor/projetos/${projeto.projeto_id}`}
                  className="flex flex-col justify-between gap-5 rounded-2xl border border-gray-100 p-5 transition-colors hover:border-gray-300 md:flex-row md:items-center"
                >
                  <div className="flex min-w-0 items-start gap-5">
                    <div
                      className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl font-bold ${posicao.numero}`}
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
                        Responsável: {projeto.aluno_responsavel}
                      </p>
                    </div>
                  </div>

                  <div className="flex shrink-0 flex-wrap items-center gap-5">
                    <div className="text-center">
                      <span className="block font-bold text-gray-900">
                        {Number(projeto.media_geral).toFixed(2)}
                      </span>

                      <span className="text-[10px] uppercase tracking-wider text-gray-400">
                        Média
                      </span>
                    </div>

                    <div className="text-center">
                      <span className="block font-bold text-gray-900">
                        {projeto.total_avaliacoes}
                      </span>

                      <span className="text-[10px] uppercase tracking-wider text-gray-400">
                        Avaliações
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      ) : (
        <div className="rounded-3xl border border-dashed border-gray-200 bg-white p-14 text-center">
          <Trophy size={42} className="mx-auto text-gray-300" />

          <h2 className="mt-5 text-lg font-bold text-gray-700">
            Nenhum projeto no ranking
          </h2>

          <p className="mx-auto mt-2 max-w-md text-sm text-gray-500">
            Ainda não existem projetos avaliados ou nenhum resultado corresponde
            aos filtros.
          </p>
        </div>
      )}
    </div>
  );
}
