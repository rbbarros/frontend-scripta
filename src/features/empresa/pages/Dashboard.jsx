import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getEmpresaPerfil } from "../../../lib/authService";

export default function Dashboard() {
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
        setErro(e.message || "Não foi possível carregar seu perfil.");
        localStorage.removeItem("scripta_token");
        localStorage.removeItem("scripta_user_type");
        navigate("/");
      });
  }, [navigate]);

  return (
    <section className="mx-auto flex max-w-5xl flex-col gap-6">
      <div className="rounded-3xl border border-gray-100 bg-white p-8 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-blue-700">Empresa</p>
        <h1 className="mt-2 text-3xl font-bold text-gray-900">
          {perfil?.nome_empresa || "Painel da empresa"}
        </h1>
        <p className="mt-2 text-sm text-gray-400">
          {erro || `Setor: ${perfil?.setor || "Não informado"}`}
        </p>
      </div>
    </section>
  );
}
