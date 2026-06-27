import { useEffect, useState } from "react";

import { getPortfolioPorId } from "../../../lib/portfolioApi";
import { getLinksDoProjeto, getProjetoPorId } from "../../../lib/projetosApi";

export function usePortfolioDetalhes(id) {
  const [portfolio, setPortfolio] = useState(null);

  const [projeto, setProjeto] = useState(null);

  const [links, setLinks] = useState([]);

  const [loading, setLoading] = useState(true);

  const [erro, setErro] = useState("");

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }

    let componenteAtivo = true;

    async function carregarDetalhes() {
      setLoading(true);
      setErro("");

      try {
        const portfolioData = await getPortfolioPorId(id);

        const [projetoResultado, linksResultado] = await Promise.allSettled([
          getProjetoPorId(portfolioData.projeto_id),

          getLinksDoProjeto(portfolioData.projeto_id),
        ]);

        if (!componenteAtivo) {
          return;
        }

        setPortfolio(portfolioData);

        setProjeto(
          projetoResultado.status === "fulfilled"
            ? projetoResultado.value
            : null,
        );

        setLinks(
          linksResultado.status === "fulfilled" &&
            Array.isArray(linksResultado.value)
            ? linksResultado.value
            : [],
        );
      } catch (error) {
        if (!componenteAtivo) {
          return;
        }

        setPortfolio(null);
        setProjeto(null);
        setLinks([]);

        setErro(error.message || "Não foi possível carregar o portfólio.");
      } finally {
        if (componenteAtivo) {
          setLoading(false);
        }
      }
    }

    carregarDetalhes();

    return () => {
      componenteAtivo = false;
    };
  }, [id]);

  return {
    portfolio,
    projeto,
    links,
    loading,
    erro,
  };
}
