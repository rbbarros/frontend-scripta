import { useState } from "react";
import { getEmpresaPerfil, updateEmpresaPerfil } from "../../../lib/authService";
import { useAuthGuard } from "../../../shared/useAuthGuard";
import { useApiData } from "../../../shared/useApiData";
import { Loading, ErrorState } from "../../../components/ui";

const inputClasse =
  "w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500";

const campos = [
  { key: "nome_empresa", label: "Nome da empresa" },
  { key: "cnpj", label: "CNPJ" },
  { key: "email_contato", label: "E-mail de contato" },
  { key: "setor", label: "Setor" },
];

export default function Perfil() {
  useAuthGuard();
  const { data: perfil, erro, carregando, recarregar } = useApiData(() => getEmpresaPerfil(), []);
  const [editado, setEditado] = useState(null);
  const [salvando, setSalvando] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [erroSalvar, setErroSalvar] = useState("");

  const form = editado ?? perfil ?? {};

  const setCampo = (campo) => (e) => {
    const valor = e.target.value;
    setEditado((prev) => ({ ...(prev ?? perfil ?? {}), [campo]: valor }));
  };

  const salvar = async (e) => {
    e.preventDefault();
    setSalvando(true);
    setFeedback("");
    setErroSalvar("");
    try {
      await updateEmpresaPerfil(form);
      setFeedback("Perfil atualizado com sucesso!");
    } catch (err) {
      setErroSalvar(err.message || "Não foi possível salvar as alterações.");
    } finally {
      setSalvando(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Perfil da Empresa</h1>
        <p className="mt-1 text-sm text-gray-400">Atualize os dados cadastrais da empresa.</p>
      </div>

      {carregando ? (
        <Loading />
      ) : erro ? (
        <ErrorState message={erro} onRetry={recarregar} />
      ) : (
        <form onSubmit={salvar} className="space-y-5 rounded-2xl border border-gray-100 bg-white p-8 shadow-sm">
          {feedback && <div className="rounded-xl border border-emerald-100 bg-emerald-50 p-3 text-xs font-semibold text-emerald-700">✓ {feedback}</div>}
          {erroSalvar && <div className="rounded-xl border border-red-100 bg-red-50 p-3 text-xs font-semibold text-red-600">⚠ {erroSalvar}</div>}

          {campos.map((c) => (
            <div key={c.key}>
              <label className="mb-1.5 block text-sm font-semibold text-gray-700">{c.label}</label>
              <input value={form[c.key] || ""} onChange={setCampo(c.key)} className={inputClasse} />
            </div>
          ))}

          <div className="flex justify-end pt-2">
            <button type="submit" disabled={salvando} className="rounded-xl bg-blue-600 px-8 py-3 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 disabled:opacity-50">
              {salvando ? "Salvando..." : "Salvar alterações"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
