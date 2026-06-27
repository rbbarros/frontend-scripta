import React, { useMemo, useState } from "react";

import { ArrowLeft, BookOpen, GraduationCap, Search, User } from "lucide-react";

import { getLinksDoProjeto, getProjetoPorId } from "../../../lib/projetosApi";

import { useEmpresaProjetos } from "../hooks/useEmpresaProjetos";

export default function Projetos() {
  const { projetos, loading, erro } = useEmpresaProjetos();

  const [busca, setBusca] = useState("");

  const [curso, setCurso] = useState("");

  const [area, setArea] = useState("");

  const [projetoSelecionado, setProjetoSelecionado] = useState(null);

  const [detalhes, setDetalhes] = useState(null);

  const [links, setLinks] = useState([]);

  const [carregandoDetalhes, setCarregandoDetalhes] = useState(false);

  const [erroDetalhes, setErroDetalhes] = useState("");

  const cursos = useMemo(
    () =>
      [
        ...new Set(projetos.map((projeto) => projeto.curso).filter(Boolean)),
      ].sort(),
    [projetos],
  );

  const areas = useMemo(
    () =>
      [
        ...new Set(
          projetos.map((projeto) => projeto.area_conhecimento).filter(Boolean),
        ),
      ].sort(),
    [projetos],
  );

  const projetosFiltrados = useMemo(() => {
    const termo = busca.trim().toLowerCase();

    return projetos.filter((projeto) => {
      const correspondeBusca =
        !termo ||
        projeto.titulo?.toLowerCase().includes(termo) ||
        projeto.curso?.toLowerCase().includes(termo) ||
        projeto.area_conhecimento?.toLowerCase().includes(termo) ||
        projeto.aluno_responsavel?.toLowerCase().includes(termo) ||
        projeto.professor_orientador?.toLowerCase().includes(termo);

      const correspondeCurso = !curso || projeto.curso === curso;

      const correspondeArea = !area || projeto.area_conhecimento === area;

      return correspondeBusca && correspondeCurso && correspondeArea;
    });
  }, [projetos, busca, curso, area]);

  async function abrirProjeto(projeto) {
    setProjetoSelecionado(projeto);
    setDetalhes(null);
    setLinks([]);
    setErroDetalhes("");
    setCarregandoDetalhes(true);

    const [projetoResultado, linksResultado] = await Promise.allSettled([
      getProjetoPorId(projeto.projeto_id),

      getLinksDoProjeto(projeto.projeto_id),
    ]);

    if (projetoResultado.status === "fulfilled") {
      setDetalhes(projetoResultado.value);
    } else {
      setErroDetalhes(
        projetoResultado.reason?.message ||
          "Não foi possível carregar os detalhes do projeto.",
      );
    }

    if (
      linksResultado.status === "fulfilled" &&
      Array.isArray(linksResultado.value)
    ) {
      setLinks(linksResultado.value);
    }

    setCarregandoDetalhes(false);
  }

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-amber-500" />
      </div>
    );
  }

  if (projetoSelecionado) {
    return (
      <div className="pb-12">
        <header className="mb-8">
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">
            Projetos
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Explore projetos acadêmicos públicos e aprovados.
          </p>
        </header>

        <button
          type="button"
          onClick={() => {
            setProjetoSelecionado(null);
            setDetalhes(null);
            setLinks([]);
            setErroDetalhes("");
          }}
          className="mb-6 flex items-center font-semibold text-[#f19f17] hover:text-amber-600"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar para a lista
        </button>

        <section className="rounded-3xl border border-gray-100 bg-white p-8 shadow-sm">
          <div className="flex flex-col justify-between gap-5 border-b border-gray-100 pb-7 md:flex-row md:items-start">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                {projetoSelecionado.titulo}
              </h2>

              <p className="mt-2 text-sm text-gray-500">
                {projetoSelecionado.curso} • {projetoSelecionado.semestre}
              </p>
            </div>

            <div className="rounded-2xl bg-amber-50 px-5 py-4 text-center">
              <p className="text-2xl font-bold text-[#f19f17]">
                {Number(projetoSelecionado.media_geral).toFixed(2)}
              </p>

              <p className="mt-1 text-xs font-semibold text-amber-700">
                Média geral
              </p>
            </div>
          </div>

          {carregandoDetalhes ? (
            <p className="py-10 text-center text-sm text-gray-500">
              Carregando detalhes...
            </p>
          ) : (
            <>
              {erroDetalhes && (
                <div className="mt-6 rounded-2xl border border-red-100 bg-red-50 p-4 text-sm text-red-600">
                  {erroDetalhes}
                </div>
              )}

              <div className="mt-7 grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400">
                    Área de conhecimento
                  </h3>

                  <p className="mt-2 text-sm font-semibold text-gray-700">
                    {projetoSelecionado.area_conhecimento}
                  </p>
                </div>

                <div>
                  <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400">
                    Turma
                  </h3>

                  <p className="mt-2 text-sm font-semibold text-gray-700">
                    {projetoSelecionado.turma}
                  </p>
                </div>

                <div>
                  <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400">
                    Aluno responsável
                  </h3>

                  <p className="mt-2 flex items-center gap-2 text-sm font-semibold text-gray-700">
                    <User size={16} />
                    {projetoSelecionado.aluno_responsavel}
                  </p>
                </div>

                <div>
                  <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400">
                    Professor orientador
                  </h3>

                  <p className="mt-2 flex items-center gap-2 text-sm font-semibold text-gray-700">
                    <GraduationCap size={16} />
                    {projetoSelecionado.professor_orientador}
                  </p>
                </div>

                <div>
                  <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400">
                    Avaliações
                  </h3>

                  <p className="mt-2 text-sm font-semibold text-gray-700">
                    {projetoSelecionado.total_avaliacoes}
                  </p>
                </div>
              </div>

              {detalhes?.descricao && (
                <div className="mt-8 border-t border-gray-100 pt-7">
                  <h3 className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-400">
                    <BookOpen size={16} />
                    Descrição
                  </h3>

                  <p className="mt-4 whitespace-pre-line text-sm leading-7 text-gray-600">
                    {detalhes.descricao}
                  </p>
                </div>
              )}

              <div className="mt-8 border-t border-gray-100 pt-7">
                <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400">
                  Links do projeto
                </h3>

                {links.length > 0 ? (
                  <div className="mt-4 space-y-3">
                    {links.map((link) => (
                      <a
                        key={link.id}
                        href={link.url}
                        target="_blank"
                        rel="noreferrer"
                        className="block rounded-xl border border-gray-100 bg-gray-50 p-4 text-sm font-semibold text-[#f19f17] hover:border-[#f19f17]"
                      >
                        {link.descricao || link.url}
                      </a>
                    ))}
                  </div>
                ) : (
                  <p className="mt-4 text-sm text-gray-500">
                    Nenhum link foi cadastrado.
                  </p>
                )}
              </div>
            </>
          )}
        </section>
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
          Explore projetos públicos aprovados e avaliados pela Faculdade Senac.
        </p>
      </header>

      {erro && (
        <div className="mb-6 rounded-2xl border border-red-100 bg-red-50 p-4 text-sm font-medium text-red-600">
          {erro}
        </div>
      )}

      <div className="mb-8 grid grid-cols-1 gap-4 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm md:grid-cols-[1fr_240px_240px]">
        <div className="relative">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            size={18}
          />

          <input
            type="search"
            placeholder="Título, aluno, professor ou palavra-chave"
            value={busca}
            onChange={(event) => setBusca(event.target.value)}
            className="w-full rounded-xl border border-gray-200 py-3 pl-11 pr-4 text-sm outline-none focus:border-[#f19f17]"
          />
        </div>

        <select
          value={area}
          onChange={(event) => setArea(event.target.value)}
          className="rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-700 outline-none focus:border-[#f19f17]"
        >
          <option value="">Todas as áreas</option>

          {areas.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>

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
      </div>

      {projetosFiltrados.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {projetosFiltrados.map((projeto) => (
            <article
              key={projeto.projeto_id}
              className="flex flex-col rounded-3xl border border-gray-100 bg-white p-6 shadow-sm transition-all hover:border-[#f19f17] hover:shadow-md"
            >
              <div className="flex justify-end">
                <div className="text-right">
                  <span className="text-lg font-bold text-[#f19f17]">
                    {Number(projeto.media_geral).toFixed(2)}
                  </span>

                  <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-400">
                    Média geral
                  </p>
                </div>
              </div>

              <h2 className="mt-5 text-lg font-bold leading-snug text-gray-900">
                {projeto.titulo}
              </h2>

              <p className="mt-2 text-sm text-gray-500">{projeto.curso}</p>

              <div className="mt-5 space-y-2 text-sm text-gray-500">
                <p>Área: {projeto.area_conhecimento}</p>

                <p>Responsável: {projeto.aluno_responsavel}</p>

                <p>{projeto.total_avaliacoes} avaliação(ões)</p>
              </div>

              <button
                type="button"
                onClick={() => abrirProjeto(projeto)}
                className="mt-6 rounded-xl bg-[#f19f17] px-5 py-3 text-sm font-bold text-white hover:bg-amber-600"
              >
                Visualizar projeto
              </button>
            </article>
          ))}
        </div>
      ) : (
        <div className="rounded-3xl border border-dashed border-gray-200 bg-white p-12 text-center">
          <h2 className="text-lg font-bold text-gray-700">
            Nenhum projeto encontrado
          </h2>

          <p className="mt-2 text-sm text-gray-500">
            Não existem projetos públicos compatíveis com os filtros.
          </p>
        </div>
      )}
    </div>
  );
}
