import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getCoordenadorPerfil } from "../api/coordenacaoApi";

export default function CoordenacaoLayout() {
  const navigate = useNavigate();
  const [perfil, setPerfil] = useState(null);

  useEffect(() => {
    getCoordenadorPerfil()
      .then(setPerfil)
      .catch(() => {});
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("scripta_token");
    localStorage.removeItem("scripta_user_type");
    navigate("/");
  };

  const navLinks = [
    {
      to: "/coordenacao",
      label: "Dashboard",
      icon: "M4 5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v4a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V5Zm0 10a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v4a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-4Zm10-10a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v4a1 1 0 0 1-1 1h-4a1 1 0 0 1-1-1V5Zm0 10a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v4a1 1 0 0 1-1 1h-4a1 1 0 0 1-1-1v-4Z",
      exact: true,
    },
    {
      to: "/coordenacao/usuarios",
      label: "Usuários",
      icon: "M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2 M9 7a4 4 0 1 0 0-8 4 4 0 0 0 0 8z M23 21v-2a4 4 0 0 0-3-3.87 M16 3.13a4 4 0 0 1 0 7.75",
      exact: false,
    },
    {
      to: "/coordenacao/projetos",
      label: "Projetos",
      icon: "M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z",
      exact: false,
    },
    {
      to: "/coordenacao/monitoramento",
      label: "Monitoramento",
      icon: "M18 20V10 M12 20V4 M6 20v-6",
      exact: false,
    },
    {
      to: "/coordenacao/relatorios",
      label: "Relatórios",
      icon: "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z M14 2v6h6 M16 13H8 M16 17H8 M10 9H8",
      exact: false,
    },
    {
      to: "/coordenacao/certificados",
      label: "Certificados",
      icon: "M12 15v5s-2 2-2 4h4s0-2-2-4v-5 M7 6v2a5 5 0 1 0 10 0V6a5 5 0 0 0-10 0z",
      exact: false,
    },
    {
      to: "/coordenacao/ranking",
      label: "Ranking",
      icon: "M2 8h20 M12 2v20 M7 2l5 6 M17 2l-5 6",
      exact: false,
    },
  ];

  return (
    <div className="flex min-h-screen bg-[#FAF8F5] font-sans antialiased text-gray-700">
      {/* Sidebar Esquerda */}
      <aside className="w-64 bg-white border-r border-gray-100 flex flex-col hidden lg:flex sticky top-0 h-screen">
        <div className="p-6 flex items-center gap-3 border-b border-gray-50 mb-4">
          <div className="w-8 h-8 bg-[#f19f17] rounded-lg flex items-center justify-center text-white shadow-sm text-sm">
            🎓
          </div>
          <span className="text-xl font-bold text-gray-900 tracking-tight">
            Scripta
          </span>
          <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full ml-1">
            Coordenação
          </span>
        </div>

        <nav className="flex-1 px-4 space-y-1">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.exact}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all text-sm font-semibold ${
                  isActive
                    ? "bg-amber-50 text-amber-700 border-r-4 border-[#f19f17]"
                    : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                }`
              }
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                {link.icon.split(" M").map((path, i) => (
                  <path key={i} d={i > 0 ? `M${path}` : path} />
                ))}
              </svg>
              {link.label}
            </NavLink>
          ))}
        </nav>
      </aside>

      {/* Conteúdo Principal */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Topbar */}
        <header className="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-8 sticky top-0 z-10">
          <div className="lg:hidden flex items-center gap-2">
            <div className="w-8 h-8 bg-[#f19f17] rounded-lg flex items-center justify-center text-white shadow-sm text-sm">
              🎓
            </div>
            <span className="text-lg font-bold text-gray-900">Scripta</span>
          </div>
          <div className="hidden lg:block"></div>

          <div className="flex items-center gap-5">
            <button className="text-gray-400 hover:text-amber-500 transition-colors relative">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
              </svg>
              <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            <div className="flex items-center gap-3 border-l border-gray-100 pl-5">
              <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center text-sm font-bold">
                {perfil?.nome?.charAt(0) || "C"}
              </div>
              <span className="text-sm font-semibold text-gray-700 hidden md:block">
                Coord. {perfil?.nome?.split(" ")[0] || "Roberto Lemos"}
              </span>
              <button
                onClick={handleLogout}
                className="text-gray-400 hover:text-red-500 ml-2"
                title="Sair"
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                  <polyline points="16 17 21 12 16 7"></polyline>
                  <line x1="21" y1="12" x2="9" y2="12"></line>
                </svg>
              </button>
            </div>
          </div>
        </header>

        <main className="min-w-0 flex-1 overflow-auto p-4 md:p-8">
          <div className="w-full">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
