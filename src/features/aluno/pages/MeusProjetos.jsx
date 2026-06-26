import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAlunoProjetos } from "../hooks/useAlunoProjetos";

const STATUS_TABS = [
  {
    id: "rascunho",
    label: "Rascunhos",
    active: "bg-[#f19f17] text-white border-[#f19f17]",
  },
  {
    id: "submetido",
    label: "Submetidos",
    active: "bg-blue-50 text-blue-700 border-blue-200",
  },
  {
    id: "em_avaliacao",
    label: "Em revisão",
    active: "bg-purple-50 text-purple-700 border-purple-200",
  },
  {
    id: "aprovado",
    label: "Aprovados",
    active: "bg-emerald-50 text-emerald-700 border-emerald-200",
  },
  {
    id: "reprovado",
    label: "Reprovados",
    active: "bg-red-50 text-red-700 border-red-200",
  },
];

const STATUS_CONFIG = {
  rascunho: {
    label: "Rascunho",
    description: "O projeto ainda pode ser editado e submetido.",
    badge: "bg-gray-100 text-gray-600 border-gray-200",
  },
  submetido: {
    label: "Submetido",
    description: "O projeto foi submetido e aguarda o início da avaliação.",
    badge: "bg-blue-50 text-blue-700 border-blue-200",
  },
  em_avaliacao: {
    label: "Em revisão",
    description: "O projeto está sendo avaliado pelos professores.",
    badge: "bg-purple-50 text-purple-700 border-purple-200",
  },
  aprovado: {
    label: "Aprovado",
    description: "O projeto foi aprovado pela coordenação.",
    badge: "bg-emerald-50 text-emerald-700 border-emerald-200",
  },
  reprovado: {
    label: "Reprovado",
    description:
      "O projeto foi reprovado. Entre em contato com os professores para orientações.",
    badge: "bg-red-50 text-red-700 border-red-200",
  },
};

export default function MeusProjetos() {
  const { meusProjetos, loading, erro, submetendoId, submeterProjeto } =
    useAlunoProjetos();

  const [activeTab, setActiveTab] = useState("rascunho");

  const projetosFiltrados = meusProjetos.filter(
    (projeto) => projeto.status === activeTab,
  );

  function contarPorStatus(status) {
    return meusProjetos.filter((projeto) => projeto.status === status).length;
  }

  async function handleSubmeter(projeto) {
    const confirmou = window.confirm(
      `Deseja submeter o projeto "${projeto.titulo}" para avaliação?`,
    );

    if (!confirmou) {
      return;
    }

    const sucesso = await submeterProjeto(projeto.id);

    if (sucesso) {
      setActiveTab("submetido");
    }
  }

  return (
    <div className="mx-auto max-w-5xl">
      <header className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">
          Meus projetos
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          Acompanhe e gerencie os projetos dos quais você participa.
        </p>
      </header>

      {erro && (
        <div className="mb-6 rounded-2xl border border-red-100 bg-red-50 p-4 text-sm font-medium text-red-600">
          {erro}
        </div>
      )}

      <div className="mb-8 flex flex-wrap gap-2 rounded-2xl border border-gray-100 bg-white p-2 shadow-sm">
        {STATUS_TABS.map((tab) => {
          const ativo = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 rounded-xl border px-4 py-2 text-sm font-semibold transition-all ${
                ativo
                  ? tab.active
                  : "border-transparent text-gray-500 hover:bg-gray-50"
              }`}
            >
              {tab.label}

              <span
                className={`rounded-md px-2 py-0.5 text-xs font-bold ${
                  ativo ? "bg-white/30" : "bg-gray-100 text-gray-500"
                }`}
              >
                {contarPorStatus(tab.id)}
              </span>
            </button>
          );
        })}
      </div>

      <div className="mb-8 space-y-4">
        {loading ? (
          <div className="rounded-3xl border border-gray-100 bg-white p-12 text-center shadow-sm">
            <p className="text-sm text-gray-500">Carregando projetos...</p>
          </div>
        ) : projetosFiltrados.length === 0 ? (
          <div className="rounded-3xl border border-gray-100 bg-white p-12 text-center shadow-sm">
            <p className="text-sm text-gray-500">
              Nenhum projeto nesta categoria.
            </p>

            {activeTab === "rascunho" && (
              <Link
                to="/aluno/submeter"
                className="mt-3 inline-block text-sm font-semibold text-[#f19f17] hover:underline"
              >
                Criar um novo projeto
              </Link>
            )}
          </div>
        ) : (
          projetosFiltrados.map((projeto) => {
            const status =
              STATUS_CONFIG[projeto.status] || STATUS_CONFIG.rascunho;

            return (
              <article
                key={projeto.id}
                className="rounded-3xl border border-gray-100 bg-white p-8 shadow-sm transition-shadow hover:shadow-md"
              >
                <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
                  <div>
                    <div className="flex flex-wrap items-center gap-3">
                      <h2 className="text-lg font-bold text-gray-900">
                        {projeto.titulo}
                      </h2>

                      <span
                        className={`rounded-full border px-3 py-1 text-xs font-bold ${status.badge}`}
                      >
                        {status.label}
                      </span>
                    </div>

                    <p className="mt-3 text-sm text-gray-500">
                      {status.description}
                    </p>

                    <div className="mt-5 space-y-1 text-xs text-gray-500">
                      <p>
                        <strong className="text-gray-700">Responsável:</strong>{" "}
                        {projeto.aluno_responsavel}
                      </p>

                      <p>
                        <strong className="text-gray-700">Orientador:</strong>{" "}
                        {projeto.professor_orientador}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col gap-3">
                    <Link
                      to={`/aluno/projetos/${projeto.id}`}
                      className="rounded-xl border border-gray-200 px-5 py-2.5 text-center text-sm font-semibold text-gray-600 hover:border-[#f19f17] hover:text-[#f19f17]"
                    >
                      {["rascunho", "submetido"].includes(projeto.status)
                        ? "Abrir e editar"
                        : "Visualizar projeto"}
                    </Link>

                    {projeto.status === "rascunho" && (
                      <button
                        type="button"
                        onClick={() => handleSubmeter(projeto)}
                        disabled={submetendoId === projeto.id}
                        className="rounded-xl bg-[#f19f17] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#d98b14] disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {submetendoId === projeto.id
                          ? "Submetendo..."
                          : "Submeter projeto"}
                      </button>
                    )}
                  </div>
                </div>
              </article>
            );
          })
        )}
      </div>

      <div className="flex justify-center">
        <Link
          to="/aluno/submeter"
          className="flex items-center gap-2 rounded-xl border border-[#f19f17] px-6 py-3 text-sm font-semibold text-[#f19f17] transition-colors hover:bg-amber-50"
        >
          Iniciar novo projeto
        </Link>
      </div>
    </div>
  );
}
