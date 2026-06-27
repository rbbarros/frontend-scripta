import React, { useCallback, useEffect, useState } from "react";

import {
  ArrowLeft,
  ExternalLink,
  FileText,
  GraduationCap,
  Link as LinkIcon,
  Star,
  User,
  Users,
} from "lucide-react";

import { Link, useParams } from "react-router-dom";

import { getAvaliacaoPorId, getAvaliacoes } from "../../../lib/avaliacoesApi";

import {
  getArquivosDoProjeto,
  getIntegrantesDoProjeto,
  getLinksDoProjeto,
  getProjetoPorId,
} from "../../../lib/projetosApi";

import RealizarAvaliacao from "./RealizarAvaliacao";

const STATUS_PROJETO = {
  submetido: {
    label: "Submetido",
    classes: "border-blue-100 bg-blue-50 text-blue-700",
  },
  em_avaliacao: {
    label: "Em avaliação",
    classes: "border-purple-100 bg-purple-50 text-purple-700",
  },
  aprovado: {
    label: "Aprovado",
    classes: "border-emerald-100 bg-emerald-50 text-emerald-700",
  },
  reprovado: {
    label: "Reprovado",
    classes: "border-red-100 bg-red-50 text-red-700",
  },
};

function obterNomeIntegrante(integrante) {
  return (
    integrante.nome ||
    integrante.nome_aluno ||
    integrante.aluno_nome ||
    `Aluno #${integrante.aluno_id}`
  );
}

function obterNomeArquivo(arquivo) {
  return (
    arquivo.nome_original ||
    arquivo.nome_arquivo ||
    arquivo.nome ||
    arquivo.filename ||
    "Arquivo cadastrado"
  );
}

export default function ProjetoDetalhes() {
  const { id } = useParams();

  const [projeto, setProjeto] = useState(null);

  const [integrantes, setIntegrantes] = useState([]);

  const [arquivos, setArquivos] = useState([]);

  const [links, setLinks] = useState([]);

  const [minhaAvaliacao, setMinhaAvaliacao] = useState(null);

  const [loading, setLoading] = useState(true);

  const [erro, setErro] = useState("");

  const [mostrarAvaliacao, setMostrarAvaliacao] = useState(false);

  const carregarDados = useCallback(async () => {
    if (!id) {
      return;
    }

    setLoading(true);
    setErro("");

    try {
      const projetoData = await getProjetoPorId(id);

      const [
        integrantesResultado,
        arquivosResultado,
        linksResultado,
        avaliacoesResultado,
      ] = await Promise.allSettled([
        getIntegrantesDoProjeto(id),
        getArquivosDoProjeto(id),
        getLinksDoProjeto(id),
        getAvaliacoes(),
      ]);

      setProjeto(projetoData);

      setIntegrantes(
        integrantesResultado.status === "fulfilled" &&
          Array.isArray(integrantesResultado.value)
          ? integrantesResultado.value
          : [],
      );

      setArquivos(
        arquivosResultado.status === "fulfilled" &&
          Array.isArray(arquivosResultado.value)
          ? arquivosResultado.value
          : [],
      );

      setLinks(
        linksResultado.status === "fulfilled" &&
          Array.isArray(linksResultado.value)
          ? linksResultado.value
          : [],
      );

      const avaliacoesDoProfessor =
        avaliacoesResultado.status === "fulfilled" &&
        Array.isArray(avaliacoesResultado.value)
          ? avaliacoesResultado.value
          : [];

      const resumoAvaliacao = avaliacoesDoProfessor.find(
        (avaliacao) => Number(avaliacao.projeto_id) === Number(id),
      );

      if (resumoAvaliacao?.id) {
        try {
          const avaliacaoCompleta = await getAvaliacaoPorId(resumoAvaliacao.id);

          setMinhaAvaliacao(avaliacaoCompleta);
        } catch {
          setMinhaAvaliacao(null);
        }
      } else {
        setMinhaAvaliacao(null);
      }
    } catch (error) {
      setProjeto(null);

      setErro(error.message || "Não foi possível carregar o projeto.");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    carregarDados();
  }, [carregarDados]);

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-amber-500" />
      </div>
    );
  }

  if (erro || !projeto) {
    return (
      <div className="rounded-3xl border border-red-100 bg-red-50 p-8">
        <h1 className="text-lg font-bold text-red-700">
          Não foi possível carregar o projeto
        </h1>

        <p className="mt-2 text-sm text-red-600">
          {erro || "Projeto não encontrado."}
        </p>

        <Link
          to="/professor/projetos"
          className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-red-700 hover:underline"
        >
          <ArrowLeft size={16} />
          Voltar para projetos
        </Link>
      </div>
    );
  }

  const status = STATUS_PROJETO[projeto.status] || {
    label: projeto.status,
    classes: "border-gray-200 bg-gray-100 text-gray-600",
  };

  const projetoEncerrado =
    projeto.status === "aprovado" || projeto.status === "reprovado";

  const podeAvaliar =
    projeto.status === "submetido" || projeto.status === "em_avaliacao";

  return (
    <div className="pb-12">
      <Link
        to="/professor/projetos"
        className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-[#f19f17] hover:text-amber-700"
      >
        <ArrowLeft size={16} />
        Voltar para a lista
      </Link>

      <section className="rounded-3xl border border-gray-100 bg-white p-8 shadow-sm">
        <div className="flex flex-col justify-between gap-5 border-b border-gray-100 pb-7 md:flex-row md:items-start">
          <div>
            <span
              className={`inline-flex rounded-lg border px-3 py-1 text-xs font-bold ${status.classes}`}
            >
              {status.label}
            </span>

            <h1 className="mt-4 text-2xl font-bold tracking-tight text-gray-900">
              {projeto.titulo}
            </h1>

            <p className="mt-2 text-sm text-gray-500">
              {projeto.curso} • {projeto.turma} • {projeto.semestre}
            </p>
          </div>

          {podeAvaliar && (
            <button
              type="button"
              onClick={() => setMostrarAvaliacao(true)}
              className="flex shrink-0 items-center justify-center gap-2 rounded-xl bg-[#f19f17] px-6 py-3 text-sm font-bold text-white hover:bg-amber-600"
            >
              <Star size={18} />

              {minhaAvaliacao ? "Editar minha avaliação" : "Avaliar projeto"}
            </button>
          )}
        </div>

        {projetoEncerrado && !minhaAvaliacao && (
          <div className="mt-6 rounded-2xl border border-gray-200 bg-gray-50 p-4 text-sm text-gray-600">
            Este projeto já foi encerrado e não pode receber uma nova avaliação.
          </div>
        )}

        <div className="mt-8 grid grid-cols-1 gap-10 xl:grid-cols-[2fr_1fr]">
          <main className="space-y-8">
            <section>
              <h2 className="text-xs font-bold uppercase tracking-widest text-gray-400">
                Descrição
              </h2>

              <p className="mt-4 whitespace-pre-line text-sm leading-7 text-gray-700">
                {projeto.descricao}
              </p>
            </section>

            <section>
              <h2 className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-400">
                <FileText size={16} />
                Arquivos cadastrados
              </h2>

              {arquivos.length > 0 ? (
                <div className="mt-4 space-y-3">
                  {arquivos.map((arquivo, index) => (
                    <div
                      key={arquivo.id || index}
                      className="flex items-center gap-3 rounded-xl border border-gray-100 bg-gray-50 p-4"
                    >
                      <FileText size={17} className="shrink-0 text-[#f19f17]" />

                      <span className="break-all text-sm font-semibold text-gray-700">
                        {obterNomeArquivo(arquivo)}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="mt-4 text-sm text-gray-500">
                  Nenhum arquivo foi cadastrado para este projeto.
                </p>
              )}
            </section>

            <section>
              <h2 className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-400">
                <LinkIcon size={16} />
                Links do projeto
              </h2>

              {links.length > 0 ? (
                <div className="mt-4 space-y-3">
                  {links.map((link) => (
                    <a
                      key={link.id}
                      href={link.url}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center justify-between gap-4 rounded-xl border border-gray-100 bg-gray-50 p-4 text-sm font-semibold text-gray-700 hover:border-[#f19f17] hover:text-[#f19f17]"
                    >
                      <span className="break-all">
                        {link.descricao || link.url}
                      </span>

                      <ExternalLink size={16} className="shrink-0" />
                    </a>
                  ))}
                </div>
              ) : (
                <p className="mt-4 text-sm text-gray-500">
                  Nenhum link foi cadastrado para este projeto.
                </p>
              )}
            </section>

            {minhaAvaliacao && (
              <section className="rounded-2xl border border-emerald-100 bg-emerald-50/50 p-6">
                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
                  <div>
                    <h2 className="font-bold text-gray-900">Minha avaliação</h2>

                    <p className="mt-1 text-xs text-gray-500">
                      {minhaAvaliacao.conceito}
                    </p>
                  </div>

                  <div className="text-left sm:text-right">
                    <p className="text-2xl font-bold text-emerald-700">
                      {Number(minhaAvaliacao.media_geral).toFixed(2)}
                    </p>

                    <p className="text-xs text-gray-500">Média geral</p>
                  </div>
                </div>

                <div className="mt-5 grid grid-cols-2 gap-4 md:grid-cols-4">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wide text-gray-400">
                      Inovação
                    </p>

                    <p className="mt-1 font-bold text-gray-800">
                      {minhaAvaliacao.nota_inovacao}
                    </p>
                  </div>

                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wide text-gray-400">
                      Técnica
                    </p>

                    <p className="mt-1 font-bold text-gray-800">
                      {minhaAvaliacao.nota_tecnica}
                    </p>
                  </div>

                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wide text-gray-400">
                      Aplicabilidade
                    </p>

                    <p className="mt-1 font-bold text-gray-800">
                      {minhaAvaliacao.nota_aplicabilidade}
                    </p>
                  </div>

                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wide text-gray-400">
                      Clareza
                    </p>

                    <p className="mt-1 font-bold text-gray-800">
                      {minhaAvaliacao.nota_clareza}
                    </p>
                  </div>
                </div>

                <div className="mt-5 border-t border-emerald-100 pt-5">
                  <p className="text-xs font-bold uppercase tracking-wide text-gray-400">
                    Parecer
                  </p>

                  <p className="mt-2 whitespace-pre-line text-sm leading-6 text-gray-700">
                    {minhaAvaliacao.parecer_descritivo}
                  </p>
                </div>
              </section>
            )}
          </main>

          <aside className="space-y-7">
            <section>
              <h2 className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-400">
                <Users size={16} />
                Integrantes
              </h2>

              {integrantes.length > 0 ? (
                <div className="mt-4 space-y-3">
                  {integrantes.map((integrante, index) => (
                    <div
                      key={integrante.aluno_id || integrante.id || index}
                      className="flex items-center gap-3 rounded-xl bg-gray-50 p-3"
                    >
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-amber-50 text-[#f19f17]">
                        <User size={15} />
                      </div>

                      <span className="text-sm font-semibold text-gray-700">
                        {obterNomeIntegrante(integrante)}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="mt-3 text-sm text-gray-500">
                  Nenhum integrante disponível.
                </p>
              )}
            </section>

            <section>
              <h2 className="text-xs font-bold uppercase tracking-widest text-gray-400">
                Aluno responsável
              </h2>

              <p className="mt-2 flex items-center gap-2 text-sm font-semibold text-gray-700">
                <User size={16} />
                {projeto.aluno_responsavel}
              </p>
            </section>

            <section>
              <h2 className="text-xs font-bold uppercase tracking-widest text-gray-400">
                Professor orientador
              </h2>

              <p className="mt-2 flex items-center gap-2 text-sm font-semibold text-gray-700">
                <GraduationCap size={16} />
                {projeto.professor_orientador}
              </p>
            </section>

            <section>
              <h2 className="text-xs font-bold uppercase tracking-widest text-gray-400">
                Área de conhecimento
              </h2>

              <p className="mt-2 text-sm font-semibold text-gray-700">
                {projeto.area_conhecimento}
              </p>
            </section>
          </aside>
        </div>
      </section>

      {mostrarAvaliacao && (
        <RealizarAvaliacao
          projetoId={id}
          avaliacaoExistente={minhaAvaliacao}
          onClose={() => setMostrarAvaliacao(false)}
          onSaved={carregarDados}
        />
      )}
    </div>
  );
}
