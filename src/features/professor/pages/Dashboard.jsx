import { Link } from "react-router-dom";
import { getProfessorPerfil } from "../../../lib/authService";
import { listProjetos } from "../../../lib/projetosService";
import { listAvaliacoesProfessor } from "../../../lib/avaliacoesService";
import { useAuthGuard } from "../../../shared/useAuthGuard";
import { useApiData } from "../../../shared/useApiData";
import { StatCard, StatusBadge } from "../../../components/ui";

export default function Dashboard() {
  useAuthGuard();
  const { data: perfil } = useApiData(() => getProfessorPerfil(), []);
  const { data: projetosData } = useApiData(() => listProjetos(), []);
  const { data: avaliacoesData } = useApiData(() => listAvaliacoesProfessor(), []);

  const projetos = Array.isArray(projetosData) ? projetosData : projetosData?.itens || [];
  const avaliacoes = Array.isArray(avaliacoesData) ? avaliacoesData : avaliacoesData?.itens || [];
  const pendentes = projetos.filter((p) => p.status === "submetido" || p.status === "em_avaliacao");

  return (
    <>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-400">
          {perfil?.nome ? `Bem-vindo, Prof. ${perfil.nome}. Acompanhe suas atividades de avaliação.` : "Acompanhe suas atividades de avaliação."}
        </p>
      </div>

      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard icon="⏳" value={pendentes.length} label="Aguardando avaliação" accentColor="purple" />
        <StatCard icon="✅" value={avaliacoes.length} label="Avaliações realizadas" accentColor="purple" />
        <StatCard icon="📁" value={projetos.length} label="Total de projetos" accentColor="purple" />
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-800">Projetos para Avaliar</h2>
            <Link to="/professor/projetos" className="text-xs font-semibold text-purple-600 hover:underline">Ver todos →</Link>
          </div>
          <div className="space-y-3">
            {pendentes.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-gray-200 bg-white p-6 text-sm text-gray-400 shadow-sm">
                Nenhum projeto aguardando avaliação.
              </div>
            ) : (
              pendentes.slice(0, 5).map((p) => (
                <div key={p.id} className="flex items-center justify-between rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
                  <div>
                    <p className="text-sm font-bold text-gray-800">{p.titulo}</p>
                    <p className="text-xs text-gray-400">{p.curso}{p.turma && ` · ${p.turma}`}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <StatusBadge status={p.status} />
                    <Link to={`/professor/avaliacoes?projeto=${p.id}`} className="rounded-xl bg-purple-600 px-3 py-1.5 text-xs font-semibold text-white">
                      Avaliar
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="space-y-3">
          <h2 className="text-lg font-bold text-gray-800">Ações Rápidas</h2>
          <Link to="/professor/projetos" className="block rounded-xl bg-white p-3 text-xs font-medium text-gray-600 shadow-sm hover:bg-gray-50">📁 Ver projetos pendentes</Link>
          <Link to="/professor/historico" className="block rounded-xl bg-white p-3 text-xs font-medium text-gray-600 shadow-sm hover:bg-gray-50">📜 Histórico de avaliações</Link>
          <Link to="/professor/ranking" className="block rounded-xl bg-white p-3 text-xs font-medium text-gray-600 shadow-sm hover:bg-gray-50">🏆 Ver ranking</Link>
        </div>
      </div>
    </>
  );
}
