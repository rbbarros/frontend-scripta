import { useState, useEffect } from "react";
import { getAlunos } from "../../aluno/api/alunoApi";

export function useEmpresaPortfolios() {
  const [alunos, setAlunos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPortfolios() {
      try {
        const data = await getAlunos();
        setAlunos(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Erro ao buscar alunos:", error);
        setAlunos([]);
      } finally {
        setLoading(false);
      }
    }
    
    fetchPortfolios();
  }, []);

  return { alunos, loading };
}
