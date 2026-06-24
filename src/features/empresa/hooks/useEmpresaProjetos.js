import { useState, useEffect } from "react";
import { getProjetos } from "../../../lib/projetosApi";; // TODO: Extrair para projetosApi no futuro

export function useEmpresaProjetos() {
  const [projetos, setProjetos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProjetos() {
      try {
        const data = await getProjetos();
        setProjetos(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Erro ao buscar projetos:", error);
        setProjetos([]);
      } finally {
        setLoading(false);
      }
    }
    
    fetchProjetos();
  }, []);

  return { projetos, loading };
}
