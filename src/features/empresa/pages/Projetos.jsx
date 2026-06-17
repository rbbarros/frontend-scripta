import { useState } from "react";
import { listProjetos } from "../../../lib/projetosService";
import { useAuthGuard } from "../../../shared/useAuthGuard";
import { useApiData } from "../../../shared/useApiData";
import { Loading, ErrorState, EmptyState } from "../../../components/ui";

export default function Projetos() {
  useAuthGuard();
  const [busca, setBusca] = useState("");
  const [aplicado, setAplicado] = useState({});

  const { data, erro, carregando, recarregar } = useApiData(() => listProjetos(aplicado), [aplicado]);
  const projetos = Array.isArray(data) ? data : data?.itens || [];

  const buscar = (e) => {
    e.preventDefault();
    setAplicado(busca ? { busca } : {});
  };

  return (
    <>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Projetos Acadêmicos</h1>
        <p className="mt-1 text-sm text-gray-400">Explore projetos publicados e descubra talentos.</p>
      </div>

      <form onSubmit={buscar} className="mb-6">
        <input
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          placeholder="🔍 Buscar projetos por título, área ou palavra-chave..."
          className="w-full rounded-2xl border border-gray-100 bg-white px-5 py-3 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </form>

      {carregando ? (
        <Loading />
      ) : erro ? (
        <ErrorState message={erro} onRetry={recarregar} />
      ) : projetos.length === 0 ? (
        <EmptyState icon="📁" title="Nenhum projeto encontrado" description="Tente outra busca." />
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {projetos.map((p) => (
            <article key={p.id} className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
              <div className="flex items-start justify-between gap-3">
                <h3 className="text-base font-bold text-gray-800">{p.titulo}</h3>
                {p.media_geral != null && (
                  <span className="shrink-0 rounded-md bg-blue-50 px-2 py-1 text-xs font-bold text-blue-700">
                    ⭐ {Number(p.media_geral).toFixed(1)}
                  </span>
                )}
              </div>
              <p className="mt-1 line-clamp-3 text-sm text-gray-500">{p.descricao}</p>
              <div className="mt-3 flex flex-wrap gap-3 text-xs text-gray-400">
                <span>📘 {p.curso}</span>
                {p.area_conhecimento && <span>🏷️ {p.area_conhecimento}</span>}
              </div>
            </article>
          ))}
        </div>
      )}
    </>
  );
}
