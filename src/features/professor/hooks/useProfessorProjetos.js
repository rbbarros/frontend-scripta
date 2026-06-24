import { useState, useEffect, useCallback } from "react";
import { getProjetos } from "../../../lib/projetosApi";; // Manter por enquanto

export function useProfessorProjetos() {
  const [projetos, setProjetos] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchProjetos = useCallback(async () => {
    setLoading(true);
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
    fetchProjetos();
  }, [fetchProjetos]);

  return { projetos, loading };
}
