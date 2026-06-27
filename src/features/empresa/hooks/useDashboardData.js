import { useState, useEffect } from "react";
import { getEmpresaPerfil } from "../api/empresaApi";
import { getProjetos } from "../../../lib/projetosApi";
import { getPortfoliosPublicos } from "../../../lib/portfolioApi";
export function useDashboardData() {
  const [perfil, setPerfil] = useState(null);
  const [projetos, setProjetos] = useState([]);
  const [portfolios, setPortfolios] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [perfilData, projetosData, portfoliosData] = await Promise.all([
          getEmpresaPerfil(),
          getProjetos(),
          getPortfoliosPublicos(),
        ]);

        setPerfil(perfilData);
        setProjetos(Array.isArray(projetosData) ? projetosData : []);
        setPortfolios(Array.isArray(portfoliosData) ? portfoliosData : []);
      } catch (error) {
        console.error("Erro ao buscar dados do dashboard:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  return { perfil, projetos, portfolios, loading };
}
