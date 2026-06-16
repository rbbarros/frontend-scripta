import { Routes, Route } from "react-router-dom";
import CoordenacaoLayout from "./components/CoordenacaoLayout";
import Dashboard from "./pages/Dashboard";
import Relatorios from "./pages/Relatorios";

export default function CoordenacaoRoutes() {
  return (
    <Routes>
      <Route element={<CoordenacaoLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="relatorios" element={<Relatorios />} />
      </Route>
    </Routes>
  );
}
