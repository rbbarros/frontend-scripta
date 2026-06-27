import {
  Activity,
  AlertTriangle,
  BarChart3,
  BookOpenCheck,
  BrainCircuit,
  CheckCircle2,
  FileCheck2,
  FolderKanban,
  Gauge,
  Layers3,
  Lightbulb,
  LoaderCircle,
  RefreshCw,
  Target,
} from "lucide-react";

import { useCoordenacaoMonitoramento } from "../hooks/useCoordenacaoMonitoramento";

const STATUS_CONFIG = {
  rascunho: {
    label: "Rascunho",
    classes: "bg-gray-400",
  },

  submetido: {
    label: "Submetido",
    classes: "bg-blue-500",
  },

  em_avaliacao: {
    label: "Em avaliação",
    classes: "bg-purple-500",
  },

  aprovado: {
    label: "Aprovado",
    classes: "bg-emerald-500",
  },

  reprovado: {
    label: "Reprovado",
    classes: "bg-red-500",
  },
};

function formatarMedia(valor) {
  if (valor === null || valor === undefined) {
    return "—";
  }

  const numero = Number(valor);

  if (!Number.isFinite(numero)) {
    return "—";
  }

  return numero.toFixed(2);
}

function calcularPercentual(quantidade, total) {
  if (total <= 0) {
    return 0;
  }

  return Math.min(100, (quantidade / total) * 100);
}

function CardIndicador({ titulo, valor, descricao, icon: Icone }) {
  return (
    <article className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-wide text-gray-400">
            {titulo}
          </p>

          <p className="mt-3 text-3xl font-bold text-gray-900">{valor}</p>

          <p className="mt-2 text-xs text-gray-500">{descricao}</p>
        </div>

        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-orange-50 text-[#f19f17]">
          <Icone size={21} />
        </div>
      </div>
    </article>
  );
}

function CardCriterio({ titulo, valor, icon: Icone }) {
  const percentual =
    valor === null ? 0 : Math.min(100, (Number(valor) / 10) * 100);

  return (
    <article className="rounded-2xl border border-gray-100 bg-gray-50 p-5">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-white p-2.5 text-[#f19f17] shadow-sm">
            <Icone size={18} />
          </div>

          <div>
            <p className="text-xs font-semibold text-gray-500">{titulo}</p>

            <p className="mt-1 text-xl font-bold text-gray-900">
              {formatarMedia(valor)}
            </p>
          </div>
        </div>

        <span className="text-xs font-semibold text-gray-400">/ 10</span>
      </div>

      <div className="mt-4 h-2 overflow-hidden rounded-full bg-gray-200">
        <div
          className="h-full rounded-full bg-[#f19f17] transition-all"
          style={{
            width: `${percentual}%`,
          }}
        />
      </div>
    </article>
  );
}

export default function Monitoramento() {
  const { dados, loading, erro, refetch } = useCoordenacaoMonitoramento();

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <LoaderCircle className="h-8 w-8 animate-spin text-[#f19f17]" />
      </div>
    );
  }

  const maiorQuantidadeArea =
    dados.projetosPorArea.length > 0 ? dados.projetosPorArea[0].quantidade : 0;

  return (
    <div className="pb-12">
      <header className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">
            Monitoramento acadêmico
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Acompanhe a distribuição, avaliação e desempenho dos Projetos
            Integradores.
          </p>
        </div>

        <button
          type="button"
          onClick={refetch}
          className="flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-50"
        >
          <RefreshCw size={17} />
          Atualizar indicadores
        </button>
      </header>

      {erro && (
        <div className="mb-6 flex items-start gap-3 rounded-2xl border border-red-100 bg-red-50 p-4 text-sm font-medium text-red-600">
          <AlertTriangle size={18} className="mt-0.5 shrink-0" />

          {erro}
        </div>
      )}

      <section className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <CardIndicador
          titulo="Total de projetos"
          valor={dados.totalProjetos}
          descricao="Projetos cadastrados no sistema"
          icon={FolderKanban}
        />

        <CardIndicador
          titulo="Projetos avaliados"
          valor={dados.projetosAvaliados}
          descricao="Projetos com ao menos uma avaliação"
          icon={FileCheck2}
        />

        <CardIndicador
          titulo="Avaliações registradas"
          valor={dados.totalAvaliacoes}
          descricao="Pareceres realizados pelos professores"
          icon={BookOpenCheck}
        />

        <CardIndicador
          titulo="Média geral"
          valor={formatarMedia(dados.mediaGeral)}
          descricao="Média ponderada das avaliações"
          icon={Gauge}
        />
      </section>

      <section className="mb-8 grid grid-cols-1 gap-6 xl:grid-cols-2">
        <article className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
          <header className="mb-6">
            <h2 className="flex items-center gap-2 text-lg font-bold text-gray-900">
              <Layers3 size={20} className="text-[#f19f17]" />
              Projetos por área de conhecimento
            </h2>

            <p className="mt-1 text-xs text-gray-500">
              Distribuição dos projetos conforme a área cadastrada.
            </p>
          </header>

          {dados.projetosPorArea.length > 0 ? (
            <div className="space-y-5">
              {dados.projetosPorArea.map((item) => {
                const percentual = calcularPercentual(
                  item.quantidade,
                  maiorQuantidadeArea,
                );

                return (
                  <div key={item.area}>
                    <div className="mb-2 flex items-center justify-between gap-4">
                      <span className="truncate text-sm font-semibold text-gray-700">
                        {item.area}
                      </span>

                      <span className="shrink-0 text-sm font-bold text-gray-900">
                        {item.quantidade}
                      </span>
                    </div>

                    <div className="h-2.5 overflow-hidden rounded-full bg-gray-100">
                      <div
                        className="h-full rounded-full bg-[#f19f17] transition-all"
                        style={{
                          width: `${percentual}%`,
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-gray-200 p-10 text-center">
              <Layers3 size={36} className="mx-auto text-gray-300" />

              <p className="mt-4 text-sm font-semibold text-gray-600">
                Nenhuma área encontrada.
              </p>
            </div>
          )}
        </article>

        <article className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
          <header className="mb-6">
            <h2 className="flex items-center gap-2 text-lg font-bold text-gray-900">
              <BarChart3 size={20} className="text-[#f19f17]" />
              Distribuição por status
            </h2>

            <p className="mt-1 text-xs text-gray-500">
              Situação atual de todos os projetos cadastrados.
            </p>
          </header>

          <div className="space-y-5">
            {Object.entries(STATUS_CONFIG).map(([status, configuracao]) => {
              const quantidade = dados.distribuicaoStatus[status] || 0;

              const percentual = calcularPercentual(
                quantidade,
                dados.totalProjetos,
              );

              return (
                <div key={status}>
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-sm font-semibold text-gray-700">
                      {configuracao.label}
                    </span>

                    <div className="flex items-center gap-3">
                      <span className="text-xs text-gray-400">
                        {percentual.toFixed(1)}%
                      </span>

                      <strong className="text-sm text-gray-900">
                        {quantidade}
                      </strong>
                    </div>
                  </div>

                  <div className="h-2.5 overflow-hidden rounded-full bg-gray-100">
                    <div
                      className={`h-full rounded-full transition-all ${configuracao.classes}`}
                      style={{
                        width: `${percentual}%`,
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </article>
      </section>

      <section className="mb-8 rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
        <header className="mb-6">
          <h2 className="flex items-center gap-2 text-lg font-bold text-gray-900">
            <Activity size={20} className="text-[#f19f17]" />
            Médias por critério
          </h2>

          <p className="mt-1 text-xs text-gray-500">
            Resultado geral das avaliações acadêmicas registradas.
          </p>
        </header>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <CardCriterio
            titulo="Inovação"
            valor={dados.criterios.inovacao}
            icon={Lightbulb}
          />

          <CardCriterio
            titulo="Técnica"
            valor={dados.criterios.tecnica}
            icon={BrainCircuit}
          />

          <CardCriterio
            titulo="Aplicabilidade"
            valor={dados.criterios.aplicabilidade}
            icon={Target}
          />

          <CardCriterio
            titulo="Clareza"
            valor={dados.criterios.clareza}
            icon={CheckCircle2}
          />
        </div>
      </section>

      <section className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
        <header className="mb-6">
          <h2 className="flex items-center gap-2 text-lg font-bold text-gray-900">
            <BarChart3 size={20} className="text-[#f19f17]" />
            Desempenho por curso
          </h2>

          <p className="mt-1 text-xs text-gray-500">
            Médias calculadas com base nas avaliações registradas para os
            projetos de cada curso.
          </p>
        </header>

        {dados.desempenhoCursos.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-100">
              <thead>
                <tr className="bg-gray-50">
                  <th className="rounded-l-xl px-4 py-3 text-left text-xs font-bold uppercase tracking-wide text-gray-500">
                    Curso
                  </th>

                  <th className="px-4 py-3 text-center text-xs font-bold uppercase tracking-wide text-gray-500">
                    Projetos
                  </th>

                  <th className="px-4 py-3 text-center text-xs font-bold uppercase tracking-wide text-gray-500">
                    Avaliações
                  </th>

                  <th className="rounded-r-xl px-4 py-3 text-right text-xs font-bold uppercase tracking-wide text-gray-500">
                    Média geral
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {dados.desempenhoCursos.map((curso) => (
                  <tr key={curso.curso} className="hover:bg-orange-50/30">
                    <td className="px-4 py-4 font-semibold text-gray-800">
                      {curso.curso}
                    </td>

                    <td className="px-4 py-4 text-center text-sm text-gray-600">
                      {curso.totalProjetos}
                    </td>

                    <td className="px-4 py-4 text-center text-sm text-gray-600">
                      {curso.totalAvaliacoes}
                    </td>

                    <td className="px-4 py-4 text-right">
                      <span
                        className={`inline-flex min-w-16 justify-center rounded-lg border px-3 py-1.5 text-sm font-bold ${
                          curso.mediaGeral !== null
                            ? "border-emerald-100 bg-emerald-50 text-emerald-700"
                            : "border-gray-200 bg-gray-50 text-gray-500"
                        }`}
                      >
                        {formatarMedia(curso.mediaGeral)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-gray-200 p-12 text-center">
            <BarChart3 size={38} className="mx-auto text-gray-300" />

            <p className="mt-4 text-sm font-semibold text-gray-600">
              Nenhum desempenho acadêmico disponível.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
