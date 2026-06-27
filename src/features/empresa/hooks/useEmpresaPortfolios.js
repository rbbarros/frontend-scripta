import { useEffect, useState } from "react";
import { getPortfoliosPublicos } from "../../../lib/portfolioApi";

export function useEmpresaPortfolios() {
  const [portfolios, setPortfolios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");

  useEffect(() => {
    let componenteAtivo = true;

    async function carregarPortfolios() {
      setLoading(true);
      setErro("");

      try {
        const data = await getPortfoliosPublicos();

        if (!componenteAtivo) {
          return;
        }

        setPortfolios(Array.isArray(data) ? data : []);
      } catch (error) {
        if (!componenteAtivo) {
          return;
        }

        setPortfolios([]);

        setErro(
          error.message || "Não foi possível carregar os portfólios públicos.",
        );
      } finally {
        if (componenteAtivo) {
          setLoading(false);
        }
      }
    }

    carregarPortfolios();

    return () => {
      componenteAtivo = false;
    };
  }, []);

  return {
    portfolios,
    loading,
    erro,
  };
}
