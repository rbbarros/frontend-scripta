import { Routes, Route } from "react-router-dom";
import Login from "../features/auth/pages/Login";
import Register from "../features/auth/pages/Register";
import AdminRoutes from "../features/admin/routes";

export default function AppRoutes() {
  return (
    <Routes>
      {/* Rotas Públicas */}
      <Route path="/" element={<Login />} />
      <Route path="/cadastro" element={<Register />} />

      {/* Rotas do Admin */}
      <Route path="/admin/*" element={<AdminRoutes />} />
    </Routes>
  );
}
