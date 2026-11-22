export function MetricCard({
  icon: Icon,
  label,
  value,
  unit,
  detail,
  meta,
  rightNote,
  tone = "navy",
}) {
  const tones = {
    navy: "bg-slate-100 text-brand-navy",
    gold: "bg-amber-50 text-amber-600",
    blue: "bg-indigo-50 text-indigo-600",
    green: "bg-emerald-50 text-emerald-600",
  };

  return (
    <article className="flex min-w-0 flex-col justify-between rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs">
      <div>
        {/* Fila superior: etiqueta a la izquierda e ícono a la derecha */}
        <div className="flex items-start justify-between gap-2">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
            {label}
          </p>
          {Icon && (
            <span
              className={`grid h-9 w-9 shrink-0 place-items-center rounded-xl ${tones[tone]}`}
            >
              <Icon size={18} />
            </span>
          )}
        </div>

        {/* Fila central: número grande + descripción corta */}
        <div className="mt-3 flex flex-wrap items-baseline gap-1.5">
          <span className="text-3xl font-bold tracking-tight text-slate-900">
            {value}
          </span>
          {unit && (
            <span className="text-xs font-medium text-slate-500">{unit}</span>
          )}
        </div>

        {detail && <p className="mt-1 text-xs text-slate-500">{detail}</p>}
      </div>

      {/* Fila inferior: pie de ficha */}
      {(meta || rightNote) && (
        <div className="mt-4 flex items-center justify-between gap-2 pt-2 text-[11px] text-slate-500">
          <span className="truncate font-medium">{meta}</span>
          {rightNote && (
            <span className="shrink-0 text-slate-400">{rightNote}</span>
          )}
        </div>
      )}
    </article>
  );
}