import { useState, useEffect, useCallback } from 'react';
import { apiRequest } from '../../../lib/api';

export function useCoordenacaoCertificados() {
  const [certificados, setCertificados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCertificados = useCallback(async () => {
    try {
      setLoading(true);
      const data = await apiRequest('/certificados/emitidos');
      setCertificados(Array.isArray(data) ? data : (data?.data || []));
      setError(null);
    } catch (err) {
      console.error(err);
      setError('Erro ao carregar certificados.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCertificados();
  }, [fetchCertificados]);

  return { certificados, loading, error, refetch: fetchCertificados };
}
