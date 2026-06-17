import { useState } from "react";
import { getAlunoPerfil, updateAlunoPerfil } from "../../../lib/authService";
import { useAuthGuard } from "../../../shared/useAuthGuard";
import { useApiData } from "../../../shared/useApiData";
import { Loading, ErrorState } from "../../../components/ui";

const campoClasse =
  "w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#f19f17]";

const campos = [
  { key: "nome", label: "Nome" },
  { key: "email", label: "E-mail" },
  { key: "curso", label: "Curso" },
  { key: "turma", label: "Turma" },
  { key: "semestre_ingresso", label: "Semestre de ingresso" },
  { key: "linkedin_url", label: "LinkedIn" },
  { key: "github_url", label: "GitHub" },
  { key: "competencias", label: "Competências" },
];

export default function Perfil() {
  useAuthGuard();
  const { data: perfil, erro, carregando, recarregar } = useApiData(() => getAlunoPerfil(), []);

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
      await updateAlunoPerfil(form);
      setFeedback("Perfil atualizado com sucesso!");
    } catch (err) {
      setErroSalvar(err.message || "Não foi possível salvar as alterações.");
    } finally {
      setSalvando(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Meu Perfil</h1>
        <p className="mt-1 text-sm text-gray-400">Atualize suas informações cadastrais e links profissionais.</p>
      </div>

      {carregando ? (
        <Loading />
      ) : erro ? (
        <ErrorState message={erro} onRetry={recarregar} />
      ) : (
        <form onSubmit={salvar} className="space-y-5 rounded-2xl border border-gray-100 bg-white p-8 shadow-sm">
          {feedback && (
            <div className="rounded-xl border border-emerald-100 bg-emerald-50 p-3 text-xs font-semibold text-emerald-700">
              ✓ {feedback}
            </div>
          )}
          {erroSalvar && (
            <div className="rounded-xl border border-red-100 bg-red-50 p-3 text-xs font-semibold text-red-600">
              ⚠ {erroSalvar}
            </div>
          )}

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            {campos.map((c) => (
              <div key={c.key} className={c.key === "competencias" ? "md:col-span-2" : ""}>
                <label className="mb-1.5 block text-sm font-semibold text-gray-700">{c.label}</label>
                <input value={form[c.key] || ""} onChange={setCampo(c.key)} className={campoClasse} />
              </div>
            ))}
          </div>

          <div className="flex justify-end pt-2">
            <button type="submit" disabled={salvando} className="rounded-xl bg-[#f19f17] px-8 py-3 text-sm font-semibold text-white shadow-sm disabled:opacity-50">
              {salvando ? "Salvando..." : "Salvar alterações"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
