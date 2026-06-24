import { useState, useEffect, useCallback } from "react";
import { getProfessorPerfil } from "../api/professorApi";
import { getProjetos } from "../../../lib/projetosApi";; // Mantemos authService por enquanto

export function useProfessorDashboard() {
  const [perfil, setPerfil] = useState(null);
  const [projetos, setProjetos] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDados = useCallback(async () => {
    setLoading(true);
    try {
      const p = await getProfessorPerfil();
      setPerfil(p);
    } catch (e) {
      console.error(e);
    }

    try {
      const data = await getProjetos();
      setProjetos(Array.isArray(data) ? data : []);
    } catch (e) {
      setProjetos([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDados();
  }, [fetchDados]);

  return { perfil, projetos, loading };
}
