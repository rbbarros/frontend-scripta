import { useState } from "react";
import { Link } from "react-router-dom";
import { listProjetos } from "../../../lib/projetosService";
import { getCurrentUserId } from "../../../lib/session";
import { useAuthGuard } from "../../../shared/useAuthGuard";
import { useApiData } from "../../../shared/useApiData";
import { Loading, ErrorState, EmptyState, StatusBadge } from "../../../components/ui";

const filtros = [
  { key: "todos", label: "Todos" },
  { key: "rascunho", label: "Rascunhos" },
  { key: "submetido", label: "Submetidos" },
  { key: "em_avaliacao", label: "Em revisão" },
  { key: "aprovado", label: "Aprovados" },
  { key: "reprovado", label: "Reprovados" },
];

export default function MeusProjetos() {
  useAuthGuard();
  const alunoId = getCurrentUserId();
  const [filtroAtivo, setFiltroAtivo] = useState("todos");

  const { data, erro, carregando, recarregar } = useApiData(
    () => listProjetos({ aluno_id: alunoId }),
    [alunoId],
  );

  const projetos = Array.isArray(data) ? data : data?.itens || [];
  const contar = (key) =>
    key === "todos" ? projetos.length : projetos.filter((p) => p.status === key).length;
  const visiveis =
    filtroAtivo === "todos" ? projetos : projetos.filter((p) => p.status === filtroAtivo);

  return (
    <>
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Meus Projetos</h1>
          <p className="mt-1 text-sm text-gray-400">Acompanhe e gerencie todos os seus projetos integradores.</p>
        </div>
        <Link to="/aluno/submeter" className="rounded-xl bg-[#f19f17] px-4 py-2 text-sm font-semibold text-white shadow-sm">
          + Novo Projeto
        </Link>
      </div>

      <div className="mb-6 flex flex-wrap gap-2">
        {filtros.map((f) => (
          <button
            key={f.key}
            onClick={() => setFiltroAtivo(f.key)}
            className={`rounded-xl px-4 py-2 text-xs font-semibold transition-colors ${
              filtroAtivo === f.key
                ? "bg-[#f19f17] text-white"
                : "bg-white text-gray-500 hover:bg-gray-50"
            }`}
          >
            {f.label} <span className="opacity-70">{contar(f.key)}</span>
          </button>
        ))}
      </div>

      {carregando ? (
        <Loading />
      ) : erro ? (
        <ErrorState message={erro} onRetry={recarregar} />
      ) : visiveis.length === 0 ? (
        <EmptyState icon="📂" title="Nenhum projeto nesta categoria" description="Submeta um novo projeto integrador." />
      ) : (
        <div className="space-y-4">
          {visiveis.map((p) => (
            <article key={p.id} className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-gray-800">{p.titulo}</h3>
                    <StatusBadge status={p.status} />
                  </div>
                  <p className="mt-1 text-xs text-gray-400">
                    {p.curso}
                    {p.semestre && ` · ${p.semestre}`}
                  </p>
                  <p className="mt-2 text-sm text-gray-500">{p.descricao}</p>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </>
  );
}
