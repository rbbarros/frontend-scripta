import { Route, Routes } from "react-router-dom";
import ProfessorLayout from "./components/ProfessorLayout";
import Dashboard from "./pages/Dashboard";
import Avaliacoes from "./pages/Avaliacoes";

export default function ProfessorRoutes() {
  return (
    <Routes>
      <Route element={<ProfessorLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="avaliacoes" element={<Avaliacoes />} />
      </Route>
    </Routes>
  );
}
