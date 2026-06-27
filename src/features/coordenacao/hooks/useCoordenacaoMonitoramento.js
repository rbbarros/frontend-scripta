import { useCallback, useEffect, useState } from "react";

import { apiRequest } from "../../../lib/api";

const STATUS_INICIAIS = {
  rascunho: 0,
  submetido: 0,
  em_avaliacao: 0,
  aprovado: 0,
  reprovado: 0,
};

function converterNumero(valor) {
  const numero = Number(valor);

  return Number.isFinite(numero) ? numero : 0;
}

function calcularMediaPonderada(registros, campoMedia, campoPeso) {
  let soma = 0;
  let pesoTotal = 0;

  registros.forEach((registro) => {
    const media = registro[campoMedia];

    const peso = converterNumero(registro[campoPeso]);

    if (media !== null && media !== undefined && peso > 0) {
      soma += converterNumero(media) * peso;

      pesoTotal += peso;
    }
  });

  if (pesoTotal === 0) {
    return null;
  }

  return soma / pesoTotal;
}

function calcularProjetosPorArea(projetos) {
  const agrupamento = new Map();

  projetos.forEach((projeto) => {
    const area = projeto.area_conhecimento?.trim() || "Área não informada";

    agrupamento.set(area, (agrupamento.get(area) || 0) + 1);
  });

  return Array.from(agrupamento.entries())
    .map(([area, quantidade]) => ({
      area,
      quantidade,
    }))
    .sort((a, b) => b.quantidade - a.quantidade);
}

function calcularDistribuicaoStatus(projetos) {
  const distribuicao = {
    ...STATUS_INICIAIS,
  };

  projetos.forEach((projeto) => {
    if (Object.hasOwn(distribuicao, projeto.status)) {
      distribuicao[projeto.status] += 1;
    }
  });

  return distribuicao;
}

function calcularDesempenhoCursos(projetos) {
  const cursos = new Map();

  projetos.forEach((projeto) => {
    const curso = projeto.curso?.trim() || "Curso não informado";

    if (!cursos.has(curso)) {
      cursos.set(curso, {
        curso,
        totalProjetos: 0,
        totalAvaliacoes: 0,
        somaPonderada: 0,
      });
    }

    const registro = cursos.get(curso);

    const totalAvaliacoes = converterNumero(projeto.total_avaliacoes);

    registro.totalProjetos += 1;
    registro.totalAvaliacoes += totalAvaliacoes;

    if (
      projeto.media_geral !== null &&
      projeto.media_geral !== undefined &&
      totalAvaliacoes > 0
    ) {
      registro.somaPonderada +=
        converterNumero(projeto.media_geral) * totalAvaliacoes;
    }
  });

  return Array.from(cursos.values())
    .map((registro) => ({
      curso: registro.curso,
      totalProjetos: registro.totalProjetos,
      totalAvaliacoes: registro.totalAvaliacoes,
      mediaGeral:
        registro.totalAvaliacoes > 0
          ? registro.somaPonderada / registro.totalAvaliacoes
          : null,
    }))
    .sort((a, b) => {
      if (a.mediaGeral === null && b.mediaGeral === null) {
        return a.curso.localeCompare(b.curso);
      }

      if (a.mediaGeral === null) {
        return 1;
      }

      if (b.mediaGeral === null) {
        return -1;
      }

      return b.mediaGeral - a.mediaGeral;
    });
}

function calcularCriterios(indicadores) {
  return {
    inovacao: calcularMediaPonderada(
      indicadores,
      "media_inovacao",
      "total_avaliacoes",
    ),

    tecnica: calcularMediaPonderada(
      indicadores,
      "media_tecnica",
      "total_avaliacoes",
    ),

    aplicabilidade: calcularMediaPonderada(
      indicadores,
      "media_aplicabilidade",
      "total_avaliacoes",
    ),

    clareza: calcularMediaPonderada(
      indicadores,
      "media_clareza",
      "total_avaliacoes",
    ),
  };
}

export function useCoordenacaoMonitoramento() {
  const [dados, setDados] = useState({
    totalProjetos: 0,
    totalAvaliacoes: 0,
    projetosAvaliados: 0,
    mediaGeral: null,
    projetosPorArea: [],
    distribuicaoStatus: {
      ...STATUS_INICIAIS,
    },
    desempenhoCursos: [],
    criterios: {
      inovacao: null,
      tecnica: null,
      aplicabilidade: null,
      clareza: null,
    },
  });

  const [loading, setLoading] = useState(true);

  const [erro, setErro] = useState("");

  const carregarDados = useCallback(async () => {
    setLoading(true);
    setErro("");

    try {
      const [relatorioProjetos, relatorioAcademico] = await Promise.all([
        apiRequest("/relatorios/projetos"),
        apiRequest("/relatorios/academico"),
      ]);

      const projetos = Array.isArray(relatorioProjetos?.projetos)
        ? relatorioProjetos.projetos
        : [];

      const indicadores = Array.isArray(relatorioAcademico?.indicadores)
        ? relatorioAcademico.indicadores
        : [];

      const totalAvaliacoes = projetos.reduce(
        (total, projeto) => total + converterNumero(projeto.total_avaliacoes),
        0,
      );

      const projetosAvaliados = projetos.filter(
        (projeto) => converterNumero(projeto.total_avaliacoes) > 0,
      ).length;

      const mediaGeral = calcularMediaPonderada(
        projetos,
        "media_geral",
        "total_avaliacoes",
      );

      setDados({
        totalProjetos: projetos.length,

        totalAvaliacoes,

        projetosAvaliados,

        mediaGeral,

        projetosPorArea: calcularProjetosPorArea(projetos),

        distribuicaoStatus: calcularDistribuicaoStatus(projetos),

        desempenhoCursos: calcularDesempenhoCursos(projetos),

        criterios: calcularCriterios(indicadores),
      });
    } catch (error) {
      setErro(
        error.message ||
          "Não foi possível carregar os indicadores de monitoramento.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    carregarDados();
  }, [carregarDados]);

  return {
    dados,
    loading,
    erro,
    refetch: carregarDados,
  };
}
