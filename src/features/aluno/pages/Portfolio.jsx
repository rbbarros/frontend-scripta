import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { createPortfolio, getAlunoPerfil, getProjetos, getPortfolioList } from "../../../lib/authService";
import { deletarPortfolio, atualizarPortfolio } from "../../../lib/portfolioService";

const GRADIENTS = [
  "from-blue-500 to-indigo-600",
  "from-emerald-500 to-teal-600",
  "from-amber-400 to-orange-500",
  "from-purple-500 to-pink-600",
  "from-rose-400 to-red-500",
  "from-cyan-400 to-blue-500",
];

export default function Portfolio() {
  const navigate = useNavigate();
  const [perfil, setPerfil] = useState(null);
  const [projetos, setProjetos] = useState([]);
  const [portfolios, setPortfolios] = useState([]);
  const [projetoId, setProjetoId] = useState("");
  const [visibilidade, setVisibilidade] = useState("privado");
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");
  const [salvando, setSalvando] = useState(false);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("scripta_token");
    if (!token) { navigate("/"); return; }
    getAlunoPerfil().then(setPerfil).catch((e) => {
      localStorage.removeItem("scripta_token");
      localStorage.removeItem("scripta_user_type");
      navigate("/");
    });
    carregarDados();
  }, [navigate]);

  const carregarDados = () => {
    getProjetos().then(setProjetos).catch(() => setProjetos([]));
    getPortfolioList().then(setPortfolios).catch(() => setPortfolios([]));
  };

  const projetosDoAluno = projetos.filter(
    (p) => perfil?.nome && p.aluno_responsavel?.toLowerCase().includes(perfil.nome.toLowerCase())
  );

  const meusPortfolios = portfolios.filter((p) => p.aluno_id === perfil?.id);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro(""); setSucesso("");
    if (!perfil?.id) { setErro("Perfil não carregado."); return; }
    setSalvando(true);
    try {
      await createPortfolio({ aluno_id: perfil.id, projeto_id: Number(projetoId), visibilidade });
      setSucesso("Projeto adicionado ao portfólio!");
      setProjetoId(""); setVisibilidade("privado");
      setShowForm(false);
      carregarDados();
    } catch (e) {
      setErro(e.message || "Erro ao adicionar ao portfólio.");
    } finally {
      setSalvando(false);
    }
  };

  const handleRemover = async (id) => {
    if (!window.confirm("Remover este projeto do portfólio?")) return;
    try { await deletarPortfolio(id); carregarDados(); }
    catch (e) { alert("Erro ao remover: " + e.message); }
  };

  const handleToggleVisibilidade = async (item) => {
    const nova = item.visibilidade === "publico" ? "privado" : "publico";
    try {
      await atualizarPortfolio(item.id, { aluno_id: item.aluno_id, projeto_id: item.projeto_id, visibilidade: nova });
      carregarDados();
    } catch (e) { alert("Erro ao atualizar: " + e.message); }
  };

  const totalPublicos = meusPortfolios.filter(p => p.visibilidade === "publico").length;
  const totalPrivados = meusPortfolios.filter(p => p.visibilidade === "privado").length;

  return (
    <section className="mx-auto flex max-w-5xl flex-col gap-8">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Meu Portfólio</h1>
          <p className="mt-2 text-sm text-gray-500">Gerencie seus projetos publicados e compartilhe com empresas</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 rounded-xl bg-[#f19f17] px-5 py-2.5 text-sm font-bold text-white hover:bg-amber-600 transition-colors"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
          Adicionar Projeto
        </button>
      </div>

      {/* Métricas */}
      <div className="grid grid-cols-3 gap-4">
        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm text-center">
          <p className="text-3xl font-bold text-gray-900">{meusPortfolios.length}</p>
          <p className="text-xs text-gray-500 mt-1">Total</p>
        </div>
        <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-5 shadow-sm text-center">
          <p className="text-3xl font-bold text-emerald-700">{totalPublicos}</p>
          <p className="text-xs text-emerald-600 mt-1">Públicos</p>
        </div>
        <div className="rounded-2xl border border-gray-100 bg-gray-50 p-5 shadow-sm text-center">
          <p className="text-3xl font-bold text-gray-600">{totalPrivados}</p>
          <p className="text-xs text-gray-500 mt-1">Privados</p>
        </div>
      </div>

      {/* Formulário de adição (toggle) */}
      {showForm && (
        <form onSubmit={handleSubmit} className="rounded-3xl border border-[#f19f17]/30 bg-amber-50 p-6 shadow-sm space-y-4">
          <h2 className="text-sm font-bold text-amber-800 uppercase tracking-widest">Adicionar ao Portfólio</h2>
          {erro && <p className="text-sm text-red-600">{erro}</p>}
          {sucesso && <p className="text-sm text-emerald-700">{sucesso}</p>}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Projeto</label>
              <select value={projetoId} onChange={(e) => setProjetoId(e.target.value)} className="w-full rounded-xl border border-gray-200 p-3 text-sm outline-none focus:border-[#f19f17] bg-white" required>
                <option value="">Selecione um projeto...</option>
                {projetosDoAluno.map((p) => <option key={p.id} value={p.id}>{p.titulo}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Visibilidade</label>
              <select value={visibilidade} onChange={(e) => setVisibilidade(e.target.value)} className="w-full rounded-xl border border-gray-200 p-3 text-sm outline-none focus:border-[#f19f17] bg-white">
                <option value="privado">🔒 Privado</option>
                <option value="publico">🌐 Público</option>
              </select>
            </div>
          </div>
          <div className="flex gap-3">
            <button disabled={salvando} className="rounded-xl bg-[#f19f17] px-6 py-2.5 text-sm font-bold text-white disabled:opacity-50 hover:bg-amber-600">
              {salvando ? "Salvando..." : "Salvar"}
            </button>
            <button type="button" onClick={() => setShowForm(false)} className="rounded-xl border border-gray-200 bg-white px-6 py-2.5 text-sm font-bold text-gray-700 hover:bg-gray-50">
              Cancelar
            </button>
          </div>
        </form>
      )}

      {/* Grid de cards do portfólio */}
      <div>
        <h2 className="text-lg font-bold text-gray-800 mb-5">Projetos no Portfólio</h2>
        {meusPortfolios.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {meusPortfolios.map((item, i) => {
              const proj = projetos.find((p) => p.id === item.projeto_id);
              const gradient = GRADIENTS[i % GRADIENTS.length];
              return (
                <article key={item.id} className="rounded-3xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-shadow bg-white">
                  {/* Card Header com gradiente */}
                  <div className={`bg-gradient-to-br ${gradient} p-6 h-32 flex flex-col justify-end`}>
                    <h3 className="text-white font-bold text-base leading-snug drop-shadow">
                      {proj?.titulo || "Projeto"}
                    </h3>
                    <p className="text-white/70 text-xs mt-1">{proj?.area_conhecimento || "Área não informada"}</p>
                  </div>

                  {/* Card Body */}
                  <div className="p-5">
                    <div className="flex items-center justify-between mb-4">
                      <span className={`rounded-full px-3 py-1 text-xs font-bold border ${
                        item.visibilidade === "publico"
                          ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                          : "bg-gray-50 text-gray-600 border-gray-200"
                      }`}>
                        {item.visibilidade === "publico" ? "🌐 Público" : "🔒 Privado"}
                      </span>
                      <span className="text-xs text-gray-400">{proj?.status || "—"}</span>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => handleToggleVisibilidade(item)}
                        className="flex-1 rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs font-bold text-gray-700 hover:bg-gray-50"
                      >
                        Tornar {item.visibilidade === "publico" ? "Privado" : "Público"}
                      </button>
                      <button
                        onClick={() => handleRemover(item.id)}
                        className="rounded-lg bg-red-50 border border-red-100 px-3 py-2 text-xs font-bold text-red-600 hover:bg-red-100"
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"></path></svg>
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="rounded-3xl border border-dashed border-gray-200 bg-white p-16 text-center shadow-sm">
            <div className="text-5xl mb-4">💼</div>
            <h3 className="text-lg font-bold text-gray-700 mb-2">Portfólio vazio</h3>
            <p className="text-sm text-gray-500 max-w-xs mx-auto mb-5">
              Adicione seus projetos ao portfólio para que empresas possam encontrá-lo.
            </p>
            <button onClick={() => setShowForm(true)} className="rounded-xl bg-[#f19f17] px-6 py-2.5 text-sm font-bold text-white hover:bg-amber-600">
              Adicionar primeiro projeto
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
