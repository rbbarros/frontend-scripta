import { Routes, Route } from "react-router-dom";
import Login from "../features/auth/pages/Login";
import Register from "../features/auth/pages/Register";
import CoordenacaoRoutes from "../features/coordenacao/routes";

export default function AppRoutes() {
  return (
    <Routes>
      {/* Rotas Públicas */}
      <Route path="/" element={<Login />} />
      <Route path="/cadastro" element={<Register />} />

      {/* Rotas da Coordenação */}
      <Route path="/coordenacao/*" element={<CoordenacaoRoutes />} />
    </Routes>
  );
}
