import { useState } from "react";
import { listProjetos } from "../../../lib/projetosService";
import { useAuthGuard } from "../../../shared/useAuthGuard";
import { useApiData } from "../../../shared/useApiData";
import { Loading, ErrorState, EmptyState } from "../../../components/ui";

export default function BuscarProjetos() {
  useAuthGuard();
  const [filtros, setFiltros] = useState({ busca: "", curso: "", semestre: "", area: "" });
  const [aplicados, setAplicados] = useState({});

  const { data, erro, carregando, recarregar } = useApiData(
    () => listProjetos(aplicados),
    [aplicados],
  );

  const projetos = Array.isArray(data) ? data : data?.itens || [];

  const handleChange = (campo) => (e) =>
    setFiltros((prev) => ({ ...prev, [campo]: e.target.value }));

  const aplicar = (e) => {
    e.preventDefault();
    setAplicados(filtros);
  };

  const limpar = () => {
    setFiltros({ busca: "", curso: "", semestre: "", area: "" });
    setAplicados({});
  };

  return (
    <>
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Buscar Projetos</h1>
        <p className="mt-1 text-sm text-gray-400">
          Explore projetos acadêmicos de diferentes cursos e semestres.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[260px_1fr]">
        <form onSubmit={aplicar} className="h-fit rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-sm font-bold text-gray-800">🎛️ Filtros</h2>

          <label className="mb-1 block text-xs font-semibold text-gray-500">Curso</label>
          <input
            value={filtros.curso}
            onChange={handleChange("curso")}
            placeholder="Todos os cursos"
            className="mb-4 w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#f19f17]"
          />

          <label className="mb-1 block text-xs font-semibold text-gray-500">Semestre</label>
          <input
            value={filtros.semestre}
            onChange={handleChange("semestre")}
            placeholder="Todos os semestres"
            className="mb-4 w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#f19f17]"
          />

          <label className="mb-1 block text-xs font-semibold text-gray-500">Área de conhecimento</label>
          <input
            value={filtros.area}
            onChange={handleChange("area")}
            placeholder="Todas as áreas"
            className="mb-4 w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#f19f17]"
          />

          <div className="flex flex-col gap-2">
            <button type="submit" className="rounded-xl bg-[#f19f17] py-2 text-sm font-semibold text-white">
              Aplicar filtros
            </button>
            <button type="button" onClick={limpar} className="text-xs font-semibold text-gray-400 hover:text-gray-600">
              Limpar filtros
            </button>
          </div>
        </form>

        <div className="space-y-4">
          <form onSubmit={aplicar}>
            <input
              value={filtros.busca}
              onChange={handleChange("busca")}
              placeholder="🔍 Buscar por título, descrição ou palavra-chave..."
              className="w-full rounded-2xl border border-gray-100 bg-white px-5 py-3 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-[#f19f17]"
            />
          </form>

          {carregando ? (
            <Loading />
          ) : erro ? (
            <ErrorState message={erro} onRetry={recarregar} />
          ) : projetos.length === 0 ? (
            <EmptyState icon="🔍" title="Nenhum projeto encontrado" description="Ajuste os filtros e tente novamente." />
          ) : (
            <>
              <p className="text-xs text-gray-400">{projetos.length} projeto(s) encontrado(s)</p>
              {projetos.map((p) => (
                <article key={p.id} className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
                  <div className="flex items-start justify-between gap-4">
                    <h3 className="text-base font-bold text-gray-800">{p.titulo}</h3>
                    {p.media_geral != null && (
                      <span className="shrink-0 rounded-md bg-amber-50 px-2 py-1 text-xs font-bold text-[#c67c00]">
                        ⭐ {Number(p.media_geral).toFixed(1)}
                      </span>
                    )}
                  </div>
                  <p className="mt-1 text-sm text-gray-500">{p.descricao}</p>
                  <div className="mt-3 flex flex-wrap gap-3 text-xs text-gray-400">
                    <span>📘 {p.curso}</span>
                    {p.semestre && <span>📅 {p.semestre}</span>}
                    {p.area_conhecimento && <span>🏷️ {p.area_conhecimento}</span>}
                  </div>
                </article>
              ))}
            </>
          )}
        </div>
      </div>
    </>
  );
}
