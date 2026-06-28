import { useCallback, useEffect, useState } from "react";

import {
  emitirCertificados,
  getTodosCertificados,
} from "../../../lib/certificadosApi";

import { getProjetos } from "../../../lib/projetosApi";

export function useCoordenacaoCertificados() {
  const [certificados, setCertificados] = useState([]);

  const [projetosAprovados, setProjetosAprovados] = useState([]);

  const [loading, setLoading] = useState(true);

  const [emitindo, setEmitindo] = useState(false);

  const [error, setError] = useState("");

  const [erroAcao, setErroAcao] = useState("");

  const [sucesso, setSucesso] = useState("");

  const carregarDados = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const [certificadosData, projetosData] = await Promise.all([
        getTodosCertificados(),
        getProjetos(),
      ]);

      setCertificados(Array.isArray(certificadosData) ? certificadosData : []);

      setProjetosAprovados(
        Array.isArray(projetosData)
          ? projetosData.filter((projeto) => projeto.status === "aprovado")
          : [],
      );
    } catch (error) {
      setCertificados([]);
      setProjetosAprovados([]);

      setError(error.message || "Não foi possível carregar os certificados.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    carregarDados();
  }, [carregarDados]);

  async function emitirParaProjeto(projetoId) {
    if (!projetoId) {
      setErroAcao("Selecione um projeto aprovado.");

      return false;
    }

    setEmitindo(true);
    setErroAcao("");
    setSucesso("");

    try {
      const resposta = await emitirCertificados(projetoId);

      const certificadosAtualizados = await getTodosCertificados();

      setCertificados(
        Array.isArray(certificadosAtualizados) ? certificadosAtualizados : [],
      );

      setSucesso(resposta?.message || "Emissão concluída.");

      return true;
    } catch (error) {
      setErroAcao(error.message || "Não foi possível emitir os certificados.");

      return false;
    } finally {
      setEmitindo(false);
    }
  }

  return {
    certificados,
    projetosAprovados,
    loading,
    emitindo,
    error,
    erroAcao,
    sucesso,
    emitirParaProjeto,
    recarregar: carregarDados,
  };
}
