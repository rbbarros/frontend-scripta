import { useState } from "react";
import { listPortfolios } from "../../../lib/portfoliosService";
import { createContato } from "../../../lib/contatosService";
import { getCurrentUserId } from "../../../lib/session";
import { useAuthGuard } from "../../../shared/useAuthGuard";
import { useApiData } from "../../../shared/useApiData";
import { Loading, ErrorState, EmptyState } from "../../../components/ui";

const inputClasse =
  "w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500";

export default function Talentos() {
  useAuthGuard();
  const { data, erro, carregando, recarregar } = useApiData(
    () => listPortfolios({ visibilidade: "publico" }),
    [],
  );
  const portfolios = Array.isArray(data) ? data : data?.itens || [];

  const [alvo, setAlvo] = useState(null);
  const [form, setForm] = useState({ assunto: "", mensagem: "" });
  const [enviando, setEnviando] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [erroEnvio, setErroEnvio] = useState("");

  const abrir = (portfolio) => {
    setAlvo(portfolio);
    setForm({ assunto: "", mensagem: "" });
    setFeedback("");
    setErroEnvio("");
  };

  const enviar = async (e) => {
    e.preventDefault();
    setEnviando(true);
    setFeedback("");
    setErroEnvio("");
    try {
      await createContato({
        empresa_id: getCurrentUserId(),
        aluno_id: alvo.aluno_id,
        assunto: form.assunto,
        mensagem: form.mensagem,
      });
      setFeedback("Contato enviado com sucesso!");
      setForm({ assunto: "", mensagem: "" });
    } catch (err) {
      setErroEnvio(err.message || "Não foi possível enviar o contato.");
    } finally {
      setEnviando(false);
    }
  };

  return (
    <>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Identificar Talentos</h1>
        <p className="mt-1 text-sm text-gray-400">Portfólios públicos de alunos disponíveis para contato.</p>
      </div>

      {carregando ? (
        <Loading />
      ) : erro ? (
        <ErrorState message={erro} onRetry={recarregar} />
      ) : portfolios.length === 0 ? (
        <EmptyState icon="🎯" title="Nenhum talento disponível" description="Ainda não há portfólios públicos." />
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {portfolios.map((p) => (
            <article key={p.id} className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-white">👤</div>
                <div>
                  <h3 className="text-sm font-bold text-gray-800">{p.aluno_nome || p.aluno?.nome || "Aluno"}</h3>
                  <p className="text-xs text-gray-400">{p.aluno_curso || p.aluno?.curso}</p>
                </div>
              </div>
              <p className="mt-3 text-xs text-gray-500">
                {p.titulo_projeto || p.projeto?.titulo || "Projeto publicado"}
              </p>
              <button
                onClick={() => abrir(p)}
                className="mt-4 w-full rounded-xl bg-blue-600 py-2 text-xs font-semibold text-white hover:bg-blue-700"
              >
                ✉️ Contatar aluno
              </button>
            </article>
          ))}
        </div>
      )}

      {alvo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={() => setAlvo(null)}>
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-800">Contatar {alvo.aluno_nome || alvo.aluno?.nome || "aluno"}</h2>
              <button onClick={() => setAlvo(null)} className="text-gray-400 hover:text-gray-600">✕</button>
            </div>

            {feedback && <div className="mb-3 rounded-xl border border-emerald-100 bg-emerald-50 p-3 text-xs font-semibold text-emerald-700">✓ {feedback}</div>}
            {erroEnvio && <div className="mb-3 rounded-xl border border-red-100 bg-red-50 p-3 text-xs font-semibold text-red-600">⚠ {erroEnvio}</div>}

            <form onSubmit={enviar} className="space-y-4">
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-gray-700">Assunto</label>
                <input
                  required
                  value={form.assunto}
                  onChange={(e) => setForm((prev) => ({ ...prev, assunto: e.target.value }))}
                  className={inputClasse}
                  placeholder="Ex.: Oportunidade de estágio"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-gray-700">Mensagem</label>
                <textarea
                  required
                  rows="4"
                  value={form.mensagem}
                  onChange={(e) => setForm((prev) => ({ ...prev, mensagem: e.target.value }))}
                  className={`${inputClasse} resize-none`}
                  placeholder="Escreva sua mensagem para o aluno..."
                />
              </div>
              <button type="submit" disabled={enviando} className="w-full rounded-xl bg-blue-600 py-3 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50">
                {enviando ? "Enviando..." : "Enviar contato"}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
