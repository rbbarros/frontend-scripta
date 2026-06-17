import React, { useEffect, useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getEmpresaPerfil, getProjetos, getPortfolioList } from "../../../lib/authService";

const AREAS_DESTAQUE = [
  { nome: "Tecnologia", icon: "💻", cor: "from-blue-500 to-indigo-600" },
  { nome: "Saúde", icon: "🏥", cor: "from-emerald-500 to-teal-600" },
  { nome: "Negócios", icon: "📊", cor: "from-amber-400 to-orange-500" },
  { nome: "Design / UX", icon: "🎨", cor: "from-purple-500 to-pink-600" },
];

export default function Dashboard() {
  const navigate = useNavigate();
  const [perfil, setPerfil] = useState(null);
  const [projetos, setProjetos] = useState([]);
  const [portfolios, setPortfolios] = useState([]);
  const [erro, setErro] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("scripta_token");
    if (!token) { navigate("/"); return; }

    getEmpresaPerfil()
      .then(setPerfil)
      .catch((e) => {
        setErro(e.message || "Não foi possível carregar seu perfil.");
        localStorage.removeItem("scripta_token");
        localStorage.removeItem("scripta_user_type");
        navigate("/");
      });

    getProjetos().then(setProjetos).catch(() => setProjetos([]));
    getPortfolioList().then(setPortfolios).catch(() => setPortfolios([]));
  }, [navigate]);

  const projetosEmDestaque = useMemo(
    () => projetos.filter((p) => (p.status || "").toLowerCase() === "aprovado").slice(0, 4),
    [projetos]
  );

  const totalTalentos = useMemo(
    () => new Set(portfolios.filter(p => p.visibilidade === "publico").map(p => p.aluno_id)).size,
    [portfolios]
  );

  return (
    <>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
          {perfil?.nome_empresa || "Painel da Empresa"}
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          {erro || `Setor: ${perfil?.setor || "Não informado"} · Encontre os melhores talentos acadêmicos`}
        </p>
      </div>

      {/* Métricas */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-5 mb-8">
        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Projetos aprovados</p>
          <p className="text-3xl font-bold text-gray-900">{projetos.filter(p => (p.status||"").toLowerCase()==="aprovado").length}</p>
        </div>
        <div className="rounded-2xl border border-blue-100 bg-blue-50 p-5 shadow-sm">
          <p className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-2">Talentos disponíveis</p>
          <p className="text-3xl font-bold text-blue-800">{totalTalentos}</p>
        </div>
        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm col-span-2 sm:col-span-1">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Total de projetos</p>
          <p className="text-3xl font-bold text-gray-900">{projetos.length}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Projetos em Destaque */}
        <div className="lg:col-span-2 space-y-6">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-800">Projetos em Destaque</h2>
              <Link to="/empresa/talentos" className="text-xs font-semibold text-[#f19f17] hover:underline">
                Explorar talentos →
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {projetosEmDestaque.map((projeto, i) => {
                const gradients = ["from-blue-500 to-indigo-600", "from-emerald-500 to-teal-600", "from-amber-400 to-orange-500", "from-purple-500 to-pink-600"];
                return (
                  <article key={projeto.id} className="rounded-3xl border border-gray-100 bg-white overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                    <div className={`bg-gradient-to-br ${gradients[i % gradients.length]} p-5 h-24 flex items-end`}>
                      <span className="text-white/70 text-xs font-semibold uppercase tracking-widest">
                        {projeto.area_conhecimento || "Projeto Acadêmico"}
                      </span>
                    </div>
                    <div className="p-4">
                      <h3 className="text-sm font-bold text-gray-900 leading-snug">{projeto.titulo}</h3>
                      <p className="text-xs text-gray-500 mt-1">{projeto.aluno_responsavel || "Aluno"} · {projeto.semestre || "2026"}</p>
                      <div className="flex items-center justify-between mt-3">
                        <span className="text-xs text-gray-400">{projeto.professor_orientador || "Professor não informado"}</span>
                        <span className="text-xs font-bold text-emerald-600">✅ Aprovado</span>
                      </div>
                    </div>
                  </article>
                );
              })}
              {!projetosEmDestaque.length && (
                <div className="sm:col-span-2 rounded-3xl border border-dashed border-gray-200 p-10 text-center text-sm text-gray-400">
                  Nenhum projeto aprovado disponível ainda.
                </div>
              )}
            </div>
          </div>

          {/* Explorar por área */}
          <div>
            <h2 className="text-lg font-bold text-gray-800 mb-4">Explorar por Área</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {AREAS_DESTAQUE.map((area) => (
                <Link
                  key={area.nome}
                  to="/empresa/talentos"
                  className={`rounded-2xl bg-gradient-to-br ${area.cor} p-4 text-white flex flex-col items-center justify-center gap-2 text-center hover:scale-105 transition-transform shadow-sm`}
                >
                  <span className="text-2xl">{area.icon}</span>
                  <span className="text-xs font-bold">{area.nome}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-5">
          {/* Perfil da empresa */}
          {perfil && (
            <div className="bg-white border border-gray-100 rounded-3xl p-5 shadow-sm">
              <h3 className="text-sm font-bold text-gray-800 border-b border-gray-100 pb-2 mb-4">Sua empresa</h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-gray-700">
                  <span className="text-gray-400">🏢</span>
                  <span className="font-semibold">{perfil.nome_empresa || "—"}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <span className="text-gray-400">📧</span>
                  <span className="text-xs">{perfil.email || "—"}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <span className="text-gray-400">🏭</span>
                  <span className="text-xs">{perfil.setor || "Setor não informado"}</span>
                </div>
              </div>
            </div>
          )}

          {/* Acesso rápido */}
          <div className="bg-white border border-gray-100 rounded-3xl p-5 shadow-sm">
            <h3 className="text-sm font-bold text-gray-800 border-b border-gray-100 pb-2 mb-4">Acesso rápido</h3>
            <div className="space-y-2">
              <Link to="/empresa/talentos" className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-gray-50 text-sm font-medium text-gray-700">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
                Ver Talentos
              </Link>
              <Link to="/empresa/oportunidades" className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-gray-50 text-sm font-medium text-gray-700">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>
                Oportunidades
              </Link>
            </div>
          </div>

          {/* CTA */}
          <div className="bg-gradient-to-br from-[#f19f17] to-amber-600 rounded-3xl p-5 text-white text-center">
            <p className="text-2xl mb-2">🎓</p>
            <h3 className="text-sm font-bold mb-2">Encontre seu próximo talento</h3>
            <p className="text-xs text-white/80 mb-4">
              {totalTalentos} estudantes com portfólio público disponíveis
            </p>
            <Link to="/empresa/talentos" className="block rounded-xl bg-white/20 hover:bg-white/30 px-4 py-2 text-xs font-bold transition-colors">
              Explorar talentos
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
