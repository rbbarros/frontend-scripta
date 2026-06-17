import { Routes, Route } from "react-router-dom";
import CoordenacaoLayout from "./components/CoordenacaoLayout";
import Dashboard from "./pages/Dashboard";
import Usuarios from "./pages/Usuarios";
import Projetos from "./pages/Projetos";
import Relatorios from "./pages/Relatorios";
import Certificados from "./pages/Certificados";
import Ranking from "./pages/Ranking";
import Logs from "./pages/Logs";
import Perfil from "./pages/Perfil";

export default function CoordenacaoRoutes() {
  return (
    <Routes>
      <Route element={<CoordenacaoLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="usuarios" element={<Usuarios />} />
        <Route path="projetos" element={<Projetos />} />
        <Route path="relatorios" element={<Relatorios />} />
        <Route path="certificados" element={<Certificados />} />
        <Route path="ranking" element={<Ranking />} />
        <Route path="logs" element={<Logs />} />
        <Route path="perfil" element={<Perfil />} />
      </Route>
    </Routes>
  );
}
