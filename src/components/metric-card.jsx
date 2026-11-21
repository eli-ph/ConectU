export function MetricCard({ icon: Icon, label, value, detail, tone = "navy" }) {
  const tones = {
    navy: "bg-brand-navy/8 text-brand-navy",
    gold: "bg-brand-gold-soft text-[#765600]",
    blue: "bg-sky-50 text-sky-700",
    green: "bg-emerald-50 text-emerald-700",
  };

  return (
    <article className="rounded-xl border border-slate-200 bg-white p-5 surface-shadow">
      <div className={`mb-4 grid h-10 w-10 place-items-center rounded-lg ${tones[tone]}`}><Icon size={20} /></div>
      <p className="text-sm font-medium text-slate-500">{label}</p>
      <p className="mt-1 text-2xl font-bold tracking-[-0.03em] text-brand-navy">{value}</p>
      {detail && <p className="mt-1 text-xs text-slate-500">{detail}</p>}
    </article>
  );
}
