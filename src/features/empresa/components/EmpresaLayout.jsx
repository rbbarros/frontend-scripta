import SidebarLayout from "../../../components/SidebarLayout";

const navItems = [
  { to: "/empresa", end: true, icon: "📊", label: "Dashboard" },
  { to: "/empresa/projetos", icon: "📁", label: "Projetos" },
  { to: "/empresa/talentos", icon: "🎯", label: "Talentos" },
  { to: "/empresa/ranking", icon: "🏆", label: "Ranking" },
  { to: "/empresa/perfil", icon: "🏢", label: "Perfil" },
];

export default function EmpresaLayout() {
  return (
    <SidebarLayout
      titulo="Scripta · Empresa"
      perfilLabel="Empresa Parceira"
      accentColor="blue"
      navItems={navItems}
    />
  );
}
