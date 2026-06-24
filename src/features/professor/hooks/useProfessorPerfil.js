import { useState, useEffect, useCallback } from "react";
import { getProfessorPerfil, updateProfessorPerfil } from "../api/professorApi";

export function useProfessorPerfil() {
  const [perfil, setPerfil] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchPerfil = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getProfessorPerfil();
      setPerfil(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPerfil();
  }, [fetchPerfil]);

  const updatePerfil = async (formData) => {
    await updateProfessorPerfil(formData);
    setPerfil((prev) => ({ ...prev, ...formData }));
  };

  return { perfil, loading, updatePerfil };
}
