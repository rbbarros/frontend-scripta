import React, { useEffect, useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getProfessorPerfil, getProjetos } from "../../../lib/authService";

export default function Dashboard() {
  const navigate = useNavigate();
  const [perfil, setPerfil] = useState(null);
  const [projetos, setProjetos] = useState([]);
  const [erro, setErro] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("scripta_token");
    if (!token) { navigate("/"); return; }

    getProfessorPerfil()
      .then(setPerfil)
      .catch((e) => {
        setErro(e.message || "Não foi possível carregar seu perfil.");
        localStorage.removeItem("scripta_token");
        localStorage.removeItem("scripta_user_type");
        navigate("/");
      });

    getProjetos().then(setProjetos).catch(() => setProjetos([]));
  }, [navigate]);

  const aguardando = useMemo(
    () => projetos.filter((p) => ["submetido", "em_revisao", "em_avaliacao"].includes((p.status || "").toLowerCase())),
    [projetos]
  );
  const avaliados = useMemo(
    () => projetos.filter((p) => ["aprovado", "reprovado"].includes((p.status || "").toLowerCase())),
    [projetos]
  );

  // Lista combinada ordenada por id desc para "recentemente"
  const recentes = useMemo(
    () => [...projetos].sort((a, b) => (b.id || 0) - (a.id || 0)).slice(0, 5),
    [projetos]
  );

  const statusBadge = (status) => {
    const s = (status || "").toLowerCase();
    if (s === "aprovado") return { label: "Avaliado", cls: "bg-emerald-50 text-emerald-700 border border-emerald-200" };
    if (s === "reprovado") return { label: "Reprovado", cls: "bg-red-50 text-red-700 border border-red-200" };
    if (s === "em_revisao" || s === "em_avaliacao") return { label: "Em revisão", cls: "bg-blue-50 text-blue-700 border border-blue-200" };
    return { label: "Aguardando", cls: "bg-amber-50 text-amber-700 border border-amber-200" };
  };

  return (
    <>
      {/* Cabeçalho */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1">
          {perfil?.nome
            ? `Bem vindo, Prof. ${perfil.nome}. Acompanhe suas atividades de avaliação.`
            : "Carregando seu painel..."}
        </p>
      </div>

      {/* Cards de Métricas */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
        {/* Aguardando */}
        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm flex items-center gap-4">
          <div className="w-11 h-11 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center shrink-0">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#f19f17" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <polyline points="12 6 12 12 16 14"></polyline>
            </svg>
          </div>
          <div>
            <p className="text-3xl font-bold text-gray-900">{aguardando.length}</p>
            <p className="text-xs text-gray-500 mt-0.5">Aguardando avaliação</p>
          </div>
        </div>

        {/* Avaliações realizadas */}
        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm flex items-center gap-4">
          <div className="w-11 h-11 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center shrink-0">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
              <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
          </div>
          <div>
            <p className="text-3xl font-bold text-gray-900">{avaliados.length}</p>
            <p className="text-xs text-gray-500 mt-0.5">Avaliações realizadas</p>
          </div>
        </div>

        {/* Total */}
        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm flex items-center gap-4">
          <div className="w-11 h-11 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
              <polyline points="14 2 14 8 20 8"></polyline>
              <line x1="16" y1="13" x2="8" y2="13"></line>
              <line x1="16" y1="17" x2="8" y2="17"></line>
              <polyline points="10 9 9 9 8 9"></polyline>
            </svg>
          </div>
          <div>
            <p className="text-3xl font-bold text-gray-900">{projetos.length}</p>
            <p className="text-xs text-gray-500 mt-0.5">Total de projetos</p>
          </div>
        </div>
      </div>

      {/* Corpo principal */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Projetos Avaliados Recentemente (2/3) */}
        <div className="lg:col-span-2 bg-white border border-gray-100 rounded-3xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-base font-bold text-gray-800">Projetos Avaliados Recentemente</h2>
            <Link to="/professor/avaliacoes" className="text-sm font-semibold text-gray-500 hover:text-gray-800 flex items-center gap-1">
              Ver todos <span>→</span>
            </Link>
          </div>

          <div className="space-y-1">
            {recentes.map((projeto) => {
              const badge = statusBadge(projeto.status);
              return (
                <div key={projeto.id} className="flex items-center justify-between py-3 px-2 rounded-xl hover:bg-gray-50 transition-colors gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    {/* Ícone documento */}
                    <div className="w-9 h-9 rounded-lg bg-amber-50 border border-amber-100 flex items-center justify-center shrink-0">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#f19f17" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                        <polyline points="14 2 14 8 20 8"></polyline>
                      </svg>
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-gray-800 truncate">{projeto.titulo}</p>
                      <p className="text-xs text-gray-400 truncate">
                        {projeto.area_conhecimento || projeto.curso || "Área não informada"} · {projeto.turma || projeto.semestre || "—"}
                      </p>
                    </div>
                  </div>
                  <span className={`rounded-full px-3 py-1 text-xs font-bold shrink-0 ${badge.cls}`}>
                    {badge.label}
                  </span>
                </div>
              );
            })}
            {!recentes.length && (
              <div className="py-10 text-center text-sm text-gray-400">
                Nenhum projeto encontrado no sistema.
              </div>
            )}
          </div>
        </div>

        {/* Sidebar (1/3) */}
        <div className="space-y-5">
          {/* Ações Rápidas */}
          <div className="bg-white border border-gray-100 rounded-3xl p-5 shadow-sm">
            <h3 className="text-sm font-bold text-gray-800 mb-4">Ações Rápidas</h3>
            <div className="space-y-2">
              <Link
                to="/professor/avaliacoes"
                className="flex items-center gap-2.5 w-full px-4 py-2.5 rounded-xl border border-[#f19f17]/40 bg-amber-50 text-sm font-semibold text-amber-800 hover:bg-amber-100 transition-colors"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
                </svg>
                Ver projetos pendentes
              </Link>
              <Link
                to="/professor/avaliacoes"
                className="flex items-center gap-2.5 w-full px-4 py-2.5 rounded-xl border border-[#f19f17]/40 bg-amber-50 text-sm font-semibold text-amber-800 hover:bg-amber-100 transition-colors"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                </svg>
                Histórico de avaliações
              </Link>
              <Link
                to="/professor/ranking"
                className="flex items-center gap-2.5 w-full px-4 py-2.5 rounded-xl border border-[#f19f17]/40 bg-amber-50 text-sm font-semibold text-amber-800 hover:bg-amber-100 transition-colors"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"></path>
                  <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"></path>
                  <path d="M4 22h16"></path>
                  <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"></path>
                  <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"></path>
                  <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"></path>
                </svg>
                Ver ranking
              </Link>
            </div>
          </div>

          {/* Notificações */}
          <div className="bg-white border border-gray-100 rounded-3xl p-5 shadow-sm">
            <h3 className="text-sm font-bold text-gray-800 mb-4">Notificações</h3>
            <div className="space-y-3">
              {/* Alerta principal */}
              {aguardando.length > 0 && (
                <div className="rounded-xl bg-amber-50 border border-amber-200 px-4 py-3">
                  <p className="text-sm font-bold text-amber-800">
                    {aguardando.length} projeto{aguardando.length > 1 ? "s" : ""} aguardam avaliação
                  </p>
                  <p className="text-xs text-amber-600 mt-0.5">Prazo: 3 dias</p>
                </div>
              )}
              {/* Notificação secundária */}
              <div className="py-2 border-b border-gray-50">
                <p className="text-sm text-gray-700">Novo projeto submetido em LSW-2A</p>
                <p className="text-xs text-gray-400 mt-0.5">Há 2 horas</p>
              </div>
              {aguardando.length === 0 && (
                <div className="rounded-xl bg-emerald-50 border border-emerald-200 px-4 py-3">
                  <p className="text-sm font-bold text-emerald-800">Tudo em dia! 🎉</p>
                  <p className="text-xs text-emerald-600 mt-0.5">Nenhum projeto aguardando avaliação.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
