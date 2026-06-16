import { Route, Routes } from "react-router-dom";
import AlunoLayout from "./components/AlunoLayout";
import Dashboard from "./pages/Dashboard";
import Portfolio from "./pages/Portfolio";
import FeaturePage from "./pages/FeaturePage";

export default function AlunoRoutes() {
  return (
    <Routes>
      <Route element={<AlunoLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="buscar" element={<FeaturePage title="Buscar" description="Explore projetos publicados por outros alunos e encontre referências para o seu próprio trabalho." />} />
        <Route path="ranking" element={<FeaturePage title="Ranking" description="Veja a classificação dos melhores projetos e acompanhe os destaques da turma." />} />
        <Route path="certificados" element={<FeaturePage title="Certificados" description="Acesse seus certificados e acompanhe as emissões vinculadas aos seus projetos e atividades." />} />
        <Route path="portfolio" element={<Portfolio />} />
        <Route path="projetos" element={<FeaturePage title="Meus Projetos" description="Centralize seus projetos, status, entregas e histórico de publicação." />} />
        <Route path="submeter" element={<FeaturePage title="Submeter" description="Envie um novo projeto integrador para análise e acompanhamento." />} />
      </Route>
    </Routes>
  );
}
