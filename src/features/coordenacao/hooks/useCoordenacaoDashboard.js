import { useCallback, useEffect, useState } from "react";

import { apiRequest } from "../../../lib/api";
import { getProjetos } from "../../../lib/projetosApi";

import { getCoordenadorPerfil } from "../api/coordenacaoApi";

export function useCoordenacaoDashboard() {
  const [perfil, setPerfil] = useState(null);

  const [projetos, setProjetos] = useState([]);

  const [totalUsuarios, setTotalUsuarios] = useState(0);

  const [loading, setLoading] = useState(true);

  const [erro, setErro] = useState("");

  const carregarDados = useCallback(async () => {
    setLoading(true);
    setErro("");

    const resultados = await Promise.allSettled([
      getCoordenadorPerfil(),
      getProjetos(),
      apiRequest("/alunos/"),
      apiRequest("/professores/"),
      apiRequest("/empresas/"),
    ]);

    const [
      perfilResultado,
      projetosResultado,
      alunosResultado,
      professoresResultado,
      empresasResultado,
    ] = resultados;

    if (perfilResultado.status === "fulfilled") {
      setPerfil(perfilResultado.value);
    } else {
      setPerfil(null);
    }

    if (
      projetosResultado.status === "fulfilled" &&
      Array.isArray(projetosResultado.value)
    ) {
      setProjetos(projetosResultado.value);
    } else {
      setProjetos([]);
    }

    const resultadosUsuarios = [
      alunosResultado,
      professoresResultado,
      empresasResultado,
    ];

    const quantidadeUsuarios = resultadosUsuarios.reduce((total, resultado) => {
      if (resultado.status === "fulfilled" && Array.isArray(resultado.value)) {
        return total + resultado.value.length;
      }

      return total;
    }, 0);

    setTotalUsuarios(quantidadeUsuarios);

    const requisicoesEssenciais = [
      perfilResultado,
      projetosResultado,
      alunosResultado,
      professoresResultado,
      empresasResultado,
    ];

    const houveFalha = requisicoesEssenciais.some(
      (resultado) => resultado.status === "rejected",
    );

    if (houveFalha) {
      setErro("Algumas informações do dashboard não puderam ser carregadas.");
    }

    setLoading(false);
  }, []);

  useEffect(() => {
    carregarDados();
  }, [carregarDados]);

  return {
    perfil,
    projetos,
    totalUsuarios,
    loading,
    erro,
    recarregar: carregarDados,
  };
}
