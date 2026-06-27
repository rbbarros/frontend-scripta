import { useEffect, useState } from "react";

import { getProjetosExploraveis } from "../../../lib/projetosApi";

export function useAlunoBuscarProjetos() {
  const [projetos, setProjetos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");

  useEffect(() => {
    let componenteAtivo = true;

    async function carregarProjetos() {
      setLoading(true);
      setErro("");

      try {
        const data = await getProjetosExploraveis();

        if (!componenteAtivo) {
          return;
        }

        setProjetos(Array.isArray(data) ? data : []);
      } catch (error) {
        if (!componenteAtivo) {
          return;
        }

        setProjetos([]);

        setErro(
          error.message || "Não foi possível carregar os projetos disponíveis.",
        );
      } finally {
        if (componenteAtivo) {
          setLoading(false);
        }
      }
    }

    carregarProjetos();

    return () => {
      componenteAtivo = false;
    };
  }, []);

  return {
    projetos,
    loading,
    erro,
  };
}
