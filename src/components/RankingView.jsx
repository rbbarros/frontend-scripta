import { getRanking } from "../lib/rankingService";
import { useApiData } from "../shared/useApiData";
import { Loading, ErrorState, EmptyState } from "./ui";

const medalhas = ["🥇", "🥈", "🥉"];

export default function RankingView({ accentColor = "purple" }) {
  const { data, erro, carregando, recarregar } = useApiData(() => getRanking(), []);
  const itens = Array.isArray(data) ? data : data?.itens || [];

  const borderActive = accentColor === "blue" ? "border-blue-400" : accentColor === "emerald" ? "border-emerald-400" : "border-purple-400";

  return (
    <>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Ranking de Projetos</h1>
        <p className="mt-1 text-sm text-gray-400">Projetos mais bem avaliados da plataforma.</p>
      </div>

      {carregando ? (
        <Loading />
      ) : erro ? (
        <ErrorState message={erro} onRetry={recarregar} />
      ) : itens.length === 0 ? (
        <EmptyState icon="🏆" title="Ranking indisponível" description="Ainda não há projetos avaliados." />
      ) : (
        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <ul className="divide-y divide-gray-100">
            {itens.map((p, i) => (
              <li key={p.id} className={`flex items-center justify-between gap-4 py-3 ${i === 0 ? `rounded-xl border ${borderActive} px-3` : ""}`}>
                <div className="flex items-center gap-3">
                  <span className="w-8 text-center text-lg">{medalhas[i] || <span className="text-sm font-bold text-gray-400">{i + 1}º</span>}</span>
                  <div>
                    <p className="text-sm font-semibold text-gray-800">{p.titulo}</p>
                    <p className="text-xs text-gray-400">{p.area_conhecimento || p.curso}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-[#c67c00]">
                    🏆 {p.media_geral != null ? Number(p.media_geral).toFixed(1) : "—"}
                  </p>
                  {p.total_avaliacoes != null && <p className="text-xs text-gray-400">{p.total_avaliacoes} avaliações</p>}
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
}
