import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAlunoDashboard } from "../hooks/useAlunoDashboard";

const statusConfig = {
  rascunho: {
    label: "Rascunho",
    classes: "bg-gray-50 text-gray-600 border-gray-200",
  },
  submetido: {
    label: "Submetido",
    classes: "bg-blue-50 text-blue-700 border-blue-100",
  },
  em_avaliacao: {
    label: "Em avaliação",
    classes: "bg-amber-50 text-amber-700 border-amber-100",
  },
  aprovado: {
    label: "Aprovado",
    classes: "bg-emerald-50 text-emerald-700 border-emerald-100",
  },
  reprovado: {
    label: "Reprovado",
    classes: "bg-red-50 text-red-700 border-red-100",
  },
};

function getStatusConfig(status) {
  return (
    statusConfig[status] || {
      label: status || "Não informado",
      classes: "bg-gray-50 text-gray-600 border-gray-200",
    }
  );
}

export default function Perfil() {
  const { perfil, projetos, erro, loading, salvandoPerfil, salvarPerfil } =
    useAlunoDashboard();

  const [editando, setEditando] = useState(false);

  const [mensagem, setMensagem] = useState("");

  const [formData, setFormData] = useState({
    github_url: "",
    linkedin_url: "",
    competencias: "",
  });

  useEffect(() => {
    if (!perfil) {
      return;
    }

    setFormData({
      github_url: perfil.github_url || "",
      linkedin_url: perfil.linkedin_url || "",
      competencias: perfil.competencias || "",
    });
  }, [perfil]);

  function atualizarCampo(campo, valor) {
    setFormData((dadosAtuais) => ({
      ...dadosAtuais,
      [campo]: valor,
    }));
  }

  async function handleSalvarPerfil(event) {
    event.preventDefault();
    setMensagem("");

    const githubUrl = formData.github_url.trim();

    const linkedinUrl = formData.linkedin_url.trim();

    if (githubUrl && !/^https?:\/\//i.test(githubUrl)) {
      setMensagem("O link do GitHub deve começar com http:// ou https://.");
      return;
    }

    if (linkedinUrl && !/^https?:\/\//i.test(linkedinUrl)) {
      setMensagem("O link do LinkedIn deve começar com http:// ou https://.");
      return;
    }

    const sucesso = await salvarPerfil({
      github_url: githubUrl || null,
      linkedin_url: linkedinUrl || null,
      competencias: formData.competencias.trim() || null,
    });

    if (sucesso) {
      setMensagem("Perfil atualizado com sucesso.");

      setEditando(false);
    }
  }

  /*
   * O backend já deve devolver somente os projetos
   * que o aluno autenticado pode acessar.
   */
  const meusProjetos = projetos;

  const projetosAprovados = meusProjetos.filter(
    (projeto) => projeto.status === "aprovado",
  );

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm">
          <p className="text-sm text-gray-500">Carregando perfil...</p>
        </div>
      </div>
    );
  }

  if (!perfil) {
    return (
      <div className="max-w-6xl mx-auto">
        <div className="bg-red-50 rounded-3xl border border-red-100 p-8">
          <h1 className="text-lg font-bold text-red-700">
            Não foi possível carregar o perfil
          </h1>

          <p className="mt-2 text-sm text-red-600">
            {erro || "Os dados do aluno não foram encontrados."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto flex flex-col gap-6">
      <section className="rounded-[2rem] border border-gray-100 bg-white p-8 shadow-sm">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-start">
          <div className="flex flex-col items-center gap-6 md:flex-row md:items-start">
            <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-full bg-[#f19f17] text-4xl font-bold text-white shadow-sm">
              {perfil.nome?.charAt(0).toUpperCase()}
            </div>

            <div className="text-center md:text-left">
              <h1 className="text-2xl font-bold tracking-tight text-gray-900">
                {perfil.nome}
              </h1>

              <p className="mt-2 text-sm text-gray-600">
                {perfil.curso}

                {perfil.turma ? ` • Turma ${perfil.turma}` : ""}

                {perfil.semestre_ingresso
                  ? ` • Ingresso ${perfil.semestre_ingresso}`
                  : ""}
              </p>

              {perfil.matricula && (
                <p className="mt-1 text-xs text-gray-500">
                  Matrícula: {perfil.matricula}
                </p>
              )}

              <div className="mt-4 flex flex-wrap items-center justify-center gap-4 text-sm md:justify-start">
                <a
                  href={`mailto:${perfil.email}`}
                  className="text-gray-500 hover:text-[#f19f17]"
                >
                  {perfil.email}
                </a>

                {perfil.github_url && (
                  <a
                    href={perfil.github_url}
                    target="_blank"
                    rel="noreferrer"
                    className="font-semibold text-gray-600 hover:text-[#f19f17]"
                  >
                    GitHub
                  </a>
                )}

                {perfil.linkedin_url && (
                  <a
                    href={perfil.linkedin_url}
                    target="_blank"
                    rel="noreferrer"
                    className="font-semibold text-gray-600 hover:text-[#f19f17]"
                  >
                    LinkedIn
                  </a>
                )}
              </div>

              {perfil.competencias && (
                <p className="mt-4 max-w-2xl text-sm text-gray-500">
                  <strong className="text-gray-700">Competências:</strong>{" "}
                  {perfil.competencias}
                </p>
              )}
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              setMensagem("");
              setEditando((estadoAtual) => !estadoAtual);
            }}
            className="shrink-0 rounded-xl border border-[#f19f17] px-5 py-2.5 text-sm font-semibold text-[#f19f17] hover:bg-amber-50"
          >
            {editando ? "Cancelar edição" : "Editar perfil"}
          </button>
        </div>
      </section>

      {editando && (
        <form
          onSubmit={handleSalvarPerfil}
          className="rounded-3xl border border-gray-100 bg-white p-8 shadow-sm"
        >
          <h2 className="text-xl font-bold text-gray-900">
            Editar perfil profissional
          </h2>

          <p className="mt-2 text-sm text-gray-500">
            Atualize os links profissionais e suas principais competências.
          </p>

          <div className="mt-6 space-y-5">
            <div>
              <label className="mb-2 block text-sm font-bold text-gray-700">
                GitHub
              </label>

              <input
                type="url"
                value={formData.github_url}
                onChange={(event) =>
                  atualizarCampo("github_url", event.target.value)
                }
                placeholder="https://github.com/seu-usuario"
                className="w-full rounded-xl border border-gray-200 p-4 text-sm outline-none focus:border-[#f19f17]"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-bold text-gray-700">
                LinkedIn
              </label>

              <input
                type="url"
                value={formData.linkedin_url}
                onChange={(event) =>
                  atualizarCampo("linkedin_url", event.target.value)
                }
                placeholder="https://linkedin.com/in/seu-usuario"
                className="w-full rounded-xl border border-gray-200 p-4 text-sm outline-none focus:border-[#f19f17]"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-bold text-gray-700">
                Competências
              </label>

              <textarea
                value={formData.competencias}
                onChange={(event) =>
                  atualizarCampo("competencias", event.target.value)
                }
                rows={4}
                placeholder="Ex.: Python, FastAPI, React, MySQL e gestão de projetos"
                className="w-full resize-none rounded-xl border border-gray-200 p-4 text-sm outline-none focus:border-[#f19f17]"
              />
            </div>
          </div>

          <div className="mt-6 flex justify-end">
            <button
              type="submit"
              disabled={salvandoPerfil}
              className="rounded-xl bg-[#f19f17] px-6 py-3 text-sm font-semibold text-white hover:bg-[#d98b14] disabled:opacity-50"
            >
              {salvandoPerfil ? "Salvando..." : "Salvar alterações"}
            </button>
          </div>
        </form>
      )}
      {mensagem && (
        <div
          className={`rounded-2xl border p-4 text-sm font-medium ${
            mensagem.includes("sucesso")
              ? "border-emerald-100 bg-emerald-50 text-emerald-700"
              : "border-red-100 bg-red-50 text-red-600"
          }`}
        >
          {mensagem}
        </div>
      )}

      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-[2rem] border border-gray-100 p-6 text-center shadow-sm">
          <p className="text-3xl font-bold text-gray-900">
            {meusProjetos.length}
          </p>

          <p className="mt-1 text-xs font-medium text-gray-500">Projetos</p>
        </div>

        <div className="bg-white rounded-[2rem] border border-gray-100 p-6 text-center shadow-sm">
          <p className="text-3xl font-bold text-gray-900">
            {projetosAprovados.length}
          </p>

          <p className="mt-1 text-xs font-medium text-gray-500">
            Projetos aprovados
          </p>
        </div>
      </section>

      <section className="flex flex-col lg:flex-row gap-6">
        <aside className="w-full lg:w-64 shrink-0">
          <div className="bg-white rounded-3xl border border-gray-100 p-3 shadow-sm">
            <h2 className="px-4 py-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
              Menu
            </h2>

            <nav className="space-y-1">
              <Link
                to="/aluno/projetos"
                className="block rounded-xl bg-amber-50 px-4 py-2.5 text-sm font-bold text-[#f19f17]"
              >
                Meus projetos
              </Link>

              <Link
                to="/aluno/certificados"
                className="block px-4 py-2.5 rounded-xl text-sm font-bold text-gray-600 hover:bg-gray-50"
              >
                Certificados
              </Link>

              <Link
                to="/aluno/portfolio"
                className="block px-4 py-2.5 rounded-xl text-sm font-bold text-gray-600 hover:bg-gray-50"
              >
                Portfólio
              </Link>
            </nav>
          </div>
        </aside>

        <div className="flex-1 bg-white rounded-3xl border border-gray-100 p-8 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 border-b border-gray-100 pb-4">
            <h2 className="text-lg font-bold text-gray-900">Meus projetos</h2>

            <Link
              to="/aluno/submeter"
              className="px-4 py-2 bg-[#f19f17] text-white text-sm font-bold rounded-xl hover:bg-amber-600 text-center"
            >
              Novo projeto
            </Link>
          </div>

          {meusProjetos.length > 0 ? (
            <div className="space-y-4">
              {meusProjetos.map((projeto) => {
                const status = getStatusConfig(projeto.status);

                return (
                  <article
                    key={projeto.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl border border-gray-100 hover:border-amber-200"
                  >
                    <div>
                      <h3 className="font-bold text-gray-900 text-sm">
                        {projeto.titulo}
                      </h3>

                      <div className="mt-2 flex flex-wrap items-center gap-3">
                        <span
                          className={`rounded-full border px-2.5 py-0.5 text-xs font-bold ${status.classes}`}
                        >
                          {status.label}
                        </span>

                        {projeto.curso && (
                          <span className="text-xs text-gray-500">
                            {projeto.curso}
                          </span>
                        )}

                        {projeto.semestre && (
                          <span className="text-xs text-gray-500">
                            {projeto.semestre}
                          </span>
                        )}
                      </div>
                    </div>

                    <Link
                      to={`/aluno/projetos/${projeto.id}`}
                      className="text-sm font-bold text-gray-400 hover:text-[#f19f17]"
                    >
                      Ver detalhes
                    </Link>
                  </article>
                );
              })}
            </div>
          ) : (
            <div className="rounded-2xl bg-gray-50 p-6 text-center">
              <p className="text-sm text-gray-500">
                Você ainda não participa de nenhum projeto.
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
