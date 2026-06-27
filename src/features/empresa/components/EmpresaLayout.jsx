import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getEmpresaPerfil } from "../api/empresaApi";
import { ScriptaLogo } from "../../../components/shared/template";

export default function EmpresaLayout() {
  const navigate = useNavigate();
  const [perfil, setPerfil] = useState(null);

  useEffect(() => {
    getEmpresaPerfil()
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
      to: "/empresa",
      label: "Dashboard",
      icon: "M4 5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v4a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V5Zm0 10a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v4a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-4Zm10-10a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v4a1 1 0 0 1-1 1h-4a1 1 0 0 1-1-1V5Zm0 10a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v4a1 1 0 0 1-1 1h-4a1 1 0 0 1-1-1v-4Z",
      exact: true,
    },
    {
      to: "/empresa/projetos",
      label: "Projetos",
      icon: "M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z",
      exact: false,
    },
    {
      to: "/empresa/portfolios",
      label: "Portfólios",
      icon: "M8 7V6.2C8 5.0799 8 4.51984 8.21799 4.09202C8.40973 3.71569 8.71569 3.40973 9.09202 3.21799C9.51984 3 10.0799 3 11.2 3H12.8C13.9201 3 14.4802 3 14.908 3.21799C15.2843 3.40973 15.5903 3.71569 15.782 4.09202C16 4.51984 16 5.0799 16 6.2V7M7 21V7.00169M17 21V7M7 7.00169C7.24373 7 7.50929 7 7.8 7H16M7 7.00169C5.83507 7.00979 5.16873 7.05658 4.63803 7.32698C4.07354 7.6146 3.6146 8.07354 3.32698 8.63803C3 9.27976 3 10.1198 3 11.8V16.2C3 17.8802 3 18.7202 3.32698 19.362C3.6146 19.9265 4.07354 20.3854 4.63803 20.673C5.27976 21 6.11984 21 7.8 21H16.2C17.8802 21 18.7202 21 19.362 20.673C19.9265 20.3854 20.3854 19.9265 20.673 19.362C21 18.7202 21 17.8802 21 16.2V11.8C21 10.1198 21 9.27976 20.673 8.63803C20.3854 8.07354 19.9265 7.6146 19.362 7.32698C18.7202 7 17.8802 7 16.2 7H17M17 7H16",
      exact: false,
    },
    {
      to: "/empresa/destaque",
      label: "Em Destaque",
      icon: "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z",
      exact: false,
    },
    {
      to: "/empresa/perfil",
      label: "Perfil",
      icon: "M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2 M12 3a4 4 0 1 0 0 8 4 4 0 0 0 0-8z",
      exact: false,
    },
  ];

  return (
    <div className="flex min-h-screen bg-[#FAF8F5] font-sans antialiased text-gray-700 flex flex-row">
      <div className="basis-full min-w-0">
        {/* Topbar Left*/}
        <header className="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-4 sticky top-0 z-10 basis-full shadow-sm">
          <div className="flex items-center gap-3 px-2">
            <ScriptaLogo />
          </div>

          {/* mobile */}
          <div className="lg:hidden flex items-center gap-2">
            <ScriptaLogo />
          </div>
          <div className="hidden lg:block"></div>

          {/* Tobar right */}
          <div className="flex items-center gap-5">
            {/* bell */}
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
            {/* user photo */}
            <div className="flex items-center gap-3 pl-1">
              <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-sm font-bold">
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
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <path d="M12 3a4 4 0 1 0 0 8 4 4 0 0 0 0-8z"></path>
                </svg>
              </div>
              <span className="text-sm font-semibold text-gray-700 hidden md:block">
                {perfil?.nome_empresa || "Empresa"}
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
        {/* final topbar */}
        {/* sidebar */}
        <div className="basis-full flex flex-row min-w-0">
          <aside className="w-64 bg-white border-r border-gray-100 flex flex-col hidden lg:flex sticky top-0 h-screen pt-3 shadow-xs">
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
          <main className="min-w-0 flex-1 overflow-auto p-4 md:p-8">
            <div className="w-full">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
