import { useState, useEffect, useCallback } from "react";
import { getAlunoPerfil } from "../api/alunoApi";
import { getProjetos } from "../../../lib/projetosApi";
import { getPortfolioList, createPortfolio, deletarPortfolio, updatePortfolio } from "../../../lib/portfolioApi";; // TODO: Extrair dps

export function useAlunoPortfolio() {
  const [perfil, setPerfil] = useState(null);
  const [projetos, setProjetos] = useState([]);
  const [portfolios, setPortfolios] = useState([]);
  const [loading, setLoading] = useState(true);

  const carregarDados = useCallback(async () => {
    try {
      const [projRes, portRes] = await Promise.allSettled([
        getProjetos(),
        getPortfolioList()
      ]);
      if (projRes.status === "fulfilled") setProjetos(Array.isArray(projRes.value) ? projRes.value : []);
      if (portRes.status === "fulfilled") setPortfolios(Array.isArray(portRes.value) ? portRes.value : []);
    } catch (e) {
      console.error(e);
    }
  }, []);

  useEffect(() => {
    async function init() {
      try {
        const p = await getAlunoPerfil();
        setPerfil(p);
      } catch (e) {
        console.error(e);
      }
      await carregarDados();
      setLoading(false);
    }
    init();
  }, [carregarDados]);

  const adicionarAoPortfolio = async (projetoId, visibilidade) => {
    if (!perfil?.id) throw new Error("Perfil não carregado.");
    await createPortfolio({ aluno_id: perfil.id, projeto_id: Number(projetoId), visibilidade });
    await carregarDados();
  };

  const removerDoPortfolio = async (id) => {
    await deletarPortfolio(id);
    await carregarDados();
  };

  const toggleVisibilidade = async (item) => {
    const nova = item.visibilidade === "publico" ? "privado" : "publico";
    await updatePortfolio(item.id, { visibilidade: nova });
    await carregarDados();
  };

  return {
    perfil,
    projetos,
    portfolios,
    loading,
    adicionarAoPortfolio,
    removerDoPortfolio,
    toggleVisibilidade
  };
}
