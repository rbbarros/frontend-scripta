import { useCallback, useEffect, useState } from "react";

import { getProjetos } from "../../../lib/projetosApi";

import {
  createPortfolio,
  deletarPortfolio,
  getMeusPortfolios,
  updatePortfolio,
} from "../../../lib/portfolioApi";

export function useAlunoPortfolio() {
  const [projetos, setProjetos] = useState([]);

  const [portfolios, setPortfolios] = useState([]);

  const [loading, setLoading] = useState(true);

  const [erro, setErro] = useState("");

  const [processandoId, setProcessandoId] = useState(null);

  const carregarDados = useCallback(async (mostrarLoading = true) => {
    if (mostrarLoading) {
      setLoading(true);
    }

    setErro("");

    try {
      const [projetosData, portfoliosData] = await Promise.all([
        getProjetos(),
        getMeusPortfolios(),
      ]);

      setProjetos(Array.isArray(projetosData) ? projetosData : []);

      setPortfolios(Array.isArray(portfoliosData) ? portfoliosData : []);
    } catch (error) {
      setProjetos([]);
      setPortfolios([]);

      setErro(error.message || "Não foi possível carregar o portfólio.");
    } finally {
      if (mostrarLoading) {
        setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    carregarDados();
  }, [carregarDados]);

  async function adicionarAoPortfolio(projetoId, visibilidade) {
    setProcessandoId("adicionar");
    setErro("");

    try {
      await createPortfolio({
        projeto_id: Number(projetoId),
        visibilidade,
      });

      await carregarDados(false);

      return true;
    } catch (error) {
      setErro(
        error.message || "Não foi possível adicionar o projeto ao portfólio.",
      );

      return false;
    } finally {
      setProcessandoId(null);
    }
  }

  async function alterarVisibilidade(portfolioId, visibilidade) {
    setProcessandoId(`visibilidade-${portfolioId}`);

    setErro("");

    try {
      await updatePortfolio(portfolioId, {
        visibilidade,
      });

      setPortfolios((portfoliosAtuais) =>
        portfoliosAtuais.map((portfolio) =>
          portfolio.id === portfolioId
            ? {
                ...portfolio,
                visibilidade,
              }
            : portfolio,
        ),
      );

      return true;
    } catch (error) {
      setErro(error.message || "Não foi possível alterar a visibilidade.");

      return false;
    } finally {
      setProcessandoId(null);
    }
  }

  async function removerDoPortfolio(portfolioId) {
    setProcessandoId(`remover-${portfolioId}`);

    setErro("");

    try {
      await deletarPortfolio(portfolioId);

      setPortfolios((portfoliosAtuais) =>
        portfoliosAtuais.filter((portfolio) => portfolio.id !== portfolioId),
      );

      return true;
    } catch (error) {
      setErro(
        error.message || "Não foi possível remover o projeto do portfólio.",
      );

      return false;
    } finally {
      setProcessandoId(null);
    }
  }

  return {
    projetos,
    portfolios,
    loading,
    erro,
    processandoId,
    adicionarAoPortfolio,
    alterarVisibilidade,
    removerDoPortfolio,
  };
}
