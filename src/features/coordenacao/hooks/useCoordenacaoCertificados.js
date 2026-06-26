import { useCallback, useEffect, useState } from "react";

import { getTodosCertificados } from "../../../lib/certificadosApi";

export function useCoordenacaoCertificados() {
  const [certificados, setCertificados] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const fetchCertificados = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const data = await getTodosCertificados();

      setCertificados(Array.isArray(data) ? data : []);
    } catch (err) {
      setCertificados([]);

      setError(err.message || "Erro ao carregar certificados.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCertificados();
  }, [fetchCertificados]);

  return {
    certificados,
    loading,
    error,
    refetch: fetchCertificados,
  };
}
