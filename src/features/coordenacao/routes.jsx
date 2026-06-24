import { Routes, Route } from "react-router-dom";
import CoordenacaoLayout from "./components/CoordenacaoLayout";
import Dashboard from "./pages/Dashboard";
import Relatorios from "./pages/Relatorios";
import Usuarios from "./pages/Usuarios";
import Projetos from "./pages/Projetos";
import Certificados from "./pages/Certificados";
import Monitoramento from "./pages/Monitoramento";

export default function CoordenacaoRoutes() {
  return (
    <Routes>
      <Route element={<CoordenacaoLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="usuarios" element={<Usuarios />} />
        <Route path="projetos" element={<Projetos />} />
        <Route path="monitoramento" element={<Monitoramento />} />
        <Route path="relatorios" element={<Relatorios />} />
        <Route path="certificados" element={<Certificados />} />
      </Route>
    </Routes>
  );
}
