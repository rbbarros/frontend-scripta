import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getEmpresaPerfil } from "../../../lib/authService";

export default function Oportunidades() {
  const navigate = useNavigate();
  const [perfil, setPerfil] = useState(null);
  const [erro, setErro] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("scripta_token");
    if (!token) {
      navigate("/");
      return;
    }

    getEmpresaPerfil()
      .then(setPerfil)
      .catch((e) => {
        setErro(e.message || "Não foi possível carregar as oportunidades.");
        localStorage.removeItem("scripta_token");
        localStorage.removeItem("scripta_user_type");
        navigate("/");
      });
  }, [navigate]);

  return (
    <section className="mx-auto flex max-w-5xl flex-col gap-6">
      <div className="rounded-3xl border border-gray-100 bg-white p-8 shadow-sm">
        <h2 className="text-xl font-semibold text-gray-800">Oportunidades abertas</h2>
        <p className="mt-2 text-sm text-gray-400">
          {erro || (perfil ? `${perfil.nome_empresa}, veja aqui as vagas e convites para sua empresa.` : "Carregando dados...")}
        </p>
      </div>
    </section>
  );
}
