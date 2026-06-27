import { useCallback, useEffect, useState } from "react";

import { getRanking } from "../../../lib/rankingApi";

export function useProfessorRanking() {
  const [ranking, setRanking] = useState([]);

  const [loading, setLoading] = useState(true);

  const [erro, setErro] = useState("");

  const carregarRanking = useCallback(async () => {
    setLoading(true);
    setErro("");

    try {
      const data = await getRanking();

      setRanking(Array.isArray(data?.ranking) ? data.ranking : []);
    } catch (error) {
      setRanking([]);

      setErro(error.message || "Não foi possível carregar o ranking.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    carregarRanking();
  }, [carregarRanking]);

  return {
    ranking,
    loading,
    erro,
    recarregar: carregarRanking,
  };
}
