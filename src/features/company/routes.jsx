import { Route, Routes } from "react-router-dom";
import CompanyLayout from "./components/CompanyLayout";
import Dashboard from "./pages/Dashboard";
import Oportunidades from "./pages/Oportunidades";

export default function CompanyRoutes() {
  return (
    <Routes>
      <Route element={<CompanyLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="oportunidades" element={<Oportunidades />} />
      </Route>
    </Routes>
  );
}
