import { useCallback, useEffect, useState } from "react";

import { getProjetos, updateProjetoStatus } from "../../../lib/projetosApi";

export function useAlunoProjetos() {
  const [meusProjetos, setMeusProjetos] = useState([]);

  const [loading, setLoading] = useState(true);

  const [erro, setErro] = useState("");

  const [submetendoId, setSubmetendoId] = useState(null);

  const carregarProjetos = useCallback(async () => {
    setLoading(true);
    setErro("");

    try {
      const data = await getProjetos();

      setMeusProjetos(Array.isArray(data) ? data : []);
    } catch (error) {
      setMeusProjetos([]);

      setErro(error.message || "Não foi possível carregar seus projetos.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    carregarProjetos();
  }, [carregarProjetos]);

  async function submeterProjeto(projetoId) {
    setSubmetendoId(projetoId);
    setErro("");

    try {
      await updateProjetoStatus(projetoId, "submetido");

      setMeusProjetos((projetosAtuais) =>
        projetosAtuais.map((projeto) =>
          projeto.id === projetoId
            ? {
                ...projeto,
                status: "submetido",
              }
            : projeto,
        ),
      );

      return true;
    } catch (error) {
      setErro(error.message || "Não foi possível submeter o projeto.");

      return false;
    } finally {
      setSubmetendoId(null);
    }
  }

  return {
    meusProjetos,
    loading,
    erro,
    submetendoId,
    submeterProjeto,
    refetch: carregarProjetos,
  };
}
