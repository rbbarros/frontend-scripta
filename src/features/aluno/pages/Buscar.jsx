import { useMemo, useState } from "react";

import {
  BookOpen,
  Filter,
  FolderSearch,
  GraduationCap,
  LoaderCircle,
  Search,
  UserRound,
  X,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

import { useAlunoBuscarProjetos } from "../hooks/useAlunoBuscarProjetos";

const selectClasses =
  "w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-700 outline-none transition-colors focus:border-[#f19f17] focus:ring-2 focus:ring-orange-100";

function valoresUnicos(projetos, campo) {
  return [
    ...new Set(projetos.map((projeto) => projeto[campo]).filter(Boolean)),
  ].sort((a, b) => String(a).localeCompare(String(b), "pt-BR"));
}

export default function Buscar() {
  const navigate = useNavigate();

  const { projetos, loading, erro } = useAlunoBuscarProjetos();

  const [termo, setTermo] = useState("");
  const [curso, setCurso] = useState("");
  const [semestre, setSemestre] = useState("");
  const [area, setArea] = useState("");

  const cursos = useMemo(() => valoresUnicos(projetos, "curso"), [projetos]);

  const semestres = useMemo(
    () => valoresUnicos(projetos, "semestre"),
    [projetos],
  );

  const areas = useMemo(
    () => valoresUnicos(projetos, "area_conhecimento"),
    [projetos],
  );

  const resultados = useMemo(() => {
    const query = termo.trim().toLowerCase();

    return projetos.filter((projeto) => {
      const camposBusca = [
        projeto.titulo,
        projeto.curso,
        projeto.turma,
        projeto.semestre,
        projeto.area_conhecimento,
        projeto.aluno_responsavel,
        projeto.professor_orientador,
      ];

      const correspondeBusca =
        !query ||
        camposBusca.some((valor) =>
          String(valor || "")
            .toLowerCase()
            .includes(query),
        );

      const correspondeCurso = !curso || projeto.curso === curso;

      const correspondeSemestre = !semestre || projeto.semestre === semestre;

      const correspondeArea = !area || projeto.area_conhecimento === area;

      return (
        correspondeBusca &&
        correspondeCurso &&
        correspondeSemestre &&
        correspondeArea
      );
    });
  }, [projetos, termo, curso, semestre, area]);

  const possuiFiltros = termo || curso || semestre || area;

  function limparFiltros() {
    setTermo("");
    setCurso("");
    setSemestre("");
    setArea("");
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
          Buscar projetos
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          Explore projetos aprovados e publicados por estudantes da Faculdade
          Senac.
        </p>
      </header>

      {erro && (
        <div className="mb-6 rounded-2xl border border-red-100 bg-red-50 p-4 text-sm font-medium text-red-600">
          {erro}
        </div>
      )}

      <div className="flex flex-col items-start gap-8 lg:flex-row">
        <aside className="w-full shrink-0 rounded-3xl border border-gray-100 bg-white p-6 shadow-sm lg:w-72">
          <div className="mb-6 flex items-center gap-2">
            <Filter size={20} className="text-[#f19f17]" />

            <h2 className="font-bold text-gray-800">Filtros</h2>
          </div>

          <div className="space-y-4">
            <label className="block">
              <span className="mb-1.5 block text-xs font-bold text-gray-600">
                Curso
              </span>

              <select
                value={curso}
                onChange={(event) => setCurso(event.target.value)}
                className={selectClasses}
              >
                <option value="">Todos os cursos</option>

                {cursos.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className="mb-1.5 block text-xs font-bold text-gray-600">
                Semestre
              </span>

              <select
                value={semestre}
                onChange={(event) => setSemestre(event.target.value)}
                className={selectClasses}
              >
                <option value="">Todos os semestres</option>

                {semestres.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className="mb-1.5 block text-xs font-bold text-gray-600">
                Área de conhecimento
              </span>

              <select
                value={area}
                onChange={(event) => setArea(event.target.value)}
                className={selectClasses}
              >
                <option value="">Todas as áreas</option>

                {areas.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <button
            type="button"
            onClick={limparFiltros}
            disabled={!possuiFiltros}
            className="mt-7 flex w-full items-center justify-center gap-2 rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-semibold text-gray-600 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <X size={16} />
            Limpar filtros
          </button>
        </aside>

        <main className="w-full min-w-0 flex-1">
          <div className="relative mb-6">
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              type="search"
              value={termo}
              onChange={(event) => setTermo(event.target.value)}
              placeholder="Buscar por título, estudante, professor, curso ou área"
              className="w-full rounded-2xl border border-gray-200 bg-white py-3 pl-11 pr-4 text-sm shadow-sm outline-none focus:border-[#f19f17] focus:ring-2 focus:ring-orange-100"
            />
          </div>

          <div className="mb-4 flex items-center justify-between gap-4">
            <p className="text-sm text-gray-500">
              {resultados.length} projeto(s) encontrado(s)
            </p>
          </div>

          {resultados.length > 0 ? (
            <div className="space-y-4">
              {resultados.map((projeto) => (
                <article
                  key={projeto.id}
                  className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm transition-all hover:border-orange-200 hover:shadow-md"
                >
                  <div className="flex flex-col justify-between gap-5 md:flex-row md:items-start">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-3">
                        <span className="rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">
                          Aprovado
                        </span>

                        <span className="text-xs text-gray-400">
                          {projeto.semestre}
                        </span>
                      </div>

                      <h2 className="mt-4 text-lg font-bold text-gray-900">
                        {projeto.titulo}
                      </h2>

                      <p className="mt-2 text-sm text-gray-500">
                        {projeto.curso} • {projeto.turma}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => navigate(`/aluno/projetos/${projeto.id}`)}
                      className="shrink-0 rounded-xl bg-[#f19f17] px-5 py-2.5 text-sm font-bold text-white hover:bg-amber-600"
                    >
                      Visualizar projeto
                    </button>
                  </div>

                  <div className="mt-6 grid grid-cols-1 gap-4 border-t border-gray-100 pt-5 sm:grid-cols-3">
                    <div className="flex items-start gap-3">
                      <BookOpen
                        size={17}
                        className="mt-0.5 shrink-0 text-[#f19f17]"
                      />

                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-wide text-gray-400">
                          Área
                        </p>

                        <p className="mt-1 text-sm font-semibold text-gray-700">
                          {projeto.area_conhecimento}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <UserRound
                        size={17}
                        className="mt-0.5 shrink-0 text-[#f19f17]"
                      />

                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-wide text-gray-400">
                          Responsável
                        </p>

                        <p className="mt-1 text-sm font-semibold text-gray-700">
                          {projeto.aluno_responsavel}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <GraduationCap
                        size={17}
                        className="mt-0.5 shrink-0 text-[#f19f17]"
                      />

                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-wide text-gray-400">
                          Orientador
                        </p>

                        <p className="mt-1 text-sm font-semibold text-gray-700">
                          {projeto.professor_orientador}
                        </p>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="rounded-3xl border border-dashed border-gray-200 bg-white p-14 text-center">
              <FolderSearch size={42} className="mx-auto text-gray-300" />

              <h2 className="mt-5 text-lg font-bold text-gray-700">
                Nenhum projeto encontrado
              </h2>

              <p className="mx-auto mt-2 max-w-md text-sm text-gray-500">
                Não existem projetos publicados compatíveis com os filtros
                informados.
              </p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
