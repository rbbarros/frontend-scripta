import { useState, useEffect, useCallback } from "react";
import { getProjetos } from "../../../lib/projetosApi";; // Manter authService por enquanto

export function useProfessorRanking() {
  const [projetos, setProjetos] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRanking = useCallback(async () => {
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
    fetchRanking();
  }, [fetchRanking]);

  return { projetos, loading };
}
