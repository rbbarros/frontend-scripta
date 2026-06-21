import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { createProjeto } from "../../../lib/authService";

export default function Submeter() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    titulo: "",
    descricao: "",
    area: "",
    links: [{ rotulo: "", url: "" }],
    integrantes: [""]
  });
  const [loading, setLoading] = useState(false);

  const handleAddLink = () => {
    setFormData({ ...formData, links: [...formData.links, { rotulo: "", url: "" }] });
  };

  const handleLinkChange = (index, field, value) => {
    const newLinks = [...formData.links];
    newLinks[index][field] = value;
    setFormData({ ...formData, links: newLinks });
  };

  const handleAddIntegrante = () => {
    setFormData({ ...formData, integrantes: [...formData.integrantes, ""] });
  };

  const handleIntegranteChange = (index, value) => {
    const newIntegrantes = [...formData.integrantes];
    newIntegrantes[index] = value;
    setFormData({ ...formData, integrantes: newIntegrantes });
  };

  const handleSubmit = async (e, isDraft = false) => {
    e.preventDefault();
    if (!formData.titulo) {
      alert("O título do projeto é obrigatório.");
      return;
    }
    
    setLoading(true);
    try {
      // Adapte os campos conforme o payload do backend
      await createProjeto({
        titulo: formData.titulo,
        descricao: formData.descricao,
        area: formData.area,
        status: isDraft ? "Rascunho" : "Aguardando avaliação",
        arquivos: "[]", // placeholder
        integrantes: JSON.stringify(formData.integrantes)
      });
      alert(isDraft ? "Rascunho salvo com sucesso!" : "Projeto submetido com sucesso!");
      navigate("/aluno/projetos");
    } catch (err) {
      alert("Erro ao submeter o projeto. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-in fade-in zoom-in-95 duration-200 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Submeter Projeto</h1>
        <p className="text-sm text-gray-500 mt-1">Preencha as informações do seu projeto integrador para submissão</p>
      </div>

      <form className="space-y-8" onSubmit={(e) => handleSubmit(e, false)}>
        {/* Informações do Projeto */}
        <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm">
          <h2 className="text-lg font-bold text-gray-800 mb-6">Informações do Projeto</h2>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Título do Projeto</label>
              <input
                required
                type="text"
                placeholder="Digite o título do projeto"
                className="w-full p-4 border border-gray-200 rounded-xl text-sm outline-none focus:border-[#f19f17] focus:ring-2 focus:ring-amber-50 transition-all"
                value={formData.titulo}
                onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Descrição</label>
              <textarea
                rows="4"
                placeholder="Descreva o objetivo, metodologia e principais resultados do projeto..."
                className="w-full p-4 border border-gray-200 rounded-xl text-sm outline-none focus:border-[#f19f17] focus:ring-2 focus:ring-amber-50 transition-all resize-none"
                value={formData.descricao}
                onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
              ></textarea>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Área de conhecimento</label>
              <select
                className="w-full p-4 border border-gray-200 rounded-xl text-sm outline-none focus:border-[#f19f17] focus:ring-2 focus:ring-amber-50 transition-all text-gray-600 bg-white"
                value={formData.area}
                onChange={(e) => setFormData({ ...formData, area: e.target.value })}
              >
                <option value="">Selecione uma área</option>
                <option value="Tecnologia da Informação">Tecnologia da Informação</option>
                <option value="Engenharia de Software">Engenharia de Software</option>
                <option value="Sistemas de Informação">Sistemas de Informação</option>
                <option value="Design Digital">Design Digital</option>
              </select>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-bold text-gray-700 flex items-center gap-2">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#f19f17]"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>
                  Links do Projeto
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

        {/* Integrantes */}
        <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#f19f17]"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
              Integrantes
            </h2>
            <button type="button" onClick={handleAddIntegrante} className="px-4 py-1.5 text-xs font-semibold text-[#f19f17] border border-[#f19f17] rounded-lg hover:bg-amber-50 transition-colors">
              + Adicionar
            </button>
          </div>
          
          <div className="space-y-3">
            {formData.integrantes.map((nome, idx) => (
              <input
                key={idx}
                type="text"
                placeholder="Nome do integrante"
                className="w-full p-4 border border-gray-200 rounded-xl text-sm outline-none focus:border-[#f19f17] transition-all"
                value={nome}
                onChange={(e) => handleIntegranteChange(idx, e.target.value)}
              />
            ))}
          </div>
        </div>

        {/* Arquivos do Projeto */}
        <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm">
          <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2 mb-6">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#f19f17]"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
            Arquivos do Projeto
          </h2>
          
          <div className="border-2 border-dashed border-gray-200 rounded-2xl p-12 text-center hover:bg-gray-50 transition-colors cursor-pointer group">
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-gray-500 mx-auto mb-4 group-hover:bg-amber-100 group-hover:text-[#f19f17] transition-colors">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
            </div>
            <p className="text-sm text-gray-600 mb-1">
              Arraste e solte seus arquivos aqui ou <span className="text-[#f19f17] font-semibold">clique para selecionar</span>
            </p>
            <p className="text-xs text-gray-400">PDF, DOCX, PPTX - Máximo 50MB por arquivo</p>
          </div>
        </div>

        {/* Botões */}
        <div className="flex items-center justify-end gap-4 pt-4">
          <button
            type="button"
            onClick={(e) => handleSubmit(e, true)}
            disabled={loading}
            className="px-6 py-3 rounded-xl font-bold text-[#f19f17] border border-[#f19f17] hover:bg-amber-50 transition-colors disabled:opacity-50"
          >
            Salvar Rascunho
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-8 py-3 rounded-xl font-bold text-white bg-[#f19f17] hover:bg-[#d68a12] transition-colors disabled:opacity-50 shadow-md shadow-amber-500/20"
          >
            {loading ? "Enviando..." : "Submeter Projeto"}
          </button>
        </div>
      </form>
    </div>
  );
}