import { useEffect, useState } from "react";

import { getRanking } from "../../../lib/rankingApi";

export function useEmpresaProjetos() {
  const [projetos, setProjetos] = useState([]);

  const [loading, setLoading] = useState(true);

  const [erro, setErro] = useState("");

  useEffect(() => {
    let componenteAtivo = true;

    async function carregarProjetos() {
      setLoading(true);
      setErro("");

      try {
        const data = await getRanking();

        if (!componenteAtivo) {
          return;
        }

        setProjetos(Array.isArray(data?.ranking) ? data.ranking : []);
      } catch (error) {
        if (!componenteAtivo) {
          return;
        }

        setProjetos([]);

        setErro(
          error.message || "Não foi possível carregar os projetos públicos.",
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
