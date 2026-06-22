import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { createProjeto, getAlunoPerfil, getProfessores, addIntegranteAoProjeto } from "../../../lib/authService";

export default function Submeter() {
  const navigate = useNavigate();
  const [perfil, setPerfil] = useState(null);
  const [professores, setProfessores] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    titulo: "",
    descricao: "",
    curso: "",
    turma: "",
    semestre: "",
    area_conhecimento: "",
    professor_orientador_id: "",
    links: [{ rotulo: "", url: "" }],
  });

  useEffect(() => {
    if (!localStorage.getItem("scripta_token")) { navigate("/"); return; }
    getAlunoPerfil()
      .then((data) => {
        setPerfil(data);
        // Pré-preenche curso com o do perfil do aluno
        setFormData((prev) => ({ ...prev, curso: data.curso || "" }));
      })
      .catch(() => { navigate("/"); });
    getProfessores().then(setProfessores).catch(() => setProfessores([]));
  }, [navigate]);

  const handleAddLink = () => {
    setFormData({ ...formData, links: [...formData.links, { rotulo: "", url: "" }] });
  };

  const handleLinkChange = (index, field, value) => {
    const newLinks = [...formData.links];
    newLinks[index][field] = value;
    setFormData({ ...formData, links: newLinks });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!perfil?.id) { alert("Perfil não carregado, tente novamente."); return; }
    if (!formData.professor_orientador_id) { alert("Selecione um professor orientador."); return; }

    setLoading(true);
    try {
      const payload = {
        titulo: formData.titulo,
        descricao: formData.descricao,
        curso: formData.curso,
        turma: formData.turma,
        semestre: formData.semestre,
        area_conhecimento: formData.area_conhecimento,
        aluno_responsavel_id: perfil.id,
        professor_orientador_id: Number(formData.professor_orientador_id),
      };
      await createProjeto(payload);
      alert("Projeto submetido com sucesso!");
      navigate("/aluno/projetos");
    } catch (err) {
      alert("Erro ao submeter o projeto: " + (err.message || "Tente novamente."));
    } finally {
      setLoading(false);
    }
  };

  const areas = [
    "Tecnologia da Informação",
    "Engenharia de Software",
    "Sistemas de Informação",
    "Design Digital",
    "Ciência da Computação",
    "Gestão de TI",
  ];

  const semestres = ["1", "2", "3", "4", "5", "6", "7", "8"];

  return (
    <div className="animate-in fade-in zoom-in-95 duration-200 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Submeter Projeto</h1>
        <p className="text-sm text-gray-500 mt-1">Preencha as informações do seu projeto integrador para submissão</p>
      </div>

      <form className="space-y-8" onSubmit={handleSubmit}>
        {/* Informações do Projeto */}
        <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm">
          <h2 className="text-lg font-bold text-gray-800 mb-6">Informações do Projeto</h2>

          <div className="space-y-6">
            {/* Título */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Título do Projeto *</label>
              <input
                required
                type="text"
                placeholder="Digite o título do projeto"
                className="w-full p-4 border border-gray-200 rounded-xl text-sm outline-none focus:border-[#f19f17] focus:ring-2 focus:ring-amber-50 transition-all"
                value={formData.titulo}
                onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
              />
            </div>

            {/* Descrição */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Descrição *</label>
              <textarea
                required
                rows="4"
                placeholder="Descreva o objetivo, metodologia e principais resultados do projeto..."
                className="w-full p-4 border border-gray-200 rounded-xl text-sm outline-none focus:border-[#f19f17] focus:ring-2 focus:ring-amber-50 transition-all resize-none"
                value={formData.descricao}
                onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
              ></textarea>
            </div>

            {/* Curso + Turma */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Curso *</label>
                <input
                  required
                  type="text"
                  placeholder="Ex: Engenharia de Software"
                  className="w-full p-4 border border-gray-200 rounded-xl text-sm outline-none focus:border-[#f19f17] transition-all"
                  value={formData.curso}
                  onChange={(e) => setFormData({ ...formData, curso: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Turma *</label>
                <input
                  required
                  type="text"
                  placeholder="Ex: ESW-2A"
                  className="w-full p-4 border border-gray-200 rounded-xl text-sm outline-none focus:border-[#f19f17] transition-all"
                  value={formData.turma}
                  onChange={(e) => setFormData({ ...formData, turma: e.target.value })}
                />
              </div>
            </div>

            {/* Semestre + Área */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Semestre *</label>
                <select
                  required
                  className="w-full p-4 border border-gray-200 rounded-xl text-sm outline-none focus:border-[#f19f17] transition-all text-gray-600 bg-white"
                  value={formData.semestre}
                  onChange={(e) => setFormData({ ...formData, semestre: e.target.value })}
                >
                  <option value="">Selecione o semestre</option>
                  {semestres.map((s) => (
                    <option key={s} value={s}>{s}º Semestre</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Área de Conhecimento *</label>
                <select
                  required
                  className="w-full p-4 border border-gray-200 rounded-xl text-sm outline-none focus:border-[#f19f17] transition-all text-gray-600 bg-white"
                  value={formData.area_conhecimento}
                  onChange={(e) => setFormData({ ...formData, area_conhecimento: e.target.value })}
                >
                  <option value="">Selecione uma área</option>
                  {areas.map((a) => (
                    <option key={a} value={a}>{a}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Professor Orientador */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Professor Orientador *</label>
              <select
                required
                className="w-full p-4 border border-gray-200 rounded-xl text-sm outline-none focus:border-[#f19f17] transition-all text-gray-600 bg-white"
                value={formData.professor_orientador_id}
                onChange={(e) => setFormData({ ...formData, professor_orientador_id: e.target.value })}
              >
                <option value="">Selecione o professor orientador</option>
                {professores.map((p) => (
                  <option key={p.id} value={p.id}>{p.nome}</option>
                ))}
              </select>
            </div>

            {/* Links do Projeto */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-bold text-gray-700 flex items-center gap-2">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#f19f17]">
                    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
                    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
                  </svg>
                  Links do Projeto (opcional)
                </label>
                <button type="button" onClick={handleAddLink} className="text-sm font-semibold text-[#f19f17] hover:text-[#d68a12] transition-colors">
                  + Adicionar link
                </button>
              </div>
              <div className="space-y-3">
                {formData.links.map((link, idx) => (
                  <div key={idx} className="flex gap-3">
                    <input
                      type="text"
                      placeholder="Rótulo (ex: GitHub, Figma)"
                      className="w-1/3 p-3 border border-gray-200 rounded-xl text-sm outline-none focus:border-[#f19f17] transition-all"
                      value={link.rotulo}
                      onChange={(e) => handleLinkChange(idx, "rotulo", e.target.value)}
                    />
                    <input
                      type="url"
                      placeholder="https://..."
                      className="flex-1 p-3 border border-gray-200 rounded-xl text-sm outline-none focus:border-[#f19f17] transition-all"
                      value={link.url}
                      onChange={(e) => handleLinkChange(idx, "url", e.target.value)}
                    />
                  </div>
                ))}
              </div>
              <p className="text-xs text-gray-400 mt-2">Adicione links relevantes como repositório, protótipo, vídeo de demonstração, etc.</p>
            </div>
          </div>
        </div>

        {/* Arquivos do Projeto */}
        <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm">
          <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2 mb-6">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#f19f17]">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
              <polyline points="14 2 14 8 20 8"></polyline>
            </svg>
            Arquivos do Projeto
          </h2>

          <div className="border-2 border-dashed border-gray-200 rounded-2xl p-12 text-center hover:bg-gray-50 transition-colors cursor-pointer group">
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-gray-500 mx-auto mb-4 group-hover:bg-amber-100 group-hover:text-[#f19f17] transition-colors">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="17 8 12 3 7 8"></polyline>
                <line x1="12" y1="3" x2="12" y2="15"></line>
              </svg>
            </div>
            <p className="text-sm text-gray-600 mb-1">
              Arraste e solte seus arquivos aqui ou <span className="text-[#f19f17] font-semibold">clique para selecionar</span>
            </p>
            <p className="text-xs text-gray-400">PDF, DOCX, PPTX - Máximo 50MB por arquivo</p>
          </div>
        </div>

        {/* Botões */}
        <div className="flex items-center justify-between pt-4">
          <Link to="/aluno/projetos" className="text-sm font-semibold text-gray-500 hover:text-gray-800 transition-colors">
            ← Voltar para Meus Projetos
          </Link>
          <div className="flex items-center gap-4">
            <button
              type="submit"
              disabled={loading}
              className="px-8 py-3 rounded-xl font-bold text-white bg-[#f19f17] hover:bg-[#d68a12] transition-colors disabled:opacity-50 shadow-md shadow-amber-500/20"
            >
              {loading ? "Enviando..." : "Submeter Projeto"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}