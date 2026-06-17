import { Link } from "react-router-dom";
import { listProjetos } from "../../../lib/projetosService";
import { useAuthGuard } from "../../../shared/useAuthGuard";
import { useApiData } from "../../../shared/useApiData";
import { Loading, ErrorState, EmptyState, StatusBadge } from "../../../components/ui";

export default function Projetos() {
  useAuthGuard();
  const { data, erro, carregando, recarregar } = useApiData(() => listProjetos(), []);
  const projetos = Array.isArray(data) ? data : data?.itens || [];

  return (
    <>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Projetos</h1>
        <p className="mt-1 text-sm text-gray-400">Lista de projetos submetidos para avaliação e acompanhamento.</p>
      </div>

      {carregando ? (
        <Loading />
      ) : erro ? (
        <ErrorState message={erro} onRetry={recarregar} />
      ) : projetos.length === 0 ? (
        <EmptyState icon="📁" title="Nenhum projeto disponível" description="Os projetos submetidos aparecerão aqui." />
      ) : (
        <div className="space-y-3">
          {projetos.map((p) => (
            <article key={p.id} className="flex flex-col gap-3 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-gray-800">{p.titulo}</h3>
                  <StatusBadge status={p.status} />
                </div>
                <p className="mt-1 text-xs text-gray-400">
                  {p.curso}{p.turma && ` · ${p.turma}`}{p.area_conhecimento && ` · ${p.area_conhecimento}`}
                </p>
                <p className="mt-2 line-clamp-2 text-sm text-gray-500">{p.descricao}</p>
              </div>
              <Link
                to={`/professor/avaliacoes?projeto=${p.id}`}
                className="shrink-0 rounded-xl bg-purple-600 px-4 py-2 text-center text-xs font-semibold text-white"
              >
                📝 Avaliar
              </Link>
            </article>
          ))}
        </div>
      )}
    </>
  );
}
