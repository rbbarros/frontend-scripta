import { Route, Routes } from "react-router-dom";
import AlunoLayout from "./components/AlunoLayout";
import Dashboard from "./pages/Dashboard";
import BuscarProjetos from "./pages/BuscarProjetos";
import Ranking from "./pages/Ranking";
import Certificados from "./pages/Certificados";
import Portfolio from "./pages/Portfolio";
import MeusProjetos from "./pages/MeusProjetos";
import Submeter from "./pages/Submeter";
import Perfil from "./pages/Perfil";

export default function AlunoRoutes() {
  return (
    <Routes>
      <Route element={<AlunoLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="buscar" element={<BuscarProjetos />} />
        <Route path="ranking" element={<Ranking />} />
        <Route path="certificados" element={<Certificados />} />
        <Route path="portfolio" element={<Portfolio />} />
        <Route path="projetos" element={<MeusProjetos />} />
        <Route path="submeter" element={<Submeter />} />
        <Route path="perfil" element={<Perfil />} />
      </Route>
    </Routes>
  );
}
