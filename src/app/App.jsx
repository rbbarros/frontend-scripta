import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "../features/auth/pages/Login";
import Register from "../features/auth/pages/Register";
// Importando as novas telas (vamos criá-las no próximo passo)
import RegisterAluno from "../features/auth/pages/RegisterAluno";
import RegisterProfessor from "../features/auth/pages/RegisterProfessor";
import RegisterEmpresa from "../features/auth/pages/RegisterEmpresa";
import AdminRoutes from "../features/admin/routes";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/cadastro" element={<Register />} />

        {/* Novas rotas dos formulários específicos */}
        <Route path="/cadastro/aluno" element={<RegisterAluno />} />
        <Route path="/cadastro/professor" element={<RegisterProfessor />} />
        <Route path="/cadastro/empresa" element={<RegisterEmpresa />} />

        <Route path="/admin/*" element={<AdminRoutes />} />
      </Routes>
    </BrowserRouter>
  );
}
