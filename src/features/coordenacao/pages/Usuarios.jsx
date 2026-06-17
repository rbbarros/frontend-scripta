import { getRelatorioAcademico } from "../../../lib/relatoriosService";
import { useAuthGuard } from "../../../shared/useAuthGuard";
import { useApiData } from "../../../shared/useApiData";
import { Loading, ErrorState, StatCard } from "../../../components/ui";

const rotulos = {
  total_alunos: "Alunos",
  total_professores: "Professores",
  total_empresas: "Empresas",
  total_coordenadores: "Coordenadores",
  alunos: "Alunos",
  professores: "Professores",
  empresas: "Empresas",
};

export default function Usuarios() {
  useAuthGuard();
  const { data, erro, carregando, recarregar } = useApiData(() => getRelatorioAcademico(), []);

  const metricas =
    data && typeof data === "object"
      ? Object.entries(data).filter(([k]) => k in rotulos)
      : [];

  return (
    <>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Usuários</h1>
        <p className="mt-1 text-sm text-gray-400">Visão geral dos usuários cadastrados na plataforma.</p>
      </div>

      {carregando ? (
        <Loading />
      ) : erro ? (
        <ErrorState message={erro} onRetry={recarregar} />
      ) : metricas.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-gray-200 bg-white p-8 text-sm text-gray-500 shadow-sm">
          O resumo de usuários é alimentado pelo endpoint <code className="rounded bg-gray-100 px-1.5 py-0.5 text-xs">/relatorios/academico</code>.
          Assim que o backend retornar os totais de usuários, eles aparecerão aqui automaticamente.
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {metricas.map(([chave, valor]) => (
            <StatCard key={chave} icon="👥" value={String(valor)} label={rotulos[chave]} accentColor="emerald" />
          ))}
        </div>
      )}
    </>
  );
}
