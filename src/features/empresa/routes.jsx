import { Route, Routes } from "react-router-dom";
import EmpresaLayout from "./components/EmpresaLayout";
import Dashboard from "./pages/Dashboard";
import Oportunidades from "./pages/Oportunidades";

export default function EmpresaRoutes() {
  return (
    <Routes>
      <Route element={<EmpresaLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="oportunidades" element={<Oportunidades />} />
      </Route>
    </Routes>
  );
}
