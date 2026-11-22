export function MetricCard({ icon: Icon, label, value, detail, tone = "navy" }) {
  const tones = {
    navy: "bg-brand-navy/8 text-brand-navy ring-brand-navy/10",
    gold: "bg-brand-gold-soft text-brand-gold-dark ring-brand-gold/20",
    blue: "bg-sky-50 text-sky-700 ring-sky-100",
    green: "bg-emerald-50 text-emerald-700 ring-emerald-100",
  };

  return (
    <article className="ui-card min-w-0 p-5 transition-shadow duration-200 hover:shadow-card sm:p-6">
      <span className={`mb-5 grid h-11 w-11 place-items-center rounded-xl ring-1 ${tones[tone] || tones.navy}`}>
        <Icon size={21} aria-hidden="true" />
      </span>
      <p className="text-sm font-semibold leading-5 text-slate-500">{label}</p>
      <p className="mt-2 break-words text-2xl font-bold leading-tight tracking-[-0.035em] text-brand-navy sm:text-[1.7rem]">{value}</p>
      {detail && <p className="mt-2 text-xs leading-5 text-slate-500">{detail}</p>}
    </article>
  );
}
