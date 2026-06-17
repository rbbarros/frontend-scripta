import { listCertificados } from "../../../lib/certificadosService";
import { getCurrentUserId } from "../../../lib/session";
import { useAuthGuard } from "../../../shared/useAuthGuard";
import { useApiData } from "../../../shared/useApiData";
import { Loading, ErrorState, EmptyState, StatCard } from "../../../components/ui";

export default function Certificados() {
  useAuthGuard();
  const alunoId = getCurrentUserId();

  const { data, erro, carregando, recarregar } = useApiData(
    () => listCertificados({ aluno_id: alunoId }),
    [alunoId],
  );

  const certificados = Array.isArray(data) ? data : data?.itens || [];

  return (
    <>
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Meus Certificados</h1>
        <p className="mt-1 text-sm text-gray-400">Certificados de projetos integradores concluídos.</p>
      </div>

      <div className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard icon="🎖️" value={certificados.length} label="Total de Certificados" />
        <StatCard icon="🏆" value={certificados.filter((c) => c.destaque).length} label="Projetos Destaque" />
        <StatCard
          icon="📊"
          value={
            certificados.length
              ? (
                  certificados.reduce((acc, c) => acc + (Number(c.nota) || 0), 0) /
                  certificados.length
                ).toFixed(1)
              : "—"
          }
          label="Média Geral"
        />
        <StatCard
          icon="📅"
          value={
            certificados[0]?.data_emissao
              ? new Date(certificados[0].data_emissao).getFullYear()
              : "—"
          }
          label="Último Certificado"
        />
      </div>

      <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-bold text-gray-800">Todos os Certificados</h2>

        {carregando ? (
          <Loading />
        ) : erro ? (
          <ErrorState message={erro} onRetry={recarregar} />
        ) : certificados.length === 0 ? (
          <EmptyState icon="📜" title="Nenhum certificado ainda" description="Conclua projetos para emitir certificados." />
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {certificados.map((c) => (
              <div key={c.id} className="rounded-xl border border-gray-100 p-5">
                <div className="flex items-start justify-between">
                  <div className="text-2xl">🎖️</div>
                  {c.destaque && (
                    <span className="rounded-md bg-amber-50 px-2 py-1 text-xs font-bold text-[#c67c00]">★ Destaque</span>
                  )}
                </div>
                <h3 className="mt-3 text-sm font-bold text-gray-800">
                  {c.titulo_projeto || c.projeto?.titulo || "Projeto Integrador"}
                </h3>
                <p className="mt-1 text-xs text-gray-400">
                  {c.data_emissao && `📅 ${new Date(c.data_emissao).toLocaleDateString("pt-BR")}`}
                  {c.nota != null && ` · Nota ${c.nota}`}
                </p>
                {c.codigo_autenticidade && (
                  <p className="mt-2 break-all text-xs text-gray-400">Código: {c.codigo_autenticidade}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
