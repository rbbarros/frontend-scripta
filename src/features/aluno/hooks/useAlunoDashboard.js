import { useEffect, useState } from "react";
import { getProjetos } from "../../../lib/projetosApi";
import { getAlunoPerfil, updateAlunoPerfil } from "../api/alunoApi";
export function useAlunoDashboard() {
  const [perfil, setPerfil] = useState(null);
  const [projetos, setProjetos] = useState([]);
  const [erro, setErro] = useState("");
  const [loading, setLoading] = useState(true);
  const [salvandoPerfil, setSalvandoPerfil] = useState(false);

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

  async function salvarPerfil(dados) {
    setSalvandoPerfil(true);
    setErro("");

    try {
      await updateAlunoPerfil(dados);

      setPerfil((perfilAtual) => ({
        ...perfilAtual,
        ...dados,
      }));

      return true;
    } catch (error) {
      setErro(error.message || "Não foi possível atualizar o perfil.");

      return false;
    } finally {
      setSalvandoPerfil(false);
    }
  }

  return {
    perfil,
    projetos,
    erro,
    loading,
    salvandoPerfil,
    salvarPerfil,
  };
}
