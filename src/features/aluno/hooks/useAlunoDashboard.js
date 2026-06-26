import { useEffect, useState } from "react";
import { getProjetos } from "../../../lib/projetosApi";
import { getAlunoPerfil } from "../api/alunoApi";

export function useAlunoDashboard() {
  const [perfil, setPerfil] = useState(null);
  const [projetos, setProjetos] = useState([]);
  const [erro, setErro] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let componenteAtivo = true;

    async function carregarDados() {
      setLoading(true);
      setErro("");

      try {
        const [perfilData, projetosData] = await Promise.all([
          getAlunoPerfil(),
          getProjetos(),
        ]);

        if (!componenteAtivo) {
          return;
        }

        setPerfil(perfilData);

        setProjetos(Array.isArray(projetosData) ? projetosData : []);
      } catch (error) {
        if (!componenteAtivo) {
          return;
        }

        setPerfil(null);
        setProjetos([]);

        setErro(
          error.message || "Não foi possível carregar os dados do aluno.",
        );
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
    erro,
    loading,
  };
}
