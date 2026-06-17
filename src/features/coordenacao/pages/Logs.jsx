import { listLogs } from "../../../lib/relatoriosService";
import { useAuthGuard } from "../../../shared/useAuthGuard";
import { useApiData } from "../../../shared/useApiData";
import { Loading, ErrorState, EmptyState } from "../../../components/ui";

const acaoStyles = {
  CREATE: "bg-emerald-50 text-emerald-700",
  UPDATE: "bg-blue-50 text-blue-700",
  DELETE: "bg-red-50 text-red-600",
};

export default function Logs() {
  useAuthGuard();
  const { data, erro, carregando, recarregar } = useApiData(() => listLogs(), []);
  const logs = Array.isArray(data) ? data : data?.itens || [];

  return (
    <>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Auditoria do Sistema</h1>
        <p className="mt-1 text-sm text-gray-400">Histórico de ações realizadas pela coordenação.</p>
      </div>

      {carregando ? (
        <Loading />
      ) : erro ? (
        <ErrorState message={erro} onRetry={recarregar} />
      ) : logs.length === 0 ? (
        <EmptyState icon="🛡️" title="Nenhum registro de auditoria" />
      ) : (
        <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-gray-100 bg-gray-50 text-xs uppercase tracking-wider text-gray-400">
              <tr>
                <th className="px-5 py-3">Ação</th>
                <th className="px-5 py-3">Entidade</th>
                <th className="px-5 py-3">Registro</th>
                <th className="px-5 py-3">Detalhes</th>
                <th className="px-5 py-3">Data</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {logs.map((log) => (
                <tr key={log.id}>
                  <td className="px-5 py-3">
                    <span className={`rounded-md px-2 py-1 text-xs font-bold ${acaoStyles[log.acao] || "bg-gray-100 text-gray-600"}`}>
                      {log.acao}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-gray-700">{log.entidade}</td>
                  <td className="px-5 py-3 text-gray-500">#{log.registro_id}</td>
                  <td className="px-5 py-3 text-gray-500">{log.detalhes || "—"}</td>
                  <td className="px-5 py-3 text-gray-400">
                    {log.data_hora && new Date(log.data_hora).toLocaleString("pt-BR")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
