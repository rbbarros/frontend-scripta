import { useState } from 'react';
import { apiRequest } from '../../../lib/api';

export function useCoordenacaoRelatorios() {
  const [isLoading, setIsLoading] = useState(false);

  const generateReport = async (reportType, exportFormat, filters) => {
    setIsLoading(true);
    try {
      const response = await apiRequest('/relatorios/projetos', {
        method: 'GET',
        params: {
          ...filters,
          type: reportType,
          format: exportFormat.toLowerCase()
        }
      });
      return response;
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return { isLoading, generateReport };
}
