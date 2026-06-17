import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getCoordenadores, getEmpresas, getPortfolioList, getProjetos, getProfessores } from "../../../lib/authService";

export default function Dashboard() {
  const navigate = useNavigate();
  const [perfil, setPerfil] = useState(null);
  const [stats, setStats] = useState({ projetos: [], professores: [], empresas: [], portfolios: [] });
  const [erro, setErro] = useState("");

  useEffect(() => {
    if (!localStorage.getItem("scripta_token")) { navigate("/"); return; }

    getCoordenadores()
      .then((data) => setPerfil(Array.isArray(data) ? data[0] : data))
      .catch((e) => setErro(e.message || "Não foi possível carregar a coordenação."));

    Promise.allSettled([getProjetos(), getProfessores(), getEmpresas(), getPortfolioList()])
      .then(([projetos, professores, empresas, portfolios]) => {
        setStats({
          projetos: projetos.status === "fulfilled" ? projetos.value : [],
          professores: professores.status === "fulfilled" ? professores.value : [],
          empresas: empresas.status === "fulfilled" ? empresas.value : [],
          portfolios: portfolios.status === "fulfilled" ? portfolios.value : [],
        });
      });
  }, [navigate]);

  const aprovados = stats.projetos.filter((p) => (p.status || "").toLowerCase() === "aprovado");
  const pendentes = stats.projetos.filter((p) => ["submetido", "em_revisao", "em_avaliacao"].includes((p.status || "").toLowerCase()));
  const reprovados = stats.projetos.filter((p) => (p.status || "").toLowerCase() === "reprovado");

  const atividadeRecente = [...stats.projetos]
    .sort((a, b) => (b.id || 0) - (a.id || 0))
    .slice(0, 6);

  const statusLabel = (s) => {
    const map = { aprovado: "Aprovado", reprovado: "Reprovado", submetido: "Submetido", em_revisao: "Em revisão", em_avaliacao: "Em avaliação", rascunho: "Rascunho" };
    return map[(s || "").toLowerCase()] || s;
  };

  const statusColor = (s) => {
    const str = (s || "").toLowerCase();
    if (str === "aprovado") return "bg-emerald-50 text-emerald-700 border-emerald-100";
    if (str === "reprovado") return "bg-red-50 text-red-700 border-red-100";
    if (str.includes("revisao") || str.includes("avaliacao")) return "bg-blue-50 text-blue-700 border-blue-100";
    return "bg-amber-50 text-amber-700 border-amber-100";
  };

  return (
    <>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
          {perfil?.nome ? `Olá, ${perfil.nome}` : "Painel da Coordenação"}
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          {erro || "Visão geral do sistema Scripta em tempo real"}
        </p>
      </div>

      {/* Métricas principais */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Total de Projetos</p>
          <p className="text-3xl font-bold text-gray-900">{stats.projetos.length}</p>
        </div>
        <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-5 shadow-sm">
          <p className="text-xs font-bold text-emerald-600 uppercase tracking-widest mb-2">Aprovados</p>
          <p className="text-3xl font-bold text-emerald-800">{aprovados.length}</p>
        </div>
        <div className="rounded-2xl border border-amber-100 bg-amber-50 p-5 shadow-sm">
          <p className="text-xs font-bold text-amber-600 uppercase tracking-widest mb-2">Em Avaliação</p>
          <p className="text-3xl font-bold text-amber-800">{pendentes.length}</p>
        </div>
        <div className="rounded-2xl border border-red-100 bg-red-50 p-5 shadow-sm">
          <p className="text-xs font-bold text-red-500 uppercase tracking-widest mb-2">Reprovados</p>
          <p className="text-3xl font-bold text-red-800">{reprovados.length}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Atividade Recente */}
        <div className="lg:col-span-2 bg-white border border-gray-100 rounded-3xl p-6 shadow-sm">
          <h2 className="text-base font-bold text-gray-800 border-b border-gray-100 pb-4 mb-4">Atividade Recente</h2>
          <div className="space-y-0">
            {atividadeRecente.map((proj) => (
              <div key={proj.id} className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0">
                <div>
                  <p className="text-sm font-semibold text-gray-800">{proj.titulo}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{proj.aluno_responsavel || "—"} · {proj.area_conhecimento || "Área não informada"}</p>
                </div>
                <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold border shrink-0 ml-3 ${statusColor(proj.status)}`}>
                  {statusLabel(proj.status)}
                </span>
              </div>
            ))}
            {!atividadeRecente.length && (
              <p className="text-sm text-gray-400 text-center py-6">Nenhuma atividade registrada no backend.</p>
            )}
          </div>
        </div>

        {/* Sidebar Visão Geral */}
        <div className="space-y-5">
          <div className="bg-white border border-gray-100 rounded-3xl p-5 shadow-sm">
            <h3 className="text-sm font-bold text-gray-800 border-b border-gray-100 pb-3 mb-4">Usuários Ativos</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <span className="w-7 h-7 rounded-lg bg-purple-100 flex items-center justify-center text-xs">👨‍🏫</span>
                  Professores
                </div>
                <span className="font-bold text-gray-900">{stats.professores.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <span className="w-7 h-7 rounded-lg bg-blue-100 flex items-center justify-center text-xs">🏢</span>
                  Empresas
                </div>
                <span className="font-bold text-gray-900">{stats.empresas.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <span className="w-7 h-7 rounded-lg bg-amber-100 flex items-center justify-center text-xs">💼</span>
                  Portfólios
                </div>
                <span className="font-bold text-gray-900">{stats.portfolios.length}</span>
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-100 rounded-3xl p-5 shadow-sm">
            <h3 className="text-sm font-bold text-gray-800 border-b border-gray-100 pb-3 mb-4">Ações Rápidas</h3>
            <div className="space-y-2">
              <Link to="/coordenacao/relatorios" className="flex items-center gap-2 w-full text-left px-3 py-2 rounded-xl hover:bg-gray-50 text-sm font-medium text-gray-700">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line></svg>
                Ver relatórios
              </Link>
            </div>
          </div>

          {/* Taxa de aprovação */}
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-3xl p-5 text-white">
            <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">Taxa de Aprovação</h3>
            <p className="text-4xl font-bold">
              {stats.projetos.length > 0
                ? Math.round((aprovados.length / stats.projetos.length) * 100)
                : 0}%
            </p>
            <div className="mt-3 w-full bg-gray-700 rounded-full h-1.5">
              <div
                className="bg-emerald-400 h-1.5 rounded-full transition-all"
                style={{ width: `${stats.projetos.length > 0 ? Math.round((aprovados.length / stats.projetos.length) * 100) : 0}%` }}
              ></div>
            </div>
            <p className="text-xs text-gray-400 mt-2">{aprovados.length} de {stats.projetos.length} projetos</p>
          </div>
        </div>
      </div>
    </>
  );
}
