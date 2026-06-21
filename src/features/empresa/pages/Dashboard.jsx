import React, { useEffect, useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getEmpresaPerfil, getProjetos, getPortfolioList } from "../../../lib/authService";

export default function Dashboard() {
  const navigate = useNavigate();
  const [perfil, setPerfil] = useState(null);
  const [projetos, setProjetos] = useState([]);
  const [portfolios, setPortfolios] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("scripta_token");
    if (!token) { navigate("/"); return; }

    getEmpresaPerfil()
      .then(setPerfil)
      .catch((e) => {
        localStorage.removeItem("scripta_token");
        localStorage.removeItem("scripta_user_type");
        navigate("/");
      });

    getProjetos()
      .then((data) => setProjetos(Array.isArray(data) ? data : []))
      .catch(() => setProjetos([]));
      
    getPortfolioList()
      .then((data) => setPortfolios(Array.isArray(data) ? data : []))
      .catch(() => setPortfolios([]));
  }, [navigate]);

  const projetosEmDestaque = useMemo(
    () => (Array.isArray(projetos) ? projetos : []).filter((p) => (p.status || "").toLowerCase() === "aprovado").slice(0, 3),
    [projetos]
  );

  const totalTalentos = useMemo(
    () => new Set((Array.isArray(portfolios) ? portfolios : []).filter(p => p.visibilidade === "publico").map(p => p.aluno_id)).size,
    [portfolios]
  );

  const projetosDisponiveis = projetos.length;
  const portfoliosDisponiveis = portfolios.filter(p => p.visibilidade === "publico").length;
  const projetosEmDestaqueCount = projetos.filter(p => (p.status || "").toLowerCase() === "aprovado").length;

  return (
    <>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
          Dashboard
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Bem vindo, {perfil?.nome_empresa || "TechCorp Brasil"}. Explore talentos e projetos acadêmicos.
        </p>
      </div>

      {/* Métricas */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm flex items-center gap-4">
           <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center shrink-0">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path></svg>
          </div>
          <div>
            <p className="text-3xl font-bold text-gray-900">{projetosDisponiveis || 187}</p>
            <p className="text-xs text-gray-500 mt-1">Projetos disponíveis</p>
          </div>
        </div>
        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm flex items-center gap-4">
           <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>
          </div>
          <div>
             <p className="text-3xl font-bold text-gray-900">{portfoliosDisponiveis || 98}</p>
             <p className="text-xs text-gray-500 mt-1">Portfólios disponíveis</p>
          </div>
        </div>
        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm flex items-center gap-4">
           <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center shrink-0">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M8 21h8m-4-4v4m5-16h2a2 2 0 0 1 2 2v2c0 3-2 5.5-5 6h-6c-3-.5-5-3-5-6V7a2 2 0 0 1 2-2h2m4 0v11"></path></svg>
          </div>
          <div>
            <p className="text-3xl font-bold text-gray-900">{projetosEmDestaqueCount || 12}</p>
            <p className="text-xs text-gray-500 mt-1">Projetos em destaque</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Projetos em Destaque */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-800">Projetos em Destaque</h2>
              <Link to="/empresa/destaque" className="text-xs font-semibold text-gray-500 hover:text-gray-800">
                Ver todos →
              </Link>
            </div>

            <div className="space-y-4">
              {projetosEmDestaque.map((projeto, i) => {
                const badges = [{ text: "Excelente", color: "bg-emerald-50 text-emerald-700", perc: "96%" }, { text: "Excelente", color: "bg-emerald-50 text-emerald-700", perc: "92%" }, { text: "Ótimo", color: "bg-blue-50 text-blue-700", perc: "88%" }];
                const badge = badges[i % badges.length];
                return (
                  <article key={projeto.id} className="rounded-2xl border border-gray-100 bg-white p-4 flex items-center justify-between gap-4">
                     <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center shrink-0">
                           <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path></svg>
                        </div>
                        <div>
                          <h3 className="text-sm font-bold text-gray-900 leading-snug">{projeto.titulo}</h3>
                          <p className="text-xs text-gray-500 mt-1">{projeto.curso || "Curso não informado"}</p>
                        </div>
                     </div>
                     <div className="flex items-center gap-3 shrink-0">
                        <span className="text-sm font-bold text-gray-700">{badge.perc}</span>
                        <span className={`px-2 py-1 rounded text-[10px] font-bold ${badge.color}`}>{badge.text}</span>
                     </div>
                  </article>
                );
              })}
              {!projetosEmDestaque.length && (
                <div className="rounded-2xl border border-dashed border-gray-200 p-8 text-center text-sm text-gray-400">
                  Nenhum projeto em destaque encontrado na API. 
                  <br/><br/>
                  <span className="text-xs">Para ilustrar o design:</span>
                  <div className="mt-4 space-y-4">
                     {[{t: "Plataforma de Blockchain para Certificados", c: "Ciência da Computação", p: "96%", b: "bg-emerald-50 text-emerald-700", bt: "Excelente"}, {t: "Sistema de IA para Diagnóstico Médico", c: "Engenharia de Software", p: "92%", b: "bg-emerald-50 text-emerald-700", bt: "Excelente"}, {t: "App de Realidade Aumentada Educacional", c: "Design Digital", p: "88%", b: "bg-blue-50 text-blue-700", bt: "Ótimo"}].map((m, i) => (
                        <article key={i} className="rounded-2xl border border-gray-100 bg-white p-4 flex items-center justify-between gap-4 text-left">
                           <div className="flex items-center gap-4">
                              <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center shrink-0">
                                 <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path></svg>
                              </div>
                              <div>
                                <h3 className="text-sm font-bold text-gray-900 leading-snug">{m.t}</h3>
                                <p className="text-xs text-gray-500 mt-1">{m.c}</p>
                              </div>
                           </div>
                           <div className="flex items-center gap-3 shrink-0">
                              <span className="text-sm font-bold text-gray-700">{m.p}</span>
                              <span className={`px-2 py-1 rounded text-[10px] font-bold ${m.b}`}>{m.bt}</span>
                           </div>
                        </article>
                     ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar Perfil */}
        <div className="space-y-6">
          <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm relative">
            <Link to="/empresa/perfil" className="absolute top-6 right-6 text-xs font-semibold text-[#f19f17] hover:underline">
              Editar
            </Link>
            <h3 className="text-sm font-bold text-gray-800 border-b border-gray-100 pb-3 mb-4">Informações da Empresa</h3>
            
            <div className="space-y-4">
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Razão Social</p>
                <p className="text-sm font-semibold text-gray-800 mt-1">{perfil?.nome_empresa || "TechCorp Brasil Ltda."}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Nome Fantasia</p>
                <p className="text-sm font-semibold text-gray-800 mt-1">{perfil?.nome_empresa || "TechCorp Brasil"}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">CNPJ</p>
                <p className="text-sm font-semibold text-gray-800 mt-1">{perfil?.cnpj || "12.345.678/0001-90"}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">E-mail Corporativo</p>
                <p className="text-sm font-semibold text-gray-800 mt-1">{perfil?.email_contato || "contato@techcorp.com.br"}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Site</p>
                <a href="#" className="text-sm font-semibold text-blue-600 hover:underline mt-1 block">https://www.techcorp.com.br</a>
              </div>
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Área de Atuação</p>
                <p className="text-sm font-semibold text-gray-800 mt-1">{perfil?.setor || "Tecnologia da Informação"}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Telefone</p>
                <p className="text-sm font-semibold text-gray-800 mt-1">{perfil?.telefone || "(11) 3456-7890"}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
