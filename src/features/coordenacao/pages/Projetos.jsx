import { useMemo, useState } from "react";

import {
  AlertTriangle,
  CheckCircle2,
  ExternalLink,
  Eye,
  FileText,
  FolderKanban,
  LoaderCircle,
  Pencil,
  Plus,
  Save,
  Search,
  Star,
  Trash2,
  UserPlus,
  Users,
  X,
  XCircle,
} from "lucide-react";

import {
  addIntegranteAoProjeto,
  createArquivoMetadata,
  deletarProjeto,
  deleteArquivoMetadata,
  getArquivosDoProjeto,
  getIntegrantesDoProjeto,
  getLinksDoProjeto,
  getProjetoPorId,
  removeIntegranteDoProjeto,
  updateArquivoMetadata,
  updateProjeto,
  updateProjetoStatus,
} from "../../../lib/projetosApi";

import { getAvaliacoesPorProjeto } from "../../../lib/avaliacoesApi";

import { useCoordenacaoProjetos } from "../hooks/useCoordenacaoProjetos";

const STATUS_PROJETO = {
  rascunho: {
    label: "Rascunho",
    classes: "border-gray-200 bg-gray-100 text-gray-600",
  },
  submetido: {
    label: "Submetido",
    classes: "border-blue-100 bg-blue-50 text-blue-700",
  },
  em_avaliacao: {
    label: "Em avaliação",
    classes: "border-purple-100 bg-purple-50 text-purple-700",
  },
  aprovado: {
    label: "Aprovado",
    classes: "border-emerald-100 bg-emerald-50 text-emerald-700",
  },
  reprovado: {
    label: "Reprovado",
    classes: "border-red-100 bg-red-50 text-red-700",
  },
};

const CONCEITO_CLASSES = {
  Excelente: "border-emerald-100 bg-emerald-50 text-emerald-700",
  Ótimo: "border-blue-100 bg-blue-50 text-blue-700",
  Bom: "border-amber-100 bg-amber-50 text-amber-700",
  "Ainda não suficiente": "border-orange-100 bg-orange-50 text-orange-700",
  Insuficiente: "border-red-100 bg-red-50 text-red-700",
};

const FORM_PROJETO_INICIAL = {
  titulo: "",
  descricao: "",
  curso: "",
  turma: "",
  semestre: "",
  area_conhecimento: "",
  professor_orientador_id: "",
};

const FORM_ARQUIVO_INICIAL = {
  nome_original: "",
  tamanho_mb: "",
};

function normalizar(valor) {
  return String(valor ?? "")
    .trim()
    .toLowerCase();
}

function formatarMedia(valor) {
  if (valor === null || valor === undefined) {
    return "—";
  }

  const numero = Number(valor);

  return Number.isNaN(numero) ? "—" : numero.toFixed(2);
}

function formatarData(data) {
  if (!data) {
    return "Data não informada";
  }

  const valor = new Date(data);

  if (Number.isNaN(valor.getTime())) {
    return "Data não informada";
  }

  return valor.toLocaleDateString("pt-BR");
}

function obterNomeAluno(aluno) {
  return aluno.nome || aluno.nome_completo || `Aluno #${aluno.id}`;
}

function obterNomeProfessor(professor) {
  return (
    professor.nome || professor.nome_completo || `Professor #${professor.id}`
  );
}

function StatusBadge({ status }) {
  const configuracao = STATUS_PROJETO[status] || {
    label: status || "Não informado",
    classes: "border-gray-200 bg-gray-100 text-gray-600",
  };

  return (
    <span
      className={`inline-flex rounded-lg border px-3 py-1 text-[10px] font-bold uppercase tracking-wide ${configuracao.classes}`}
    >
      {configuracao.label}
    </span>
  );
}

function TabButton({ active, children, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`shrink-0 whitespace-nowrap border-b-2 px-4 py-4 text-sm font-semibold leading-none transition-colors ${
        active
          ? "border-[#f19f17] text-[#f19f17]"
          : "border-transparent text-gray-500 hover:text-gray-800"
      }`}
    >
      {children}
    </button>
  );
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

const inputClasses =
  "w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-800 outline-none transition-colors focus:border-[#f19f17] focus:ring-2 focus:ring-orange-100";

export default function Projetos() {
  const { projetos, alunos, professores, loading, error, refetch } =
    useCoordenacaoProjetos();

  const [busca, setBusca] = useState("");

  const [curso, setCurso] = useState("");

  const [turma, setTurma] = useState("");

  const [semestre, setSemestre] = useState("");

  const [professorFiltro, setProfessorFiltro] = useState("");

  const [statusFiltro, setStatusFiltro] = useState("");

  const [modalAberto, setModalAberto] = useState(false);

  const [abaAtiva, setAbaAtiva] = useState("dados");

  const [selectedProject, setSelectedProject] = useState(null);

  const [integrantes, setIntegrantes] = useState([]);

  const [arquivos, setArquivos] = useState([]);

  const [links, setLinks] = useState([]);

  const [avaliacoes, setAvaliacoes] = useState([]);

  const [formProjeto, setFormProjeto] = useState(FORM_PROJETO_INICIAL);

  const [alunoSelecionado, setAlunoSelecionado] = useState("");

  const [formArquivo, setFormArquivo] = useState(FORM_ARQUIVO_INICIAL);

  const [arquivoEditandoId, setArquivoEditandoId] = useState(null);

  const [formArquivoEdicao, setFormArquivoEdicao] =
    useState(FORM_ARQUIVO_INICIAL);

  const [loadingDetails, setLoadingDetails] = useState(false);

  const [processando, setProcessando] = useState(false);

  const [erroAcao, setErroAcao] = useState("");

  const [sucesso, setSucesso] = useState("");

  const cursos = useMemo(
    () =>
      [...new Set(projetos.map((item) => item.curso).filter(Boolean))].sort(),
    [projetos],
  );

  const turmas = useMemo(
    () =>
      [...new Set(projetos.map((item) => item.turma).filter(Boolean))].sort(),
    [projetos],
  );

  const semestres = useMemo(
    () =>
      [
        ...new Set(projetos.map((item) => item.semestre).filter(Boolean)),
      ].sort(),
    [projetos],
  );

  const nomesProfessores = useMemo(
    () =>
      [
        ...new Set(
          projetos.map((item) => item.professor_orientador).filter(Boolean),
        ),
      ].sort(),
    [projetos],
  );

  const projetosFiltrados = useMemo(() => {
    const termo = normalizar(busca);

    return projetos.filter((projeto) => {
      const correspondeBusca =
        !termo ||
        [
          projeto.titulo,
          projeto.aluno_responsavel,
          projeto.professor_orientador,
          projeto.area_conhecimento,
        ].some((campo) => normalizar(campo).includes(termo));

      return (
        correspondeBusca &&
        (!curso || projeto.curso === curso) &&
        (!turma || projeto.turma === turma) &&
        (!semestre || projeto.semestre === semestre) &&
        (!professorFiltro ||
          projeto.professor_orientador === professorFiltro) &&
        (!statusFiltro || projeto.status === statusFiltro)
      );
    });
  }, [projetos, busca, curso, turma, semestre, professorFiltro, statusFiltro]);

  const alunosDisponiveis = useMemo(() => {
    const idsIntegrantes = new Set(
      integrantes.map((integrante) => Number(integrante.aluno_id)),
    );

    return alunos
      .filter((aluno) => !idsIntegrantes.has(Number(aluno.id)))
      .sort((a, b) => obterNomeAluno(a).localeCompare(obterNomeAluno(b)));
  }, [alunos, integrantes]);

  async function carregarDetalhes(projetoId) {
    setLoadingDetails(true);
    setErroAcao("");

    try {
      const projeto = await getProjetoPorId(projetoId);

      const resultados = await Promise.allSettled([
        getIntegrantesDoProjeto(projetoId),
        getArquivosDoProjeto(projetoId),
        getLinksDoProjeto(projetoId),
        getAvaliacoesPorProjeto(projetoId),
      ]);

      const [
        integrantesResultado,
        arquivosResultado,
        linksResultado,
        avaliacoesResultado,
      ] = resultados;

      setSelectedProject((anterior) => ({
        ...anterior,
        ...projeto,
      }));

      setFormProjeto({
        titulo: projeto.titulo || "",
        descricao: projeto.descricao || "",
        curso: projeto.curso || "",
        turma: projeto.turma || "",
        semestre: projeto.semestre || "",
        area_conhecimento: projeto.area_conhecimento || "",
        professor_orientador_id: String(projeto.professor_orientador_id || ""),
      });

      setIntegrantes(
        integrantesResultado.status === "fulfilled" &&
          Array.isArray(integrantesResultado.value)
          ? integrantesResultado.value
          : [],
      );

      setArquivos(
        arquivosResultado.status === "fulfilled" &&
          Array.isArray(arquivosResultado.value)
          ? arquivosResultado.value
          : [],
      );

      setLinks(
        linksResultado.status === "fulfilled" &&
          Array.isArray(linksResultado.value)
          ? linksResultado.value
          : [],
      );

      setAvaliacoes(
        avaliacoesResultado.status === "fulfilled" &&
          Array.isArray(avaliacoesResultado.value)
          ? avaliacoesResultado.value
          : [],
      );
    } catch (err) {
      setErroAcao(
        err.message || "Não foi possível carregar os detalhes do projeto.",
      );
    } finally {
      setLoadingDetails(false);
    }
  }

  async function abrirModal(projeto) {
    setSelectedProject(projeto);
    setModalAberto(true);
    setAbaAtiva("dados");
    setErroAcao("");
    setSucesso("");
    setAlunoSelecionado("");
    setFormArquivo(FORM_ARQUIVO_INICIAL);
    setArquivoEditandoId(null);

    await carregarDetalhes(projeto.id);
  }

  function fecharModal() {
    if (processando) {
      return;
    }

    setModalAberto(false);
    setSelectedProject(null);
    setIntegrantes([]);
    setArquivos([]);
    setLinks([]);
    setAvaliacoes([]);
    setErroAcao("");
    setSucesso("");
    setArquivoEditandoId(null);
  }

  function atualizarFormProjeto(campo, valor) {
    setFormProjeto((anterior) => ({
      ...anterior,
      [campo]: valor,
    }));
  }

  async function salvarProjeto() {
    if (!selectedProject) {
      return;
    }

    const payload = {};

    const camposTexto = [
      "titulo",
      "descricao",
      "curso",
      "turma",
      "semestre",
      "area_conhecimento",
    ];

    camposTexto.forEach((campo) => {
      const novoValor = formProjeto[campo].trim();

      if (novoValor !== String(selectedProject[campo] ?? "").trim()) {
        payload[campo] = novoValor;
      }
    });

    const novoProfessorId = Number(formProjeto.professor_orientador_id);

    if (novoProfessorId !== Number(selectedProject.professor_orientador_id)) {
      payload.professor_orientador_id = novoProfessorId;
    }

    if (Object.keys(payload).length === 0) {
      setErroAcao("Nenhuma alteração foi identificada.");
      setSucesso("");
      return;
    }

    setProcessando(true);
    setErroAcao("");
    setSucesso("");

    try {
      await updateProjeto(selectedProject.id, payload);

      await carregarDetalhes(selectedProject.id);

      await refetch();

      setSucesso("Projeto atualizado com sucesso.");
    } catch (err) {
      setErroAcao(err.message || "Não foi possível atualizar o projeto.");
    } finally {
      setProcessando(false);
    }
  }

  async function adicionarIntegrante() {
    if (!selectedProject || !alunoSelecionado) {
      setErroAcao("Selecione um aluno para adicionar.");
      return;
    }

    setProcessando(true);
    setErroAcao("");
    setSucesso("");

    try {
      await addIntegranteAoProjeto(selectedProject.id, {
        aluno_id: Number(alunoSelecionado),
      });

      setAlunoSelecionado("");

      await carregarDetalhes(selectedProject.id);

      setSucesso("Integrante adicionado com sucesso.");
    } catch (err) {
      setErroAcao(err.message || "Não foi possível adicionar o integrante.");
    } finally {
      setProcessando(false);
    }
  }

  async function removerIntegrante(integrante) {
    if (!selectedProject) {
      return;
    }

    const confirmou = window.confirm(
      `Remover ${integrante.nome} deste projeto?`,
    );

    if (!confirmou) {
      return;
    }

    setProcessando(true);
    setErroAcao("");
    setSucesso("");

    try {
      await removeIntegranteDoProjeto(selectedProject.id, integrante.aluno_id);

      await carregarDetalhes(selectedProject.id);

      setSucesso("Integrante removido com sucesso.");
    } catch (err) {
      setErroAcao(err.message || "Não foi possível remover o integrante.");
    } finally {
      setProcessando(false);
    }
  }

  async function cadastrarArquivo() {
    if (!selectedProject) {
      return;
    }

    const nome = formArquivo.nome_original.trim();

    const tamanho = Number(formArquivo.tamanho_mb);

    if (!nome) {
      setErroAcao("Informe o nome do arquivo.");
      return;
    }

    if (Number.isNaN(tamanho) || tamanho <= 0 || tamanho > 50) {
      setErroAcao("O tamanho deve ser maior que 0 e menor ou igual a 50 MB.");
      return;
    }

    setProcessando(true);
    setErroAcao("");
    setSucesso("");

    try {
      await createArquivoMetadata({
        projeto_id: selectedProject.id,
        nome_original: nome,
        tamanho_mb: tamanho,
      });

      setFormArquivo(FORM_ARQUIVO_INICIAL);

      await carregarDetalhes(selectedProject.id);

      setSucesso("Metadado do arquivo cadastrado com sucesso.");
    } catch (err) {
      setErroAcao(err.message || "Não foi possível cadastrar o arquivo.");
    } finally {
      setProcessando(false);
    }
  }

  function iniciarEdicaoArquivo(arquivo) {
    setArquivoEditandoId(arquivo.id);

    setFormArquivoEdicao({
      nome_original: arquivo.nome_original || "",
      tamanho_mb: String(arquivo.tamanho_mb ?? ""),
    });

    setErroAcao("");
    setSucesso("");
  }

  function cancelarEdicaoArquivo() {
    setArquivoEditandoId(null);

    setFormArquivoEdicao(FORM_ARQUIVO_INICIAL);
  }

  async function salvarArquivo(arquivo) {
    if (!selectedProject) {
      return;
    }

    const nome = formArquivoEdicao.nome_original.trim();

    const tamanho = Number(formArquivoEdicao.tamanho_mb);

    const payload = {};

    if (nome !== arquivo.nome_original) {
      payload.nome_original = nome;
    }

    if (tamanho !== Number(arquivo.tamanho_mb)) {
      payload.tamanho_mb = tamanho;
    }

    if (Object.keys(payload).length === 0) {
      setErroAcao("Nenhuma alteração foi identificada.");
      return;
    }

    setProcessando(true);
    setErroAcao("");
    setSucesso("");

    try {
      await updateArquivoMetadata(arquivo.id, payload);

      cancelarEdicaoArquivo();

      await carregarDetalhes(selectedProject.id);

      setSucesso("Metadados do arquivo atualizados com sucesso.");
    } catch (err) {
      setErroAcao(err.message || "Não foi possível atualizar o arquivo.");
    } finally {
      setProcessando(false);
    }
  }

  async function excluirArquivo(arquivo) {
    if (!selectedProject) {
      return;
    }

    const confirmou = window.confirm(
      `Remover o registro "${arquivo.nome_original}"?`,
    );

    if (!confirmou) {
      return;
    }

    setProcessando(true);
    setErroAcao("");
    setSucesso("");

    try {
      await deleteArquivoMetadata(arquivo.id);

      await carregarDetalhes(selectedProject.id);

      setSucesso("Arquivo removido com sucesso.");
    } catch (err) {
      setErroAcao(err.message || "Não foi possível remover o arquivo.");
    } finally {
      setProcessando(false);
    }
  }

  async function alterarStatus(novoStatus) {
    if (!selectedProject) {
      return;
    }

    const acao = novoStatus === "aprovado" ? "aprovar" : "reprovar";

    const confirmou = window.confirm(
      `Confirma que deseja ${acao} este projeto?`,
    );

    if (!confirmou) {
      return;
    }

    setProcessando(true);
    setErroAcao("");
    setSucesso("");

    try {
      await updateProjetoStatus(selectedProject.id, novoStatus);

      await carregarDetalhes(selectedProject.id);

      await refetch();

      setSucesso(
        novoStatus === "aprovado"
          ? "Projeto aprovado com sucesso."
          : "Projeto reprovado com sucesso.",
      );
    } catch (err) {
      setErroAcao(err.message || "Não foi possível alterar o status.");
    } finally {
      setProcessando(false);
    }
  }

  async function excluirProjetoSelecionado() {
    if (!selectedProject) {
      return;
    }

    const confirmou = window.confirm(
      `Excluir definitivamente o projeto "${selectedProject.titulo}"?`,
    );

    if (!confirmou) {
      return;
    }

    setProcessando(true);
    setErroAcao("");
    setSucesso("");

    try {
      await deletarProjeto(selectedProject.id);

      fecharModal();

      await refetch();
    } catch (err) {
      setErroAcao(err.message || "Não foi possível excluir o projeto.");
      setProcessando(false);
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <LoaderCircle className="h-8 w-8 animate-spin text-[#f19f17]" />
      </div>
    );
  }

  const podeDecidir = selectedProject?.status === "em_avaliacao";

  const podeExcluir =
    selectedProject &&
    ["rascunho", "submetido"].includes(selectedProject.status);

  return (
    <div className="pb-12">
      <header className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">
          Projetos
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          Gerencie projetos, integrantes, arquivos e resultados acadêmicos.
        </p>
      </header>

      {error && (
        <div className="mb-6 rounded-2xl border border-amber-100 bg-amber-50 p-4 text-sm font-medium text-amber-700">
          {error}
        </div>
      )}

      <section className="mb-8 rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-5">
          <select
            value={curso}
            onChange={(event) => setCurso(event.target.value)}
            className={inputClasses}
          >
            <option value="">Todos os cursos</option>

            {cursos.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>

          <select
            value={turma}
            onChange={(event) => setTurma(event.target.value)}
            className={inputClasses}
          >
            <option value="">Todas as turmas</option>

            {turmas.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>

          <select
            value={semestre}
            onChange={(event) => setSemestre(event.target.value)}
            className={inputClasses}
          >
            <option value="">Todos os semestres</option>

            {semestres.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>

          <select
            value={professorFiltro}
            onChange={(event) => setProfessorFiltro(event.target.value)}
            className={inputClasses}
          >
            <option value="">Todos os professores</option>

            {nomesProfessores.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>

          <select
            value={statusFiltro}
            onChange={(event) => setStatusFiltro(event.target.value)}
            className={inputClasses}
          >
            <option value="">Todos os status</option>

            {Object.entries(STATUS_PROJETO).map(([valor, config]) => (
              <option key={valor} value={valor}>
                {config.label}
              </option>
            ))}
          </select>
        </div>

        <div className="relative mt-4">
          <Search
            size={17}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />

          <input
            type="search"
            value={busca}
            onChange={(event) => setBusca(event.target.value)}
            placeholder="Buscar por título, aluno, professor ou área"
            className={`${inputClasses} pl-10`}
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
        <div className="space-y-4">
          {projetosFiltrados.map((projeto) => (
            <article
              key={projeto.id}
              className="flex flex-col justify-between gap-5 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition-colors hover:border-orange-200 md:flex-row md:items-center"
            >
              <div className="flex min-w-0 items-start gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-orange-50 text-[#f19f17]">
                  <FolderKanban size={21} />
                </div>

                <div className="min-w-0">
                  <h3 className="font-bold text-gray-900">{projeto.titulo}</h3>

                  <p className="mt-1 text-xs text-gray-500">
                    {projeto.curso} • {projeto.turma} • {projeto.semestre}
                  </p>

                  <p className="mt-2 text-xs text-gray-400">
                    Responsável: {projeto.aluno_responsavel}
                  </p>

                  <p className="mt-1 text-xs text-gray-400">
                    Orientador: {projeto.professor_orientador}
                  </p>
                </div>
              </div>

              <div className="flex shrink-0 flex-wrap items-center gap-4">
                <div className="text-center">
                  <strong className="block text-gray-900">
                    {projeto.total_avaliacoes}
                  </strong>

                  <span className="text-[10px] uppercase tracking-wide text-gray-400">
                    Avaliações
                  </span>
                </div>

                <div className="text-center">
                  <strong className="block text-gray-900">
                    {formatarMedia(projeto.media_geral)}
                  </strong>

                  <span className="text-[10px] uppercase tracking-wide text-gray-400">
                    Média
                  </span>
                </div>

                <StatusBadge status={projeto.status} />

                <button
                  type="button"
                  onClick={() => abrirModal(projeto)}
                  className="rounded-xl p-2.5 text-[#f19f17] hover:bg-orange-50"
                  title="Gerenciar projeto"
                >
                  <Eye size={18} />
                </button>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="rounded-3xl border border-dashed border-gray-200 bg-white p-14 text-center">
          <FolderKanban size={42} className="mx-auto text-gray-300" />

          <h2 className="mt-5 text-lg font-bold text-gray-700">
            Nenhum projeto encontrado
          </h2>

          <p className="mt-2 text-sm text-gray-500">
            Não existem projetos compatíveis com os filtros.
          </p>
        </div>
      )}

      {modalAberto && selectedProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
          <div className="flex h-[calc(100vh-2rem)] max-h-[94vh] w-full max-w-6xl flex-col overflow-hidden rounded-3xl bg-white shadow-2xl">
            <header className="shrink-0 flex items-start justify-between gap-5 border-b border-gray-100 px-7 py-6">
              <div>
                <StatusBadge status={selectedProject.status} />

                <h2 className="mt-3 text-xl font-bold text-gray-900">
                  {selectedProject.titulo}
                </h2>

                <p className="mt-1 text-xs text-gray-500">
                  {selectedProject.curso} • {selectedProject.turma} •{" "}
                  {selectedProject.semestre}
                </p>
              </div>

              <button
                type="button"
                onClick={fecharModal}
                disabled={processando}
                className="rounded-full p-2 text-gray-400 hover:bg-gray-100 disabled:opacity-50"
              >
                <X size={21} />
              </button>
            </header>

            <nav className="shrink-0 flex min-h-14 items-end overflow-x-auto border-b border-gray-100 px-5">
              <TabButton
                active={abaAtiva === "dados"}
                onClick={() => setAbaAtiva("dados")}
              >
                Dados gerais
              </TabButton>

              <TabButton
                active={abaAtiva === "integrantes"}
                onClick={() => setAbaAtiva("integrantes")}
              >
                Integrantes
              </TabButton>

              <TabButton
                active={abaAtiva === "arquivos"}
                onClick={() => setAbaAtiva("arquivos")}
              >
                Arquivos
              </TabButton>

              <TabButton
                active={abaAtiva === "avaliacoes"}
                onClick={() => setAbaAtiva("avaliacoes")}
              >
                Avaliações
              </TabButton>
            </nav>

            <div className="min-h-0 flex-1 overflow-y-auto p-7">
              {erroAcao && (
                <div className="mb-6 flex items-start gap-3 rounded-2xl border border-red-100 bg-red-50 p-4 text-sm font-medium text-red-600">
                  <AlertTriangle size={18} className="mt-0.5 shrink-0" />

                  {erroAcao}
                </div>
              )}

              {sucesso && (
                <div className="mb-6 rounded-2xl border border-emerald-100 bg-emerald-50 p-4 text-sm font-medium text-emerald-700">
                  {sucesso}
                </div>
              )}

              {loadingDetails ? (
                <div className="flex min-h-[350px] items-center justify-center">
                  <LoaderCircle className="h-8 w-8 animate-spin text-[#f19f17]" />
                </div>
              ) : (
                <>
                  {abaAtiva === "dados" && (
                    <div className="space-y-8">
                      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                        <Campo label="Título">
                          <input
                            value={formProjeto.titulo}
                            onChange={(event) =>
                              atualizarFormProjeto("titulo", event.target.value)
                            }
                            className={inputClasses}
                          />
                        </Campo>

                        <Campo label="Área de conhecimento">
                          <input
                            value={formProjeto.area_conhecimento}
                            onChange={(event) =>
                              atualizarFormProjeto(
                                "area_conhecimento",
                                event.target.value,
                              )
                            }
                            className={inputClasses}
                          />
                        </Campo>

                        <Campo label="Curso">
                          <input
                            value={formProjeto.curso}
                            onChange={(event) =>
                              atualizarFormProjeto("curso", event.target.value)
                            }
                            className={inputClasses}
                          />
                        </Campo>

                        <Campo label="Turma">
                          <input
                            value={formProjeto.turma}
                            onChange={(event) =>
                              atualizarFormProjeto("turma", event.target.value)
                            }
                            className={inputClasses}
                          />
                        </Campo>

                        <Campo label="Semestre">
                          <input
                            value={formProjeto.semestre}
                            onChange={(event) =>
                              atualizarFormProjeto(
                                "semestre",
                                event.target.value,
                              )
                            }
                            className={inputClasses}
                          />
                        </Campo>

                        <Campo label="Professor orientador">
                          <select
                            value={formProjeto.professor_orientador_id}
                            onChange={(event) =>
                              atualizarFormProjeto(
                                "professor_orientador_id",
                                event.target.value,
                              )
                            }
                            className={inputClasses}
                          >
                            <option value="">Selecione</option>

                            {professores.map((professor) => (
                              <option key={professor.id} value={professor.id}>
                                {obterNomeProfessor(professor)}
                              </option>
                            ))}
                          </select>
                        </Campo>
                      </div>

                      <Campo label="Descrição">
                        <textarea
                          rows={6}
                          value={formProjeto.descricao}
                          onChange={(event) =>
                            atualizarFormProjeto(
                              "descricao",
                              event.target.value,
                            )
                          }
                          className={inputClasses}
                        />
                      </Campo>

                      <div className="rounded-2xl border border-gray-100 bg-gray-50 p-5">
                        <p className="text-xs font-bold uppercase tracking-wider text-gray-400">
                          Aluno responsável
                        </p>

                        <p className="mt-2 font-semibold text-gray-800">
                          {selectedProject.aluno_responsavel}
                        </p>
                      </div>

                      {links.length > 0 ? (
                        <section>
                          <h3 className="mb-4 text-sm font-bold text-gray-800">
                            Links vinculados
                          </h3>

                          <div className="space-y-3">
                            {links.map((link) => (
                              <a
                                key={link.id}
                                href={link.url}
                                target="_blank"
                                rel="noreferrer"
                                className="flex items-center justify-between gap-4 rounded-xl border border-gray-100 p-4 text-sm font-semibold text-gray-700 hover:border-orange-200 hover:text-[#f19f17]"
                              >
                                <span className="break-all">
                                  {link.descricao || link.url}
                                </span>

                                <ExternalLink size={16} />
                              </a>
                            ))}
                          </div>
                        </section>
                      ) : null}

                      <div className="flex justify-end">
                        <button
                          type="button"
                          onClick={salvarProjeto}
                          disabled={processando}
                          className="flex items-center gap-2 rounded-xl bg-[#f19f17] px-5 py-2.5 text-sm font-bold text-white hover:bg-amber-600 disabled:opacity-50"
                        >
                          <Save size={17} />
                          Salvar alterações
                        </button>
                      </div>
                    </div>
                  )}

                  {abaAtiva === "integrantes" && (
                    <div className="space-y-7">
                      <section className="rounded-2xl border border-gray-100 bg-gray-50 p-5">
                        <h3 className="flex items-center gap-2 font-bold text-gray-800">
                          <UserPlus size={19} />
                          Adicionar integrante
                        </h3>

                        <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                          <select
                            value={alunoSelecionado}
                            onChange={(event) =>
                              setAlunoSelecionado(event.target.value)
                            }
                            className={`${inputClasses} flex-1`}
                          >
                            <option value="">Selecione um aluno</option>

                            {alunosDisponiveis.map((aluno) => (
                              <option key={aluno.id} value={aluno.id}>
                                {obterNomeAluno(aluno)}
                                {aluno.curso ? ` — ${aluno.curso}` : ""}
                              </option>
                            ))}
                          </select>

                          <button
                            type="button"
                            onClick={adicionarIntegrante}
                            disabled={processando || !alunoSelecionado}
                            className="flex items-center justify-center gap-2 rounded-xl bg-[#f19f17] px-5 py-2.5 text-sm font-bold text-white disabled:opacity-50"
                          >
                            <Plus size={17} />
                            Adicionar
                          </button>
                        </div>
                      </section>

                      <section>
                        <h3 className="mb-4 flex items-center gap-2 font-bold text-gray-800">
                          <Users size={19} />
                          Integrantes do projeto
                        </h3>

                        {integrantes.length > 0 ? (
                          <div className="space-y-3">
                            {integrantes.map((integrante) => {
                              const responsavel =
                                Number(integrante.aluno_id) ===
                                Number(selectedProject.aluno_responsavel_id);

                              return (
                                <div
                                  key={integrante.aluno_id}
                                  className="flex items-center justify-between gap-4 rounded-2xl border border-gray-100 p-4"
                                >
                                  <div>
                                    <p className="font-semibold text-gray-800">
                                      {integrante.nome}
                                    </p>

                                    {responsavel && (
                                      <span className="mt-1 inline-flex rounded-lg bg-orange-50 px-2 py-1 text-[10px] font-bold text-[#f19f17]">
                                        Responsável
                                      </span>
                                    )}
                                  </div>

                                  {!responsavel && (
                                    <button
                                      type="button"
                                      onClick={() =>
                                        removerIntegrante(integrante)
                                      }
                                      disabled={processando}
                                      className="rounded-xl p-2 text-red-500 hover:bg-red-50 disabled:opacity-50"
                                      title="Remover integrante"
                                    >
                                      <Trash2 size={17} />
                                    </button>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        ) : (
                          <p className="text-sm text-gray-500">
                            Nenhum integrante encontrado.
                          </p>
                        )}
                      </section>
                    </div>
                  )}

                  {abaAtiva === "arquivos" && (
                    <div className="space-y-7">
                      <div className="rounded-2xl border border-blue-100 bg-blue-50 p-4 text-sm text-blue-700">
                        O armazenamento físico ainda não está disponível. Nesta
                        versão, a coordenação administra os metadados dos
                        arquivos vinculados ao projeto.
                      </div>

                      <section className="rounded-2xl border border-gray-100 bg-gray-50 p-5">
                        <h3 className="flex items-center gap-2 font-bold text-gray-800">
                          <Plus size={19} />
                          Cadastrar metadado
                        </h3>

                        <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-[2fr_1fr_auto] md:items-end">
                          <Campo label="Nome do arquivo">
                            <input
                              value={formArquivo.nome_original}
                              onChange={(event) =>
                                setFormArquivo((anterior) => ({
                                  ...anterior,
                                  nome_original: event.target.value,
                                }))
                              }
                              placeholder="relatorio-final.pdf"
                              className={inputClasses}
                            />
                          </Campo>

                          <Campo label="Tamanho em MB">
                            <input
                              type="number"
                              min="0.01"
                              max="50"
                              step="0.01"
                              value={formArquivo.tamanho_mb}
                              onChange={(event) =>
                                setFormArquivo((anterior) => ({
                                  ...anterior,
                                  tamanho_mb: event.target.value,
                                }))
                              }
                              className={inputClasses}
                            />
                          </Campo>

                          <button
                            type="button"
                            onClick={cadastrarArquivo}
                            disabled={processando}
                            className="flex h-[42px] items-center justify-center gap-2 rounded-xl bg-[#f19f17] px-5 text-sm font-bold text-white disabled:opacity-50"
                          >
                            <Plus size={17} />
                            Cadastrar
                          </button>
                        </div>
                      </section>

                      <section>
                        <h3 className="mb-4 flex items-center gap-2 font-bold text-gray-800">
                          <FileText size={19} />
                          Arquivos cadastrados
                        </h3>

                        {arquivos.length > 0 ? (
                          <div className="space-y-3">
                            {arquivos.map((arquivo) => (
                              <div
                                key={arquivo.id}
                                className="rounded-2xl border border-gray-100 p-4"
                              >
                                {arquivoEditandoId === arquivo.id ? (
                                  <div className="grid grid-cols-1 gap-4 md:grid-cols-[2fr_1fr_auto] md:items-end">
                                    <Campo label="Nome">
                                      <input
                                        value={formArquivoEdicao.nome_original}
                                        onChange={(event) =>
                                          setFormArquivoEdicao((anterior) => ({
                                            ...anterior,
                                            nome_original: event.target.value,
                                          }))
                                        }
                                        className={inputClasses}
                                      />
                                    </Campo>

                                    <Campo label="Tamanho em MB">
                                      <input
                                        type="number"
                                        min="0.01"
                                        max="50"
                                        step="0.01"
                                        value={formArquivoEdicao.tamanho_mb}
                                        onChange={(event) =>
                                          setFormArquivoEdicao((anterior) => ({
                                            ...anterior,
                                            tamanho_mb: event.target.value,
                                          }))
                                        }
                                        className={inputClasses}
                                      />
                                    </Campo>

                                    <div className="flex gap-2">
                                      <button
                                        type="button"
                                        onClick={() => salvarArquivo(arquivo)}
                                        disabled={processando}
                                        className="rounded-xl bg-[#f19f17] p-3 text-white disabled:opacity-50"
                                        title="Salvar"
                                      >
                                        <Save size={17} />
                                      </button>

                                      <button
                                        type="button"
                                        onClick={cancelarEdicaoArquivo}
                                        disabled={processando}
                                        className="rounded-xl border border-gray-200 p-3 text-gray-600"
                                        title="Cancelar"
                                      >
                                        <X size={17} />
                                      </button>
                                    </div>
                                  </div>
                                ) : (
                                  <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                                    <div className="flex items-center gap-3">
                                      <div className="rounded-xl bg-orange-50 p-3 text-[#f19f17]">
                                        <FileText size={19} />
                                      </div>

                                      <div>
                                        <p className="break-all font-semibold text-gray-800">
                                          {arquivo.nome_original}
                                        </p>

                                        <p className="mt-1 text-xs text-gray-400">
                                          {arquivo.tamanho_mb} MB
                                        </p>
                                      </div>
                                    </div>

                                    <div className="flex gap-2">
                                      <button
                                        type="button"
                                        onClick={() =>
                                          iniciarEdicaoArquivo(arquivo)
                                        }
                                        className="rounded-xl p-2.5 text-gray-500 hover:bg-gray-100"
                                        title="Editar metadados"
                                      >
                                        <Pencil size={17} />
                                      </button>

                                      <button
                                        type="button"
                                        onClick={() => excluirArquivo(arquivo)}
                                        disabled={processando}
                                        className="rounded-xl p-2.5 text-red-500 hover:bg-red-50 disabled:opacity-50"
                                        title="Remover arquivo"
                                      >
                                        <Trash2 size={17} />
                                      </button>
                                    </div>
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-sm text-gray-500">
                            Nenhum arquivo cadastrado.
                          </p>
                        )}
                      </section>
                    </div>
                  )}

                  {abaAtiva === "avaliacoes" && (
                    <div>
                      <div className="mb-6 flex flex-wrap gap-4">
                        <div className="rounded-2xl border border-gray-100 bg-gray-50 px-5 py-4">
                          <p className="text-xs font-semibold text-gray-400">
                            Total de avaliações
                          </p>

                          <p className="mt-1 text-2xl font-bold text-gray-900">
                            {avaliacoes.length}
                          </p>
                        </div>

                        <div className="rounded-2xl border border-gray-100 bg-gray-50 px-5 py-4">
                          <p className="text-xs font-semibold text-gray-400">
                            Média geral
                          </p>

                          <p className="mt-1 text-2xl font-bold text-gray-900">
                            {formatarMedia(selectedProject.media_geral)}
                          </p>
                        </div>
                      </div>

                      {avaliacoes.length > 0 ? (
                        <div className="space-y-4">
                          {avaliacoes.map((avaliacao) => (
                            <article
                              key={avaliacao.id}
                              className="rounded-2xl border border-gray-100 bg-gray-50 p-5"
                            >
                              <div className="flex flex-col justify-between gap-3 sm:flex-row">
                                <div>
                                  <h3 className="flex items-center gap-2 font-bold text-gray-900">
                                    <Star
                                      size={17}
                                      className="text-[#f19f17]"
                                    />

                                    {avaliacao.professor_nome}
                                  </h3>

                                  <p className="mt-1 text-xs text-gray-400">
                                    {formatarData(avaliacao.data_avaliacao)}
                                  </p>
                                </div>

                                <div className="flex items-center gap-3">
                                  <strong className="text-lg text-gray-900">
                                    {formatarMedia(avaliacao.media_geral)}
                                  </strong>

                                  <span
                                    className={`rounded-lg border px-3 py-1 text-[10px] font-bold ${
                                      CONCEITO_CLASSES[avaliacao.conceito] ||
                                      "border-gray-200 bg-gray-100 text-gray-600"
                                    }`}
                                  >
                                    {avaliacao.conceito}
                                  </span>
                                </div>
                              </div>

                              <div className="mt-5 grid grid-cols-2 gap-4 md:grid-cols-4">
                                <div>
                                  <p className="text-[10px] uppercase text-gray-400">
                                    Inovação
                                  </p>
                                  <strong className="text-gray-800">
                                    {avaliacao.nota_inovacao}
                                  </strong>
                                </div>

                                <div>
                                  <p className="text-[10px] uppercase text-gray-400">
                                    Técnica
                                  </p>
                                  <strong className="text-gray-800">
                                    {avaliacao.nota_tecnica}
                                  </strong>
                                </div>

                                <div>
                                  <p className="text-[10px] uppercase text-gray-400">
                                    Aplicabilidade
                                  </p>
                                  <strong className="text-gray-800">
                                    {avaliacao.nota_aplicabilidade}
                                  </strong>
                                </div>

                                <div>
                                  <p className="text-[10px] uppercase text-gray-400">
                                    Clareza
                                  </p>
                                  <strong className="text-gray-800">
                                    {avaliacao.nota_clareza}
                                  </strong>
                                </div>
                              </div>

                              <p className="mt-5 border-t border-gray-200 pt-4 text-sm leading-6 text-gray-700">
                                {avaliacao.parecer_descritivo}
                              </p>
                            </article>
                          ))}
                        </div>
                      ) : (
                        <div className="rounded-2xl border border-dashed border-gray-200 p-12 text-center">
                          <Star size={38} className="mx-auto text-gray-300" />

                          <p className="mt-4 text-sm font-semibold text-gray-600">
                            Nenhuma avaliação registrada.
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </>
              )}
            </div>

            <footer className="shrink-0 flex flex-col justify-between gap-4 border-t border-gray-100 bg-white px-7 py-5 sm:flex-row sm:items-center">
              <div>
                {podeExcluir && (
                  <button
                    type="button"
                    onClick={excluirProjetoSelecionado}
                    disabled={processando}
                    className="flex items-center justify-center gap-2 rounded-xl border border-red-200 px-5 py-2.5 text-sm font-bold text-red-600 hover:bg-red-50 disabled:opacity-50"
                  >
                    <Trash2 size={17} />
                    Excluir projeto
                  </button>
                )}
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                {podeDecidir && (
                  <>
                    <button
                      type="button"
                      onClick={() => alterarStatus("reprovado")}
                      disabled={processando}
                      className="flex items-center justify-center gap-2 rounded-xl border border-red-200 px-5 py-2.5 text-sm font-bold text-red-600 hover:bg-red-50 disabled:opacity-50"
                    >
                      <XCircle size={17} />
                      Reprovar
                    </button>

                    <button
                      type="button"
                      onClick={() => alterarStatus("aprovado")}
                      disabled={processando}
                      className="flex items-center justify-center gap-2 rounded-xl bg-[#f19f17] px-5 py-2.5 text-sm font-bold text-white hover:bg-amber-600 disabled:opacity-50"
                    >
                      <CheckCircle2 size={17} />
                      Aprovar
                    </button>
                  </>
                )}

                <button
                  type="button"
                  onClick={fecharModal}
                  disabled={processando}
                  className="rounded-xl border border-gray-200 px-5 py-2.5 text-sm font-bold text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                >
                  Fechar
                </button>
              </div>
            </footer>
          </div>
        </div>
      )}
    </div>
  );
}
