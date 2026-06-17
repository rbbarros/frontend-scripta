import { Link } from "react-router-dom";
import { listProjetos } from "../../../lib/projetosService";
import { listLogs } from "../../../lib/relatoriosService";
import { useAuthGuard } from "../../../shared/useAuthGuard";
import { useApiData } from "../../../shared/useApiData";
import { StatCard } from "../../../components/ui";

const acaoLabels = { CREATE: "criou", UPDATE: "atualizou", DELETE: "removeu" };

export default function Dashboard() {
  useAuthGuard();
  const { data: projetosData } = useApiData(() => listProjetos(), []);
  const { data: logsData } = useApiData(() => listLogs(), []);

  const projetos = Array.isArray(projetosData) ? projetosData : projetosData?.itens || [];
  const logs = Array.isArray(logsData) ? logsData : logsData?.itens || [];

  const aprovados = projetos.filter((p) => p.status === "aprovado").length;
  const pendentes = projetos.filter((p) => p.status === "submetido" || p.status === "em_avaliacao").length;

  return (
    <>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-400">Visão geral da plataforma Scripta · Faculdade Senac.</p>
      </div>

      <div className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard icon="📁" value={projetos.length} label="Total de Projetos" accentColor="emerald" />
        <StatCard icon="✅" value={aprovados} label="Aprovados" accentColor="emerald" />
        <StatCard icon="⏳" value={pendentes} label="Pendentes" accentColor="emerald" />
        <StatCard icon="🎖️" value={projetos.filter((p) => p.status === "aprovado").length} label="Certificáveis" accentColor="emerald" />
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-800">Atividade Recente</h2>
            <Link to="/coordenacao/logs" className="text-xs font-semibold text-emerald-700 hover:underline">Ver auditoria →</Link>
          </div>
          <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
            {logs.length === 0 ? (
              <p className="text-sm text-gray-400">Nenhuma atividade registrada.</p>
            ) : (
              <ul className="divide-y divide-gray-100">
                {logs.slice(0, 6).map((log) => (
                  <li key={log.id} className="flex items-center justify-between gap-3 py-3">
                    <div>
                      <p className="text-sm font-medium text-gray-700">
                        {acaoLabels[log.acao] || log.acao} · {log.entidade} #{log.registro_id}
                      </p>
                      {log.detalhes && <p className="text-xs text-gray-400">{log.detalhes}</p>}
                    </div>
                    <span className="shrink-0 text-xs text-gray-400">
                      {log.data_hora && new Date(log.data_hora).toLocaleDateString("pt-BR")}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div className="space-y-3">
          <h2 className="text-lg font-bold text-gray-800">Acesso Rápido</h2>
          <Link to="/coordenacao/projetos" className="block rounded-xl bg-white p-3 text-xs font-medium text-gray-600 shadow-sm hover:bg-gray-50">📁 Gerenciar projetos</Link>
          <Link to="/coordenacao/relatorios" className="block rounded-xl bg-white p-3 text-xs font-medium text-gray-600 shadow-sm hover:bg-gray-50">📈 Gerar relatórios</Link>
          <Link to="/coordenacao/certificados" className="block rounded-xl bg-white p-3 text-xs font-medium text-gray-600 shadow-sm hover:bg-gray-50">🎖️ Emitir certificados</Link>
          <Link to="/coordenacao/usuarios" className="block rounded-xl bg-white p-3 text-xs font-medium text-gray-600 shadow-sm hover:bg-gray-50">👥 Ver usuários</Link>
        </div>
      </div>
    </>
  );
}
