import React, { useMemo, useState } from "react";

import { ArrowRight, FileText, Search, Star } from "lucide-react";

import { Link } from "react-router-dom";

import { useProfessorAvaliacoes } from "../hooks/useProfessorAvaliacoes";

const CONCEITO_CLASSES = {
  Excelente: "border-emerald-100 bg-emerald-50 text-emerald-700",

  Ótimo: "border-blue-100 bg-blue-50 text-blue-700",

  Bom: "border-amber-100 bg-amber-50 text-amber-700",

  "Ainda não suficiente": "border-orange-100 bg-orange-50 text-orange-700",

  Insuficiente: "border-red-100 bg-red-50 text-red-700",
};

function formatarData(data) {
  if (!data) {
    return "Data não disponível";
  }

  const dataFormatada = new Date(data);

  if (Number.isNaN(dataFormatada.getTime())) {
    return "Data não disponível";
  }

  return dataFormatada.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

function formatarNota(nota) {
  const valor = Number(nota);

  if (Number.isNaN(valor)) {
    return "—";
  }

  return valor.toFixed(2);
}

export default function Avaliacoes() {
  const { perfil, avaliacoes, loading, erro } = useProfessorAvaliacoes();

  const [busca, setBusca] = useState("");

  const [conceito, setConceito] = useState("");

  const conceitosDisponiveis = useMemo(
    () =>
      [
        ...new Set(
          avaliacoes.map((avaliacao) => avaliacao.conceito).filter(Boolean),
        ),
      ].sort(),
    [avaliacoes],
  );

  const avaliacoesFiltradas = useMemo(() => {
    const termo = busca.trim().toLowerCase();

    return avaliacoes.filter((avaliacao) => {
      const correspondeBusca =
        !termo ||
        avaliacao.projeto_titulo?.toLowerCase().includes(termo) ||
        avaliacao.professor_nome?.toLowerCase().includes(termo) ||
        avaliacao.parecer_descritivo?.toLowerCase().includes(termo);

      const correspondeConceito = !conceito || avaliacao.conceito === conceito;

      return correspondeBusca && correspondeConceito;
    });
  }, [avaliacoes, busca, conceito]);

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-amber-500" />
      </div>
    );
  }

  return (
    <div className="pb-12">
      <header className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">
          Histórico de avaliações
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          Consulte todas as avaliações realizadas por você na plataforma.
        </p>
      </header>

      {erro && (
        <div className="mb-6 rounded-2xl border border-red-100 bg-red-50 p-4 text-sm font-medium text-red-600">
          {erro}
        </div>
      )}

      <section className="mb-8 grid grid-cols-1 gap-4 rounded-3xl border border-gray-100 bg-white p-5 shadow-sm md:grid-cols-[1fr_280px]">
        <div className="relative">
          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
          />

          <input
            type="search"
            value={busca}
            onChange={(event) => setBusca(event.target.value)}
            placeholder="Buscar por projeto ou parecer"
            className="w-full rounded-xl border border-gray-200 py-3 pl-11 pr-4 text-sm outline-none focus:border-[#f19f17]"
          />
        </div>

        <select
          value={conceito}
          onChange={(event) => setConceito(event.target.value)}
          className="rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-700 outline-none focus:border-[#f19f17]"
        >
          <option value="">Todos os conceitos</option>

          {conceitosDisponiveis.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
      </section>

      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-bold text-gray-800">
          Avaliações realizadas
        </h2>

        <span className="text-sm font-semibold text-gray-400">
          {avaliacoesFiltradas.length} encontrada(s)
        </span>
      </div>

      {avaliacoesFiltradas.length > 0 ? (
        <div className="space-y-6">
          {avaliacoesFiltradas.map((avaliacao) => {
            const classes =
              CONCEITO_CLASSES[avaliacao.conceito] ||
              "border-gray-200 bg-gray-100 text-gray-600";

            const possuiDetalhes =
              avaliacao.nota_inovacao !== undefined &&
              avaliacao.nota_tecnica !== undefined &&
              avaliacao.nota_aplicabilidade !== undefined &&
              avaliacao.nota_clareza !== undefined;

            return (
              <article
                key={avaliacao.id}
                className="rounded-3xl border border-gray-100 bg-white p-7 shadow-sm"
              >
                <div className="flex flex-col justify-between gap-5 border-b border-gray-100 pb-6 md:flex-row md:items-start">
                  <div className="flex min-w-0 items-start gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-orange-50 text-orange-500">
                      <Star size={23} />
                    </div>

                    <div className="min-w-0">
                      <h3 className="text-lg font-bold text-gray-900">
                        {avaliacao.projeto_titulo}
                      </h3>

                      <p className="mt-1 text-xs text-gray-500">
                        Avaliado por{" "}
                        {avaliacao.professor_nome ||
                          perfil?.nome ||
                          "Professor autenticado"}
                      </p>

                      <p className="mt-1 text-xs text-gray-400">
                        {formatarData(avaliacao.data_avaliacao)}
                      </p>
                    </div>
                  </div>

                  <div className="flex shrink-0 items-center gap-4">
                    <div className="text-right">
                      <p className="text-2xl font-bold text-gray-900">
                        {formatarNota(avaliacao.media_geral)}
                      </p>

                      <p className="text-xs text-gray-400">Média geral</p>
                    </div>

                    <span
                      className={`rounded-lg border px-3 py-1.5 text-xs font-bold ${classes}`}
                    >
                      {avaliacao.conceito}
                    </span>
                  </div>
                </div>

                {possuiDetalhes && (
                  <div className="mt-6 grid grid-cols-2 gap-5 md:grid-cols-4">
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                        Inovação
                      </p>

                      <p className="mt-1 text-lg font-bold text-gray-900">
                        {formatarNota(avaliacao.nota_inovacao)}
                      </p>
                    </div>

                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                        Qualidade técnica
                      </p>

                      <p className="mt-1 text-lg font-bold text-gray-900">
                        {formatarNota(avaliacao.nota_tecnica)}
                      </p>
                    </div>

                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                        Aplicabilidade
                      </p>

                      <p className="mt-1 text-lg font-bold text-gray-900">
                        {formatarNota(avaliacao.nota_aplicabilidade)}
                      </p>
                    </div>

                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                        Clareza
                      </p>

                      <p className="mt-1 text-lg font-bold text-gray-900">
                        {formatarNota(avaliacao.nota_clareza)}
                      </p>
                    </div>
                  </div>
                )}

                <div className="mt-6 h-2.5 overflow-hidden rounded-full bg-gray-100">
                  <div
                    className="h-full rounded-full bg-[#f19f17]"
                    style={{
                      width: `${Math.min(
                        100,
                        Math.max(0, Number(avaliacao.media_geral) || 0),
                      )}%`,
                    }}
                  />
                </div>

                {avaliacao.parecer_descritivo && (
                  <div className="mt-6 rounded-2xl border border-gray-100 bg-gray-50 p-5">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
                      Parecer descritivo
                    </p>

                    <p className="mt-3 whitespace-pre-line text-sm leading-7 text-gray-700">
                      {avaliacao.parecer_descritivo}
                    </p>
                  </div>
                )}

                <div className="mt-6 flex justify-end">
                  <Link
                    to={`/professor/projetos/${avaliacao.projeto_id}`}
                    className="flex items-center gap-1 text-sm font-bold text-[#f19f17] hover:text-amber-700"
                  >
                    Abrir projeto
                    <ArrowRight size={16} />
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        <div className="rounded-3xl border border-dashed border-gray-200 bg-white p-14 text-center">
          <FileText size={42} className="mx-auto text-gray-300" />

          <h2 className="mt-5 text-lg font-bold text-gray-700">
            Nenhuma avaliação encontrada
          </h2>

          <p className="mx-auto mt-2 max-w-md text-sm text-gray-500">
            Você ainda não realizou avaliações ou nenhuma delas corresponde aos
            filtros selecionados.
          </p>
        </div>
      )}
    </div>
  );
}
