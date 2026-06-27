import React, { useMemo, useState } from "react";

import { FileText, Search } from "lucide-react";

import { Link } from "react-router-dom";

import { useProfessorProjetos } from "../hooks/useProfessorProjetos";

const STATUS_PROJETO = {
  submetido: {
    label: "Submetido",
    classes: "bg-blue-50 text-blue-700 border-blue-100",
  },
  em_avaliacao: {
    label: "Em avaliação",
    classes: "bg-purple-50 text-purple-700 border-purple-100",
  },
  aprovado: {
    label: "Aprovado",
    classes: "bg-emerald-50 text-emerald-700 border-emerald-100",
  },
  reprovado: {
    label: "Reprovado",
    classes: "bg-red-50 text-red-700 border-red-100",
  },
};

const STATUS_AVALIACAO = {
  pendente: {
    label: "Pendente",
    classes: "bg-amber-50 text-amber-700 border-amber-100",
  },
  avaliado: {
    label: "Avaliado",
    classes: "bg-emerald-50 text-emerald-700 border-emerald-100",
  },
  encerrado: {
    label: "Encerrado",
    classes: "bg-gray-100 text-gray-600 border-gray-200",
  },
};

export default function Projetos() {
  const { projetos, loading, erro } = useProfessorProjetos();

  const [busca, setBusca] = useState("");

  const [curso, setCurso] = useState("");

  const [turma, setTurma] = useState("");

  const [semestre, setSemestre] = useState("");

  const [statusAvaliacao, setStatusAvaliacao] = useState("");

  const cursos = useMemo(
    () =>
      [
        ...new Set(projetos.map((projeto) => projeto.curso).filter(Boolean)),
      ].sort(),
    [projetos],
  );

  const turmas = useMemo(
    () =>
      [
        ...new Set(projetos.map((projeto) => projeto.turma).filter(Boolean)),
      ].sort(),
    [projetos],
  );

  const semestres = useMemo(
    () =>
      [
        ...new Set(projetos.map((projeto) => projeto.semestre).filter(Boolean)),
      ].sort(),
    [projetos],
  );

  const projetosFiltrados = useMemo(() => {
    const termo = busca.trim().toLowerCase();

    return projetos.filter((projeto) => {
      const correspondeBusca =
        !termo ||
        projeto.titulo?.toLowerCase().includes(termo) ||
        projeto.aluno_responsavel?.toLowerCase().includes(termo) ||
        projeto.professor_orientador?.toLowerCase().includes(termo) ||
        projeto.area_conhecimento?.toLowerCase().includes(termo);

      const correspondeCurso = !curso || projeto.curso === curso;

      const correspondeTurma = !turma || projeto.turma === turma;

      const correspondeSemestre = !semestre || projeto.semestre === semestre;

      const correspondeAvaliacao =
        !statusAvaliacao || projeto.status_avaliacao === statusAvaliacao;

      return (
        correspondeBusca &&
        correspondeCurso &&
        correspondeTurma &&
        correspondeSemestre &&
        correspondeAvaliacao
      );
    });
  }, [projetos, busca, curso, turma, semestre, statusAvaliacao]);

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
          Projetos
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          Consulte os projetos submetidos e acompanhe suas avaliações.
        </p>
      </header>

      {erro && (
        <div className="mb-6 rounded-2xl border border-red-100 bg-red-50 p-4 text-sm font-medium text-red-600">
          {erro}
        </div>
      )}

      <section className="mb-8 rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
        <h2 className="mb-5 text-sm font-bold text-gray-800">Filtros</h2>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          <div>
            <label
              htmlFor="curso"
              className="mb-1 block text-xs font-bold text-gray-700"
            >
              Curso
            </label>

            <select
              id="curso"
              value={curso}
              onChange={(event) => setCurso(event.target.value)}
              className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-600 outline-none focus:border-[#f19f17]"
            >
              <option value="">Todos</option>

              {cursos.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="turma"
              className="mb-1 block text-xs font-bold text-gray-700"
            >
              Turma
            </label>

            <select
              id="turma"
              value={turma}
              onChange={(event) => setTurma(event.target.value)}
              className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-600 outline-none focus:border-[#f19f17]"
            >
              <option value="">Todas</option>

              {turmas.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="semestre"
              className="mb-1 block text-xs font-bold text-gray-700"
            >
              Semestre
            </label>

            <select
              id="semestre"
              value={semestre}
              onChange={(event) => setSemestre(event.target.value)}
              className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-600 outline-none focus:border-[#f19f17]"
            >
              <option value="">Todos</option>

              {semestres.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="status-avaliacao"
              className="mb-1 block text-xs font-bold text-gray-700"
            >
              Avaliação
            </label>

            <select
              id="status-avaliacao"
              value={statusAvaliacao}
              onChange={(event) => setStatusAvaliacao(event.target.value)}
              className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-600 outline-none focus:border-[#f19f17]"
            >
              <option value="">Todas</option>

              <option value="pendente">Pendentes</option>

              <option value="avaliado">Avaliados</option>

              <option value="encerrado">Encerrados</option>
            </select>
          </div>
        </div>

        <div className="relative mt-4">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            size={17}
          />

          <input
            type="search"
            placeholder="Buscar por título, aluno, professor ou área"
            value={busca}
            onChange={(event) => setBusca(event.target.value)}
            className="w-full rounded-xl border border-gray-200 py-2.5 pl-10 pr-4 text-sm outline-none focus:border-[#f19f17]"
          />
        </div>
      </section>

      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-bold text-gray-800">Projetos</h2>

        <span className="text-sm font-semibold text-gray-400">
          {projetosFiltrados.length} encontrado(s)
        </span>
      </div>

      {projetosFiltrados.length > 0 ? (
        <div className="overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm">
          {projetosFiltrados.map((projeto, index) => {
            const statusProjeto = STATUS_PROJETO[projeto.status] || {
              label: projeto.status,
              classes: "bg-gray-100 text-gray-600 border-gray-200",
            };

            const avaliacao = STATUS_AVALIACAO[projeto.status_avaliacao];

            return (
              <Link
                key={projeto.id}
                to={`/professor/projetos/${projeto.id}`}
                className={`flex flex-col justify-between gap-5 p-6 transition-colors hover:bg-gray-50 md:flex-row md:items-center ${
                  index < projetosFiltrados.length - 1
                    ? "border-b border-gray-100"
                    : ""
                }`}
              >
                <div className="flex min-w-0 items-start gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-[#f19f17]">
                    <FileText size={21} />
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

                    <p className="mt-1 text-xs text-gray-400">
                      Área: {projeto.area_conhecimento}
                    </p>
                  </div>
                </div>

                <div className="flex shrink-0 flex-wrap items-center gap-2">
                  <span
                    className={`rounded-lg border px-2.5 py-1 text-[10px] font-bold ${statusProjeto.classes}`}
                  >
                    {statusProjeto.label}
                  </span>

                  <span
                    className={`rounded-lg border px-2.5 py-1 text-[10px] font-bold ${avaliacao.classes}`}
                  >
                    {avaliacao.label}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      ) : (
        <div className="rounded-3xl border border-dashed border-gray-200 bg-white p-12 text-center">
          <FileText size={40} className="mx-auto text-gray-300" />

          <h2 className="mt-4 text-lg font-bold text-gray-700">
            Nenhum projeto encontrado
          </h2>

          <p className="mt-2 text-sm text-gray-500">
            Não existem projetos compatíveis com os filtros selecionados.
          </p>
        </div>
      )}
    </div>
  );
}
