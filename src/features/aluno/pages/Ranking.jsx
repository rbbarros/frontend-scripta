import { getRanking } from "../../../lib/rankingService";
import { useAuthGuard } from "../../../shared/useAuthGuard";
import { useApiData } from "../../../shared/useApiData";
import { Loading, ErrorState, EmptyState } from "../../../components/ui";

const medalhas = ["🥇", "🥈", "🥉"];

export default function Ranking() {
  useAuthGuard();
  const { data, erro, carregando, recarregar } = useApiData(() => getRanking(), []);

  const itens = Array.isArray(data) ? data : data?.itens || [];

  return (
    <>
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Ranking de Projetos</h1>
        <p className="mt-1 text-sm text-gray-400">Projetos mais bem avaliados da plataforma.</p>
      </div>

      {carregando ? (
        <Loading />
      ) : erro ? (
        <ErrorState message={erro} onRetry={recarregar} />
      ) : itens.length === 0 ? (
        <EmptyState icon="🏆" title="Ranking indisponível" description="Ainda não há projetos avaliados." />
      ) : (
        <>
          <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
            {itens.slice(0, 3).map((p, i) => (
              <div
                key={p.id}
                className={`rounded-2xl border bg-white p-6 text-center shadow-sm ${i === 0 ? "border-[#f19f17]" : "border-gray-100"}`}
              >
                <div className="text-3xl">{medalhas[i]}</div>
                <div className="mt-2 text-lg font-bold text-gray-700">{i + 1}º</div>
                <h3 className="mt-2 text-sm font-bold text-gray-800">{p.titulo}</h3>
                <p className="text-xs text-gray-400">{p.area_conhecimento || p.curso}</p>
                <p className="mt-2 text-xs font-semibold text-[#c67c00]">
                  🏆 {p.media_geral != null ? Number(p.media_geral).toFixed(1) : "—"}
                  {p.total_avaliacoes != null && ` · ${p.total_avaliacoes} avaliações`}
                </p>
              </div>
            ))}
          </div>

          <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-bold text-gray-800">Classificação Completa</h2>
            <ul className="divide-y divide-gray-100">
              {itens.map((p, i) => (
                <li key={p.id} className="flex items-center justify-between gap-4 py-3">
                  <div className="flex items-center gap-3">
                    <span className="w-6 text-sm font-bold text-gray-400">{i + 1}º</span>
                    <div>
                      <p className="text-sm font-semibold text-gray-800">{p.titulo}</p>
                      <p className="text-xs text-gray-400">{p.area_conhecimento || p.curso}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-[#c67c00]">
                      🏆 {p.media_geral != null ? Number(p.media_geral).toFixed(1) : "—"}
                    </p>
                    {p.total_avaliacoes != null && (
                      <p className="text-xs text-gray-400">{p.total_avaliacoes} avaliações</p>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </>
      )}
    </>
  );
}
