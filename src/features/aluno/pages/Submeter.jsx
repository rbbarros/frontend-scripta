import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { createProjeto, getAlunoPerfil, getProfessores } from "../../../lib/authService";

const AREAS = [
  "Tecnologia da Informação", "Engenharia de Software", "Ciência da Computação",
  "Sistemas de Informação", "Design / UX", "Saúde e Biotecnologia",
  "Gestão e Negócios", "Educação", "Outra",
];

export default function Submeter() {
  const navigate = useNavigate();
  const [perfil, setPerfil] = useState(null);
  const [professores, setProfessores] = useState([]);
  const [form, setForm] = useState({
    titulo: "",
    descricao: "",
    curso: "",
    turma: "",
    semestre: "",
    area_conhecimento: "",
    professor_orientador_id: "",
  });
  const [links, setLinks] = useState([{ tipo: "GitHub", url: "" }]);
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");
  const [salvando, setSalvando] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem("scripta_token")) { navigate("/"); return; }

    getAlunoPerfil().then((data) => {
      setPerfil(data);
      setForm((cur) => ({ ...cur, curso: data.curso || "", turma: data.turma || "", semestre: data.semestre_ingresso || "" }));
    }).catch(() => navigate("/"));

    getProfessores().then(setProfessores).catch(() => setProfessores([]));
  }, [navigate]);

  const handleChange = (field) => (e) => setForm((cur) => ({ ...cur, [field]: e.target.value }));

  const addLink = () => setLinks((cur) => [...cur, { tipo: "GitHub", url: "" }]);
  const removeLink = (i) => setLinks((cur) => cur.filter((_, idx) => idx !== i));
  const updateLink = (i, field, val) => setLinks((cur) => cur.map((l, idx) => idx === i ? { ...l, [field]: val } : l));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro(""); setSucesso("");
    if (!perfil?.id) { setErro("Seu perfil ainda não foi carregado."); return; }
    setSalvando(true);
    try {
      await createProjeto({
        titulo: form.titulo,
        descricao: form.descricao,
        curso: form.curso,
        turma: form.turma,
        semestre: form.semestre,
        area_conhecimento: form.area_conhecimento,
        aluno_responsavel_id: perfil.id,
        professor_orientador_id: Number(form.professor_orientador_id),
      });
      setSucesso("Projeto submetido com sucesso! Ele está agora em análise.");
      setForm((cur) => ({ ...cur, titulo: "", descricao: "", area_conhecimento: "", professor_orientador_id: "" }));
      setLinks([{ tipo: "GitHub", url: "" }]);
    } catch (e) {
      setErro(e.message || "Não foi possível submeter o projeto.");
    } finally {
      setSalvando(false);
    }
  };

  return (
    <section className="mx-auto flex max-w-5xl flex-col gap-6">
      <div className="mb-2">
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Submeter Projeto</h1>
        <p className="mt-2 text-sm text-gray-500">Preencha os dados abaixo para submeter seu projeto integrador</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Formulário Principal */}
        <form onSubmit={handleSubmit} className="lg:col-span-2 bg-white border border-gray-100 rounded-3xl p-8 shadow-sm space-y-6">
          {erro && <div className="rounded-2xl bg-red-50 border border-red-100 p-4 text-sm text-red-700">{erro}</div>}
          {sucesso && (
            <div className="rounded-2xl bg-emerald-50 border border-emerald-100 p-4 text-sm text-emerald-700 flex items-start gap-3">
              <span className="text-lg">✅</span>
              <div><strong>Sucesso!</strong> {sucesso}</div>
            </div>
          )}

          {/* Informações do Projeto */}
          <div>
            <h2 className="text-sm font-bold text-gray-800 uppercase tracking-widest mb-4 pb-2 border-b border-gray-100">
              Informações do Projeto
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Título do Projeto *</label>
                <input
                  value={form.titulo}
                  onChange={handleChange("titulo")}
                  placeholder="Ex: Sistema de IA para diagnóstico médico"
                  className="w-full rounded-xl border border-gray-200 p-3 text-sm outline-none focus:border-[#f19f17] transition-colors"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Descrição *</label>
                <textarea
                  value={form.descricao}
                  onChange={handleChange("descricao")}
                  placeholder="Descreva o objetivo, metodologia e resultados esperados do projeto..."
                  className="w-full rounded-xl border border-gray-200 p-3 text-sm outline-none focus:border-[#f19f17] transition-colors min-h-[120px] resize-none"
                  required
                />
                <p className="text-xs text-gray-400 mt-1">{form.descricao.length} / 1000 caracteres</p>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Área de Conhecimento *</label>
                <select
                  value={form.area_conhecimento}
                  onChange={handleChange("area_conhecimento")}
                  className="w-full rounded-xl border border-gray-200 p-3 text-sm outline-none focus:border-[#f19f17] transition-colors bg-white"
                  required
                >
                  <option value="">Selecione a área...</option>
                  {AREAS.map((a) => <option key={a} value={a}>{a}</option>)}
                </select>
              </div>
            </div>
          </div>

          {/* Dados Acadêmicos */}
          <div>
            <h2 className="text-sm font-bold text-gray-800 uppercase tracking-widest mb-4 pb-2 border-b border-gray-100">
              Dados Acadêmicos
            </h2>
            <div className="grid gap-4 md:grid-cols-3">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Curso *</label>
                <input value={form.curso} onChange={handleChange("curso")} placeholder="Ex: Engenharia de Software" className="w-full rounded-xl border border-gray-200 p-3 text-sm outline-none focus:border-[#f19f17]" required />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Turma *</label>
                <input value={form.turma} onChange={handleChange("turma")} placeholder="Ex: SI3A" className="w-full rounded-xl border border-gray-200 p-3 text-sm outline-none focus:border-[#f19f17]" required />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Semestre *</label>
                <input value={form.semestre} onChange={handleChange("semestre")} placeholder="Ex: 2026.1" className="w-full rounded-xl border border-gray-200 p-3 text-sm outline-none focus:border-[#f19f17]" required />
              </div>
            </div>
            <div className="mt-4">
              <label className="block text-sm font-semibold text-gray-700 mb-1">Professor Orientador *</label>
              <select value={form.professor_orientador_id} onChange={handleChange("professor_orientador_id")} className="w-full rounded-xl border border-gray-200 p-3 text-sm outline-none focus:border-[#f19f17] bg-white" required>
                <option value="">Selecione o professor orientador...</option>
                {professores.map((p) => <option key={p.id} value={p.id}>{p.nome}</option>)}
              </select>
            </div>
          </div>

          {/* Links do Projeto */}
          <div>
            <h2 className="text-sm font-bold text-gray-800 uppercase tracking-widest mb-4 pb-2 border-b border-gray-100">
              Links do Projeto
            </h2>
            <div className="space-y-3">
              {links.map((link, i) => (
                <div key={i} className="flex gap-2 items-center">
                  <select
                    value={link.tipo}
                    onChange={(e) => updateLink(i, "tipo", e.target.value)}
                    className="rounded-xl border border-gray-200 p-3 text-sm outline-none focus:border-[#f19f17] bg-white w-36 shrink-0"
                  >
                    <option>GitHub</option>
                    <option>LinkedIn</option>
                    <option>Figma</option>
                    <option>Deploy</option>
                    <option>Documento</option>
                    <option>Outro</option>
                  </select>
                  <input
                    value={link.url}
                    onChange={(e) => updateLink(i, "url", e.target.value)}
                    placeholder="https://..."
                    className="flex-1 rounded-xl border border-gray-200 p-3 text-sm outline-none focus:border-[#f19f17]"
                  />
                  {links.length > 1 && (
                    <button type="button" onClick={() => removeLink(i)} className="text-red-400 hover:text-red-600 p-2 rounded-lg hover:bg-red-50 shrink-0">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"></path></svg>
                    </button>
                  )}
                </div>
              ))}
              <button type="button" onClick={addLink} className="flex items-center gap-2 text-sm font-semibold text-[#f19f17] hover:text-amber-600 mt-2">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="16"></line><line x1="8" y1="12" x2="16" y2="12"></line></svg>
                Adicionar outro link
              </button>
            </div>
          </div>

          <button
            disabled={salvando}
            className="w-full rounded-xl bg-[#f19f17] py-4 font-bold text-white text-sm disabled:opacity-50 hover:bg-amber-600 transition-colors flex items-center justify-center gap-2"
          >
            {salvando ? (
              <><span className="animate-spin inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full"></span> Enviando...</>
            ) : (
              <><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg> Submeter Projeto</>
            )}
          </button>
        </form>

        {/* Sidebar Dicas */}
        <div className="space-y-5">
          {perfil && (
            <div className="bg-white border border-gray-100 rounded-3xl p-5 shadow-sm">
              <h3 className="text-sm font-bold text-gray-800 mb-4 border-b border-gray-100 pb-2">Submetendo como</h3>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-sm shrink-0">
                  {perfil.nome?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-800">{perfil.nome}</p>
                  <p className="text-xs text-gray-500">{perfil.email}</p>
                </div>
              </div>
            </div>
          )}

          <div className="bg-white border border-gray-100 rounded-3xl p-5 shadow-sm">
            <h3 className="text-sm font-bold text-gray-800 mb-4 border-b border-gray-100 pb-2">💡 Dicas para uma boa submissão</h3>
            <ul className="space-y-3 text-xs text-gray-600">
              <li className="flex items-start gap-2"><span className="text-[#f19f17] mt-0.5">●</span><span>Use um <strong>título claro e descritivo</strong> que identifique bem o projeto.</span></li>
              <li className="flex items-start gap-2"><span className="text-[#f19f17] mt-0.5">●</span><span>A <strong>descrição deve incluir</strong> objetivo, metodologia e resultado esperado.</span></li>
              <li className="flex items-start gap-2"><span className="text-[#f19f17] mt-0.5">●</span><span>Adicione o <strong>link do GitHub</strong> para que os professores possam revisar o código.</span></li>
              <li className="flex items-start gap-2"><span className="text-[#f19f17] mt-0.5">●</span><span>Escolha o professor orientador correto para agilizar a avaliação.</span></li>
            </ul>
          </div>

          <div className="bg-amber-50 border border-amber-100 rounded-3xl p-5">
            <h3 className="text-sm font-bold text-amber-800 mb-3">Ciclo do projeto</h3>
            <div className="space-y-2">
              {["Rascunho", "Submetido", "Em Revisão", "Aprovado / Reprovado"].map((s, i) => (
                <div key={s} className="flex items-center gap-2 text-xs text-amber-700">
                  <span className="w-5 h-5 rounded-full bg-amber-200 flex items-center justify-center font-bold shrink-0">{i + 1}</span>
                  {s}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}