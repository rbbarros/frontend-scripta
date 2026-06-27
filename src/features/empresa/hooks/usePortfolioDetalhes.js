import { useEffect, useState } from "react";

import { getPortfoliosDoAluno } from "../../../lib/portfolioApi";

import { getLinksDoProjeto, getProjetoPorId } from "../../../lib/projetosApi";

export function usePortfolioDetalhes(alunoId) {
  const [aluno, setAluno] = useState(null);

  const [projetos, setProjetos] = useState([]);

  const [loading, setLoading] = useState(true);

  const [erro, setErro] = useState("");

  useEffect(() => {
    if (!alunoId) {
      setAluno(null);
      setProjetos([]);
      setErro("Aluno não identificado.");
      setLoading(false);

      return;
    }

    let componenteAtivo = true;

    async function carregarDetalhes() {
      setLoading(true);
      setErro("");

      try {
        const portfolios = await getPortfoliosDoAluno(alunoId);

        if (!Array.isArray(portfolios) || portfolios.length === 0) {
          throw new Error(
            "Este estudante não possui projetos públicos no portfólio.",
          );
        }

        const resultados = await Promise.all(
          portfolios.map(async (portfolio) => {
            const [projetoResultado, linksResultado] = await Promise.allSettled(
              [
                getProjetoPorId(portfolio.projeto_id),
                getLinksDoProjeto(portfolio.projeto_id),
              ],
            );

            return {
              portfolio_id: portfolio.id,

              projeto_id: portfolio.projeto_id,

              titulo: portfolio.titulo_projeto,

              curso: portfolio.curso,

              semestre: portfolio.semestre,

              detalhes:
                projetoResultado.status === "fulfilled"
                  ? projetoResultado.value
                  : null,

              links:
                linksResultado.status === "fulfilled" &&
                Array.isArray(linksResultado.value)
                  ? linksResultado.value
                  : [],
            };
          }),
        );

        if (!componenteAtivo) {
          return;
        }

        const cursos = [
          ...new Set(
            portfolios.map((portfolio) => portfolio.curso).filter(Boolean),
          ),
        ].sort((a, b) => a.localeCompare(b, "pt-BR"));

        const semestres = [
          ...new Set(
            portfolios.map((portfolio) => portfolio.semestre).filter(Boolean),
          ),
        ].sort((a, b) => a.localeCompare(b, "pt-BR"));

        setAluno({
          id: Number(alunoId),

          nome: portfolios[0].nome_aluno,

          cursos,

          semestres,
        });

        setProjetos(resultados);
      } catch (error) {
        if (!componenteAtivo) {
          return;
        }

        setAluno(null);
        setProjetos([]);

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
  }, [alunoId]);

  return {
    aluno,
    projetos,
    loading,
    erro,
  };
}
