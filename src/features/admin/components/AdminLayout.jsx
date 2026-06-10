import { NavLink, Outlet } from "react-router-dom";

export default function AdminLayout() {
  return (
    <div className="min-h-screen bg-[#F8F9FA] text-gray-700">
      <header className="bg-white border-b border-gray-100 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center text-white text-xl shadow-sm">🏛️</div>
          <span className="text-xl font-bold text-gray-900 tracking-tight">Scripta · Coordenação</span>
        </div>

        <nav className="hidden lg:flex items-center gap-2 text-sm font-medium text-gray-500">
          <NavLink to="/admin" end className={({ isActive }) => `px-4 py-2 rounded-xl transition-all ${isActive ? "bg-emerald-50 text-emerald-700 font-semibold" : "hover:bg-gray-50 hover:text-gray-800"}`}>
            📊 Painel
          </NavLink>
          <NavLink to="/admin/relatorios" className={({ isActive }) => `px-4 py-2 rounded-xl transition-all ${isActive ? "bg-emerald-50 text-emerald-700 font-semibold" : "hover:bg-gray-50 hover:text-gray-800"}`}>
            📈 Relatórios
          </NavLink>
        </nav>

        <a href="/" className="rounded-xl border border-gray-200 px-3 py-2 text-xs hover:border-emerald-500 hover:text-emerald-700 transition-colors">Sair</a>
      </header>

      <main className="px-6 py-8">
        <Outlet />
      </main>
    </div>
  );
}
