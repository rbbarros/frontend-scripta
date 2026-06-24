import { useState, useEffect, useCallback } from "react";
import { getCoordenadorPerfil } from "../api/coordenacaoApi";
import { getProjetos } from "../../../lib/projetosApi";; // TODO: Mover para local correto depois

export function useCoordenacaoDashboard() {
  const [perfil, setPerfil] = useState(null);
  const [projetos, setProjetos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");

  const carregarDados = useCallback(async () => {
    try {
      const p = await getCoordenadorPerfil();
      setPerfil(p);
    } catch (e) {
      setErro("Não foi possível carregar seu perfil.");
    }

    try {
      const data = await getProjetos();
      setProjetos(data || []);
    } catch (e) {
      console.error(e);
      setProjetos([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    carregarDados();
  }, [carregarDados]);

  return { perfil, projetos, loading, erro };
}
