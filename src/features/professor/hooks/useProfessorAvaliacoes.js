import { useState, useEffect, useCallback } from "react";
import { getProjetos } from "../../../lib/projetosApi";; // Mantemos authService por enquanto
import { getProfessorPerfil } from "../api/professorApi";

export function useProfessorAvaliacoes() {
  const [projetos, setProjetos] = useState([]);
  const [perfil, setPerfil] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchDados = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getProjetos();
      setProjetos(Array.isArray(data) ? data : []);
    } catch (e) {
      setProjetos([]);
    }

    try {
      const p = await getProfessorPerfil();
      setPerfil(p);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDados();
  }, [fetchDados]);

  return { projetos, perfil, loading };
}
