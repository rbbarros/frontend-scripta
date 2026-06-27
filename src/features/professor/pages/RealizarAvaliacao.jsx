import React, { useEffect, useMemo, useState } from "react";

import { createAvaliacao, updateAvaliacao } from "../../../lib/avaliacoesApi";

import { getProfessorPerfil } from "../api/professorApi";

const CRITERIOS_INICIAIS = {
  inovacao: 0,
  tecnica: 0,
  aplicabilidade: 0,
  clareza: 0,
};

function obterConceito(media) {
  if (media >= 95) {
    return {
      label: "Excelente",
      classes: "border-emerald-200 bg-emerald-50 text-emerald-700",
    };
  }

  if (media >= 85) {
    return {
      label: "Ótimo",
      classes: "border-blue-200 bg-blue-50 text-blue-700",
    };
  }

  if (media >= 70) {
    return {
      label: "Bom",
      classes: "border-amber-200 bg-amber-50 text-amber-700",
    };
  }

  if (media >= 50) {
    return {
      label: "Ainda não suficiente",
      classes: "border-orange-200 bg-orange-50 text-orange-700",
    };
  }

  return {
    label: "Insuficiente",
    classes: "border-red-200 bg-red-50 text-red-700",
  };
}

export default function RealizarAvaliacao({
  projetoId,
  avaliacaoExistente = null,
  onClose,
  onSaved,
}) {
  const [perfil, setPerfil] = useState(null);

  const [criterios, setCriterios] = useState(CRITERIOS_INICIAIS);

  const [parecer, setParecer] = useState("");

  const [salvando, setSalvando] = useState(false);

  const [erro, setErro] = useState("");

  useEffect(() => {
    getProfessorPerfil()
      .then(setPerfil)
      .catch(() => {
        setPerfil(null);
      });
  }, []);

  useEffect(() => {
    if (!avaliacaoExistente) {
      setCriterios(CRITERIOS_INICIAIS);

      setParecer("");
      return;
    }

    setCriterios({
      inovacao: Number(avaliacaoExistente.nota_inovacao),
      tecnica: Number(avaliacaoExistente.nota_tecnica),
      aplicabilidade: Number(avaliacaoExistente.nota_aplicabilidade),
      clareza: Number(avaliacaoExistente.nota_clareza),
    });

    setParecer(avaliacaoExistente.parecer_descritivo || "");
  }, [avaliacaoExistente]);

  const media = useMemo(() => {
    const soma =
      criterios.inovacao +
      criterios.tecnica +
      criterios.aplicabilidade +
      criterios.clareza;

    return Number((soma / 4).toFixed(2));
  }, [criterios]);

  const conceito = obterConceito(media);

  const metricas = [
    {
      id: "inovacao",
      titulo: "Inovação",
      descricao: "Grau de originalidade e criatividade da solução.",
    },
    {
      id: "tecnica",
      titulo: "Qualidade técnica",
      descricao: "Completude, robustez e boas práticas de desenvolvimento.",
    },
    {
      id: "aplicabilidade",
      titulo: "Aplicabilidade",
      descricao: "Potencial de uso real e impacto prático da solução.",
    },
    {
      id: "clareza",
      titulo: "Clareza da solução",
      descricao: "Qualidade da documentação e da apresentação do projeto.",
    },
  ];

  function alterarCriterio(event, campo) {
    const valor = Number(event.target.value);

    setCriterios((criteriosAtuais) => ({
      ...criteriosAtuais,
      [campo]: valor,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    const parecerLimpo = parecer.trim();

    if (parecerLimpo.length < 10) {
      setErro("O parecer deve possuir pelo menos 10 caracteres.");

      return;
    }

    setSalvando(true);
    setErro("");

    const dados = {
      nota_inovacao: criterios.inovacao,
      nota_tecnica: criterios.tecnica,
      nota_aplicabilidade: criterios.aplicabilidade,
      nota_clareza: criterios.clareza,
      parecer_descritivo: parecerLimpo,
    };

    try {
      if (avaliacaoExistente?.id) {
        await updateAvaliacao(avaliacaoExistente.id, dados);
      } else {
        await createAvaliacao({
          projeto_id: Number(projetoId),
          ...dados,
        });
      }

      await onSaved?.();
      onClose();
    } catch (error) {
      setErro(error.message || "Não foi possível salvar a avaliação.");
    } finally {
      setSalvando(false);
    }
  }

  const dataAtual = new Date().toLocaleDateString("pt-BR");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
      <form
        onSubmit={handleSubmit}
        className="flex max-h-[90vh] w-full max-w-4xl flex-col overflow-y-auto rounded-3xl bg-white shadow-xl"
      >
        <header className="flex items-center justify-between border-b border-gray-100 p-6">
          <div>
            <h2 className="text-lg font-bold text-gray-900">
              {avaliacaoExistente ? "Editar avaliação" : "Rubrica de avaliação"}
            </h2>

            <p className="mt-1 text-xs text-gray-500">Projeto #{projetoId}</p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={salvando}
            className="text-gray-400 hover:text-gray-600 disabled:opacity-50"
            aria-label="Fechar avaliação"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18" />

              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </header>

        <div className="border-b border-gray-100 bg-blue-50/50 px-6 py-4">
          <p className="text-xs font-medium text-blue-700">
            <strong>Métricas conceituais:</strong> Excelente (95–100), Ótimo
            (85–94), Bom (70–84), Ainda não suficiente (50–69) e Insuficiente
            (0–49).
          </p>
        </div>

        <div className="flex-1 space-y-8 p-6">
          {erro && (
            <div className="rounded-2xl border border-red-100 bg-red-50 p-4 text-sm font-medium text-red-600">
              {erro}
            </div>
          )}

          <section className="flex flex-col justify-between gap-4 rounded-2xl border border-gray-100 bg-gray-50 p-5 sm:flex-row sm:items-center">
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-gray-400">
                Média calculada
              </p>

              <p className="mt-1 text-3xl font-bold text-gray-900">
                {media.toFixed(2)}
              </p>
            </div>

            <span
              className={`self-start rounded-lg border px-3 py-1.5 text-xs font-bold sm:self-auto ${conceito.classes}`}
            >
              {conceito.label}
            </span>
          </section>

          {metricas.map((metrica) => {
            const valor = criterios[metrica.id];

            const conceitoCriterio = obterConceito(valor);

            return (
              <section key={metrica.id}>
                <div className="mb-3 flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
                  <div>
                    <h3 className="text-sm font-bold text-gray-900">
                      {metrica.titulo}
                    </h3>

                    <p className="mt-1 text-xs text-gray-500">
                      {metrica.descricao}
                    </p>
                  </div>

                  <div className="flex shrink-0 items-center gap-2">
                    <span className="text-sm font-bold text-gray-900">
                      {valor}
                    </span>

                    <span
                      className={`rounded border px-2 py-0.5 text-[10px] font-bold ${conceitoCriterio.classes}`}
                    >
                      {conceitoCriterio.label}
                    </span>
                  </div>
                </div>

                <input
                  type="range"
                  min="0"
                  max="100"
                  value={valor}
                  onChange={(event) => alterarCriterio(event, metrica.id)}
                  className="h-1.5 w-full cursor-pointer appearance-none rounded-lg bg-gray-200 accent-[#f19f17]"
                />

                <div className="mt-1 flex justify-between text-[10px] font-medium text-gray-400">
                  <span>0</span>
                  <span>50</span>
                  <span>100</span>
                </div>
              </section>
            );
          })}

          <section className="border-t border-gray-100 pt-6">
            <label
              htmlFor="parecer"
              className="mb-2 block text-sm font-bold text-gray-900"
            >
              Parecer descritivo
            </label>

            <textarea
              id="parecer"
              rows="5"
              minLength={10}
              required
              placeholder="Descreva os pontos fortes, pontos de melhoria e suas considerações sobre o projeto."
              value={parecer}
              onChange={(event) => setParecer(event.target.value)}
              className="w-full resize-none rounded-xl border border-gray-200 p-4 text-sm outline-none transition-all focus:border-[#f19f17] focus:ring-2 focus:ring-amber-50"
            />
          </section>

          <p className="text-xs text-gray-400">
            Avaliador: {perfil?.nome || "Professor autenticado"} • {dataAtual}
          </p>
        </div>

        <footer className="flex flex-col-reverse gap-3 border-t border-gray-100 p-6 sm:flex-row">
          <button
            type="button"
            onClick={onClose}
            disabled={salvando}
            className="rounded-xl border border-gray-200 bg-white px-6 py-2.5 font-bold text-gray-700 hover:bg-gray-50 disabled:opacity-50"
          >
            Cancelar
          </button>

          <button
            type="submit"
            disabled={salvando}
            className="rounded-xl bg-[#f19f17] px-6 py-2.5 font-bold text-white hover:bg-amber-600 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {salvando
              ? "Salvando..."
              : avaliacaoExistente
                ? "Atualizar avaliação"
                : "Salvar avaliação"}
          </button>
        </footer>
      </form>
    </div>
  );
}
