import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getProjetos } from "../../../lib/projetosApi";;
import { getEmpresaPerfil } from "../api/empresaApi";

export default function Oportunidades() {
  const navigate = useNavigate();
  const [perfil, setPerfil] = useState(null);
  const [projetos, setProjetos] = useState([]);
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

    getProjetos()
      .then(setProjetos)
      .catch(() => setProjetos([]));
  }, [navigate]);

  const oportunidades = projetos.filter((projeto) => ["submetido", "em_avaliacao", "aprovado"].includes(projeto.status));

  return (
    <section className="mx-auto flex max-w-5xl flex-col gap-6">
      <div className="rounded-3xl border border-gray-100 bg-white p-8 shadow-sm">
        <h2 className="text-xl font-semibold text-gray-800">Oportunidades abertas</h2>
        <p className="mt-2 text-sm text-gray-400">
          {erro || (perfil ? `${perfil.nome_empresa}, veja aqui os projetos que podem interessar à sua empresa.` : "Carregando dados...")}
        </p>
      </div>

      <div className="grid gap-4">
        {oportunidades.map((projeto) => (
          <article key={projeto.id} className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-800">{projeto.titulo}</h3>
            <p className="mt-1 text-sm text-gray-500">{projeto.aluno_responsavel} • {projeto.status}</p>
          </article>
        ))}
        {!oportunidades.length && <div className="rounded-3xl border border-dashed border-gray-200 bg-white p-8 text-sm text-gray-500 shadow-sm">Nenhuma oportunidade disponível no backend.</div>}
      </div>
    </section>
  );
}
