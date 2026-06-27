import { Route, Routes } from "react-router-dom";

import EmpresaLayout from "./components/EmpresaLayout";
import Dashboard from "./pages/Dashboard";
import Projetos from "./pages/Projetos";
import Portfolios from "./pages/Portfolios";
import PortfolioDetalhes from "./pages/PortfolioDetalhes";
import EmDestaque from "./pages/EmDestaque";
import Perfil from "./pages/Perfil";

export default function EmpresaRoutes() {
  return (
    <Routes>
      <Route element={<EmpresaLayout />}>
        <Route index element={<Dashboard />} />

        <Route path="projetos" element={<Projetos />} />

        <Route path="portfolios" element={<Portfolios />} />

        <Route
          path="portfolios/aluno/:alunoId"
          element={<PortfolioDetalhes />}
        />

        <Route path="destaque" element={<EmDestaque />} />

        <Route path="perfil" element={<Perfil />} />
      </Route>
    </Routes>
  );
}
