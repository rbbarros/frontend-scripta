import { useEffect, useMemo } from "react";

import {
  Award,
  BriefcaseBusiness,
  CheckCircle2,
  Clock3,
  FileCheck2,
  FolderKanban,
  Search,
  Trophy,
  Upload,
  UserRound,
  XCircle,
} from "lucide-react";

import { Link, useNavigate } from "react-router-dom";

import { useAlunoDashboard } from "../hooks/useAlunoDashboard";

function formatarMedia(valor) {
  const numero = Number(valor);

  return Number.isFinite(numero) ? numero.toFixed(2) : "—";
}

function CardAtalho({ to, titulo, descricao, icon: Icone, iconClasses }) {
  return (
    <Link
      to={to}
      className="block rounded-2xl border border-gray-100 bg-white p-5 text-left shadow-sm transition-all hover:border-orange-200 hover:shadow-md"
    >
      <div
        className={`mb-4 flex h-12 w-full items-center rounded-xl pl-3 text-white shadow-sm ${iconClasses}`}
      >
        <Icone size={24} />
      </div>

      <h3 className="mb-1 text-sm font-bold text-gray-800">{titulo}</h3>

      <p className="text-xs text-gray-400">{descricao}</p>
    </Link>
  );
}

function ItemResumo({ label, quantidade, icon: Icone, classes }) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-gray-100 p-3">
      <div className="flex items-center gap-3">
        <div className={`rounded-lg p-2 ${classes}`}>
          <Icone size={16} />
        </div>

        <span className="text-sm font-medium text-gray-700">{label}</span>
      </div>

      <strong className="text-gray-900">{quantidade}</strong>
    </div>
  );
}

export default function Dashboard() {
  const navigate = useNavigate();

  const { perfil, projetos, destaques, erro, loading } = useAlunoDashboard();

  useEffect(() => {
    if (
      erro === "Não autenticado" ||
      erro === "Não foi possível carregar seu perfil."
    ) {
      localStorage.removeItem("scripta_token");

      localStorage.removeItem("scripta_user_type");

      navigate("/");
    }
  }, [erro, navigate]);

  const resumo = useMemo(
    () => ({
      rascunho: projetos.filter((projeto) => projeto.status === "rascunho")
        .length,

      submetido: projetos.filter((projeto) => projeto.status === "submetido")
        .length,

      emAvaliacao: projetos.filter(
        (projeto) => projeto.status === "em_avaliacao",
      ).length,

      aprovado: projetos.filter((projeto) => projeto.status === "aprovado")
        .length,

      reprovado: projetos.filter((projeto) => projeto.status === "reprovado")
        .length,
    }),
    [projetos],
  );

  return (
    <div className="pb-12">
      <header className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">
          {loading
            ? "Carregando..."
            : perfil?.nome
              ? `Olá, ${perfil.nome}`
              : "Bem-vindo ao Scripta"}
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          {erro || "Acesse rapidamente suas funcionalidades principais."}
        </p>
      </header>

      <section className="mb-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <CardAtalho
          to="/aluno/submeter"
          titulo="Submeter projeto"
          descricao="Cadastre um novo Projeto Integrador."
          icon={Upload}
          iconClasses="bg-blue-600"
        />

        <CardAtalho
          to="/aluno/buscar"
          titulo="Buscar projetos"
          descricao="Explore projetos disponíveis na plataforma."
          icon={Search}
          iconClasses="bg-emerald-500"
        />

        <CardAtalho
          to="/aluno/ranking"
          titulo="Ver ranking"
          descricao="Confira os projetos mais bem avaliados."
          icon={Trophy}
          iconClasses="bg-amber-500"
        />

        <CardAtalho
          to="/aluno/portfolio"
          titulo="Meu portfólio"
          descricao="Gerencie seus projetos publicados."
          icon={BriefcaseBusiness}
          iconClasses="bg-purple-500"
        />
      </section>

      <section className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <article className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm lg:col-span-2">
          <header className="mb-5 flex items-center justify-between gap-4">
            <div>
              <h2 className="flex items-center gap-2 text-xl font-bold text-gray-800">
                <Trophy size={21} className="text-[#f19f17]" />
                Projetos em destaque
              </h2>

              <p className="mt-1 text-xs text-gray-500">
                Projetos aprovados com as maiores médias de avaliação.
              </p>
            </div>

            <Link
              to="/aluno/ranking"
              className="shrink-0 text-sm font-semibold text-gray-500 hover:text-[#f19f17]"
            >
              Ver ranking →
            </Link>
          </header>

          {loading ? (
            <div className="py-12 text-center text-sm text-gray-500">
              Carregando projetos...
            </div>
          ) : destaques.length > 0 ? (
            <div className="space-y-3">
              {destaques.map((projeto) => (
                <div
                  key={projeto.projeto_id}
                  className="flex flex-col justify-between gap-4 rounded-2xl border border-gray-100 p-5 transition-colors hover:border-orange-200 sm:flex-row sm:items-center"
                >
                  <div className="min-w-0">
                    <div className="mb-2 flex items-center gap-2">
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-orange-50 text-xs font-bold text-[#f19f17]">
                        {projeto.posicao}º
                      </span>

                      <h3 className="truncate text-sm font-bold text-gray-800">
                        {projeto.titulo}
                      </h3>
                    </div>

                    <p className="text-xs text-gray-500">
                      {projeto.curso} • {projeto.turma} • {projeto.semestre}
                    </p>

                    <p className="mt-1 text-xs text-gray-400">
                      Responsável: {projeto.aluno_responsavel}
                    </p>
                  </div>

                  <div className="flex shrink-0 items-center gap-5">
                    <div className="text-center">
                      <strong className="block text-lg text-[#f19f17]">
                        {formatarMedia(projeto.media_geral)}
                      </strong>

                      <span className="text-[10px] font-semibold uppercase tracking-wide text-gray-400">
                        Média
                      </span>
                    </div>

                    <div className="text-center">
                      <strong className="block text-lg text-gray-800">
                        {projeto.total_avaliacoes}
                      </strong>

                      <span className="text-[10px] font-semibold uppercase tracking-wide text-gray-400">
                        Avaliações
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-gray-200 py-12 text-center">
              <Trophy size={38} className="mx-auto text-gray-300" />

              <p className="mt-4 text-sm font-semibold text-gray-600">
                Nenhum projeto em destaque disponível.
              </p>

              <p className="mt-1 text-xs text-gray-400">
                Os destaques aparecem após projetos serem avaliados e aprovados.
              </p>
            </div>
          )}
        </article>

        <div className="space-y-6">
          <article className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
            <header className="mb-5">
              <h2 className="flex items-center gap-2 text-xl font-bold text-gray-800">
                <FolderKanban size={21} className="text-[#f19f17]" />
                Meus projetos
              </h2>

              <p className="mt-1 text-xs text-gray-500">
                Resumo por situação atual.
              </p>
            </header>

            <div className="space-y-3">
              <ItemResumo
                label="Rascunhos"
                quantidade={resumo.rascunho}
                icon={FolderKanban}
                classes="bg-gray-100 text-gray-600"
              />

              <ItemResumo
                label="Submetidos"
                quantidade={resumo.submetido}
                icon={Clock3}
                classes="bg-blue-50 text-blue-600"
              />

              <ItemResumo
                label="Em avaliação"
                quantidade={resumo.emAvaliacao}
                icon={FileCheck2}
                classes="bg-purple-50 text-purple-600"
              />

              <ItemResumo
                label="Aprovados"
                quantidade={resumo.aprovado}
                icon={CheckCircle2}
                classes="bg-emerald-50 text-emerald-600"
              />

              <ItemResumo
                label="Reprovados"
                quantidade={resumo.reprovado}
                icon={XCircle}
                classes="bg-red-50 text-red-600"
              />
            </div>

            <Link
              to="/aluno/projetos"
              className="mt-5 block rounded-xl border border-gray-200 px-4 py-2.5 text-center text-sm font-bold text-gray-700 hover:bg-gray-50"
            >
              Ver meus projetos
            </Link>
          </article>

          <article className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-xl font-bold text-gray-800">
              Ações rápidas
            </h2>

            <div className="space-y-3">
              <button
                type="button"
                onClick={() => navigate("/aluno/submeter")}
                className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-[#f19f17] px-4 py-3 font-bold text-[#f19f17] transition-colors hover:bg-orange-50"
              >
                <Upload size={18} />
                Nova submissão
              </button>

              <button
                type="button"
                onClick={() => navigate("/aluno/certificados")}
                className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-[#f19f17] px-4 py-3 font-bold text-[#f19f17] transition-colors hover:bg-orange-50"
              >
                <Award size={18} />
                Certificados
              </button>

              <button
                type="button"
                onClick={() => navigate("/aluno/perfil")}
                className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-[#f19f17] px-4 py-3 font-bold text-[#f19f17] transition-colors hover:bg-orange-50"
              >
                <UserRound size={18} />
                Meu perfil
              </button>
            </div>
          </article>
        </div>
      </section>
    </div>
  );
}
