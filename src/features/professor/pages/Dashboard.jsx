import React, { useMemo } from "react";

import {
  ArrowRight,
  CheckCircle2,
  Clock3,
  FileText,
  Star,
  Trophy,
} from "lucide-react";

import { Link } from "react-router-dom";

import { useProfessorDashboard } from "../hooks/useProfessorDashboard";

const CONCEITO_CLASSES = {
  Excelente: "bg-emerald-50 text-emerald-700 border-emerald-100",
  Ótimo: "bg-blue-50 text-blue-700 border-blue-100",
  Bom: "bg-amber-50 text-amber-700 border-amber-100",
  "Ainda não suficiente": "bg-orange-50 text-orange-700 border-orange-100",
  Insuficiente: "bg-red-50 text-red-700 border-red-100",
};

export default function Dashboard() {
  const { perfil, projetos, avaliacoes, loading, erro } =
    useProfessorDashboard();

  const avaliacoesPorProjeto = useMemo(
    () => new Set(avaliacoes.map((avaliacao) => Number(avaliacao.projeto_id))),
    [avaliacoes],
  );

  const projetosAguardando = useMemo(
    () =>
      projetos.filter(
        (projeto) =>
          ["submetido", "em_avaliacao"].includes(projeto.status) &&
          !avaliacoesPorProjeto.has(Number(projeto.id)),
      ),
    [projetos, avaliacoesPorProjeto],
  );

  const projetosPorId = useMemo(
    () => new Map(projetos.map((projeto) => [Number(projeto.id), projeto])),
    [projetos],
  );

  const avaliacoesRecentes = useMemo(
    () =>
      avaliacoes.slice(0, 3).map((avaliacao) => ({
        ...avaliacao,
        projeto: projetosPorId.get(Number(avaliacao.projeto_id)) || null,
      })),
    [avaliacoes, projetosPorId],
  );

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-amber-500" />
      </div>
    );
  }

  const primeiroNome = perfil?.nome?.trim().split(/\s+/)[0] || "Professor";

  return (
    <div className="pb-12">
      <header className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">
          Dashboard
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          Bem-vindo, Prof. {primeiroNome}. Acompanhe suas atividades de
          avaliação.
        </p>
      </header>

      {erro && (
        <div className="mb-6 rounded-2xl border border-red-100 bg-red-50 p-4 text-sm font-medium text-red-600">
          {erro}
        </div>
      )}

      <section className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="flex items-center gap-5 rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-50 text-amber-500">
            <Clock3 size={25} />
          </div>

          <div>
            <span className="mb-1 block text-2xl font-bold leading-none text-gray-900">
              {projetosAguardando.length}
            </span>

            <span className="text-xs font-medium text-gray-500">
              Aguardando avaliação
            </span>
          </div>
        </div>

        <div className="relative flex items-center gap-5 overflow-hidden rounded-3xl border border-emerald-100 bg-white p-6 shadow-sm">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-500">
            <CheckCircle2 size={25} />
          </div>

          <div>
            <span className="mb-1 block text-2xl font-bold leading-none text-gray-900">
              {avaliacoes.length}
            </span>

            <span className="text-xs font-medium text-gray-500">
              Avaliações realizadas
            </span>
          </div>
        </div>

        <div className="flex items-center gap-5 rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-500">
            <FileText size={25} />
          </div>

          <div>
            <span className="mb-1 block text-2xl font-bold leading-none text-gray-900">
              {projetos.length}
            </span>

            <span className="text-xs font-medium text-gray-500">
              Total de projetos
            </span>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 gap-8 xl:grid-cols-[2fr_1fr]">
        <section className="rounded-3xl border border-gray-100 bg-white p-8 shadow-sm">
          <div className="mb-6 flex items-center justify-between gap-4">
            <h2 className="text-lg font-bold text-gray-800">
              Avaliações recentes
            </h2>

            <Link
              to="/professor/avaliacoes"
              className="flex items-center gap-1 text-sm font-semibold text-gray-500 transition-colors hover:text-[#f19f17]"
            >
              Ver todas
              <ArrowRight size={16} />
            </Link>
          </div>

          {avaliacoesRecentes.length > 0 ? (
            <div className="space-y-4">
              {avaliacoesRecentes.map((avaliacao) => {
                const classes =
                  CONCEITO_CLASSES[avaliacao.conceito] ||
                  "border-gray-200 bg-gray-100 text-gray-600";

                return (
                  <Link
                    key={avaliacao.id}
                    to={`/professor/projetos/${avaliacao.projeto_id}`}
                    className="flex flex-col justify-between gap-4 rounded-2xl border border-gray-100 bg-white p-4 transition-colors hover:border-gray-200 sm:flex-row sm:items-center"
                  >
                    <div className="flex min-w-0 items-center gap-4">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-orange-50 text-orange-400">
                        <Star size={20} />
                      </div>

                      <div className="min-w-0">
                        <h3 className="truncate text-sm font-bold text-gray-900">
                          {avaliacao.projeto_titulo}
                        </h3>

                        {avaliacao.projeto && (
                          <p className="mt-1 text-[10px] text-gray-400">
                            {avaliacao.projeto.curso} •{" "}
                            {avaliacao.projeto.turma}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex shrink-0 items-center gap-3">
                      <span className="text-sm font-bold text-gray-800">
                        {Number(avaliacao.media_geral).toFixed(2)}
                      </span>

                      <span
                        className={`rounded-lg border px-3 py-1 text-[10px] font-bold ${classes}`}
                      >
                        {avaliacao.conceito}
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-gray-200 py-12 text-center">
              <Star size={38} className="mx-auto text-gray-300" />

              <h3 className="mt-4 font-bold text-gray-700">
                Nenhuma avaliação realizada
              </h3>

              <p className="mt-2 text-sm text-gray-500">
                Suas avaliações mais recentes aparecerão aqui.
              </p>
            </div>
          )}
        </section>

        <aside className="space-y-6">
          <section className="rounded-3xl border border-gray-100 bg-white p-8 shadow-sm">
            <h2 className="mb-4 text-lg font-bold text-gray-800">
              Ações rápidas
            </h2>

            <div className="space-y-3">
              <Link
                to="/professor/projetos"
                className="flex w-full items-center gap-3 rounded-2xl border border-[#f19f17] p-4 text-sm font-semibold text-[#f19f17] transition-colors hover:bg-amber-50"
              >
                <Clock3 size={18} />
                Ver projetos pendentes
              </Link>

              <Link
                to="/professor/avaliacoes"
                className="flex w-full items-center gap-3 rounded-2xl border border-[#f19f17] p-4 text-sm font-semibold text-[#f19f17] transition-colors hover:bg-amber-50"
              >
                <Star size={18} />
                Histórico de avaliações
              </Link>

              <Link
                to="/professor/ranking"
                className="flex w-full items-center gap-3 rounded-2xl border border-[#f19f17] p-4 text-sm font-semibold text-[#f19f17] transition-colors hover:bg-amber-50"
              >
                <Trophy size={18} />
                Ver ranking
              </Link>
            </div>
          </section>

          <section className="rounded-3xl border border-gray-100 bg-white p-8 shadow-sm">
            <h2 className="mb-4 text-lg font-bold text-gray-800">Pendências</h2>

            {projetosAguardando.length > 0 ? (
              <div className="rounded-2xl border border-amber-100 bg-amber-50 p-4">
                <p className="text-sm font-semibold text-amber-700">
                  {projetosAguardando.length} projeto(s) aguardam sua avaliação
                </p>

                <Link
                  to="/professor/projetos"
                  className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-amber-700 hover:underline"
                >
                  Visualizar projetos
                  <ArrowRight size={14} />
                </Link>
              </div>
            ) : (
              <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-4">
                <p className="text-sm font-semibold text-emerald-700">
                  Você não possui projetos pendentes de avaliação.
                </p>
              </div>
            )}
          </section>
        </aside>
      </div>
    </div>
  );
}
