import { useState, useEffect } from "react";
import { getAlunoPerfil } from "../api/alunoApi";
import { getProjetos } from "../../../lib/projetosApi";; // TODO: Mover futuramente

export function useAlunoProjetos() {
  const [projetos, setProjetos] = useState([]);
  const [meusProjetos, setMeusProjetos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [perfilRes, projetosRes] = await Promise.allSettled([
          getAlunoPerfil(),
          getProjetos()
        ]);

        let perfilId = null;
        if (perfilRes.status === "fulfilled" && perfilRes.value) {
          perfilId = perfilRes.value.id;
        }

        let allProjetos = [];
        if (projetosRes.status === "fulfilled" && Array.isArray(projetosRes.value)) {
          allProjetos = projetosRes.value;
          setProjetos(allProjetos);
        }

        if (perfilId) {
          setMeusProjetos(allProjetos.filter(p => p.aluno_responsavel_id === perfilId));
        }

      } catch (error) {
        console.error("Erro ao carregar projetos do aluno:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  return { projetos, meusProjetos, loading };
}
