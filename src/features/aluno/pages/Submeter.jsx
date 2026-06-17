import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createProjeto } from "../../../lib/projetosService";
import { getCurrentUserId } from "../../../lib/session";
import { useAuthGuard } from "../../../shared/useAuthGuard";

const campoClasse =
  "w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#f19f17]";

export default function Submeter() {
  useAuthGuard();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    titulo: "",
    descricao: "",
    curso: "",
    turma: "",
    semestre: "",
    area_conhecimento: "",
    professor_orientador_id: "",
  });
  const [links, setLinks] = useState([{ descricao: "", url: "" }]);
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");
  const [enviando, setEnviando] = useState(false);

  const setCampo = (campo) => (e) =>
    setForm((prev) => ({ ...prev, [campo]: e.target.value }));

  const setLink = (index, campo) => (e) =>
    setLinks((prev) =>
      prev.map((l, i) => (i === index ? { ...l, [campo]: e.target.value } : l)),
    );

  const addLink = () => setLinks((prev) => [...prev, { descricao: "", url: "" }]);
  const removeLink = (index) => setLinks((prev) => prev.filter((_, i) => i !== index));

  const enviar = async (e) => {
    e.preventDefault();
    setErro("");
    setSucesso("");
    setEnviando(true);

    try {
      await createProjeto({
        ...form,
        professor_orientador_id: form.professor_orientador_id
          ? Number(form.professor_orientador_id)
          : null,
        aluno_responsavel_id: getCurrentUserId(),
        status: "submetido",
        links: links.filter((l) => l.url.trim()),
      });
      setSucesso("Projeto submetido com sucesso!");
      setTimeout(() => navigate("/aluno/projetos"), 800);
    } catch (err) {
      setErro(err.message || "Não foi possível submeter o projeto.");
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Submeter Projeto</h1>
        <p className="mt-1 text-sm text-gray-400">Preencha as informações do seu projeto integrador para submissão.</p>
      </div>

      {erro && (
        <div className="mb-5 rounded-xl border border-red-100 bg-red-50 p-3.5 text-xs font-semibold text-red-600">
          ⚠ {erro}
        </div>
      )}
      {sucesso && (
        <div className="mb-5 rounded-xl border border-emerald-100 bg-emerald-50 p-3.5 text-xs font-semibold text-emerald-700">
          ✓ {sucesso}
        </div>
      )}

      <form onSubmit={enviar} className="space-y-6 rounded-2xl border border-gray-100 bg-white p-8 shadow-sm">
        <h2 className="text-base font-bold text-gray-800">Informações do Projeto</h2>

        <div>
          <label className="mb-1.5 block text-sm font-semibold text-gray-700">Título do Projeto</label>
          <input value={form.titulo} onChange={setCampo("titulo")} required placeholder="Digite o título do projeto" className={campoClasse} />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-semibold text-gray-700">Descrição</label>
          <textarea
            value={form.descricao}
            onChange={setCampo("descricao")}
            required
            rows="5"
            placeholder="Descreva o objetivo, metodologia e principais resultados do projeto..."
            className={`${campoClasse} resize-none`}
          />
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-sm font-semibold text-gray-700">Curso</label>
            <input value={form.curso} onChange={setCampo("curso")} required placeholder="Ex.: Análise e Desenvolvimento de Sistemas" className={campoClasse} />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-semibold text-gray-700">Turma</label>
            <input value={form.turma} onChange={setCampo("turma")} required placeholder="Ex.: ADS-1A" className={campoClasse} />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-semibold text-gray-700">Semestre</label>
            <input value={form.semestre} onChange={setCampo("semestre")} required placeholder="Ex.: 2025.1" className={campoClasse} />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-semibold text-gray-700">Área de conhecimento</label>
            <input value={form.area_conhecimento} onChange={setCampo("area_conhecimento")} required placeholder="Ex.: Inteligência Artificial" className={campoClasse} />
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-semibold text-gray-700">ID do Professor Orientador</label>
          <input
            type="number"
            value={form.professor_orientador_id}
            onChange={setCampo("professor_orientador_id")}
            required
            placeholder="Ex.: 1"
            className={campoClasse}
          />
        </div>

        <div>
          <div className="mb-1.5 flex items-center justify-between">
            <label className="text-sm font-semibold text-gray-700">🔗 Links do Projeto</label>
            <button type="button" onClick={addLink} className="text-xs font-semibold text-[#f19f17] hover:underline">
              + Adicionar link
            </button>
          </div>
          <div className="space-y-2">
            {links.map((link, i) => (
              <div key={i} className="flex gap-2">
                <input value={link.descricao} onChange={setLink(i, "descricao")} placeholder="Rótulo (ex.: GitHub)" className={`${campoClasse} w-1/3`} />
                <input value={link.url} onChange={setLink(i, "url")} placeholder="https://..." className={campoClasse} />
                {links.length > 1 && (
                  <button type="button" onClick={() => removeLink(i)} className="rounded-xl border border-gray-200 px-3 text-gray-400 hover:text-red-500">
                    ✕
                  </button>
                )}
              </div>
            ))}
          </div>
          <p className="mt-1 text-xs text-gray-400">Adicione links relevantes como repositório, protótipo, vídeo de demonstração, etc.</p>
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <button type="button" onClick={() => navigate("/aluno")} className="rounded-xl border border-gray-200 px-6 py-3 text-sm font-semibold text-gray-600 hover:bg-gray-50">
            Cancelar
          </button>
          <button type="submit" disabled={enviando} className="rounded-xl bg-[#f19f17] px-8 py-3 text-sm font-semibold text-white shadow-sm disabled:opacity-50">
            {enviando ? "Enviando..." : "Submeter Projeto"}
          </button>
        </div>
      </form>
    </div>
  );
}
