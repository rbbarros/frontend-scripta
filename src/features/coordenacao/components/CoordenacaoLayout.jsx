import SidebarLayout from "../../../components/SidebarLayout";

const navItems = [
  { to: "/coordenacao", end: true, icon: "📊", label: "Dashboard" },
  { to: "/coordenacao/usuarios", icon: "👥", label: "Usuários" },
  { to: "/coordenacao/projetos", icon: "📁", label: "Projetos" },
  { to: "/coordenacao/relatorios", icon: "📈", label: "Relatórios" },
  { to: "/coordenacao/certificados", icon: "🎖️", label: "Certificados" },
  { to: "/coordenacao/ranking", icon: "🏆", label: "Ranking" },
  { to: "/coordenacao/logs", icon: "🛡️", label: "Auditoria" },
  { to: "/coordenacao/perfil", icon: "👤", label: "Perfil" },
];

export default function CoordenacaoLayout() {
  return (
    <SidebarLayout
      titulo="Scripta · Coordenação"
      perfilLabel="Coordenação"
      accentColor="emerald"
      navItems={navItems}
    />
  );
}
