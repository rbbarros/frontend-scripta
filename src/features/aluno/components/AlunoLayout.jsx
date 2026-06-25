import React from "react";
import { useNavigate, Link, useLocation, Outlet } from "react-router-dom";

export default function AlunoLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem("scripta_token");
    localStorage.removeItem("scripta_user_type");
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex flex-col font-sans text-gray-700 antialiased">
      {/* NAVBAR SUPERIOR (IDÊNTICA AO FIGMA) */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl w-full mx-auto px-8 py-4 flex items-center justify-between">
          {/* LOGO SCRIPTADA */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-[#f19f17] rounded-lg flex items-center justify-center text-white text-sm">
              <i className="fas fa-graduation-cap text-white-900"></i>
            </div>
            <span className="text-xl font-bold text-gray-900 tracking-tight">
              Scripta
            </span>
          </div>

          {/* TODOS OS LINKS DE NAVEGAÇÃO DO FIGMA */}
          <nav className="hidden xl:flex items-center gap-1 text-sm font-medium text-gray-500">
            <Link
              to="/aluno"
              className={`px-4 py-2 rounded-xl flex items-center gap-1.5 transition-all ${location.pathname === "/aluno" || location.pathname === "/aluno/" ? "bg-amber-50 text-[#f19f17] font-semibold" : "hover:bg-gray-50 hover:text-gray-800"}`}
            >
              <i class="fas fa-home"></i>
              Início
            </Link>

            <Link
              to="/aluno/buscar"
              className={`px-4 py-2 rounded-xl flex items-center gap-1.5 transition-all ${location.pathname === "/aluno/buscar" ? "bg-amber-50 text-[#f19f17] font-semibold" : "hover:bg-gray-50 hover:text-gray-800"}`}
            >
              <i class="fas fa-search"></i>
              Buscar
            </Link>

            <Link
              to="/aluno/ranking"
              className={`px-4 py-2 rounded-xl flex items-center gap-1.5 transition-all ${location.pathname === "/aluno/ranking" ? "bg-amber-50 text-[#f19f17] font-semibold" : "hover:bg-gray-50 hover:text-gray-800"}`}
            >
              <i class="fas fa-trophy"></i>
              Ranking
            </Link>

            <Link
              to="/aluno/certificados"
              className={`px-4 py-2 rounded-xl flex items-center gap-1.5 transition-all ${location.pathname === "/aluno/certificados" ? "bg-amber-50 text-[#f19f17] font-semibold" : "hover:bg-gray-50 hover:text-gray-800"}`}
            >
              <i class="fas fa-award"></i>
              Certificados
            </Link>

            <Link
              to="/aluno/portfolio"
              className={`px-4 py-2 rounded-xl flex items-center gap-1.5 transition-all ${location.pathname === "/aluno/portfolio" ? "bg-amber-50 text-[#f19f17] font-semibold" : "hover:bg-gray-50 hover:text-gray-800"}`}
            >
              <i class="fas fa-suitcase"></i>
              Portfólio
            </Link>

            <Link
              to="/aluno/projetos"
              className={`px-4 py-2 rounded-xl flex items-center gap-1.5 transition-all ${location.pathname === "/aluno/projetos" ? "bg-amber-50 text-[#f19f17] font-semibold" : "hover:bg-gray-50 hover:text-gray-800"}`}
            >
              <i class="far fa-folder"></i>
              Meus Projetos
            </Link>

            <Link
              to="/aluno/submeter"
              className={`px-4 py-2 rounded-xl flex items-center gap-1.5 transition-all ${location.pathname === "/aluno/submeter" ? "bg-amber-50 text-[#f19f17] font-semibold" : "hover:bg-gray-50 hover:text-gray-800"}`}
            >
              <i class="fas fa-upload"></i>
              Submeter
            </Link>
          </nav>

          {/* right topbar */}
          <div className="flex items-center gap-5">
            { /* bell */}
            <button className="text-gray-400 hover:text-amber-500 transition-colors relative">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>
              <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            { /* user photo */}
            <div className="flex items-center gap-3 pl-1">
              <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-sm font-bold">  
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <path d="M12 3a4 4 0 1 0 0 8 4 4 0 0 0 0-8z"></path>
                </svg>
              </div>
              <button onClick={handleLogout} className="text-gray-400 hover:text-red-500 ml-2" title="Sair">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* CONTEÚDO DINÂMICO DO PROJETO */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-8 py-10">
        <Outlet />
      </main>
    </div>
  );
}
