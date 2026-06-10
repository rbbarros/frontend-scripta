import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Login from "../features/auth/pages/Login";
import StudentRoutes from "../features/student/routes";
import ProfessorRoutes from "../features/professor/routes";
import AdminRoutes from "../features/admin/routes";
import CompanyRoutes from "../features/company/routes";
import RealizarAvaliacao from "../features/professor/pages/RealizarAvaliacao";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/aluno/*" element={<StudentRoutes />} />
        <Route path="/professor/*" element={<ProfessorRoutes />} />
        <Route path="/admin/*" element={<AdminRoutes />} />
        <Route path="/company/*" element={<CompanyRoutes />} />
        <Route path="/professor-old" element={<RealizarAvaliacao />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
