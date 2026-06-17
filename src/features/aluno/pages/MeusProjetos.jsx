import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAlunoPerfil, getProjetos } from "../../../lib/authService";
import { atualizarProjeto, deletarProjeto } from "../../../lib/projetoService";

const STATUS_TABS = [
  { id: "rascunho", label: "Rascunhos" },
  { id: "submetido", label: "Submetidos" },
  { id: "em_revisao", label: "Em revisão" },
  { id: "aprovado", label: "Aprovados" },
  { id: "reprovado", label: "Reprovados" }
];

export default function MeusProjetos() {
  const navigate = useNavigate();
  const [perfil, setPerfil] = useState(null);
  const [projetos, setProjetos] = useState([]);
  const [activeTab, setActiveTab] = useState("reprovado");
  const [editandoId, setEditandoId] = useState(null);
  const [editData, setEditData] = useState({ titulo: "", area_conhecimento: "" });

  useEffect(() => {
    if (!localStorage.getItem("scripta_token")) {
      navigate("/");
      return;
    }

    getAlunoPerfil().then(setPerfil).catch(() => navigate("/"));
    carregarProjetos();
  }, [navigate]);

  const carregarProjetos = () => {
    getProjetos().then(setProjetos).catch(() => setProjetos([]));
  };

  const meusProjetos = useMemo(() => {
    if (!perfil?.nome) return [];
    return projetos.filter((projeto) => projeto.aluno_responsavel?.toLowerCase().includes(perfil.nome.toLowerCase()));
  }, [perfil, projetos]);

  const projetosFiltrados = useMemo(() => {
    return meusProjetos.filter(p => (p.status || "rascunho").toLowerCase() === activeTab);
  }, [meusProjetos, activeTab]);

  const handleDeletar = async (id) => {
    if (!window.confirm("Tem certeza que deseja excluir este projeto?")) return;
    try {
      await deletarProjeto(id);
      carregarProjetos();
    } catch (e) {
      alert("Erro ao excluir projeto: " + e.message);
    }
  };

  const iniciarEdicao = (projeto) => {
    setEditandoId(projeto.id);
    setEditData({ titulo: projeto.titulo, area_conhecimento: projeto.area_conhecimento || "" });
  };

  const salvarEdicao = async (id) => {
    try {
      await atualizarProjeto(id, editData);
      setEditandoId(null);
      carregarProjetos();
    } catch (e) {
      alert("Erro ao atualizar projeto: " + e.message);
    }
  };

  return (
    <section className="mx-auto flex max-w-5xl flex-col gap-6">
      <div className="rounded-3xl border border-gray-100 bg-white p-8 shadow-sm">
        <h1 className="text-3xl font-bold text-gray-900">Meus Projetos</h1>
        <p className="mt-2 text-sm text-gray-500">Acompanhe e gerencie todos os seus projetos integradores</p>
        
        <div className="mt-8 flex flex-wrap gap-3 border-b border-gray-100 pb-4">
          {STATUS_TABS.map(tab => {
            const count = meusProjetos.filter(p => (p.status || "rascunho").toLowerCase() === tab.id).length;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 rounded-full px-5 py-2 text-sm font-semibold transition-colors ${
                  isActive
                    ? "bg-amber-500 text-white shadow-md"
                    : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
                }`}
              >
                <span>{tab.label}</span>
                <span className={`flex h-5 w-5 items-center justify-center rounded-full text-xs ${isActive ? 'bg-white text-amber-600' : 'bg-gray-100 text-gray-500'}`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid gap-4">
        {projetosFiltrados.map((projeto) => (
          <article key={projeto.id} className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
            {editandoId === projeto.id ? (
              <div className="space-y-3">
                <input
                  type="text"
                  value={editData.titulo}
                  onChange={(e) => setEditData({ ...editData, titulo: e.target.value })}
                  className="w-full rounded-xl border border-gray-200 px-4 py-2 text-sm outline-none focus:border-blue-500"
                />
                <input
                  type="text"
                  value={editData.area_conhecimento}
                  onChange={(e) => setEditData({ ...editData, area_conhecimento: e.target.value })}
                  className="w-full rounded-xl border border-gray-200 px-4 py-2 text-sm outline-none focus:border-blue-500"
                />
                <div className="flex gap-2 mt-4">
                  <button onClick={() => salvarEdicao(projeto.id)} className="rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white hover:bg-blue-700">Salvar</button>
                  <button onClick={() => setEditandoId(null)} className="rounded-xl bg-gray-100 px-4 py-2 text-xs font-bold text-gray-600 hover:bg-gray-200">Cancelar</button>
                </div>
              </div>
            ) : (
              <>
                <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <h2 className="text-xl font-bold text-gray-800">{projeto.titulo}</h2>
                      <span className="inline-flex items-center rounded-full bg-red-50 px-2.5 py-0.5 text-xs font-medium text-red-700 border border-red-100">
                        {projeto.status}
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-gray-500">{projeto.area_conhecimento || "Engenharia de Software - 2º/2024"}</p>
                    <p className="mt-4 text-sm text-gray-600">{projeto.descricao || "Nenhuma descrição fornecida."}</p>
                  </div>
                  
                  <div className="flex flex-col items-end gap-2">
                    {projeto.status === 'reprovado' && (
                      <span className="inline-flex items-center gap-1.5 rounded-md text-xs font-medium text-red-600">
                        🔒 Não editável
                      </span>
                    )}
                    {projeto.status !== 'reprovado' && projeto.status !== 'em_revisao' && (
                      <div className="flex gap-2">
                        <button onClick={() => iniciarEdicao(projeto)} className="rounded-xl border border-gray-200 bg-white px-4 py-2 text-xs font-bold text-gray-700 hover:bg-gray-50">Editar</button>
                        <button onClick={() => handleDeletar(projeto.id)} className="rounded-xl bg-red-50 px-4 py-2 text-xs font-bold text-red-600 hover:bg-red-100">Excluir</button>
                      </div>
                    )}
                  </div>
                </div>

                {projeto.status === 'reprovado' && (
                  <div className="mt-6">
                    <div className="rounded-xl bg-red-50 p-4 border border-red-100 text-sm text-red-800 flex items-start gap-3">
                      <span>⚠️</span>
                      <p>Entre em contato com os professores avaliadores para orientação sobre os próximos passos.</p>
                    </div>

                    <div className="mt-6 border-t border-gray-100 pt-6">
                      <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Avaliações dos Professores</h3>
                      <div className="flex items-center justify-between rounded-xl border border-gray-100 p-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-gray-500 font-bold">
                            👤
                          </div>
                          <div>
                            <p className="text-sm font-bold text-gray-800">Prof. Avaliador</p>
                            <p className="text-xs text-gray-400">Avaliado recentemente</p>
                          </div>
                        </div>
                        <span className="flex items-center gap-1.5 text-sm font-bold text-red-600">
                          <span className="flex h-5 w-5 items-center justify-center rounded-full border border-red-200 bg-red-50 text-xs">✕</span>
                          Reprovado
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </article>
        ))}
        {!projetosFiltrados.length && (
          <div className="rounded-3xl border border-dashed border-gray-200 bg-white p-12 text-center text-gray-500 shadow-sm">
            Nenhum projeto encontrado nesta categoria.
          </div>
        )}
      </div>
    </section>
  );
}