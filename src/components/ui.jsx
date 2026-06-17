const accentClasses = {
  amber: { text: "text-[#f19f17]", bg: "bg-amber-50", ring: "focus:ring-[#f19f17]" },
  purple: { text: "text-purple-600", bg: "bg-purple-50", ring: "focus:ring-purple-500" },
  blue: { text: "text-blue-700", bg: "bg-blue-50", ring: "focus:ring-blue-500" },
  emerald: { text: "text-emerald-700", bg: "bg-emerald-50", ring: "focus:ring-emerald-500" },
};

function accent(name) {
  return accentClasses[name] || accentClasses.amber;
}

export function PageHeader({ eyebrow, title, description, accentColor = "amber", action }) {
  const a = accent(accentColor);
  return (
    <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        {eyebrow && (
          <p className={`text-xs font-semibold uppercase tracking-[0.25em] ${a.text}`}>
            {eyebrow}
          </p>
        )}
        <h1 className="mt-1 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
          {title}
        </h1>
        {description && <p className="mt-1 text-sm text-gray-400">{description}</p>}
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}

export function Loading({ label = "Carregando..." }) {
  return (
    <div className="flex items-center justify-center gap-3 rounded-2xl border border-gray-100 bg-white p-10 text-sm text-gray-400 shadow-sm">
      <span className="h-4 w-4 animate-spin rounded-full border-2 border-gray-200 border-t-gray-400" />
      {label}
    </div>
  );
}

export function ErrorState({ message, onRetry }) {
  return (
    <div className="rounded-2xl border border-red-100 bg-red-50 p-6 text-sm text-red-600 shadow-sm">
      <p className="font-semibold">⚠ Não foi possível carregar os dados</p>
      <p className="mt-1 text-red-500">{message}</p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="mt-3 rounded-xl border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-600 transition-colors hover:bg-red-100"
        >
          Tentar novamente
        </button>
      )}
    </div>
  );
}

export function EmptyState({ icon = "📭", title = "Nada por aqui ainda", description }) {
  return (
    <div className="rounded-2xl border border-dashed border-gray-200 bg-white p-10 text-center shadow-sm">
      <div className="text-3xl">{icon}</div>
      <p className="mt-3 font-semibold text-gray-700">{title}</p>
      {description && <p className="mt-1 text-sm text-gray-400">{description}</p>}
    </div>
  );
}

export function StatCard({ icon, value, label, accentColor = "amber" }) {
  const a = accent(accentColor);
  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-6 text-center shadow-sm">
      {icon && <div className={`text-2xl ${a.text}`}>{icon}</div>}
      <div className="mt-2 text-3xl font-bold text-gray-900">{value}</div>
      <div className="mt-1 text-xs font-medium text-gray-400">{label}</div>
    </div>
  );
}

const statusStyles = {
  rascunho: "bg-gray-100 text-gray-600",
  submetido: "bg-blue-50 text-blue-700",
  em_avaliacao: "bg-amber-50 text-[#c67c00]",
  aprovado: "bg-emerald-50 text-emerald-700",
  reprovado: "bg-red-50 text-red-600",
};

const statusLabels = {
  rascunho: "Rascunho",
  submetido: "Submetido",
  em_avaliacao: "Em avaliação",
  aprovado: "Aprovado",
  reprovado: "Reprovado",
};

export function StatusBadge({ status }) {
  const key = String(status || "").toLowerCase();
  const style = statusStyles[key] || "bg-gray-100 text-gray-600";
  const label = statusLabels[key] || status || "—";
  return (
    <span className={`inline-flex rounded-md px-2 py-1 text-xs font-bold ${style}`}>
      {label}
    </span>
  );
}
