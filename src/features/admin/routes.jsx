import { Route, Routes } from "react-router-dom";
import AdminLayout from "./components/AdminLayout";
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
