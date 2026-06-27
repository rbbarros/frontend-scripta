import { useEffect, useState } from "react";

import { getPortfoliosPublicos } from "../../../lib/portfolioApi";
import { getDestaques, getRanking } from "../../../lib/rankingApi";

import { getEmpresaPerfil } from "../api/empresaApi";

export function useDashboardData() {
  const [perfil, setPerfil] = useState(null);

  const [projetos, setProjetos] = useState([]);

  const [portfolios, setPortfolios] = useState([]);

  const [destaques, setDestaques] = useState([]);

  const [loading, setLoading] = useState(true);

  const [erro, setErro] = useState("");

  useEffect(() => {
    let componenteAtivo = true;

    async function carregarDados() {
      setLoading(true);
      setErro("");

      try {
        const [perfilData, rankingData, portfoliosData, destaquesData] =
          await Promise.all([
            getEmpresaPerfil(),
            getRanking(),
            getPortfoliosPublicos(),
            getDestaques({}, 3),
          ]);

        if (!componenteAtivo) {
          return;
        }

        setPerfil(perfilData);

        setProjetos(
          Array.isArray(rankingData?.ranking) ? rankingData.ranking : [],
        );

        setPortfolios(Array.isArray(portfoliosData) ? portfoliosData : []);

        setDestaques(
          Array.isArray(destaquesData?.destaques)
            ? destaquesData.destaques
            : [],
        );
      } catch (error) {
        if (!componenteAtivo) {
          return;
        }

        setPerfil(null);
        setProjetos([]);
        setPortfolios([]);
        setDestaques([]);

        setErro(error.message || "Não foi possível carregar o dashboard.");
      } finally {
        if (componenteAtivo) {
          setLoading(false);
        }
      }
    }

    carregarDados();

    return () => {
      componenteAtivo = false;
    };
  }, []);

  return {
    perfil,
    projetos,
    portfolios,
    destaques,
    loading,
    erro,
  };
}
