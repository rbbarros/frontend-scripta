import SidebarLayout from "../../../components/SidebarLayout";

const navItems = [
  { to: "/professor", end: true, icon: "📊", label: "Dashboard" },
  { to: "/professor/projetos", icon: "📁", label: "Projetos" },
  { to: "/professor/avaliacoes", icon: "📝", label: "Avaliar" },
  { to: "/professor/historico", icon: "📜", label: "Histórico" },
  { to: "/professor/ranking", icon: "🏆", label: "Ranking" },
  { to: "/professor/perfil", icon: "👤", label: "Perfil" },
];

export default function ProfessorLayout() {
  return (
    <SidebarLayout
      titulo="Scripta · Professor"
      perfilLabel="Professor"
      accentColor="purple"
      navItems={navItems}
    />
  );
}
