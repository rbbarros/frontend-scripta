import { useMemo, useState } from "react";

import {
  AlertTriangle,
  Building2,
  GraduationCap,
  LoaderCircle,
  Pencil,
  Save,
  Search,
  Trash2,
  UserRound,
  X,
} from "lucide-react";

import { useCoordenacaoUsuarios } from "../hooks/useCoordenacaoUsuarios";

const FORM_INICIAL = {
  nome: "",
  email: "",
  curso: "",
  matricula: "",
  turma: "",
  semestre_ingresso: "",
  linkedin_url: "",
  github_url: "",
  competencias: "",
  area_atuacao: "",
  cnpj: "",
  setor: "",
  senha: "",
  confirmar_senha: "",
};

const inputClasses =
  "w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-800 outline-none transition-colors focus:border-[#f19f17] focus:ring-2 focus:ring-orange-100";

function normalizar(valor) {
  return String(valor ?? "")
    .trim()
    .toLowerCase();
}

function valorOpcional(valor) {
  const valorTratado = String(valor ?? "").trim();

  return valorTratado || null;
}

function obterIcone(tipo) {
  if (tipo === "aluno") {
    return GraduationCap;
  }

  if (tipo === "professor") {
    return UserRound;
  }

  return Building2;
}

function obterCorPerfil(tipo) {
  if (tipo === "aluno") {
    return "border-blue-100 bg-blue-50 text-blue-700";
  }

  if (tipo === "professor") {
    return "border-purple-100 bg-purple-50 text-purple-700";
  }

  return "border-emerald-100 bg-emerald-50 text-emerald-700";
}

function Campo({ label, children, descricao }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-semibold text-gray-600">
        {label}
      </span>

      {children}

      {descricao && (
        <span className="mt-1 block text-[11px] text-gray-400">
          {descricao}
        </span>
      )}
    </label>
  );
}

function criarFormulario(usuario) {
  if (!usuario) {
    return FORM_INICIAL;
  }

  return {
    ...FORM_INICIAL,
    nome:
      usuario.tipo === "empresa"
        ? usuario.nome_empresa || ""
        : usuario.nome || "",
    email:
      usuario.tipo === "empresa"
        ? usuario.email_contato || ""
        : usuario.email || "",
    curso: usuario.curso || "",
    matricula: usuario.matricula || "",
    turma: usuario.turma || "",
    semestre_ingresso: usuario.semestre_ingresso || "",
    linkedin_url: usuario.linkedin_url || "",
    github_url: usuario.github_url || "",
    competencias: usuario.competencias || "",
    area_atuacao: usuario.area_atuacao || "",
    cnpj: usuario.cnpj || "",
    setor: usuario.setor || "",
    senha: "",
    confirmar_senha: "",
  };
}

function adicionarSeAlterado(payload, campo, valorNovo, valorAtual) {
  const novoNormalizado = valorNovo ?? null;

  const atualNormalizado = valorAtual ?? null;

  if (String(novoNormalizado ?? "") !== String(atualNormalizado ?? "")) {
    payload[campo] = novoNormalizado;
  }
}

export default function Usuarios() {
  const { usuarios, loading, erro, atualizarUsuario, excluirUsuario } =
    useCoordenacaoUsuarios();

  const [busca, setBusca] = useState("");

  const [perfilFiltro, setPerfilFiltro] = useState("");

  const [usuarioEditando, setUsuarioEditando] = useState(null);

  const [form, setForm] = useState(FORM_INICIAL);

  const [processando, setProcessando] = useState(false);

  const [erroModal, setErroModal] = useState("");

  const [mensagem, setMensagem] = useState("");

  const usuariosFiltrados = useMemo(() => {
    const termo = normalizar(busca);

    return usuarios.filter((usuario) => {
      const correspondeBusca =
        !termo ||
        [
          usuario.nomeExibicao,
          usuario.emailExibicao,
          usuario.perfil,
          usuario.detalheExibicao,
          usuario.matricula,
          usuario.cnpj,
        ].some((valor) => normalizar(valor).includes(termo));

      const correspondePerfil = !perfilFiltro || usuario.tipo === perfilFiltro;

      return correspondeBusca && correspondePerfil;
    });
  }, [usuarios, busca, perfilFiltro]);

  const totais = useMemo(
    () => ({
      alunos: usuarios.filter((usuario) => usuario.tipo === "aluno").length,
      professores: usuarios.filter((usuario) => usuario.tipo === "professor")
        .length,
      empresas: usuarios.filter((usuario) => usuario.tipo === "empresa").length,
    }),
    [usuarios],
  );

  function abrirEdicao(usuario) {
    setUsuarioEditando(usuario);
    setForm(criarFormulario(usuario));
    setErroModal("");
  }

  function fecharEdicao() {
    if (processando) {
      return;
    }

    setUsuarioEditando(null);
    setForm(FORM_INICIAL);
    setErroModal("");
  }

  function atualizarCampo(campo, valor) {
    setForm((anterior) => ({
      ...anterior,
      [campo]: valor,
    }));
  }

  function montarPayload() {
    if (!usuarioEditando) {
      return {};
    }

    const payload = {};

    const nome = form.nome.trim();
    const email = form.email.trim().toLowerCase();

    if (!nome) {
      throw new Error("Informe o nome do usuário.");
    }

    if (!email) {
      throw new Error("Informe o e-mail do usuário.");
    }

    if (usuarioEditando.tipo === "aluno") {
      const curso = form.curso.trim();

      if (!curso) {
        throw new Error("Informe o curso do aluno.");
      }

      adicionarSeAlterado(payload, "nome", nome, usuarioEditando.nome);

      adicionarSeAlterado(payload, "email", email, usuarioEditando.email);

      adicionarSeAlterado(payload, "curso", curso, usuarioEditando.curso);

      adicionarSeAlterado(
        payload,
        "matricula",
        valorOpcional(form.matricula),
        usuarioEditando.matricula,
      );

      adicionarSeAlterado(
        payload,
        "turma",
        valorOpcional(form.turma),
        usuarioEditando.turma,
      );

      adicionarSeAlterado(
        payload,
        "semestre_ingresso",
        valorOpcional(form.semestre_ingresso),
        usuarioEditando.semestre_ingresso,
      );

      adicionarSeAlterado(
        payload,
        "linkedin_url",
        valorOpcional(form.linkedin_url),
        usuarioEditando.linkedin_url,
      );

      adicionarSeAlterado(
        payload,
        "github_url",
        valorOpcional(form.github_url),
        usuarioEditando.github_url,
      );

      adicionarSeAlterado(
        payload,
        "competencias",
        valorOpcional(form.competencias),
        usuarioEditando.competencias,
      );
    }

    if (usuarioEditando.tipo === "professor") {
      adicionarSeAlterado(payload, "nome", nome, usuarioEditando.nome);

      adicionarSeAlterado(payload, "email", email, usuarioEditando.email);

      adicionarSeAlterado(
        payload,
        "area_atuacao",
        valorOpcional(form.area_atuacao),
        usuarioEditando.area_atuacao,
      );
    }

    if (usuarioEditando.tipo === "empresa") {
      const cnpj = form.cnpj.trim();

      if (!cnpj) {
        throw new Error("Informe o CNPJ da empresa.");
      }

      adicionarSeAlterado(
        payload,
        "nome_empresa",
        nome,
        usuarioEditando.nome_empresa,
      );

      adicionarSeAlterado(
        payload,
        "email_contato",
        email,
        usuarioEditando.email_contato,
      );

      adicionarSeAlterado(payload, "cnpj", cnpj, usuarioEditando.cnpj);

      adicionarSeAlterado(
        payload,
        "setor",
        valorOpcional(form.setor),
        usuarioEditando.setor,
      );
    }

    const senha = form.senha.trim();

    const confirmarSenha = form.confirmar_senha.trim();

    if (senha || confirmarSenha) {
      if (senha.length < 6) {
        throw new Error("A nova senha deve possuir pelo menos 6 caracteres.");
      }

      if (senha !== confirmarSenha) {
        throw new Error("A senha e a confirmação não coincidem.");
      }

      payload.senha = senha;
      payload.confirmar_senha = confirmarSenha;
    }

    return payload;
  }

  async function salvarAlteracoes(event) {
    event.preventDefault();

    if (!usuarioEditando) {
      return;
    }

    setErroModal("");

    let payload;

    try {
      payload = montarPayload();
    } catch (error) {
      setErroModal(error.message);
      return;
    }

    if (Object.keys(payload).length === 0) {
      setErroModal("Nenhuma alteração foi identificada.");
      return;
    }

    setProcessando(true);

    try {
      await atualizarUsuario(usuarioEditando, payload);

      const nomeAtual = form.nome.trim();

      fecharEdicao();

      setMensagem(`${nomeAtual} foi atualizado com sucesso.`);
    } catch (error) {
      setErroModal(error.message || "Não foi possível atualizar o usuário.");
    } finally {
      setProcessando(false);
    }
  }

  async function removerUsuario(usuario) {
    const confirmou = window.confirm(
      `Deseja realmente excluir ${usuario.nomeExibicao}? Esta ação não poderá ser desfeita.`,
    );

    if (!confirmou) {
      return;
    }

    setProcessando(true);
    setMensagem("");

    try {
      await excluirUsuario(usuario);

      setMensagem(`${usuario.nomeExibicao} foi removido com sucesso.`);
    } catch (error) {
      setMensagem("");

      window.alert(error.message || "Não foi possível excluir o usuário.");
    } finally {
      setProcessando(false);
    }
  }

  return (
    <div className="pb-12">
      <header className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">
          Gestão de usuários
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          Consulte e gerencie alunos, professores e empresas cadastrados no
          Scripta.
        </p>
      </header>

      {erro && (
        <div className="mb-6 flex items-start gap-3 rounded-2xl border border-amber-100 bg-amber-50 p-4 text-sm font-medium text-amber-700">
          <AlertTriangle size={18} className="mt-0.5 shrink-0" />

          {erro}
        </div>
      )}

      {mensagem && (
        <div className="mb-6 rounded-2xl border border-emerald-100 bg-emerald-50 p-4 text-sm font-medium text-emerald-700">
          {mensagem}
        </div>
      )}

      <section className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-blue-100 bg-white p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
            Alunos
          </p>

          <p className="mt-2 text-2xl font-bold text-blue-700">
            {totais.alunos}
          </p>
        </div>

        <div className="rounded-2xl border border-purple-100 bg-white p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
            Professores
          </p>

          <p className="mt-2 text-2xl font-bold text-purple-700">
            {totais.professores}
          </p>
        </div>

        <div className="rounded-2xl border border-emerald-100 bg-white p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
            Empresas
          </p>

          <p className="mt-2 text-2xl font-bold text-emerald-700">
            {totais.empresas}
          </p>
        </div>
      </section>

      <section className="mb-6 rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-[1fr_220px]">
          <div className="relative">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              type="search"
              value={busca}
              onChange={(event) => setBusca(event.target.value)}
              placeholder="Buscar por nome, e-mail, matrícula ou CNPJ"
              className={`${inputClasses} pl-10`}
            />
          </div>

          <select
            value={perfilFiltro}
            onChange={(event) => setPerfilFiltro(event.target.value)}
            className={inputClasses}
          >
            <option value="">Todos os perfis</option>

            <option value="aluno">Alunos</option>

            <option value="professor">Professores</option>

            <option value="empresa">Empresas</option>
          </select>
        </div>
      </section>

      <section className="overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm">
        {loading ? (
          <div className="flex min-h-[320px] items-center justify-center">
            <LoaderCircle className="h-8 w-8 animate-spin text-[#f19f17]" />
          </div>
        ) : usuariosFiltrados.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-100">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wide text-gray-500">
                    Usuário
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wide text-gray-500">
                    Perfil
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wide text-gray-500">
                    Informações
                  </th>

                  <th className="px-6 py-4 text-right text-xs font-bold uppercase tracking-wide text-gray-500">
                    Ações
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {usuariosFiltrados.map((usuario) => {
                  const Icone = obterIcone(usuario.tipo);

                  return (
                    <tr
                      key={`${usuario.tipo}-${usuario.id}`}
                      className="transition-colors hover:bg-orange-50/30"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-orange-50 text-[#f19f17]">
                            <Icone size={20} />
                          </div>

                          <div>
                            <p className="font-semibold text-gray-900">
                              {usuario.nomeExibicao}
                            </p>

                            <p className="mt-1 text-sm text-gray-500">
                              {usuario.emailExibicao}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex rounded-lg border px-3 py-1 text-xs font-semibold ${obterCorPerfil(
                            usuario.tipo,
                          )}`}
                        >
                          {usuario.perfil}
                        </span>
                      </td>

                      <td className="px-6 py-4 text-sm text-gray-600">
                        {usuario.tipo === "aluno" && (
                          <>
                            <p>{usuario.curso || "Curso não informado"}</p>

                            {usuario.matricula && (
                              <p className="mt-1 text-xs text-gray-400">
                                Matrícula: {usuario.matricula}
                              </p>
                            )}
                          </>
                        )}

                        {usuario.tipo === "professor" && (
                          <p>{usuario.area_atuacao || "Área não informada"}</p>
                        )}

                        {usuario.tipo === "empresa" && (
                          <>
                            <p>{usuario.setor || "Setor não informado"}</p>

                            <p className="mt-1 text-xs text-gray-400">
                              CNPJ: {usuario.cnpj}
                            </p>
                          </>
                        )}
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => abrirEdicao(usuario)}
                            className="rounded-xl p-2.5 text-[#f19f17] hover:bg-orange-50"
                            title="Editar usuário"
                          >
                            <Pencil size={18} />
                          </button>

                          <button
                            type="button"
                            onClick={() => removerUsuario(usuario)}
                            disabled={processando}
                            className="rounded-xl p-2.5 text-red-500 hover:bg-red-50 disabled:opacity-50"
                            title="Excluir usuário"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-14 text-center">
            <UserRound size={42} className="mx-auto text-gray-300" />

            <h2 className="mt-5 text-lg font-bold text-gray-700">
              Nenhum usuário encontrado
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              Não existem usuários compatíveis com a busca.
            </p>
          </div>
        )}
      </section>

      {usuarioEditando && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
          <form
            onSubmit={salvarAlteracoes}
            className="flex h-[calc(100vh-2rem)] max-h-[92vh] w-full max-w-3xl flex-col overflow-hidden rounded-3xl bg-white shadow-2xl"
          >
            <header className="flex shrink-0 items-start justify-between gap-5 border-b border-gray-100 px-7 py-6">
              <div>
                <span
                  className={`inline-flex rounded-lg border px-3 py-1 text-xs font-semibold ${obterCorPerfil(
                    usuarioEditando.tipo,
                  )}`}
                >
                  {usuarioEditando.perfil}
                </span>

                <h2 className="mt-3 text-xl font-bold text-gray-900">
                  Editar usuário
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  {usuarioEditando.nomeExibicao}
                </p>
              </div>

              <button
                type="button"
                onClick={fecharEdicao}
                disabled={processando}
                className="rounded-full p-2 text-gray-400 hover:bg-gray-100 disabled:opacity-50"
              >
                <X size={21} />
              </button>
            </header>

            <div className="min-h-0 flex-1 overflow-y-auto p-7">
              {erroModal && (
                <div className="mb-6 flex items-start gap-3 rounded-2xl border border-red-100 bg-red-50 p-4 text-sm font-medium text-red-600">
                  <AlertTriangle size={18} className="mt-0.5 shrink-0" />

                  {erroModal}
                </div>
              )}

              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <Campo
                  label={
                    usuarioEditando.tipo === "empresa"
                      ? "Nome da empresa"
                      : "Nome completo"
                  }
                >
                  <input
                    value={form.nome}
                    onChange={(event) =>
                      atualizarCampo("nome", event.target.value)
                    }
                    className={inputClasses}
                  />
                </Campo>

                <Campo
                  label={
                    usuarioEditando.tipo === "empresa"
                      ? "E-mail de contato"
                      : "E-mail institucional"
                  }
                >
                  <input
                    type="email"
                    value={form.email}
                    onChange={(event) =>
                      atualizarCampo("email", event.target.value)
                    }
                    className={inputClasses}
                  />
                </Campo>

                {usuarioEditando.tipo === "aluno" && (
                  <>
                    <Campo label="Curso">
                      <input
                        value={form.curso}
                        onChange={(event) =>
                          atualizarCampo("curso", event.target.value)
                        }
                        className={inputClasses}
                      />
                    </Campo>

                    <Campo label="Matrícula">
                      <input
                        value={form.matricula}
                        onChange={(event) =>
                          atualizarCampo("matricula", event.target.value)
                        }
                        className={inputClasses}
                      />
                    </Campo>

                    <Campo label="Turma">
                      <input
                        value={form.turma}
                        onChange={(event) =>
                          atualizarCampo("turma", event.target.value)
                        }
                        className={inputClasses}
                      />
                    </Campo>

                    <Campo label="Semestre de ingresso">
                      <input
                        value={form.semestre_ingresso}
                        onChange={(event) =>
                          atualizarCampo(
                            "semestre_ingresso",
                            event.target.value,
                          )
                        }
                        className={inputClasses}
                      />
                    </Campo>

                    <Campo label="LinkedIn">
                      <input
                        value={form.linkedin_url}
                        onChange={(event) =>
                          atualizarCampo("linkedin_url", event.target.value)
                        }
                        className={inputClasses}
                      />
                    </Campo>

                    <Campo label="GitHub">
                      <input
                        value={form.github_url}
                        onChange={(event) =>
                          atualizarCampo("github_url", event.target.value)
                        }
                        className={inputClasses}
                      />
                    </Campo>

                    <div className="md:col-span-2">
                      <Campo label="Competências">
                        <textarea
                          rows={3}
                          value={form.competencias}
                          onChange={(event) =>
                            atualizarCampo("competencias", event.target.value)
                          }
                          className={inputClasses}
                        />
                      </Campo>
                    </div>
                  </>
                )}

                {usuarioEditando.tipo === "professor" && (
                  <div className="md:col-span-2">
                    <Campo label="Área de atuação">
                      <input
                        value={form.area_atuacao}
                        onChange={(event) =>
                          atualizarCampo("area_atuacao", event.target.value)
                        }
                        className={inputClasses}
                      />
                    </Campo>
                  </div>
                )}

                {usuarioEditando.tipo === "empresa" && (
                  <>
                    <Campo label="CNPJ">
                      <input
                        value={form.cnpj}
                        onChange={(event) =>
                          atualizarCampo("cnpj", event.target.value)
                        }
                        className={inputClasses}
                      />
                    </Campo>

                    <Campo label="Setor">
                      <input
                        value={form.setor}
                        onChange={(event) =>
                          atualizarCampo("setor", event.target.value)
                        }
                        className={inputClasses}
                      />
                    </Campo>
                  </>
                )}
              </div>

              <section className="mt-8 rounded-2xl border border-gray-100 bg-gray-50 p-5">
                <h3 className="font-bold text-gray-800">
                  Redefinição de senha
                </h3>

                <p className="mt-1 text-xs text-gray-500">
                  Deixe os campos vazios para manter a senha atual.
                </p>

                <div className="mt-4 grid grid-cols-1 gap-5 md:grid-cols-2">
                  <Campo label="Nova senha">
                    <input
                      type="password"
                      value={form.senha}
                      onChange={(event) =>
                        atualizarCampo("senha", event.target.value)
                      }
                      className={inputClasses}
                    />
                  </Campo>

                  <Campo label="Confirmar nova senha">
                    <input
                      type="password"
                      value={form.confirmar_senha}
                      onChange={(event) =>
                        atualizarCampo("confirmar_senha", event.target.value)
                      }
                      className={inputClasses}
                    />
                  </Campo>
                </div>
              </section>
            </div>

            <footer className="flex shrink-0 justify-end gap-3 border-t border-gray-100 bg-white px-7 py-5">
              <button
                type="button"
                onClick={fecharEdicao}
                disabled={processando}
                className="rounded-xl border border-gray-200 px-5 py-2.5 text-sm font-bold text-gray-700 hover:bg-gray-50 disabled:opacity-50"
              >
                Cancelar
              </button>

              <button
                type="submit"
                disabled={processando}
                className="flex items-center gap-2 rounded-xl bg-[#f19f17] px-5 py-2.5 text-sm font-bold text-white hover:bg-amber-600 disabled:opacity-50"
              >
                {processando ? (
                  <LoaderCircle size={17} className="animate-spin" />
                ) : (
                  <Save size={17} />
                )}
                Salvar alterações
              </button>
            </footer>
          </form>
        </div>
      )}
    </div>
  );
}
