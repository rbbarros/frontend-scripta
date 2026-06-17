import { Link } from "react-router-dom";
import { getEmpresaPerfil } from "../../../lib/authService";
import { getProjetosDestaque, listProjetos } from "../../../lib/projetosService";
import { listPortfolios } from "../../../lib/portfoliosService";
import { useAuthGuard } from "../../../shared/useAuthGuard";
import { useApiData } from "../../../shared/useApiData";
import { StatCard } from "../../../components/ui";

export default function Dashboard() {
  useAuthGuard();
  const { data: perfil } = useApiData(() => getEmpresaPerfil(), []);
  const { data: projetosData } = useApiData(() => listProjetos(), []);
  const { data: portfoliosData } = useApiData(() => listPortfolios(), []);
  const { data: destaqueData } = useApiData(() => getProjetosDestaque(), []);

  const projetos = Array.isArray(projetosData) ? projetosData : projetosData?.itens || [];
  const portfolios = Array.isArray(portfoliosData) ? portfoliosData : portfoliosData?.itens || [];
  const destaque = Array.isArray(destaqueData) ? destaqueData : destaqueData?.itens || [];

  return (
    <>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-400">
          {perfil?.nome_empresa ? `Bem-vindo, ${perfil.nome_empresa}. Explore talentos e projetos acadêmicos.` : "Explore talentos e projetos acadêmicos."}
        </p>
      </div>

      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard icon="📁" value={projetos.length} label="Projetos disponíveis" accentColor="blue" />
        <StatCard icon="📚" value={portfolios.length} label="Portfólios disponíveis" accentColor="blue" />
        <StatCard icon="🏆" value={destaque.length} label="Projetos em destaque" accentColor="blue" />
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-800">Projetos em Destaque</h2>
            <Link to="/empresa/projetos" className="text-xs font-semibold text-blue-700 hover:underline">Ver todos →</Link>
          </div>
          <div className="space-y-3">
            {destaque.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-gray-200 bg-white p-6 text-sm text-gray-400 shadow-sm">
                Nenhum projeto em destaque no momento.
              </div>
            ) : (
              destaque.slice(0, 5).map((p) => (
                <div key={p.id} className="flex items-center justify-between rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
                  <div>
                    <p className="text-sm font-bold text-gray-800">{p.titulo}</p>
                    <p className="text-xs text-gray-400">{p.area_conhecimento || p.curso}</p>
                  </div>
                  {p.media_geral != null && (
                    <span className="rounded-md bg-blue-50 px-2 py-1 text-xs font-bold text-blue-700">
                      {Number(p.media_geral).toFixed(1)}
                    </span>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        <div className="space-y-3">
          <h2 className="text-lg font-bold text-gray-800">Explorar</h2>
          <Link to="/empresa/projetos" className="block rounded-xl bg-white p-3 text-xs font-medium text-gray-600 shadow-sm hover:bg-gray-50">📁 Buscar projetos</Link>
          <Link to="/empresa/talentos" className="block rounded-xl bg-white p-3 text-xs font-medium text-gray-600 shadow-sm hover:bg-gray-50">🎯 Identificar talentos</Link>
          <Link to="/empresa/ranking" className="block rounded-xl bg-white p-3 text-xs font-medium text-gray-600 shadow-sm hover:bg-gray-50">🏆 Ver ranking</Link>
        </div>
      </div>
    </>
  );
}
