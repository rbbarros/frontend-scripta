import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { createPortfolio, getAlunoPerfil, getProjetos, getPortfolioList, deletarPortfolio, updatePortfolio } from "../../../lib/authService";

const GRADIENTS = [
  "from-blue-500 to-blue-600",
  "from-emerald-400 to-emerald-500",
  "from-purple-500 to-purple-600",
  "from-amber-400 to-orange-500",
  "from-rose-400 to-red-500",
  "from-cyan-400 to-blue-500",
];

export default function Portfolio() {
  const navigate = useNavigate();
  const [perfil, setPerfil] = useState(null);
  const [projetos, setProjetos] = useState([]);
  const [portfolios, setPortfolios] = useState([]);
  const [projetoId, setProjetoId] = useState("");
  const [visibilidade, setVisibilidade] = useState("publico");
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
      setProjetoId(""); setVisibilidade("publico");
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
      await updatePortfolio(item.id, { visibilidade: nova });
      carregarDados();
    } catch (e) { alert("Erro ao atualizar: " + e.message); }
  };

  const totalPublicos = meusPortfolios.filter(p => p.visibilidade === "publico").length;
  const totalPrivados = meusPortfolios.filter(p => p.visibilidade === "privado").length;

  return (
    <section className="mx-auto flex max-w-5xl flex-col gap-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Meu Portfólio</h1>
          <p className="mt-1 text-sm text-gray-500">Projetos publicados e disponíveis para visualização</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-bold text-gray-700 hover:bg-gray-50 transition-colors"
          >
            + Adicionar
          </button>
          <button
            className="flex items-center gap-2 rounded-xl bg-[#f19f17] px-4 py-2 text-sm font-bold text-white hover:bg-amber-600 transition-colors"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="18" cy="5" r="3"></circle><circle cx="6" cy="12" r="3"></circle><circle cx="18" cy="19" r="3"></circle><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line></svg>
            Compartilhar Portfólio
          </button>
        </div>
      </div>

      {/* Métricas */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm text-center">
          <p className="text-2xl font-bold text-gray-800">{meusPortfolios.length}</p>
          <p className="text-xs text-gray-500 mt-1">Projetos Totais</p>
        </div>
        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm text-center">
          <p className="text-2xl font-bold text-gray-800">{totalPublicos}</p>
          <p className="text-xs text-gray-500 mt-1">Públicos</p>
        </div>
        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm text-center">
          <p className="text-2xl font-bold text-gray-800">Ótimo</p>
          <p className="text-xs text-gray-500 mt-1">Média Avaliativa</p>
        </div>
        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm text-center">
          <p className="text-2xl font-bold text-gray-800">1.2k</p>
          <p className="text-xs text-gray-500 mt-1">Visualizações</p>
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
                <option value="privado">🔒 Apenas Senac</option>
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

      {/* Header secundário "Todos os Projetos" com select Ordenar por */}
      <div className="flex items-center justify-between mt-2">
        <h2 className="text-sm font-bold text-gray-800">Todos os Projetos</h2>
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500">Ordenar por:</span>
          <select className="border-none text-xs font-semibold text-gray-700 bg-transparent outline-none cursor-pointer">
            <option>Mais recentes</option>
            <option>Mais antigos</option>
            <option>Melhor avaliados</option>
          </select>
        </div>
      </div>

      {/* Grid de cards do portfólio */}
      <div>
        {meusPortfolios.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {meusPortfolios.map((item, i) => {
              const proj = projetos.find((p) => p.id === item.projeto_id);
              const gradient = GRADIENTS[i % GRADIENTS.length];
              return (
                <article key={item.id} className="rounded-[2rem] border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-shadow bg-white flex flex-col">
                  {/* Card Header com gradiente */}
                  <div className={`bg-gradient-to-br ${gradient} p-4 h-32 relative`}>
                    <button onClick={() => handleRemover(item.id)} className="absolute top-4 right-4 text-white hover:text-red-200" title="Remover do portfólio">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"></path><path d="M15 9l-6 6"></path><path d="M9 9l6 6"></path></svg>
                    </button>
                  </div>

                  {/* Card Body */}
                  <div className="p-6 flex flex-col flex-1">
                    <h3 className="font-bold text-gray-900 text-sm leading-snug mb-3 line-clamp-2">
                      {proj?.titulo || "Projeto sem título"}
                    </h3>
                    
                    <button
                      onClick={() => handleToggleVisibilidade(item)}
                      className={`w-fit rounded-full px-2.5 py-1 text-[10px] font-bold border flex items-center gap-1 mb-3 hover:opacity-80 transition-opacity ${
                        item.visibilidade === "publico"
                          ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                          : "bg-blue-50 text-blue-600 border-blue-100"
                      }`}
                    >
                      {item.visibilidade === "publico" ? (
                        <><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg> Público</>
                      ) : (
                        <><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle><line x1="1" y1="1" x2="23" y2="23"></line></svg> Apenas Senac</>
                      )}
                    </button>

                    <p className="text-xs text-gray-500 line-clamp-3 mb-4">
                      {proj?.descricao || "Descrição do projeto não fornecida. Este texto é um placeholder..."}
                    </p>

                    <div className="flex flex-wrap gap-2 mb-4 mt-auto">
                      <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-[10px] font-medium">React Native</span>
                      <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-[10px] font-medium">Node.js</span>
                      <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-[10px] font-medium">PostgreSQL</span>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-gray-100 mt-auto">
                      <div className="flex items-center gap-2">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400"><path d="M12 15v5s-2 2-2 4h4s0-2-2-4v-5"></path><path d="M7 6v2a5 5 0 1 0 10 0V6a5 5 0 0 0-10 0z"></path></svg>
                        <span className="text-xs font-bold text-gray-700">9.5</span>
                        <span className="bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded text-[10px] font-bold">Excelente</span>
                      </div>
                      <div className="flex items-center gap-1 text-gray-400">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
                        <span className="text-xs">{Math.floor(Math.random() * 4) + 2} pessoas</span>
                      </div>
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
