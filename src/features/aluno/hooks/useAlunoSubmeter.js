import { useState, useEffect } from "react";
import { getAlunoPerfil } from "../api/alunoApi";
import { createProjeto } from "../../../lib/projetosApi";
import { getProfessoresOrientadores } from "../../professor/api/professorApi";

export function useAlunoSubmeter() {
  const [perfil, setPerfil] = useState(null);
  const [professores, setProfessores] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function init() {
      try {
        const data = await getAlunoPerfil();
        setPerfil(data);
      } catch (e) {
        console.error(e);
      }

      try {
        const profs = await getProfessoresOrientadores();
        setProfessores(profs);
      } catch (e) {
        console.error(e);
      }
    }
    init();
  }, []);

  const submitProjeto = async (formData) => {
    if (!perfil?.id) throw new Error("Perfil não carregado.");

    setLoading(true);
    try {
      return createProjeto(formData);
    } finally {
      setLoading(false);
    }
  };

  return { perfil, professores, loading, submitProjeto };
}
