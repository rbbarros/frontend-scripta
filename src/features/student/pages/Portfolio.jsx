export default function Portfolio() {
  return (
    <section className="mx-auto flex max-w-5xl flex-col gap-6">
      <div className="rounded-3xl border border-gray-100 bg-white p-8 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#f19f17]">Portfólio</p>
        <h1 className="mt-2 text-3xl font-bold text-gray-900">Seu portfólio acadêmico</h1>
        <p className="mt-2 text-sm text-gray-400">Acompanhe projetos publicados, feedbacks e visibilidade para empresas.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <article className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-800">Projetos publicados</h2>
          <p className="mt-2 text-sm text-gray-400">Lista centralizada para acompanhar status, avaliações e links.</p>
        </article>
        <article className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-800">Feedbacks recebidos</h2>
          <p className="mt-2 text-sm text-gray-400">Próximo passo da arquitetura para o módulo de avaliação e acompanhamento.</p>
        </article>
      </div>
    </section>
  );
}
