import { getRelatorioProjetos, getRelatorioAcademico } from "../../../lib/relatoriosService";
import { useAuthGuard } from "../../../shared/useAuthGuard";
import { useApiData } from "../../../shared/useApiData";
import { Loading, ErrorState } from "../../../components/ui";

function Metricas({ dados }) {
  if (!dados || typeof dados !== "object") {
    return <p className="text-sm text-gray-400">Sem dados disponíveis.</p>;
  }

  const entradas = Object.entries(dados).filter(([, v]) => typeof v !== "object");

  if (entradas.length === 0) {
    return <p className="text-sm text-gray-400">Sem dados disponíveis.</p>;
  }

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
      {entradas.map(([chave, valor]) => (
        <div key={chave} className="rounded-xl border border-gray-100 p-4">
          <div className="text-2xl font-bold text-gray-900">{String(valor)}</div>
          <div className="mt-1 text-xs font-medium capitalize text-gray-400">{chave.replace(/_/g, " ")}</div>
        </div>
      ))}
    </div>
  );
}

export default function Relatorios() {
  useAuthGuard();
  const projetos = useApiData(() => getRelatorioProjetos(), []);
  const academico = useApiData(() => getRelatorioAcademico(), []);

  return (
    <>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Relatórios</h1>
        <p className="mt-1 text-sm text-gray-400">Indicadores gerais de projetos e desempenho acadêmico.</p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <section className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-bold text-gray-800">📊 Relatório de Projetos</h2>
          {projetos.carregando ? (
            <Loading />
          ) : projetos.erro ? (
            <ErrorState message={projetos.erro} onRetry={projetos.recarregar} />
          ) : (
            <Metricas dados={projetos.data} />
          )}
        </section>

        <section className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-bold text-gray-800">🎓 Relatório Acadêmico</h2>
          {academico.carregando ? (
            <Loading />
          ) : academico.erro ? (
            <ErrorState message={academico.erro} onRetry={academico.recarregar} />
          ) : (
            <Metricas dados={academico.data} />
          )}
        </section>
      </div>
    </>
  );
}
