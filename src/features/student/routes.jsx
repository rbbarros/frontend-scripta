import { Route, Routes } from "react-router-dom";
import AlunoLayout from "./components/AlunoLayout";
import Dashboard from "./pages/Dashboard";
import Portfolio from "./pages/Portfolio";

export default function StudentRoutes() {
  return (
    <Routes>
      <Route element={<AlunoLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="portfolio" element={<Portfolio />} />
      </Route>
    </Routes>
  );
}
