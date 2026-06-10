import { Routes, Route } from "react-router-dom";
import AdminLayout from "./components/AdminLayout"; // Garanta que esse import existe
import Dashboard from "./pages/Dashboard";
import Relatorios from "./pages/Relatorios";

export default function AdminRoutes() {
  return (
    <Routes>
      <Route element={<AdminLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="relatorios" element={<Relatorios />} />
      </Route>
    </Routes>
  );
}
