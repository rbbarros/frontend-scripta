import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { clearSession } from "../lib/session";

const accentMap = {
  purple: { logo: "bg-purple-600", active: "bg-purple-50 text-purple-600", tag: "text-purple-600" },
  blue: { logo: "bg-blue-600", active: "bg-blue-50 text-blue-700", tag: "text-blue-700" },
  emerald: { logo: "bg-emerald-600", active: "bg-emerald-50 text-emerald-700", tag: "text-emerald-700" },
  amber: { logo: "bg-[#f19f17]", active: "bg-amber-50 text-[#f19f17]", tag: "text-[#f19f17]" },
};

export default function SidebarLayout({ titulo, perfilLabel, accentColor = "purple", navItems = [] }) {
  const navigate = useNavigate();
  const a = accentMap[accentColor] || accentMap.purple;

  const handleLogout = () => {
    clearSession();
    navigate("/");
  };

  return (
    <div className="flex min-h-screen bg-[#F8F9FA] font-sans text-gray-700">
      <aside className="hidden w-64 shrink-0 flex-col justify-between border-r border-gray-100 bg-white p-6 md:flex">
        <div>
          <div className="mb-10 flex items-center gap-3">
            <div className={`flex h-9 w-10 items-center justify-center rounded-lg text-white ${a.logo}`}>🎓</div>
            <div>
              <span className="block text-lg font-bold leading-tight text-gray-900">Scripta</span>
              <span className={`text-xs font-semibold ${a.tag}`}>{perfilLabel}</span>
            </div>
          </div>

          <nav className="space-y-1.5">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all ${
                    isActive ? `${a.active} font-semibold` : "text-gray-400 hover:bg-gray-50 hover:text-gray-600"
                  }`
                }
              >
                <span>{item.icon}</span> {item.label}
              </NavLink>
            ))}
          </nav>
        </div>

        <button
          onClick={handleLogout}
          className="flex items-center gap-2 rounded-xl border border-gray-100 px-4 py-3 text-sm font-medium text-gray-400 transition-all hover:text-gray-600"
        >
          <span>🚪</span> Sair
        </button>
      </aside>

      <div className="flex-1">
        <header className="flex items-center justify-between border-b border-gray-100 bg-white px-6 py-4 md:hidden">
          <span className="text-lg font-bold text-gray-900">{titulo}</span>
          <button onClick={handleLogout} className="rounded-xl border border-gray-200 px-3 py-2 text-xs">Sair</button>
        </header>
        <main className="mx-auto max-w-6xl px-6 py-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
