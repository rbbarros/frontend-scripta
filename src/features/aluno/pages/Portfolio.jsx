import React, { useEffect, useMemo, useState } from "react";

import { Link, useSearchParams } from "react-router-dom";

import { useAlunoPortfolio } from "../hooks/useAlunoPortfolio";

const VISIBILIDADES = {
  publico: {
    label: "Público",
    descricao: "Visível para empresas e usuários do Senac.",
    classes: "border-emerald-100 bg-emerald-50 text-emerald-700",
  },

  apenas_senac: {
    label: "Apenas Senac",
    descricao: "Visível somente para alunos, professores e coordenação.",
    classes: "border-blue-100 bg-blue-50 text-blue-700",
  },

  privado: {
    label: "Privado",
    descricao: "Visível somente para você.",
    classes: "border-gray-200 bg-gray-50 text-gray-600",
  },
};

export default function Portfolio() {
  const {
    projetos,
    portfolios,
    loading,
    erro,
    processandoId,
    adicionarAoPortfolio,
    alterarVisibilidade,
    removerDoPortfolio,
  } = useAlunoPortfolio();

  const [searchParams] = useSearchParams();

  const projetoRecebido = searchParams.get("projeto");

  const [projetoId, setProjetoId] = useState("");

  const [visibilidade, setVisibilidade] = useState("privado");

  const [showForm, setShowForm] = useState(false);

  const [mensagem, setMensagem] = useState("");

  const projetosDisponiveis = useMemo(() => {
    const projetosNoPortfolio = new Set(
      portfolios.map((portfolio) => portfolio.projeto_id),
    );

    return projetos.filter(
      (projeto) =>
        projeto.status === "aprovado" && !projetosNoPortfolio.has(projeto.id),
    );
  }, [projetos, portfolios]);

  useEffect(() => {
    if (!projetoRecebido || loading) {
      return;
    }

    const projetoDisponivel = projetosDisponiveis.some(
      (projeto) => projeto.id === Number(projetoRecebido),
    );

    if (projetoDisponivel) {
      setProjetoId(projetoRecebido);
      setShowForm(true);
    }
  }, [projetoRecebido, projetosDisponiveis, loading]);

  const totais = useMemo(
    () => ({
      total: portfolios.length,

      publicos: portfolios.filter(
        (portfolio) => portfolio.visibilidade === "publico",
      ).length,

      apenasSenac: portfolios.filter(
        (portfolio) => portfolio.visibilidade === "apenas_senac",
      ).length,

      privados: portfolios.filter(
        (portfolio) => portfolio.visibilidade === "privado",
      ).length,
    }),
    [portfolios],
  );

  async function handleAdicionar(event) {
    event.preventDefault();
    setMensagem("");

    const sucesso = await adicionarAoPortfolio(projetoId, visibilidade);

    if (!sucesso) {
      return;
    }

    setProjetoId("");
    setVisibilidade("privado");
    setShowForm(false);

    setMensagem("Projeto adicionado ao portfólio com sucesso.");
  }

  async function handleVisibilidade(portfolioId, novaVisibilidade) {
    setMensagem("");

    const sucesso = await alterarVisibilidade(portfolioId, novaVisibilidade);

    if (sucesso) {
      setMensagem("Visibilidade atualizada com sucesso.");
    }
  }

  async function handleRemover(portfolio) {
    const confirmou = window.confirm(
      `Deseja remover "${portfolio.titulo_projeto}" do portfólio?`,
    );

    if (!confirmou) {
      return;
    }

    setMensagem("");

    const sucesso = await removerDoPortfolio(portfolio.id);

    if (sucesso) {
      setMensagem("Projeto removido do portfólio.");
    }
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-5xl">
        <div className="rounded-3xl border border-gray-100 bg-white p-10 text-center shadow-sm">
          <p className="text-sm text-gray-500">Carregando portfólio...</p>
        </div>
      </div>
    );
  }

  return (
    <section className="mx-auto flex max-w-5xl flex-col gap-8">
      <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">
            Meu portfólio
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Gerencie os projetos aprovados exibidos no seu portfólio.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setMensagem("");
            setShowForm((estadoAtual) => !estadoAtual);
          }}
          className="rounded-xl bg-[#f19f17] px-5 py-3 text-sm font-bold text-white hover:bg-amber-600"
        >
          {showForm ? "Fechar formulário" : "Adicionar projeto"}
        </button>
      </header>

      {erro && (
        <div className="rounded-2xl border border-red-100 bg-red-50 p-4 text-sm font-medium text-red-600">
          {erro}
        </div>
      )}

      {mensagem && (
        <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-4 text-sm font-medium text-emerald-700">
          {mensagem}
        </div>
      )}

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <div className="rounded-2xl border border-gray-100 bg-white p-5 text-center shadow-sm">
          <p className="text-2xl font-bold text-gray-900">{totais.total}</p>

          <p className="mt-1 text-xs text-gray-500">Total</p>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-5 text-center shadow-sm">
          <p className="text-2xl font-bold text-emerald-700">
            {totais.publicos}
          </p>

          <p className="mt-1 text-xs text-gray-500">Públicos</p>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-5 text-center shadow-sm">
          <p className="text-2xl font-bold text-blue-700">
            {totais.apenasSenac}
          </p>

          <p className="mt-1 text-xs text-gray-500">Apenas Senac</p>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-5 text-center shadow-sm">
          <p className="text-2xl font-bold text-gray-700">{totais.privados}</p>

          <p className="mt-1 text-xs text-gray-500">Privados</p>
        </div>
      </div>

      {showForm && (
        <form
          onSubmit={handleAdicionar}
          className="space-y-5 rounded-3xl border border-amber-200 bg-amber-50 p-6 shadow-sm"
        >
          <div>
            <h2 className="text-lg font-bold text-gray-900">
              Adicionar projeto
            </h2>

            <p className="mt-1 text-sm text-gray-600">
              Somente projetos aprovados que ainda não estão no portfólio podem
              ser adicionados.
            </p>
          </div>

          {projetosDisponiveis.length > 0 ? (
            <>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    Projeto
                  </label>

                  <select
                    value={projetoId}
                    onChange={(event) => setProjetoId(event.target.value)}
                    required
                    className="w-full rounded-xl border border-gray-200 bg-white p-3 text-sm outline-none focus:border-[#f19f17]"
                  >
                    <option value="">Selecione um projeto</option>

                    {projetosDisponiveis.map((projeto) => (
                      <option key={projeto.id} value={projeto.id}>
                        {projeto.titulo}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    Visibilidade
                  </label>

                  <select
                    value={visibilidade}
                    onChange={(event) => setVisibilidade(event.target.value)}
                    className="w-full rounded-xl border border-gray-200 bg-white p-3 text-sm outline-none focus:border-[#f19f17]"
                  >
                    <option value="privado">Privado</option>

                    <option value="apenas_senac">Apenas Senac</option>

                    <option value="publico">Público</option>
                  </select>
                </div>
              </div>

              <p className="text-xs text-gray-600">
                {VISIBILIDADES[visibilidade].descricao}
              </p>

              <div className="flex flex-wrap gap-3">
                <button
                  type="submit"
                  disabled={processandoId === "adicionar"}
                  className="rounded-xl bg-[#f19f17] px-6 py-2.5 text-sm font-bold text-white hover:bg-amber-600 disabled:opacity-50"
                >
                  {processandoId === "adicionar"
                    ? "Adicionando..."
                    : "Adicionar ao portfólio"}
                </button>

                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="rounded-xl border border-gray-200 bg-white px-6 py-2.5 text-sm font-bold text-gray-700 hover:bg-gray-50"
                >
                  Cancelar
                </button>
              </div>
            </>
          ) : (
            <div className="rounded-2xl border border-amber-200 bg-white p-5">
              <p className="text-sm text-gray-600">
                Não existem projetos aprovados disponíveis para inclusão.
              </p>

              <Link
                to="/aluno/projetos"
                className="mt-3 inline-block text-sm font-bold text-[#f19f17] hover:underline"
              >
                Ver meus projetos
              </Link>
            </div>
          )}
        </form>
      )}

      <div>
        <h2 className="mb-4 text-lg font-bold text-gray-900">
          Projetos do portfólio
        </h2>

        {portfolios.length > 0 ? (
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            {portfolios.map((portfolio) => {
              const configuracao =
                VISIBILIDADES[portfolio.visibilidade] || VISIBILIDADES.privado;

              return (
                <article
                  key={portfolio.id}
                  className="flex flex-col rounded-3xl border border-gray-100 bg-white p-6 shadow-sm"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <span
                        className={`inline-block rounded-full border px-3 py-1 text-xs font-bold ${configuracao.classes}`}
                      >
                        {configuracao.label}
                      </span>

                      <h3 className="mt-4 text-lg font-bold text-gray-900">
                        {portfolio.titulo_projeto}
                      </h3>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleRemover(portfolio)}
                      disabled={processandoId === `remover-${portfolio.id}`}
                      className="text-sm font-semibold text-red-500 hover:underline disabled:opacity-50"
                    >
                      {processandoId === `remover-${portfolio.id}`
                        ? "Removendo..."
                        : "Remover"}
                    </button>
                  </div>

                  <div className="mt-4 space-y-1 text-sm text-gray-500">
                    <p>Curso: {portfolio.curso}</p>

                    <p>Semestre: {portfolio.semestre}</p>
                  </div>

                  <div className="mt-6">
                    <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-gray-400">
                      Visibilidade
                    </label>

                    <select
                      value={portfolio.visibilidade}
                      onChange={(event) =>
                        handleVisibilidade(portfolio.id, event.target.value)
                      }
                      disabled={
                        processandoId === `visibilidade-${portfolio.id}`
                      }
                      className="w-full rounded-xl border border-gray-200 bg-white p-3 text-sm outline-none focus:border-[#f19f17] disabled:opacity-50"
                    >
                      <option value="privado">Privado</option>

                      <option value="apenas_senac">Apenas Senac</option>

                      <option value="publico">Público</option>
                    </select>

                    <p className="mt-2 text-xs text-gray-400">
                      {configuracao.descricao}
                    </p>
                  </div>

                  <Link
                    to={`/aluno/projetos/${portfolio.projeto_id}`}
                    className="mt-6 rounded-xl border border-gray-200 px-4 py-2.5 text-center text-sm font-bold text-gray-600 hover:border-[#f19f17] hover:text-[#f19f17]"
                  >
                    Visualizar projeto
                  </Link>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="rounded-3xl border border-dashed border-gray-200 bg-white p-12 text-center shadow-sm">
            <h3 className="text-lg font-bold text-gray-700">Portfólio vazio</h3>

            <p className="mx-auto mt-2 max-w-md text-sm text-gray-500">
              Adicione um projeto aprovado para começar a montar seu portfólio.
            </p>

            <button
              type="button"
              onClick={() => setShowForm(true)}
              className="mt-5 rounded-xl bg-[#f19f17] px-6 py-2.5 text-sm font-bold text-white hover:bg-amber-600"
            >
              Adicionar primeiro projeto
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
