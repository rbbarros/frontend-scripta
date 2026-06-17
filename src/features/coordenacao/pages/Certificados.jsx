import { useState } from "react";
import { listCertificados, emitirCertificado, deleteCertificado } from "../../../lib/certificadosService";
import { useAuthGuard } from "../../../shared/useAuthGuard";
import { useApiData } from "../../../shared/useApiData";
import { Loading, ErrorState, EmptyState } from "../../../components/ui";

const inputClasse =
  "w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500";

export default function Certificados() {
  useAuthGuard();
  const { data, erro, carregando, recarregar } = useApiData(() => listCertificados(), []);
  const certificados = Array.isArray(data) ? data : data?.itens || [];

  const [form, setForm] = useState({ projeto_id: "", aluno_id: "", codigo_autenticidade: "" });
  const [emitindo, setEmitindo] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [erroAcao, setErroAcao] = useState("");

  const setCampo = (campo) => (e) => setForm((prev) => ({ ...prev, [campo]: e.target.value }));

  const emitir = async (e) => {
    e.preventDefault();
    setEmitindo(true);
    setFeedback("");
    setErroAcao("");
    try {
      await emitirCertificado({
        projeto_id: Number(form.projeto_id),
        aluno_id: Number(form.aluno_id),
        codigo_autenticidade: form.codigo_autenticidade,
      });
      setFeedback("Certificado emitido com sucesso!");
      setForm({ projeto_id: "", aluno_id: "", codigo_autenticidade: "" });
      recarregar();
    } catch (err) {
      setErroAcao(err.message || "Não foi possível emitir o certificado.");
    } finally {
      setEmitindo(false);
    }
  };

  const remover = async (id) => {
    if (!window.confirm("Remover este certificado?")) return;
    try {
      await deleteCertificado(id);
      recarregar();
    } catch (err) {
      setErroAcao(err.message || "Não foi possível remover o certificado.");
    }
  };

  return (
    <>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Certificados</h1>
        <p className="mt-1 text-sm text-gray-400">Emita e gerencie os certificados dos projetos concluídos.</p>
      </div>

      {feedback && <div className="mb-4 rounded-xl border border-emerald-100 bg-emerald-50 p-3 text-xs font-semibold text-emerald-700">✓ {feedback}</div>}
      {erroAcao && <div className="mb-4 rounded-xl border border-red-100 bg-red-50 p-3 text-xs font-semibold text-red-600">⚠ {erroAcao}</div>}

      <form onSubmit={emitir} className="mb-8 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-bold text-gray-800">Emitir Certificado</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <input type="number" required value={form.projeto_id} onChange={setCampo("projeto_id")} placeholder="ID do projeto" className={inputClasse} />
          <input type="number" required value={form.aluno_id} onChange={setCampo("aluno_id")} placeholder="ID do aluno" className={inputClasse} />
          <input required value={form.codigo_autenticidade} onChange={setCampo("codigo_autenticidade")} placeholder="Código de autenticidade" className={inputClasse} />
        </div>
        <div className="mt-4 flex justify-end">
          <button type="submit" disabled={emitindo} className="rounded-xl bg-emerald-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-50">
            {emitindo ? "Emitindo..." : "Emitir"}
          </button>
        </div>
      </form>

      {carregando ? (
        <Loading />
      ) : erro ? (
        <ErrorState message={erro} onRetry={recarregar} />
      ) : certificados.length === 0 ? (
        <EmptyState icon="🎖️" title="Nenhum certificado emitido" />
      ) : (
        <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-gray-100 bg-gray-50 text-xs uppercase tracking-wider text-gray-400">
              <tr>
                <th className="px-5 py-3">Projeto</th>
                <th className="px-5 py-3">Código</th>
                <th className="px-5 py-3">Emissão</th>
                <th className="px-5 py-3 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {certificados.map((c) => (
                <tr key={c.id}>
                  <td className="px-5 py-3 font-semibold text-gray-800">{c.titulo_projeto || c.projeto?.titulo || `#${c.projeto_id}`}</td>
                  <td className="px-5 py-3 text-gray-500">{c.codigo_autenticidade}</td>
                  <td className="px-5 py-3 text-gray-500">{c.data_emissao && new Date(c.data_emissao).toLocaleDateString("pt-BR")}</td>
                  <td className="px-5 py-3 text-right">
                    <button onClick={() => remover(c.id)} className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50">
                      Remover
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
