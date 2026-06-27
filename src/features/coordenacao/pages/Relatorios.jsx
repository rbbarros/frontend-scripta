import { useMemo, useState } from "react";

import {
  AlertTriangle,
  BarChart3,
  Download,
  FileText,
  Filter,
  FolderKanban,
  LoaderCircle,
  RefreshCw,
} from "lucide-react";

import { useCoordenacaoRelatorios } from "../hooks/useCoordenacaoRelatorios";

const FILTROS_INICIAIS = {
  curso: "",
  turma: "",
  semestre: "",
  status: "",
  professor_id: "",
};

const STATUS = {
  rascunho: "Rascunho",
  submetido: "Submetido",
  em_avaliacao: "Em avaliação",
  aprovado: "Aprovado",
  reprovado: "Reprovado",
};

const STATUS_CLASSES = {
  rascunho: "border-gray-200 bg-gray-50 text-gray-600",
  submetido: "border-blue-100 bg-blue-50 text-blue-700",
  em_avaliacao: "border-purple-100 bg-purple-50 text-purple-700",
  aprovado: "border-emerald-100 bg-emerald-50 text-emerald-700",
  reprovado: "border-red-100 bg-red-50 text-red-700",
};

const inputClasses =
  "w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-800 outline-none transition-colors focus:border-[#f19f17] focus:ring-2 focus:ring-orange-100";

function valoresUnicos(itens, campo) {
  return [...new Set(itens.map((item) => item[campo]).filter(Boolean))].sort(
    (a, b) => String(a).localeCompare(String(b), "pt-BR"),
  );
}

function formatarMedia(valor) {
  if (valor === null || valor === undefined) {
    return "—";
  }

  const numero = Number(valor);

  return Number.isFinite(numero) ? numero.toFixed(2) : "—";
}

function Campo({ label, children }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-semibold text-gray-600">
        {label}
      </span>

      {children}
    </label>
  );
}

function CardTipo({ selecionado, icon: Icone, titulo, descricao, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex min-h-40 flex-col items-center justify-center rounded-2xl border-2 bg-white p-6 text-center transition-all ${
        selecionado
          ? "border-[#f19f17] shadow-md"
          : "border-gray-100 hover:border-orange-200"
      }`}
    >
      <div
        className={`rounded-2xl p-3 ${
          selecionado
            ? "bg-orange-50 text-[#f19f17]"
            : "bg-gray-50 text-gray-400"
        }`}
      >
        <Icone size={30} />
      </div>

      <h3 className="mt-4 font-bold text-gray-900">{titulo}</h3>

      <p className="mt-2 max-w-sm text-sm leading-5 text-gray-500">
        {descricao}
      </p>
    </button>
  );
}

function TabelaProjetos({ dados }) {
  const projetos = Array.isArray(dados?.projetos) ? dados.projetos : [];

  if (projetos.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-gray-200 p-12 text-center">
        <FolderKanban size={38} className="mx-auto text-gray-300" />

        <p className="mt-4 text-sm font-semibold text-gray-600">
          Nenhum projeto encontrado com os filtros selecionados.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="mb-5 flex items-center justify-between">
        <h3 className="font-bold text-gray-900">Resultado</h3>

        <span className="text-sm font-semibold text-gray-500">
          {dados.total_projetos} projeto(s)
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-100">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wide text-gray-500">
                Projeto
              </th>

              <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wide text-gray-500">
                Curso e turma
              </th>

              <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wide text-gray-500">
                Orientador
              </th>

              <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wide text-gray-500">
                Status
              </th>

              <th className="px-4 py-3 text-center text-xs font-bold uppercase tracking-wide text-gray-500">
                Avaliações
              </th>

              <th className="px-4 py-3 text-right text-xs font-bold uppercase tracking-wide text-gray-500">
                Média
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {projetos.map((projeto) => (
              <tr key={projeto.id} className="hover:bg-orange-50/30">
                <td className="px-4 py-4">
                  <p className="font-semibold text-gray-900">
                    {projeto.titulo}
                  </p>

                  <p className="mt-1 text-xs text-gray-400">
                    {projeto.area_conhecimento}
                  </p>

                  <p className="mt-1 text-xs text-gray-400">
                    Responsável: {projeto.aluno_responsavel}
                  </p>
                </td>

                <td className="px-4 py-4 text-sm text-gray-600">
                  <p>{projeto.curso}</p>

                  <p className="mt-1 text-xs text-gray-400">
                    {projeto.turma} • {projeto.semestre}
                  </p>
                </td>

                <td className="px-4 py-4 text-sm text-gray-600">
                  {projeto.professor_orientador}
                </td>

                <td className="px-4 py-4">
                  <span
                    className={`inline-flex rounded-lg border px-3 py-1 text-xs font-semibold ${
                      STATUS_CLASSES[projeto.status] || STATUS_CLASSES.rascunho
                    }`}
                  >
                    {STATUS[projeto.status] || projeto.status}
                  </span>
                </td>

                <td className="px-4 py-4 text-center text-sm font-semibold text-gray-700">
                  {projeto.total_avaliacoes}
                </td>

                <td className="px-4 py-4 text-right font-bold text-gray-900">
                  {formatarMedia(projeto.media_geral)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

function TabelaAcademica({ dados }) {
  const indicadores = Array.isArray(dados?.indicadores)
    ? dados.indicadores
    : [];

  if (indicadores.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-gray-200 p-12 text-center">
        <BarChart3 size={38} className="mx-auto text-gray-300" />

        <p className="mt-4 text-sm font-semibold text-gray-600">
          Nenhum indicador acadêmico encontrado com os filtros selecionados.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="mb-5 flex items-center justify-between">
        <h3 className="font-bold text-gray-900">Indicadores acadêmicos</h3>

        <span className="text-sm font-semibold text-gray-500">
          {indicadores.length} agrupamento(s)
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-100">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wide text-gray-500">
                Curso
              </th>

              <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wide text-gray-500">
                Turma
              </th>

              <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wide text-gray-500">
                Semestre
              </th>

              <th className="px-4 py-3 text-center text-xs font-bold uppercase tracking-wide text-gray-500">
                Projetos
              </th>

              <th className="px-4 py-3 text-center text-xs font-bold uppercase tracking-wide text-gray-500">
                Avaliações
              </th>

              <th className="px-4 py-3 text-right text-xs font-bold uppercase tracking-wide text-gray-500">
                Inovação
              </th>

              <th className="px-4 py-3 text-right text-xs font-bold uppercase tracking-wide text-gray-500">
                Técnica
              </th>

              <th className="px-4 py-3 text-right text-xs font-bold uppercase tracking-wide text-gray-500">
                Aplicabilidade
              </th>

              <th className="px-4 py-3 text-right text-xs font-bold uppercase tracking-wide text-gray-500">
                Clareza
              </th>

              <th className="px-4 py-3 text-right text-xs font-bold uppercase tracking-wide text-gray-500">
                Média geral
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {indicadores.map((indicador) => (
              <tr
                key={`${indicador.curso}-${indicador.turma}-${indicador.semestre}`}
                className="hover:bg-orange-50/30"
              >
                <td className="px-4 py-4 font-semibold text-gray-900">
                  {indicador.curso}
                </td>

                <td className="px-4 py-4 text-sm text-gray-600">
                  {indicador.turma}
                </td>

                <td className="px-4 py-4 text-sm text-gray-600">
                  {indicador.semestre}
                </td>

                <td className="px-4 py-4 text-center text-sm text-gray-600">
                  {indicador.total_projetos}
                </td>

                <td className="px-4 py-4 text-center text-sm text-gray-600">
                  {indicador.total_avaliacoes}
                </td>

                <td className="px-4 py-4 text-right text-sm text-gray-600">
                  {formatarMedia(indicador.media_inovacao)}
                </td>

                <td className="px-4 py-4 text-right text-sm text-gray-600">
                  {formatarMedia(indicador.media_tecnica)}
                </td>

                <td className="px-4 py-4 text-right text-sm text-gray-600">
                  {formatarMedia(indicador.media_aplicabilidade)}
                </td>

                <td className="px-4 py-4 text-right text-sm text-gray-600">
                  {formatarMedia(indicador.media_clareza)}
                </td>

                <td className="px-4 py-4 text-right font-bold text-gray-900">
                  {formatarMedia(indicador.media_geral)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default function Relatorios() {
  const {
    projetosBase,
    professores,
    resultado,
    tipoResultado,
    loadingInicial,
    carregandoRelatorio,
    exportando,
    erro,
    gerarRelatorio,
    exportarPdf,
  } = useCoordenacaoRelatorios();

  const [reportType, setReportType] = useState("projetos");

  const [filters, setFilters] = useState(FILTROS_INICIAIS);

  const cursos = useMemo(
    () => valoresUnicos(projetosBase, "curso"),
    [projetosBase],
  );

  const turmas = useMemo(
    () => valoresUnicos(projetosBase, "turma"),
    [projetosBase],
  );

  const semestres = useMemo(
    () => valoresUnicos(projetosBase, "semestre"),
    [projetosBase],
  );

  function alterarFiltro(campo, valor) {
    setFilters((anterior) => ({
      ...anterior,
      [campo]: valor,
    }));
  }

  async function selecionarTipo(tipo) {
    if (tipo === reportType && tipo === tipoResultado) {
      return;
    }

    setReportType(tipo);

    try {
      await gerarRelatorio(tipo, filters);
    } catch {
      // O hook já exibe a mensagem.
    }
  }

  async function atualizarVisualizacao() {
    try {
      await gerarRelatorio(reportType, filters);
    } catch {
      // O hook já exibe a mensagem.
    }
  }

  async function baixarPdf() {
    try {
      await exportarPdf(reportType, filters);
    } catch {
      // O hook já exibe a mensagem.
    }
  }

  function limparFiltros() {
    setFilters(FILTROS_INICIAIS);
  }

  if (loadingInicial) {
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
          Relatórios
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          Consulte indicadores e exporte relatórios acadêmicos em PDF.
        </p>
      </header>

      {erro && (
        <div className="mb-6 flex items-start gap-3 rounded-2xl border border-red-100 bg-red-50 p-4 text-sm font-medium text-red-600">
          <AlertTriangle size={18} className="mt-0.5 shrink-0" />

          {erro}
        </div>
      )}

      <section className="mb-8">
        <h2 className="mb-4 flex items-center gap-2 font-bold text-gray-800">
          <FileText size={19} className="text-[#f19f17]" />
          Tipo de relatório
        </h2>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <CardTipo
            selecionado={reportType === "projetos"}
            icon={FolderKanban}
            titulo="Relatório de projetos"
            descricao="Projetos Integradores, responsáveis, orientadores, status e resultados das avaliações."
            onClick={() => selecionarTipo("projetos")}
          />

          <CardTipo
            selecionado={reportType === "academico"}
            icon={BarChart3}
            titulo="Relatório acadêmico"
            descricao="Indicadores consolidados por curso, turma e semestre, incluindo médias por critério."
            onClick={() => selecionarTipo("academico")}
          />
        </div>
      </section>

      <section className="mb-8 rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
        <header className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h2 className="flex items-center gap-2 font-bold text-gray-900">
              <Filter size={19} className="text-[#f19f17]" />
              Configurar relatório
            </h2>

            <p className="mt-1 text-xs text-gray-500">
              Campos vazios incluem todos os registros disponíveis.
            </p>
          </div>

          <button
            type="button"
            onClick={limparFiltros}
            className="text-sm font-semibold text-gray-500 hover:text-[#f19f17]"
          >
            Limpar filtros
          </button>
        </header>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-5">
          <Campo label="Curso">
            <select
              value={filters.curso}
              onChange={(event) => alterarFiltro("curso", event.target.value)}
              className={inputClasses}
            >
              <option value="">Todos os cursos</option>

              {cursos.map((curso) => (
                <option key={curso} value={curso}>
                  {curso}
                </option>
              ))}
            </select>
          </Campo>

          <Campo label="Turma">
            <select
              value={filters.turma}
              onChange={(event) => alterarFiltro("turma", event.target.value)}
              className={inputClasses}
            >
              <option value="">Todas as turmas</option>

              {turmas.map((turma) => (
                <option key={turma} value={turma}>
                  {turma}
                </option>
              ))}
            </select>
          </Campo>

          <Campo label="Semestre">
            <select
              value={filters.semestre}
              onChange={(event) =>
                alterarFiltro("semestre", event.target.value)
              }
              className={inputClasses}
            >
              <option value="">Todos os semestres</option>

              {semestres.map((semestre) => (
                <option key={semestre} value={semestre}>
                  {semestre}
                </option>
              ))}
            </select>
          </Campo>

          <Campo label="Professor">
            <select
              value={filters.professor_id}
              onChange={(event) =>
                alterarFiltro("professor_id", event.target.value)
              }
              className={inputClasses}
            >
              <option value="">Todos os professores</option>

              {professores.map((professor) => (
                <option key={professor.id} value={professor.id}>
                  {professor.nome}
                </option>
              ))}
            </select>
          </Campo>

          {reportType === "projetos" && (
            <Campo label="Status">
              <select
                value={filters.status}
                onChange={(event) =>
                  alterarFiltro("status", event.target.value)
                }
                className={inputClasses}
              >
                <option value="">Todos os status</option>

                {Object.entries(STATUS).map(([valor, label]) => (
                  <option key={valor} value={valor}>
                    {label}
                  </option>
                ))}
              </select>
            </Campo>
          )}
        </div>

        <div className="mt-6 flex flex-col justify-end gap-3 sm:flex-row">
          <button
            type="button"
            onClick={atualizarVisualizacao}
            disabled={carregandoRelatorio || exportando}
            className="flex items-center justify-center gap-2 rounded-xl border border-gray-200 px-5 py-2.5 text-sm font-bold text-gray-700 hover:bg-gray-50 disabled:opacity-50"
          >
            {carregandoRelatorio ? (
              <LoaderCircle size={17} className="animate-spin" />
            ) : (
              <RefreshCw size={17} />
            )}
            Atualizar visualização
          </button>

          <button
            type="button"
            onClick={baixarPdf}
            disabled={exportando || carregandoRelatorio}
            className="flex items-center justify-center gap-2 rounded-xl bg-[#f19f17] px-5 py-2.5 text-sm font-bold text-white hover:bg-amber-600 disabled:opacity-50"
          >
            {exportando ? (
              <LoaderCircle size={17} className="animate-spin" />
            ) : (
              <Download size={17} />
            )}
            Baixar PDF
          </button>
        </div>
      </section>

      <section className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
        {carregandoRelatorio ? (
          <div className="flex min-h-72 items-center justify-center">
            <LoaderCircle className="h-8 w-8 animate-spin text-[#f19f17]" />
          </div>
        ) : tipoResultado === "academico" ? (
          <TabelaAcademica dados={resultado} />
        ) : (
          <TabelaProjetos dados={resultado} />
        )}
      </section>
    </div>
  );
}
