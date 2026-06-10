import React from "react";
import { useNavigate, Link, useLocation, Outlet } from "react-router-dom";

export default function AlunoLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex flex-col font-sans text-gray-700 antialiased">
      {/* NAVBAR SUPERIOR (IDÊNTICA AO FIGMA) */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-50 px-8 py-4 flex items-center justify-between">
        {/* LOGO SCRIPTADA */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#f19f17] rounded-xl flex items-center justify-center text-white text-xl shadow-sm">
            🎓
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
            🏠 Início
          </Link>

          <button className="hover:bg-gray-50 hover:text-gray-800 px-4 py-2 rounded-xl flex items-center gap-1.5 transition-all">
            🔍 Buscar
          </button>

          <button className="hover:bg-gray-50 hover:text-gray-800 px-4 py-2 rounded-xl flex items-center gap-1.5 transition-all">
            🥈 Ranking
          </button>

          <button className="hover:bg-gray-50 hover:text-gray-800 px-4 py-2 rounded-xl flex items-center gap-1.5 transition-all">
            📜 Certificados
          </button>

          <Link
            to="/aluno/portfolio"
            className={`px-4 py-2 rounded-xl flex items-center gap-1.5 transition-all ${location.pathname === "/aluno/portfolio" ? "bg-amber-50 text-[#f19f17] font-semibold" : "hover:bg-gray-50 hover:text-gray-800"}`}
          >
            💼 Portfólio
          </Link>

          <button className="hover:bg-gray-50 hover:text-gray-800 px-4 py-2 rounded-xl flex items-center gap-1.5 transition-all">
            📂 Meus Projetos
          </button>

          <button className="hover:bg-gray-50 hover:text-gray-800 px-4 py-2 rounded-xl flex items-center gap-1.5 transition-all">
            📤 Submeter
          </button>
        </nav>

        {/* ÍCONES DA DIREITA: NOTIFICAÇÃO + AVATAR DE USUÁRIO */}
        <div className="flex items-center gap-4">
          <button className="relative p-2 text-gray-400 hover:text-gray-600 rounded-full transition-colors">
            🔔{" "}
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>

          {/* Avatar Laranja do Figma que desloga ao clicar */}
          <div
            onClick={() => navigate("/login")}
            title="Clique para deslogar"
            className="w-10 h-10 bg-[#f19f17] hover:bg-[#d68a12] text-white rounded-full flex items-center justify-center font-bold shadow-sm cursor-pointer transition-colors"
          >
            👤
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
