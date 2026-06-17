import { useState } from "react";
import { listProjetos, deleteProjeto } from "../../../lib/projetosService";
import { useAuthGuard } from "../../../shared/useAuthGuard";
import { useApiData } from "../../../shared/useApiData";
import { Loading, ErrorState, EmptyState, StatusBadge } from "../../../components/ui";

export default function Projetos() {
  useAuthGuard();
  const { data, erro, carregando, recarregar } = useApiData(() => listProjetos(), []);
  const projetos = Array.isArray(data) ? data : data?.itens || [];
  const [removendo, setRemovendo] = useState(null);
  const [erroAcao, setErroAcao] = useState("");

  const remover = async (id) => {
    if (!window.confirm("Tem certeza que deseja excluir este projeto?")) return;
    setRemovendo(id);
    setErroAcao("");
    try {
      await deleteProjeto(id);
      recarregar();
    } catch (err) {
      setErroAcao(err.message || "Não foi possível excluir o projeto.");
    } finally {
      setRemovendo(null);
    }
  };

  return (
    <>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Gestão de Projetos</h1>
        <p className="mt-1 text-sm text-gray-400">Acompanhe e gerencie todos os projetos da plataforma.</p>
      </div>

      {erroAcao && <div className="mb-4 rounded-xl border border-red-100 bg-red-50 p-3 text-xs font-semibold text-red-600">⚠ {erroAcao}</div>}

      {carregando ? (
        <Loading />
      ) : erro ? (
        <ErrorState message={erro} onRetry={recarregar} />
      ) : projetos.length === 0 ? (
        <EmptyState icon="📁" title="Nenhum projeto cadastrado" />
      ) : (
        <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-gray-100 bg-gray-50 text-xs uppercase tracking-wider text-gray-400">
              <tr>
                <th className="px-5 py-3">Projeto</th>
                <th className="px-5 py-3">Curso</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {projetos.map((p) => (
                <tr key={p.id}>
                  <td className="px-5 py-3 font-semibold text-gray-800">{p.titulo}</td>
                  <td className="px-5 py-3 text-gray-500">{p.curso}</td>
                  <td className="px-5 py-3"><StatusBadge status={p.status} /></td>
                  <td className="px-5 py-3 text-right">
                    <button
                      onClick={() => remover(p.id)}
                      disabled={removendo === p.id}
                      className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50 disabled:opacity-50"
                    >
                      {removendo === p.id ? "Excluindo..." : "Excluir"}
                    </button>
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
