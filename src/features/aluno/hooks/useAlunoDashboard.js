import { useEffect, useState } from "react";

import { getProjetos } from "../../../lib/projetosApi";

import { getDestaques } from "../../../lib/rankingApi";

import { getAlunoPerfil, updateAlunoPerfil } from "../api/alunoApi";

export function useAlunoDashboard() {
  const [perfil, setPerfil] = useState(null);

  const [projetos, setProjetos] = useState([]);

  const [destaques, setDestaques] = useState([]);

  const [erro, setErro] = useState("");

  const [loading, setLoading] = useState(true);

  const [salvandoPerfil, setSalvandoPerfil] = useState(false);

  useEffect(() => {
    let componenteAtivo = true;

    async function carregarDados() {
      setLoading(true);
      setErro("");

      try {
        const perfilData = await getAlunoPerfil();

        const [projetosResultado, destaquesResultado] =
          await Promise.allSettled([getProjetos(), getDestaques({}, 3)]);

        if (!componenteAtivo) {
          return;
        }

        setPerfil(perfilData);

        setProjetos(
          projetosResultado.status === "fulfilled" &&
            Array.isArray(projetosResultado.value)
            ? projetosResultado.value
            : [],
        );

        setDestaques(
          destaquesResultado.status === "fulfilled" &&
            Array.isArray(destaquesResultado.value?.destaques)
            ? destaquesResultado.value.destaques
            : [],
        );

        if (
          projetosResultado.status === "rejected" ||
          destaquesResultado.status === "rejected"
        ) {
          setErro("Algumas informações do painel não puderam ser carregadas.");
        }
      } catch (error) {
        if (!componenteAtivo) {
          return;
        }

        setPerfil(null);
        setProjetos([]);
        setDestaques([]);

        setErro(error.message || "Não foi possível carregar seu perfil.");
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
    destaques,
    erro,
    loading,
    salvandoPerfil,
    salvarPerfil,
  };
}
