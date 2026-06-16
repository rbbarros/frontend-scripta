import { NavLink, Outlet, useNavigate } from "react-router-dom";

export default function EmpresaLayout() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("scripta_token");
    localStorage.removeItem("scripta_user_type");
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-gray-700">
      <header className="bg-white border-b border-gray-100 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white text-xl shadow-sm">🏢</div>
          <span className="text-xl font-bold text-gray-900 tracking-tight">Scripta · Empresa</span>
        </div>

        <nav className="hidden lg:flex items-center gap-2 text-sm font-medium text-gray-500">
          <NavLink to="/empresa" end className={({ isActive }) => `px-4 py-2 rounded-xl transition-all ${isActive ? "bg-blue-50 text-blue-700 font-semibold" : "hover:bg-gray-50 hover:text-gray-800"}`}>
            📌 Painel
          </NavLink>
          <NavLink to="/empresa/oportunidades" className={({ isActive }) => `px-4 py-2 rounded-xl transition-all ${isActive ? "bg-blue-50 text-blue-700 font-semibold" : "hover:bg-gray-50 hover:text-gray-800"}`}>
            💼 Oportunidades
          </NavLink>
        </nav>

        <button onClick={handleLogout} className="rounded-xl border border-gray-200 px-3 py-2 text-xs hover:border-blue-500 hover:text-blue-700 transition-colors">Sair</button>
      </header>

      <main className="px-6 py-8">
        <Outlet />
      </main>
    </div>
  );
}
