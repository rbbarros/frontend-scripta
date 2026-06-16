import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAlunoPerfil } from "../../../lib/authService";

export default function Portfolio() {
  const navigate = useNavigate();
  const [perfil, setPerfil] = useState(null);
  const [erro, setErro] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("scripta_token");
    if (!token) {
      navigate("/");
      return;
    }

    getAlunoPerfil()
      .then(setPerfil)
      .catch((e) => {
        setErro(e.message || "Não foi possível carregar o portfólio.");
        localStorage.removeItem("scripta_token");
        localStorage.removeItem("scripta_user_type");
        navigate("/");
      });
  }, [navigate]);

  return (
    <section className="mx-auto flex max-w-5xl flex-col gap-6">
      <div className="rounded-3xl border border-gray-100 bg-white p-8 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#f19f17]">Portfólio</p>
        <h1 className="mt-2 text-3xl font-bold text-gray-900">{perfil?.nome || "Seu portfólio acadêmico"}</h1>
        <p className="mt-2 text-sm text-gray-400">
          {erro || `Acompanhe projetos publicados, feedbacks e visibilidade para empresas.`}
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <article className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-800">Projetos publicados</h2>
          <p className="mt-2 text-sm text-gray-400">
            {perfil ? `Bem-vindo, ${perfil.nome}. Aqui você verá seus projetos e status.` : "Carregando seus dados..."}
          </p>
        </article>
        <article className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-800">Feedbacks recebidos</h2>
          <p className="mt-2 text-sm text-gray-400">Próximo passo da arquitetura para o módulo de avaliação e acompanhamento.</p>
        </article>
      </div>
    </section>
  );
}
