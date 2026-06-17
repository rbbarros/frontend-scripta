import { Route, Routes } from "react-router-dom";
import EmpresaLayout from "./components/EmpresaLayout";
import Dashboard from "./pages/Dashboard";
import Projetos from "./pages/Projetos";
import Talentos from "./pages/Talentos";
import Ranking from "./pages/Ranking";
import Perfil from "./pages/Perfil";

export default function EmpresaRoutes() {
  return (
    <Routes>
      <Route element={<EmpresaLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="projetos" element={<Projetos />} />
        <Route path="talentos" element={<Talentos />} />
        <Route path="ranking" element={<Ranking />} />
        <Route path="perfil" element={<Perfil />} />
      </Route>
    </Routes>
  );
}
