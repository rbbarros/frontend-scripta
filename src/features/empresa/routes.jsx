import { Route, Routes } from "react-router-dom";
import EmpresaLayout from "./components/EmpresaLayout";
import Dashboard from "./pages/Dashboard";
import Oportunidades from "./pages/Oportunidades";
import Talentos from "./pages/Talentos";

export default function EmpresaRoutes() {
  return (
    <Routes>
      <Route element={<EmpresaLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="talentos" element={<Talentos />} />
        <Route path="oportunidades" element={<Oportunidades />} />
      </Route>
    </Routes>
  );
}
