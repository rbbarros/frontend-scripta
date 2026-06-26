import React from "react";
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
  const { perfil, projetos, erro, loading } = useAlunoDashboard();

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

  if (erro || !perfil) {
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
      <section className="bg-white rounded-[2rem] border border-gray-100 p-8 shadow-sm">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
          <div className="w-24 h-24 bg-[#f19f17] rounded-full flex items-center justify-center text-white text-4xl font-bold shadow-sm shrink-0">
            {perfil.nome?.charAt(0).toUpperCase()}
          </div>

          <div className="text-center md:text-left">
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
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

            <div className="mt-4 flex flex-wrap items-center justify-center md:justify-start gap-4 text-sm">
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
      </section>

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
                className="block px-4 py-2.5 rounded-xl text-sm font-bold text-[#f19f17] bg-amber-50"
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
                      to="/aluno/projetos"
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
