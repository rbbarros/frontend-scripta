import { useMemo, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { getProjeto, listProjetos } from "../../../lib/projetosService";
import { createAvaliacao } from "../../../lib/avaliacoesService";
import { getCurrentUserId } from "../../../lib/session";
import { useAuthGuard } from "../../../shared/useAuthGuard";
import { useApiData } from "../../../shared/useApiData";
import { Loading, EmptyState } from "../../../components/ui";

const conceitos = ["Excelente", "Ótimo", "Bom", "Ainda não suficiente", "Insuficiente"];
const criterios = [
  { key: "nota_inovacao", label: "Inovação" },
  { key: "nota_tecnica", label: "Qualidade Técnica" },
  { key: "nota_aplicabilidade", label: "Aplicabilidade" },
  { key: "nota_clareza", label: "Clareza" },
];

const inputClasse =
  "w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500";

export default function RealizarAvaliacao() {
  useAuthGuard();
  const [searchParams] = useSearchParams();
  const projetoId = searchParams.get("projeto");

  const { data: projeto } = useApiData(
    () => (projetoId ? getProjeto(projetoId) : Promise.resolve(null)),
    [projetoId],
  );
  const { data: listaData, carregando: carregandoLista } = useApiData(
    () => (projetoId ? Promise.resolve(null) : listProjetos({ status: "submetido" })),
    [projetoId],
  );

  const [notas, setNotas] = useState({
    nota_inovacao: "",
    nota_tecnica: "",
    nota_aplicabilidade: "",
    nota_clareza: "",
  });
  const [conceito, setConceito] = useState("");
  const [parecer, setParecer] = useState("");
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");
  const [enviando, setEnviando] = useState(false);

  const media = useMemo(() => {
    const valores = criterios.map((c) => Number(notas[c.key])).filter((n) => !Number.isNaN(n) && n > 0);
    if (valores.length === 0) return 0;
    return valores.reduce((a, b) => a + b, 0) / valores.length;
  }, [notas]);

  const setNota = (key) => (e) => setNotas((prev) => ({ ...prev, [key]: e.target.value }));

  const enviar = async (e) => {
    e.preventDefault();
    setErro("");
    setSucesso("");
    setEnviando(true);
    try {
      await createAvaliacao({
        projeto_id: Number(projetoId),
        professor_id: getCurrentUserId(),
        nota_inovacao: Number(notas.nota_inovacao),
        nota_tecnica: Number(notas.nota_tecnica),
        nota_aplicabilidade: Number(notas.nota_aplicabilidade),
        nota_clareza: Number(notas.nota_clareza),
        media_geral: Number(media.toFixed(2)),
        conceito,
        parecer_descritivo: parecer,
      });
      setSucesso("Avaliação registrada com sucesso!");
    } catch (err) {
      setErro(err.message || "Não foi possível salvar a avaliação.");
    } finally {
      setEnviando(false);
    }
  };

  if (!projetoId) {
    const lista = Array.isArray(listaData) ? listaData : listaData?.itens || [];
    return (
      <>
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Avaliar Projetos</h1>
          <p className="mt-1 text-sm text-gray-400">Selecione um projeto para iniciar a avaliação.</p>
        </div>
        {carregandoLista ? (
          <Loading />
        ) : lista.length === 0 ? (
          <EmptyState icon="📝" title="Nenhum projeto aguardando avaliação" description="Volte mais tarde." />
        ) : (
          <div className="space-y-3">
            {lista.map((p) => (
              <Link
                key={p.id}
                to={`/professor/avaliacoes?projeto=${p.id}`}
                className="flex items-center justify-between rounded-2xl border border-gray-100 bg-white p-4 shadow-sm hover:border-purple-300"
              >
                <div>
                  <p className="text-sm font-bold text-gray-800">{p.titulo}</p>
                  <p className="text-xs text-gray-400">{p.curso}</p>
                </div>
                <span className="text-purple-600">→</span>
              </Link>
            ))}
          </div>
        )}
      </>
    );
  }

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Avaliação de Projeto</h1>
        <p className="mt-1 text-sm text-gray-400">Atribua as notas por critério e registre o parecer técnico.</p>
      </div>

      <div className="mb-6 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
        <span className="rounded-md bg-amber-50 px-2 py-1 text-xs font-bold uppercase tracking-wider text-[#f19f17]">
          Aguardando Nota
        </span>
        <h2 className="mt-2 text-lg font-bold text-gray-800">{projeto?.titulo || "Carregando projeto..."}</h2>
        <p className="mt-0.5 text-xs text-gray-400">
          {projeto?.curso}
          {projeto?.area_conhecimento && ` • ${projeto.area_conhecimento}`}
        </p>
        {projeto?.descricao && <p className="mt-3 text-sm text-gray-500">{projeto.descricao}</p>}
      </div>

      {erro && <div className="mb-4 rounded-xl border border-red-100 bg-red-50 p-3 text-xs font-semibold text-red-600">⚠ {erro}</div>}
      {sucesso && <div className="mb-4 rounded-xl border border-emerald-100 bg-emerald-50 p-3 text-xs font-semibold text-emerald-700">✓ {sucesso}</div>}

      <form onSubmit={enviar} className="space-y-6 rounded-2xl border border-gray-100 bg-white p-8 shadow-sm">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          {criterios.map((c) => (
            <div key={c.key}>
              <label className="mb-1.5 block text-sm font-semibold text-gray-700">{c.label} (0 a 10)</label>
              <input
                type="number"
                min="0"
                max="10"
                step="0.1"
                required
                value={notas[c.key]}
                onChange={setNota(c.key)}
                className={inputClasse}
              />
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-sm font-semibold text-gray-700">Média Geral</label>
            <div className="rounded-xl border border-gray-100 bg-gray-50 px-4 py-2.5 text-sm font-bold text-purple-600">
              {media.toFixed(2)}
            </div>
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-semibold text-gray-700">Conceito</label>
            <select required value={conceito} onChange={(e) => setConceito(e.target.value)} className={inputClasse}>
              <option value="">Selecione o conceito...</option>
              {conceitos.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-semibold text-gray-700">Parecer Descritivo</label>
          <textarea
            rows="5"
            value={parecer}
            onChange={(e) => setParecer(e.target.value)}
            placeholder="Justifique o conceito com base nas diretrizes técnicas de arquitetura, código e entrega..."
            className={`${inputClasse} resize-none`}
          />
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <Link to="/professor/projetos" className="rounded-xl border border-gray-200 px-6 py-3 text-sm font-semibold text-gray-600 hover:bg-gray-50">
            Voltar
          </Link>
          <button type="submit" disabled={enviando} className="rounded-xl bg-purple-600 px-8 py-3 text-sm font-semibold text-white shadow-sm hover:bg-purple-700 disabled:opacity-50">
            {enviando ? "Salvando..." : "Salvar Avaliação"}
          </button>
        </div>
      </form>
    </div>
  );
}
