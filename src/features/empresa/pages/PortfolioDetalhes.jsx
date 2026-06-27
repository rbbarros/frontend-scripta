import {
  ArrowLeft,
  Briefcase,
  ExternalLink,
  GraduationCap,
  Layers3,
  User,
} from "lucide-react";

import { useNavigate, useParams } from "react-router-dom";

import { usePortfolioDetalhes } from "../hooks/usePortfolioDetalhes";

export default function PortfolioDetalhes() {
  const { alunoId } = useParams();

  const navigate = useNavigate();

  const { aluno, projetos, loading, erro } = usePortfolioDetalhes(alunoId);

  if (loading) {
    return (
      <div className="rounded-3xl border border-gray-100 bg-white p-10 text-center shadow-sm">
        <p className="text-sm text-gray-500">Carregando portfólio...</p>
      </div>
    );
  }

  if (erro || !aluno) {
    return (
      <div className="rounded-3xl border border-red-100 bg-red-50 p-8">
        <h1 className="text-lg font-bold text-red-700">
          Não foi possível carregar este portfólio
        </h1>

        <p className="mt-2 text-sm text-red-600">
          {erro || "Portfólio não encontrado."}
        </p>

        <button
          type="button"
          onClick={() => navigate("/empresa/portfolios")}
          className="mt-5 text-sm font-bold text-red-700 hover:underline"
        >
          Voltar para portfólios
        </button>
      </div>
    );
  }

  return (
    <div className="pb-12">
      <button
        type="button"
        onClick={() => navigate("/empresa/portfolios")}
        className="mb-6 flex items-center font-semibold text-[#f19f17] hover:text-amber-600"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Voltar para portfólios
      </button>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[280px_1fr]">
        <aside>
          <div className="rounded-3xl border border-gray-100 bg-white p-7 text-center shadow-sm">
            <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
              <User size={42} />
            </div>

            <h1 className="mt-5 text-xl font-bold text-gray-900">
              {aluno.nome}
            </h1>

            <p className="mt-2 text-sm text-gray-500">
              {aluno.cursos.join(", ") || "Curso não informado"}
            </p>

            <div className="mt-6 space-y-3">
              <div className="flex items-center justify-center gap-2 rounded-2xl bg-gray-50 p-4 text-gray-600">
                <Briefcase size={17} />

                <span className="text-sm font-semibold">
                  {projetos.length} projeto(s) público(s)
                </span>
              </div>

              <div className="flex items-center justify-center gap-2 rounded-2xl bg-gray-50 p-4 text-gray-600">
                <GraduationCap size={17} />

                <span className="text-sm font-semibold">
                  {aluno.semestres.join(", ")}
                </span>
              </div>
            </div>
          </div>
        </aside>

        <main className="space-y-6">
          <header className="rounded-3xl border border-gray-100 bg-white p-7 shadow-sm">
            <div className="flex items-center gap-2 text-[#f19f17]">
              <Layers3 size={20} />

              <span className="text-xs font-bold uppercase tracking-wider">
                Portfólio público
              </span>
            </div>

            <h2 className="mt-3 text-xl font-bold text-gray-900">
              Projetos publicados
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Projetos aprovados que o estudante disponibilizou publicamente.
            </p>
          </header>

          {projetos.map((item) => {
            const projeto = item.detalhes;

            return (
              <section
                key={item.portfolio_id}
                className="rounded-3xl border border-gray-100 bg-white p-8 shadow-sm"
              >
                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
                  <div>
                    <span className="rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">
                      Projeto aprovado
                    </span>

                    <h2 className="mt-4 text-2xl font-bold text-gray-900">
                      {item.titulo}
                    </h2>

                    <p className="mt-2 text-sm text-gray-500">
                      {item.curso} • {item.semestre}
                    </p>
                  </div>
                </div>

                {projeto?.descricao ? (
                  <p className="mt-6 whitespace-pre-line text-sm leading-7 text-gray-600">
                    {projeto.descricao}
                  </p>
                ) : (
                  <p className="mt-6 text-sm text-gray-500">
                    A descrição completa deste projeto não está disponível.
                  </p>
                )}

                {projeto && (
                  <div className="mt-7 grid grid-cols-1 gap-4 border-t border-gray-100 pt-6 sm:grid-cols-2">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wide text-gray-400">
                        Área de conhecimento
                      </p>

                      <p className="mt-1 text-sm font-semibold text-gray-700">
                        {projeto.area_conhecimento || "Não informada"}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs font-bold uppercase tracking-wide text-gray-400">
                        Turma
                      </p>

                      <p className="mt-1 text-sm font-semibold text-gray-700">
                        {projeto.turma || "Não informada"}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs font-bold uppercase tracking-wide text-gray-400">
                        Professor orientador
                      </p>

                      <p className="mt-1 text-sm font-semibold text-gray-700">
                        {projeto.professor_orientador || "Não informado"}
                      </p>
                    </div>
                  </div>
                )}

                <div className="mt-7 border-t border-gray-100 pt-6">
                  <h3 className="text-sm font-bold text-gray-900">
                    Links do projeto
                  </h3>

                  {item.links.length > 0 ? (
                    <div className="mt-4 space-y-3">
                      {item.links.map((link) => (
                        <a
                          key={link.id}
                          href={link.url}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center justify-between rounded-2xl border border-gray-100 bg-gray-50 p-4 text-sm font-semibold text-gray-700 hover:border-[#f19f17] hover:text-[#f19f17]"
                        >
                          <span>{link.descricao || link.url}</span>

                          <ExternalLink size={16} />
                        </a>
                      ))}
                    </div>
                  ) : (
                    <p className="mt-3 text-sm text-gray-500">
                      Nenhum link público foi cadastrado para este projeto.
                    </p>
                  )}
                </div>
              </section>
            );
          })}
        </main>
      </div>
    </div>
  );
}
