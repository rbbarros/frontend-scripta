import { listAvaliacoesProfessor } from "../../../lib/avaliacoesService";
import { useAuthGuard } from "../../../shared/useAuthGuard";
import { useApiData } from "../../../shared/useApiData";
import { Loading, ErrorState, EmptyState } from "../../../components/ui";

const conceitoStyles = {
  Excelente: "bg-emerald-50 text-emerald-700",
  "Ótimo": "bg-emerald-50 text-emerald-700",
  Bom: "bg-blue-50 text-blue-700",
  "Ainda não suficiente": "bg-amber-50 text-[#c67c00]",
  Insuficiente: "bg-red-50 text-red-600",
};

export default function Historico() {
  useAuthGuard();
  const { data, erro, carregando, recarregar } = useApiData(() => listAvaliacoesProfessor(), []);
  const avaliacoes = Array.isArray(data) ? data : data?.itens || [];

  return (
    <>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Histórico de Avaliações</h1>
        <p className="mt-1 text-sm text-gray-400">Todas as avaliações que você já registrou.</p>
      </div>

      {carregando ? (
        <Loading />
      ) : erro ? (
        <ErrorState message={erro} onRetry={recarregar} />
      ) : avaliacoes.length === 0 ? (
        <EmptyState icon="📜" title="Nenhuma avaliação registrada" description="Suas avaliações aparecerão aqui." />
      ) : (
        <div className="space-y-3">
          {avaliacoes.map((a) => (
            <article key={a.id} className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-sm font-bold text-gray-800">
                    {a.titulo_projeto || a.projeto?.titulo || `Projeto #${a.projeto_id}`}
                  </h3>
                  <p className="mt-0.5 text-xs text-gray-400">
                    {a.data_avaliacao && new Date(a.data_avaliacao).toLocaleDateString("pt-BR")}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-purple-600">
                    {a.media_geral != null ? Number(a.media_geral).toFixed(1) : "—"}
                  </span>
                  {a.conceito && (
                    <span className={`rounded-md px-2 py-1 text-xs font-bold ${conceitoStyles[a.conceito] || "bg-gray-100 text-gray-600"}`}>
                      {a.conceito}
                    </span>
                  )}
                </div>
              </div>
              {a.parecer_descritivo && <p className="mt-3 text-sm text-gray-500">{a.parecer_descritivo}</p>}
            </article>
          ))}
        </div>
      )}
    </>
  );
}
