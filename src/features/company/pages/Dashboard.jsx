export default function Dashboard() {
  return (
    <section className="mx-auto flex max-w-5xl flex-col gap-6">
      <div className="rounded-3xl border border-gray-100 bg-white p-8 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-blue-700">Company</p>
        <h1 className="mt-2 text-3xl font-bold text-gray-900">Painel da empresa</h1>
        <p className="mt-2 text-sm text-gray-400">Visualize projetos, candidatos e oportunidades de parceria.</p>
      </div>
    </section>
  );
}
