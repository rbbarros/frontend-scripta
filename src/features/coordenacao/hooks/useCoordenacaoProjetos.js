import { useState, useEffect, useCallback } from 'react';
import { apiRequest } from '../../../lib/api';

export function useCoordenacaoProjetos() {
  const [projetos, setProjetos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProjetos = useCallback(async () => {
    try {
      setLoading(true);
      const data = await apiRequest('/projetos/').catch(() => null);
      
      const mockData = [
        {
          id: 1,
          titulo: "Sistema de IA para Diagnóstico Médico",
          curso: "Engenharia de Software",
          turma: "ESW-2A",
          semestre: "1º/2025",
          periodo: "Matutino",
          status: "Aprovado",
          descricao: "Plataforma de inteligência artificial para auxílio no diagnóstico de doenças respiratórias a partir de análise de imagens de raio-X, utilizando redes neurais convolucionais com 94% de precisão.",
          professor: "Prof. Ana Silva",
          area: "Inteligência Artificial - Saúde Digital",
          arquivos: [{nome: 'Relatório_Final.pdf'}, {nome: 'Apresentação.pptx'}, {nome: 'Código_Fonte.zip'}],
          integrantes: [{nome: 'João Silva'}, {nome: 'Maria Santos'}, {nome: 'Pedro Costa'}, {nome: 'Ana Lima'}],
          historico: [
            {versao: 'v3.0', data: '28/05/2025', nota: 'Versão final com correções'},
            {versao: 'v2.0', data: '15/05/2025', nota: 'Adicionada documentação técnica'},
            {versao: 'v1.0', data: '01/05/2025', nota: 'Submissão inicial'}
          ],
          avaliacoes: []
        },
        {
          id: 2,
          titulo: "Plataforma de Blockchain para Certificados",
          curso: "Ciência da Computação",
          turma: "CC-4A",
          semestre: "2º/2024",
          status: "Aprovado",
          arquivos: [{}, {}],
          integrantes: [{}, {}, {}]
        },
        {
          id: 3,
          titulo: "App de Realidade Aumentada Educacional",
          curso: "Design Digital",
          turma: "DD-1A",
          semestre: "1º/2025",
          status: "Pendente",
          arquivos: [{}, {}, {}, {}],
          integrantes: [{}, {}, {}, {}, {}]
        }
      ];

      if (!data || data.length === 0) {
        setProjetos(mockData);
      } else {
        setProjetos(data);
      }
      setError(null);
    } catch (err) {
      setError(err.message || 'Erro ao carregar projetos');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProjetos();
  }, [fetchProjetos]);

  return { projetos, loading, error, refetch: fetchProjetos };
}
