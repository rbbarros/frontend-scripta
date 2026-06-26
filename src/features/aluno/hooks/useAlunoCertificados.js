import { useEffect, useState } from "react";

import { getMeusCertificados } from "../../../lib/certificadosApi";

export function useAlunoCertificados() {
  const [certificados, setCertificados] = useState([]);

  const [loading, setLoading] = useState(true);

  const [erro, setErro] = useState("");

  useEffect(() => {
    let componenteAtivo = true;

    async function carregarCertificados() {
      setLoading(true);
      setErro("");

      try {
        const data = await getMeusCertificados();

        if (!componenteAtivo) {
          return;
        }

        setCertificados(Array.isArray(data) ? data : []);
      } catch (error) {
        if (!componenteAtivo) {
          return;
        }

        setCertificados([]);

        setErro(
          error.message || "Não foi possível carregar seus certificados.",
        );
      } finally {
        if (componenteAtivo) {
          setLoading(false);
        }
      }
    }

    carregarCertificados();

    return () => {
      componenteAtivo = false;
    };
  }, []);

  return {
    certificados,
    loading,
    erro,
  };
}
