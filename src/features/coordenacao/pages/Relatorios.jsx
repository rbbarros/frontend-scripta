import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getCoordenadores, getEmpresas, getPortfolioList, getProjetos, getProfessores } from "../../../lib/authService";

export default function Relatorios() {
  const navigate = useNavigate();
  const [estatisticas, setEstatisticas] = useState({ projetos: [], professores: [], empresas: [], portfolios: [] });

  useEffect(() => {
    if (!localStorage.getItem("scripta_token")) {
      navigate("/");
      return;
    }

    Promise.allSettled([
      getProjetos(),
      getProfessores(),
      getEmpresas(),
      getPortfolioList(),
      getCoordenadores(),
    ]).then(([projetos, professores, empresas, portfolios]) => {
      setEstatisticas({
        projetos: projetos.status === "fulfilled" ? projetos.value : [],
        professores: professores.status === "fulfilled" ? professores.value : [],
        empresas: empresas.status === "fulfilled" ? empresas.value : [],
        portfolios: portfolios.status === "fulfilled" ? portfolios.value : [],
      });
    });
  }, [navigate]);

  return (
    <section className="mx-auto flex max-w-5xl flex-col gap-6">
      <div className="rounded-3xl border border-gray-100 bg-white p-8 shadow-sm">
        <h2 className="text-xl font-semibold text-gray-800">Relatórios e métricas</h2>
        <p className="mt-2 text-sm text-gray-400">Resumo em tempo real dos cadastros e projetos retornados pelo backend.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <article className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
          <p className="text-xs uppercase tracking-[0.2em] text-gray-400">Projetos</p>
          <h3 className="mt-2 text-2xl font-bold text-gray-900">{estatisticas.projetos.length}</h3>
        </article>
        <article className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
          <p className="text-xs uppercase tracking-[0.2em] text-gray-400">Usuários</p>
          <h3 className="mt-2 text-2xl font-bold text-gray-900">{estatisticas.professores.length + estatisticas.empresas.length}</h3>
        </article>
      </div>
    </section>
  );
}
