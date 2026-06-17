import { useCallback, useEffect, useState } from "react";

export function useApiData(fetcher, deps = []) {
  const [data, setData] = useState(null);
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(true);
  const [nonce, setNonce] = useState(0);

  const recarregar = useCallback(() => setNonce((n) => n + 1), []);

  const depsKey = JSON.stringify(deps);

  useEffect(() => {
    let ativo = true;

    Promise.resolve()
      .then(() => fetcher())
      .then((resultado) => {
        if (ativo) {
          setData(resultado);
          setErro("");
          setCarregando(false);
        }
      })
      .catch((e) => {
        if (ativo) {
          setErro(e.message || "Não foi possível carregar os dados.");
          setCarregando(false);
        }
      });

    return () => {
      ativo = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [depsKey, nonce]);

  return { data, erro, carregando, recarregar };
}
