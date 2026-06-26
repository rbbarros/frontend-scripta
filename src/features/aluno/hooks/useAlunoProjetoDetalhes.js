import { useCallback, useEffect, useState } from "react";

import {
  addLinkAoProjeto,
  deleteLinkDoProjeto,
  getArquivosDoProjeto,
  getLinksDoProjeto,
  getProjetoPorId,
  updateProjeto,
} from "../../../lib/projetosApi";

export function useAlunoProjetoDetalhes(projetoId) {
  const [projeto, setProjeto] = useState(null);

  const [links, setLinks] = useState([]);

  const [arquivos, setArquivos] = useState([]);

  const [loading, setLoading] = useState(true);

  const [salvando, setSalvando] = useState(false);

  const [erro, setErro] = useState("");

  const carregarDados = useCallback(async () => {
    setLoading(true);
    setErro("");

    try {
      const projetoData = await getProjetoPorId(projetoId);

      setProjeto(projetoData);

      const [linksResult, arquivosResult] = await Promise.allSettled([
        getLinksDoProjeto(projetoId),
        getArquivosDoProjeto(projetoId),
      ]);

      setLinks(
        linksResult.status === "fulfilled" && Array.isArray(linksResult.value)
          ? linksResult.value
          : [],
      );

      setArquivos(
        arquivosResult.status === "fulfilled" &&
          Array.isArray(arquivosResult.value)
          ? arquivosResult.value
          : [],
      );
    } catch (error) {
      setProjeto(null);

      setErro(error.message || "Não foi possível carregar o projeto.");
    } finally {
      setLoading(false);
    }
  }, [projetoId]);

  useEffect(() => {
    carregarDados();
  }, [carregarDados]);

  async function salvarProjeto(dados) {
    setSalvando(true);
    setErro("");

    try {
      await updateProjeto(projetoId, dados);

      setProjeto((projetoAtual) => ({
        ...projetoAtual,
        ...dados,
      }));

      return true;
    } catch (error) {
      setErro(error.message || "Não foi possível atualizar o projeto.");

      return false;
    } finally {
      setSalvando(false);
    }
  }

  async function adicionarLink(dados) {
    setErro("");

    try {
      await addLinkAoProjeto(projetoId, dados);

      const linksAtualizados = await getLinksDoProjeto(projetoId);

      setLinks(Array.isArray(linksAtualizados) ? linksAtualizados : []);

      return true;
    } catch (error) {
      setErro(error.message || "Não foi possível adicionar o link.");

      return false;
    }
  }

  async function removerLink(linkId) {
    setErro("");

    try {
      await deleteLinkDoProjeto(projetoId, linkId);

      setLinks((linksAtuais) =>
        linksAtuais.filter((link) => link.id !== linkId),
      );

      return true;
    } catch (error) {
      setErro(error.message || "Não foi possível remover o link.");

      return false;
    }
  }

  return {
    projeto,
    links,
    arquivos,
    loading,
    salvando,
    erro,
    salvarProjeto,
    adicionarLink,
    removerLink,
  };
}
