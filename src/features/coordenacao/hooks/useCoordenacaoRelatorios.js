import { useCallback, useEffect, useState } from "react";

import { apiRequest } from "../../../lib/api";

function montarParametros(tipo, filtros) {
  const parametros = {
    curso: filtros.curso || undefined,
    turma: filtros.turma || undefined,
    semestre: filtros.semestre || undefined,
    professor_id: filtros.professor_id
      ? Number(filtros.professor_id)
      : undefined,
  };

  if (tipo === "projetos") {
    parametros.status = filtros.status || undefined;
  }

  return parametros;
}

function obterEndpoint(tipo) {
  return tipo === "academico"
    ? "/relatorios/academico"
    : "/relatorios/projetos";
}

export function useCoordenacaoRelatorios() {
  const [projetosBase, setProjetosBase] = useState([]);

  const [professores, setProfessores] = useState([]);

  const [resultado, setResultado] = useState(null);

  const [tipoResultado, setTipoResultado] = useState("projetos");

  const [loadingInicial, setLoadingInicial] = useState(true);

  const [carregandoRelatorio, setCarregandoRelatorio] = useState(false);

  const [exportando, setExportando] = useState(false);

  const [erro, setErro] = useState("");

  const carregarDadosIniciais = useCallback(async () => {
    setLoadingInicial(true);
    setErro("");

    try {
      const [relatorioProjetos, listaProfessores] = await Promise.all([
        apiRequest("/relatorios/projetos"),
        apiRequest("/professores/"),
      ]);

      const projetos = Array.isArray(relatorioProjetos?.projetos)
        ? relatorioProjetos.projetos
        : [];

      setProjetosBase(projetos);

      setProfessores(Array.isArray(listaProfessores) ? listaProfessores : []);

      setResultado(relatorioProjetos);

      setTipoResultado("projetos");
    } catch (error) {
      setErro(
        error.message || "Não foi possível carregar os dados dos relatórios.",
      );
    } finally {
      setLoadingInicial(false);
    }
  }, []);

  useEffect(() => {
    carregarDadosIniciais();
  }, [carregarDadosIniciais]);

  const gerarRelatorio = useCallback(async (tipo, filtros) => {
    setCarregandoRelatorio(true);
    setErro("");
    setResultado(null);
    setTipoResultado(tipo);

    try {
      const dados = await apiRequest(obterEndpoint(tipo), {
        params: montarParametros(tipo, filtros),
      });

      setResultado(dados);

      return dados;
    } catch (error) {
      setErro(error.message || "Não foi possível gerar o relatório.");

      throw error;
    } finally {
      setCarregandoRelatorio(false);
    }
  }, []);

  const exportarPdf = useCallback(async (tipo, filtros) => {
    setExportando(true);
    setErro("");

    try {
      const endpoint = `${obterEndpoint(tipo)}/export`;

      const arquivo = await apiRequest(endpoint, {
        params: montarParametros(tipo, filtros),
        responseType: "blob",
      });

      const url = URL.createObjectURL(arquivo);

      const link = document.createElement("a");

      link.href = url;

      link.download =
        tipo === "academico"
          ? "relatorio_academico.pdf"
          : "relatorio_projetos.pdf";

      document.body.appendChild(link);

      link.click();
      link.remove();

      URL.revokeObjectURL(url);
    } catch (error) {
      setErro(error.message || "Não foi possível exportar o relatório.");

      throw error;
    } finally {
      setExportando(false);
    }
  }, []);

  return {
    projetosBase,
    professores,
    resultado,
    tipoResultado,
    loadingInicial,
    carregandoRelatorio,
    exportando,
    erro,
    gerarRelatorio,
    exportarPdf,
    refetch: carregarDadosIniciais,
  };
}
