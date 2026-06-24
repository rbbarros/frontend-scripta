import { useState, useEffect } from "react";
import { getAlunoPerfil } from "../api/alunoApi";
import { getProjetos } from "../../../lib/projetosApi";; // TODO: Extrair para projetosApi no futuro

export function useAlunoDashboard() {
  const [perfil, setPerfil] = useState(null);
  const [projetos, setProjetos] = useState([]);
  const [erro, setErro] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const token = localStorage.getItem("scripta_token");
      if (!token) {
        setErro("Não autenticado");
        setLoading(false);
        return;
      }

      try {
        const [perfilData, projetosData] = await Promise.allSettled([
          getAlunoPerfil(),
          getProjetos()
        ]);

        if (perfilData.status === "fulfilled") {
          setPerfil(perfilData.value);
        } else {
          setErro("Não foi possível carregar seu perfil.");
        }

        if (projetosData.status === "fulfilled") {
          setProjetos(Array.isArray(projetosData.value) ? projetosData.value : []);
        }

      } catch (error) {
        console.error("Erro no dashboard do aluno:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  return { perfil, projetos, erro, loading };
}
