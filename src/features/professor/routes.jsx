import { Routes, Route } from "react-router-dom";
import ProfessorLayout from "./components/ProfessorLayout";
import Dashboard from "./pages/Dashboard";
import Projetos from "./pages/Projetos";
import Avaliacoes from "./pages/Avaliacoes";
import Ranking from "./pages/Ranking";
import Perfil from "./pages/Perfil";

export default function ProfessorRoutes() {
  return (
    <Routes>
      <Route element={<ProfessorLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="projetos" element={<Projetos />} />
        <Route path="avaliacoes" element={<Avaliacoes />} />
        <Route path="ranking" element={<Ranking />} />
        <Route path="perfil" element={<Perfil />} />
      </Route>
    </Routes>
  );
}
