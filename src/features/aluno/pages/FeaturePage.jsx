import React from "react";
import { Link } from "react-router-dom";

export default function FeaturePage({ title, description }) {
  return (
    <section className="mx-auto flex max-w-5xl flex-col gap-6">
      <div className="rounded-3xl border border-gray-100 bg-white p-8 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#f19f17]">Aluno</p>
        <h1 className="mt-2 text-3xl font-bold text-gray-900">{title}</h1>
        <p className="mt-2 text-sm text-gray-400">{description}</p>
      </div>

      <div className="rounded-3xl border border-dashed border-gray-200 bg-white p-8 text-sm text-gray-500 shadow-sm">
        Esta área já está ligada à navegação. O próximo passo é carregar os dados reais do backend aqui.
        <div className="mt-4">
          <Link to="/aluno" className="text-[#f19f17] font-semibold hover:underline">
            Voltar para o início
          </Link>
        </div>
      </div>
    </section>
  );
}