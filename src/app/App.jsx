import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "../features/auth/pages/Login";
import Register from "../features/auth/pages/Register";
import RegisterAluno from "../features/auth/pages/RegisterAluno";
import RegisterProfessor from "../features/auth/pages/RegisterProfessor";
import RegisterEmpresa from "../features/auth/pages/RegisterEmpresa";
import CoordenacaoRoutes from "../features/coordenacao/routes";
import AlunoRoutes from "../features/aluno/routes";
import ProfessorRoutes from "../features/professor/routes";
import EmpresaRoutes from "../features/empresa/routes";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/cadastro" element={<Register />} />

        <Route path="/cadastro/aluno" element={<RegisterAluno />} />
        <Route path="/cadastro/professor" element={<RegisterProfessor />} />
        <Route path="/cadastro/empresa" element={<RegisterEmpresa />} />

        <Route path="/aluno/*" element={<AlunoRoutes />} />
        <Route path="/professor/*" element={<ProfessorRoutes />} />
        <Route path="/empresa/*" element={<EmpresaRoutes />} />
        <Route path="/coordenacao/*" element={<CoordenacaoRoutes />} />
      </Routes>
    </BrowserRouter>
  );
}
