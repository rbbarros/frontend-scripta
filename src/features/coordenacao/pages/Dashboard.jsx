import React, { useMemo } from "react";

import {
  Award,
  BarChart3,
  CheckCircle2,
  Clock3,
  FileText,
  FolderKanban,
  Settings,
  Users,
} from "lucide-react";

import { Link } from "react-router-dom";

import { useCoordenacaoDashboard } from "../hooks/useCoordenacaoDashboard";

const STATUS_PROJETO = {
  rascunho: {
    label: "Rascunho",
    classes: "border-gray-200 bg-gray-100 text-gray-600",
    barra: "bg-gray-400",
  },

  submetido: {
    label: "Submetido",
    classes: "border-blue-100 bg-blue-50 text-blue-700",
    barra: "bg-blue-500",
  },

  em_avaliacao: {
    label: "Em avaliação",
    classes: "border-purple-100 bg-purple-50 text-purple-700",
    barra: "bg-purple-500",
  },

  aprovado: {
    label: "Aprovado",
    classes: "border-emerald-100 bg-emerald-50 text-emerald-700",
    barra: "bg-emerald-500",
  },

  reprovado: {
    label: "Reprovado",
    classes: "border-red-100 bg-red-50 text-red-700",
    barra: "bg-red-500",
  },
};

export default function Dashboard() {
  const { perfil, projetos, totalUsuarios, loading, erro } =
    useCoordenacaoDashboard();

  const quantidadePorStatus = useMemo(() => {
    const contagem = {
      rascunho: 0,
      submetido: 0,
      em_avaliacao: 0,
      aprovado: 0,
      reprovado: 0,
    };

    projetos.forEach((projeto) => {
      if (Object.hasOwn(contagem, projeto.status)) {
        contagem[projeto.status] += 1;
      }
    });

    return contagem;
  }, [projetos]);

  const aprovados = quantidadePorStatus.aprovado;

  const pendentes =
    quantidadePorStatus.submetido + quantidadePorStatus.em_avaliacao;

  const projetosRecentes = projetos.slice(0, 5);

  const primeiroNome = perfil?.nome?.trim().split(/\s+/)[0] || "Coordenação";

  function calcularPorcentagem(quantidade) {
    if (projetos.length === 0) {
      return 0;
    }

    return Math.round((quantidade / projetos.length) * 100);
  }

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
          Bem-vindo, {primeiroNome}. Acompanhe a visão geral da plataforma
          Scripta.
        </p>
      </header>

      {erro && (
        <div className="mb-6 rounded-2xl border border-amber-100 bg-amber-50 p-4 text-sm font-medium text-amber-700">
          {erro}
        </div>
      )}

      <section className="mb-8 grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
        <div className="flex items-center gap-5 rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
            <FolderKanban size={25} />
          </div>

          <div>
            <span className="block text-2xl font-bold leading-none text-gray-900">
              {projetos.length}
            </span>

            <span className="mt-2 block text-xs font-medium text-gray-500">
              Total de projetos
            </span>
          </div>
        </div>

        <div className="flex items-center gap-5 rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-purple-50 text-purple-600">
            <Users size={25} />
          </div>

          <div>
            <span className="block text-2xl font-bold leading-none text-gray-900">
              {totalUsuarios}
            </span>

            <span className="mt-2 block text-xs font-medium text-gray-500">
              Usuários gerenciáveis
            </span>
          </div>
        </div>

        <div className="flex items-center gap-5 rounded-3xl border border-emerald-100 bg-white p-6 shadow-sm">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
            <CheckCircle2 size={25} />
          </div>

          <div>
            <span className="block text-2xl font-bold leading-none text-gray-900">
              {aprovados}
            </span>

            <span className="mt-2 block text-xs font-medium text-gray-500">
              Projetos aprovados
            </span>
          </div>
        </div>

        <div className="flex items-center gap-5 rounded-3xl border border-amber-100 bg-white p-6 shadow-sm">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-amber-50 text-amber-600">
            <Clock3 size={25} />
          </div>

          <div>
            <span className="block text-2xl font-bold leading-none text-gray-900">
              {pendentes}
            </span>

            <span className="mt-2 block text-xs font-medium text-gray-500">
              Em análise
            </span>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 gap-8 xl:grid-cols-[2fr_1fr]">
        <section className="rounded-3xl border border-gray-100 bg-white p-7 shadow-sm">
          <div className="mb-6 flex items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-gray-800">
                Últimos projetos cadastrados
              </h2>

              <p className="mt-1 text-xs text-gray-400">
                Projetos mais recentes disponíveis para a coordenação.
              </p>
            </div>

            <Link
              to="/coordenacao/projetos"
              className="text-sm font-bold text-[#f19f17] hover:text-amber-700"
            >
              Ver todos
            </Link>
          </div>

          {projetosRecentes.length > 0 ? (
            <div className="space-y-3">
              {projetosRecentes.map((projeto) => {
                const status = STATUS_PROJETO[projeto.status] || {
                  label: projeto.status,
                  classes: "border-gray-200 bg-gray-100 text-gray-600",
                };

                return (
                  <Link
                    key={projeto.id}
                    to="/coordenacao/projetos"
                    className="flex flex-col justify-between gap-4 rounded-2xl border border-gray-100 p-4 transition-colors hover:border-gray-300 sm:flex-row sm:items-center"
                  >
                    <div className="flex min-w-0 items-center gap-4">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-orange-50 text-[#f19f17]">
                        <FileText size={19} />
                      </div>

                      <div className="min-w-0">
                        <h3 className="truncate text-sm font-bold text-gray-900">
                          {projeto.titulo}
                        </h3>

                        <p className="mt-1 text-xs text-gray-500">
                          {projeto.curso} • {projeto.turma} • {projeto.semestre}
                        </p>

                        <p className="mt-1 text-xs text-gray-400">
                          Responsável: {projeto.aluno_responsavel}
                        </p>
                      </div>
                    </div>

                    <span
                      className={`w-fit shrink-0 rounded-lg border px-3 py-1 text-[10px] font-bold ${status.classes}`}
                    >
                      {status.label}
                    </span>
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-gray-200 py-12 text-center">
              <FolderKanban size={38} className="mx-auto text-gray-300" />

              <p className="mt-4 text-sm font-semibold text-gray-600">
                Nenhum projeto cadastrado.
              </p>
            </div>
          )}
        </section>

        <aside className="space-y-6">
          <section className="rounded-3xl border border-gray-100 bg-white p-7 shadow-sm">
            <h2 className="mb-4 text-lg font-bold text-gray-800">
              Acesso rápido
            </h2>

            <div className="space-y-3">
              <Link
                to="/coordenacao/usuarios"
                className="flex items-center gap-3 rounded-2xl border border-[#f19f17] p-4 text-sm font-semibold text-[#f19f17] hover:bg-amber-50"
              >
                <Settings size={18} />
                Gerenciar usuários
              </Link>

              <Link
                to="/coordenacao/relatorios"
                className="flex items-center gap-3 rounded-2xl border border-[#f19f17] p-4 text-sm font-semibold text-[#f19f17] hover:bg-amber-50"
              >
                <FileText size={18} />
                Consultar relatórios
              </Link>

              <Link
                to="/coordenacao/certificados"
                className="flex items-center gap-3 rounded-2xl border border-[#f19f17] p-4 text-sm font-semibold text-[#f19f17] hover:bg-amber-50"
              >
                <Award size={18} />
                Gerenciar certificados
              </Link>

              <Link
                to="/coordenacao/monitoramento"
                className="flex items-center gap-3 rounded-2xl border border-[#f19f17] p-4 text-sm font-semibold text-[#f19f17] hover:bg-amber-50"
              >
                <BarChart3 size={18} />
                Ver indicadores
              </Link>
            </div>
          </section>

          <section className="rounded-3xl border border-gray-100 bg-white p-7 shadow-sm">
            <h2 className="mb-5 text-lg font-bold text-gray-800">
              Status dos projetos
            </h2>

            {projetos.length > 0 ? (
              <div className="space-y-5">
                {Object.entries(STATUS_PROJETO).map(
                  ([statusChave, configuracao]) => {
                    const quantidade = quantidadePorStatus[statusChave];

                    const porcentagem = calcularPorcentagem(quantidade);

                    return (
                      <div key={statusChave}>
                        <div className="mb-2 flex items-center justify-between text-xs">
                          <span className="font-semibold text-gray-600">
                            {configuracao.label}
                          </span>

                          <span className="font-bold text-gray-800">
                            {quantidade}
                          </span>
                        </div>

                        <div className="h-2 overflow-hidden rounded-full bg-gray-100">
                          <div
                            className={`h-full rounded-full ${configuracao.barra}`}
                            style={{
                              width: `${porcentagem}%`,
                            }}
                          />
                        </div>
                      </div>
                    );
                  },
                )}
              </div>
            ) : (
              <p className="text-sm text-gray-500">
                Não existem projetos para exibir indicadores.
              </p>
            )}
          </section>
        </aside>
      </div>
    </div>
  );
}
