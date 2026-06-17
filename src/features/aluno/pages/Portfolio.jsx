import { listPortfolios } from "../../../lib/portfoliosService";
import { getCurrentUserId } from "../../../lib/session";
import { useAuthGuard } from "../../../shared/useAuthGuard";
import { useApiData } from "../../../shared/useApiData";
import { Loading, ErrorState, EmptyState, StatCard } from "../../../components/ui";

const visibilidadeLabels = {
  publico: { label: "Público", style: "bg-emerald-50 text-emerald-700" },
  apenas_senac: { label: "Apenas Senac", style: "bg-blue-50 text-blue-700" },
  privado: { label: "Privado", style: "bg-gray-100 text-gray-600" },
};

export default function Portfolio() {
  useAuthGuard();
  const alunoId = getCurrentUserId();

  const { data, erro, carregando, recarregar } = useApiData(
    () => listPortfolios({ aluno_id: alunoId }),
    [alunoId],
  );

  const itens = Array.isArray(data) ? data : data?.itens || [];
  const publicos = itens.filter((p) => p.visibilidade === "publico").length;

  return (
    <>
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Meu Portfólio</h1>
          <p className="mt-1 text-sm text-gray-400">Projetos publicados e disponíveis para visualização.</p>
        </div>
        <button className="rounded-xl bg-[#f19f17] px-4 py-2 text-sm font-semibold text-white shadow-sm">
          🔗 Compartilhar Portfólio
        </button>
      </div>

      <div className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard icon="📁" value={itens.length} label="Projetos Totais" />
        <StatCard icon="🌐" value={publicos} label="Públicos" />
        <StatCard icon="⭐" value={itens.length ? "Ótimo" : "—"} label="Média Avaliada" />
        <StatCard icon="👁️" value={itens.reduce((a, p) => a + (p.visualizacoes || 0), 0)} label="Visualizações" />
      </div>

      <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-bold text-gray-800">Todos os Projetos</h2>

        {carregando ? (
          <Loading />
        ) : erro ? (
          <ErrorState message={erro} onRetry={recarregar} />
        ) : itens.length === 0 ? (
          <EmptyState icon="💼" title="Portfólio vazio" description="Publique projetos para exibi-los aqui." />
        ) : (
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
            {itens.map((p) => {
              const vis = visibilidadeLabels[p.visibilidade] || visibilidadeLabels.privado;
              return (
                <article key={p.id} className="overflow-hidden rounded-xl border border-gray-100">
                  <div className="h-28 bg-gradient-to-br from-[#f19f17] to-amber-400" />
                  <div className="p-4">
                    <span className={`inline-flex rounded-md px-2 py-1 text-xs font-bold ${vis.style}`}>
                      {vis.label}
                    </span>
                    <h3 className="mt-2 text-sm font-bold text-gray-800">
                      {p.titulo_projeto || p.projeto?.titulo || "Projeto"}
                    </h3>
                    <p className="mt-1 line-clamp-2 text-xs text-gray-400">
                      {p.descricao || p.projeto?.descricao}
                    </p>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}
