import React, { useMemo, useState } from "react";

import { Briefcase, ExternalLink, Search, User } from "lucide-react";

import { useNavigate } from "react-router-dom";

import { useEmpresaPortfolios } from "../hooks/useEmpresaPortfolios";

export default function Talentos() {
  const { portfolios, loading, erro } = useEmpresaPortfolios();

  const navigate = useNavigate();

  const [busca, setBusca] = useState("");

  const [curso, setCurso] = useState("");

  const talentos = useMemo(() => {
    const alunosAgrupados = new Map();

    portfolios.forEach((portfolio) => {
      const alunoExistente = alunosAgrupados.get(portfolio.aluno_id);

      if (alunoExistente) {
        alunoExistente.projetos.push({
          portfolio_id: portfolio.id,
          projeto_id: portfolio.projeto_id,
          titulo: portfolio.titulo_projeto,
          semestre: portfolio.semestre,
        });

        return;
      }

      alunosAgrupados.set(portfolio.aluno_id, {
        aluno_id: portfolio.aluno_id,
        nome: portfolio.nome_aluno,
        curso: portfolio.curso,
        projetos: [
          {
            portfolio_id: portfolio.id,
            projeto_id: portfolio.projeto_id,
            titulo: portfolio.titulo_projeto,
            semestre: portfolio.semestre,
          },
        ],
      });
    });

    return Array.from(alunosAgrupados.values()).sort((a, b) =>
      a.nome.localeCompare(b.nome),
    );
  }, [portfolios]);

  const cursos = useMemo(
    () =>
      [
        ...new Set(talentos.map((talento) => talento.curso).filter(Boolean)),
      ].sort(),
    [talentos],
  );

  const talentosFiltrados = useMemo(() => {
    const termo = busca.trim().toLowerCase();

    return talentos.filter((talento) => {
      const correspondeBusca =
        !termo ||
        talento.nome?.toLowerCase().includes(termo) ||
        talento.curso?.toLowerCase().includes(termo) ||
        talento.projetos.some((projeto) =>
          projeto.titulo?.toLowerCase().includes(termo),
        );

      const correspondeCurso = !curso || talento.curso === curso;

      return correspondeBusca && correspondeCurso;
    });
  }, [talentos, busca, curso]);

  if (loading) {
    return (
      <div className="py-12 text-center text-sm font-semibold text-gray-400">
        Carregando talentos...
      </div>
    );
  }

  return (
    <div className="pb-12">
      <header className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">
          Talentos
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          Conheça estudantes que disponibilizaram projetos aprovados
          publicamente.
        </p>
      </header>

      {erro && (
        <div className="mb-6 rounded-2xl border border-red-100 bg-red-50 p-4 text-sm font-medium text-red-600">
          {erro}
        </div>
      )}

      <div className="mb-8 grid grid-cols-1 gap-4 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm md:grid-cols-[1fr_280px]">
        <div className="relative">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            size={18}
          />

          <input
            type="search"
            placeholder="Buscar por aluno, curso ou projeto"
            value={busca}
            onChange={(event) => setBusca(event.target.value)}
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
      </div>

      {talentosFiltrados.length > 0 ? (
        <div className="space-y-5">
          {talentosFiltrados.map((talento) => (
            <article
              key={talento.aluno_id}
              className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm"
            >
              <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                  <User size={30} />
                </div>

                <div className="min-w-0 flex-1">
                  <h2 className="text-lg font-bold text-gray-900">
                    {talento.nome}
                  </h2>

                  <p className="mt-1 text-sm text-gray-500">{talento.curso}</p>

                  <div className="mt-5 flex items-center gap-2 text-sm text-gray-600">
                    <Briefcase size={16} className="text-[#f19f17]" />

                    <span className="font-semibold">
                      {talento.projetos.length} projeto(s) público(s)
                    </span>
                  </div>

                  <div className="mt-4 space-y-2">
                    {talento.projetos.map((projeto) => (
                      <button
                        key={projeto.portfolio_id}
                        type="button"
                        onClick={() =>
                          navigate(
                            `/empresa/portfolios/${projeto.portfolio_id}`,
                          )
                        }
                        className="flex w-full items-center justify-between gap-4 rounded-xl border border-gray-100 bg-gray-50 p-4 text-left hover:border-[#f19f17]"
                      >
                        <div>
                          <p className="text-sm font-bold text-gray-700">
                            {projeto.titulo}
                          </p>

                          <p className="mt-1 text-xs text-gray-400">
                            Semestre: {projeto.semestre}
                          </p>
                        </div>

                        <ExternalLink
                          size={16}
                          className="shrink-0 text-[#f19f17]"
                        />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="rounded-3xl border border-dashed border-gray-200 bg-white p-14 text-center shadow-sm">
          <User size={42} className="mx-auto text-gray-300" />

          <h2 className="mt-5 text-lg font-bold text-gray-700">
            Nenhum talento encontrado
          </h2>

          <p className="mx-auto mt-2 max-w-md text-sm text-gray-500">
            Não existem estudantes com portfólios públicos compatíveis com os
            filtros selecionados.
          </p>
        </div>
      )}
    </div>
  );
}
