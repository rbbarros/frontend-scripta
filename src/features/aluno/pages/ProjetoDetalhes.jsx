import React, { useEffect, useState } from "react";

import { Link, useParams } from "react-router-dom";

import { useAlunoProjetoDetalhes } from "../hooks/useAlunoProjetoDetalhes";

const STATUS_LABELS = {
  rascunho: "Rascunho",
  submetido: "Submetido",
  em_avaliacao: "Em avaliação",
  aprovado: "Aprovado",
  reprovado: "Reprovado",
};

export default function ProjetoDetalhes() {
  const { id } = useParams();

  const {
    projeto,
    links,
    arquivos,
    loading,
    salvando,
    erro,
    salvarProjeto,
    adicionarLink,
    removerLink,
  } = useAlunoProjetoDetalhes(id);

  const [formData, setFormData] = useState({
    titulo: "",
    descricao: "",
    curso: "",
    turma: "",
    semestre: "",
    area_conhecimento: "",
  });

  const [novoLink, setNovoLink] = useState({
    descricao: "",
    url: "",
  });

  const [arquivosSelecionados, setArquivosSelecionados] = useState([]);

  useEffect(() => {
    if (!projeto) {
      return;
    }

    setFormData({
      titulo: projeto.titulo || "",
      descricao: projeto.descricao || "",
      curso: projeto.curso || "",
      turma: projeto.turma || "",
      semestre: projeto.semestre || "",
      area_conhecimento: projeto.area_conhecimento || "",
    });
  }, [projeto]);

  const podeEditar =
    projeto && ["rascunho", "submetido"].includes(projeto.status);

  function atualizarCampo(campo, valor) {
    setFormData((dadosAtuais) => ({
      ...dadosAtuais,
      [campo]: valor,
    }));
  }

  async function handleSalvar(event) {
    event.preventDefault();

    if (!podeEditar) {
      return;
    }

    const sucesso = await salvarProjeto({
      titulo: formData.titulo.trim(),
      descricao: formData.descricao.trim(),
      curso: formData.curso.trim(),
      turma: formData.turma.trim(),
      semestre: formData.semestre.trim(),
      area_conhecimento: formData.area_conhecimento.trim(),
    });

    if (sucesso) {
      alert("Projeto atualizado com sucesso!");
    }
  }

  async function handleAdicionarLink(event) {
    event.preventDefault();

    if (!novoLink.url.trim()) {
      return;
    }

    if (!/^https?:\/\//i.test(novoLink.url.trim())) {
      alert("O link deve começar com http:// ou https://.");
      return;
    }

    const sucesso = await adicionarLink({
      url: novoLink.url.trim(),
      descricao: novoLink.descricao.trim() || null,
    });

    if (sucesso) {
      setNovoLink({
        descricao: "",
        url: "",
      });
    }
  }

  async function handleRemoverLink(link) {
    const confirmou = window.confirm(
      `Deseja remover o link "${link.descricao || link.url}"?`,
    );

    if (confirmou) {
      await removerLink(link.id);
    }
  }

  function handleSelecionarArquivos(event) {
    const selecionados = Array.from(event.target.files || []);

    const maioresQueLimite = selecionados.filter(
      (arquivo) => arquivo.size / (1024 * 1024) > 50,
    );

    if (maioresQueLimite.length > 0) {
      alert("Cada arquivo deve possuir no máximo 50 MB.");
      event.target.value = "";
      return;
    }

    setArquivosSelecionados(selecionados);
  }

  if (loading) {
    return (
      <div className="rounded-3xl border border-gray-100 bg-white p-10 text-center">
        <p className="text-sm text-gray-500">Carregando projeto...</p>
      </div>
    );
  }

  if (erro && !projeto) {
    return (
      <div className="rounded-3xl border border-red-100 bg-red-50 p-8">
        <p className="text-sm font-medium text-red-600">{erro}</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <header>
        <Link
          to="/aluno/projetos"
          className="text-sm font-semibold text-[#f19f17] hover:underline"
        >
          ← Voltar para meus projetos
        </Link>

        <div className="mt-5 flex flex-col justify-between gap-4 md:flex-row md:items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {projeto.titulo}
            </h1>

            <p className="mt-2 text-sm text-gray-500">
              Responsável: {projeto.aluno_responsavel}
            </p>

            <p className="mt-1 text-sm text-gray-500">
              Orientador: {projeto.professor_orientador}
            </p>
          </div>

          <span className="self-start rounded-full border border-amber-200 bg-amber-50 px-4 py-2 text-sm font-bold text-amber-700">
            {STATUS_LABELS[projeto.status]}
          </span>
        </div>

        {!podeEditar && (
          <div className="mt-5 rounded-2xl border border-gray-200 bg-gray-50 p-4 text-sm text-gray-600">
            Este projeto está disponível somente para visualização.
          </div>
        )}

        {projeto.status === "submetido" && (
          <div className="mt-5 rounded-2xl border border-blue-100 bg-blue-50 p-4 text-sm text-blue-700">
            O projeto foi submetido, mas ainda pode ser atualizado até entrar em
            avaliação.
          </div>
        )}
      </header>

      {erro && projeto && (
        <div className="rounded-2xl border border-red-100 bg-red-50 p-4 text-sm font-medium text-red-600">
          {erro}
        </div>
      )}

      <form
        onSubmit={handleSalvar}
        className="rounded-3xl border border-gray-100 bg-white p-8 shadow-sm"
      >
        <h2 className="mb-6 text-xl font-bold text-gray-900">
          Informações do projeto
        </h2>

        <div className="space-y-5">
          <div>
            <label className="mb-2 block text-sm font-bold text-gray-700">
              Título
            </label>

            <input
              type="text"
              value={formData.titulo}
              onChange={(event) => atualizarCampo("titulo", event.target.value)}
              disabled={!podeEditar}
              minLength={3}
              required
              className="w-full rounded-xl border border-gray-200 p-4 text-sm outline-none focus:border-[#f19f17] disabled:bg-gray-50 disabled:text-gray-500"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-bold text-gray-700">
              Descrição
            </label>

            <textarea
              value={formData.descricao}
              onChange={(event) =>
                atualizarCampo("descricao", event.target.value)
              }
              disabled={!podeEditar}
              minLength={10}
              required
              rows={5}
              className="w-full resize-none rounded-xl border border-gray-200 p-4 text-sm outline-none focus:border-[#f19f17] disabled:bg-gray-50 disabled:text-gray-500"
            />
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-bold text-gray-700">
                Curso
              </label>

              <input
                type="text"
                value={formData.curso}
                onChange={(event) =>
                  atualizarCampo("curso", event.target.value)
                }
                disabled={!podeEditar}
                required
                className="w-full rounded-xl border border-gray-200 p-4 text-sm outline-none focus:border-[#f19f17] disabled:bg-gray-50"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-bold text-gray-700">
                Turma
              </label>

              <input
                type="text"
                value={formData.turma}
                onChange={(event) =>
                  atualizarCampo("turma", event.target.value)
                }
                disabled={!podeEditar}
                required
                className="w-full rounded-xl border border-gray-200 p-4 text-sm outline-none focus:border-[#f19f17] disabled:bg-gray-50"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-bold text-gray-700">
                Semestre
              </label>

              <input
                type="text"
                value={formData.semestre}
                onChange={(event) =>
                  atualizarCampo("semestre", event.target.value)
                }
                disabled={!podeEditar}
                required
                className="w-full rounded-xl border border-gray-200 p-4 text-sm outline-none focus:border-[#f19f17] disabled:bg-gray-50"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-bold text-gray-700">
                Área de conhecimento
              </label>

              <input
                type="text"
                value={formData.area_conhecimento}
                onChange={(event) =>
                  atualizarCampo("area_conhecimento", event.target.value)
                }
                disabled={!podeEditar}
                required
                className="w-full rounded-xl border border-gray-200 p-4 text-sm outline-none focus:border-[#f19f17] disabled:bg-gray-50"
              />
            </div>
          </div>
        </div>

        {podeEditar && (
          <div className="mt-8 flex justify-end">
            <button
              type="submit"
              disabled={salvando}
              className="rounded-xl bg-[#f19f17] px-6 py-3 text-sm font-semibold text-white hover:bg-[#d98b14] disabled:opacity-50"
            >
              {salvando ? "Salvando..." : "Salvar alterações"}
            </button>
          </div>
        )}
      </form>

      <section className="rounded-3xl border border-gray-100 bg-white p-8 shadow-sm">
        <h2 className="text-xl font-bold text-gray-900">Links do projeto</h2>

        {links.length > 0 ? (
          <div className="mt-5 space-y-3">
            {links.map((link) => (
              <div
                key={link.id}
                className="flex flex-col justify-between gap-3 rounded-2xl border border-gray-100 bg-gray-50 p-4 sm:flex-row sm:items-center"
              >
                <a
                  href={link.url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm font-semibold text-[#f19f17] hover:underline"
                >
                  {link.descricao || link.url}
                </a>

                {podeEditar && (
                  <button
                    type="button"
                    onClick={() => handleRemoverLink(link)}
                    className="text-sm font-semibold text-red-500 hover:underline"
                  >
                    Remover
                  </button>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="mt-4 text-sm text-gray-500">Nenhum link cadastrado.</p>
        )}

        {podeEditar && (
          <form
            onSubmit={handleAdicionarLink}
            className="mt-6 grid grid-cols-1 gap-3 border-t border-gray-100 pt-6 md:grid-cols-[1fr_2fr_auto]"
          >
            <input
              type="text"
              placeholder="Descrição, por exemplo GitHub"
              value={novoLink.descricao}
              onChange={(event) =>
                setNovoLink((dadosAtuais) => ({
                  ...dadosAtuais,
                  descricao: event.target.value,
                }))
              }
              maxLength={100}
              className="rounded-xl border border-gray-200 p-3 text-sm outline-none focus:border-[#f19f17]"
            />

            <input
              type="url"
              placeholder="https://..."
              value={novoLink.url}
              onChange={(event) =>
                setNovoLink((dadosAtuais) => ({
                  ...dadosAtuais,
                  url: event.target.value,
                }))
              }
              required
              className="rounded-xl border border-gray-200 p-3 text-sm outline-none focus:border-[#f19f17]"
            />

            <button
              type="submit"
              className="rounded-xl border border-[#f19f17] px-5 py-3 text-sm font-semibold text-[#f19f17] hover:bg-amber-50"
            >
              Adicionar
            </button>
          </form>
        )}
      </section>

      <section className="rounded-3xl border border-gray-100 bg-white p-8 shadow-sm">
        <h2 className="text-xl font-bold text-gray-900">Arquivos do projeto</h2>

        {arquivos.length > 0 && (
          <div className="mt-5 space-y-3">
            {arquivos.map((arquivo) => (
              <div
                key={arquivo.id}
                className="flex justify-between rounded-2xl border border-gray-100 bg-gray-50 p-4 text-sm"
              >
                <span className="font-semibold text-gray-700">
                  {arquivo.nome_original}
                </span>

                <span className="text-gray-500">
                  {Number(arquivo.tamanho_mb).toFixed(2)} MB
                </span>
              </div>
            ))}
          </div>
        )}

        {podeEditar && (
          <label className="mt-6 block cursor-pointer rounded-2xl border-2 border-dashed border-gray-200 p-10 text-center hover:bg-gray-50">
            <input
              type="file"
              multiple
              accept=".pdf,.doc,.docx,.ppt,.pptx,.zip"
              onChange={handleSelecionarArquivos}
              className="hidden"
            />

            <span className="text-sm text-gray-600">
              Clique para selecionar arquivos
            </span>

            <span className="mt-2 block text-xs text-gray-400">
              PDF, DOCX, PPTX ou ZIP — máximo de 50 MB por arquivo
            </span>
          </label>
        )}

        {arquivosSelecionados.length > 0 && (
          <div className="mt-5 space-y-3">
            {arquivosSelecionados.map((arquivo) => (
              <div
                key={`${arquivo.name}-${arquivo.size}`}
                className="flex justify-between rounded-2xl border border-amber-100 bg-amber-50 p-4 text-sm"
              >
                <span className="font-semibold text-gray-700">
                  {arquivo.name}
                </span>

                <span className="text-gray-500">
                  {(arquivo.size / (1024 * 1024)).toFixed(2)} MB
                </span>
              </div>
            ))}

            <p className="text-xs text-gray-400">
              A seleção acima representa visualmente o futuro fluxo de upload.
              Os arquivos ainda não são enviados ao servidor.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
