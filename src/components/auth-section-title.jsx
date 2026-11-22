/** Título de sección utilizado por los dos registros; conserva su color original. */
export function AuthSectionTitle({ icon: Icon, title, tone = "navy" }) {
  const iconStyle = tone === "gold"
    ? "bg-brand-gold-soft text-brand-gold-dark"
    : "bg-[#edf0ff] text-brand-navy";
  return (
    <h2 className="mb-5 flex items-center gap-3 border-b border-slate-200 pb-3 text-base font-bold text-brand-navy sm:text-lg">
      <span className={`grid h-9 w-9 shrink-0 place-items-center rounded-xl ${iconStyle}`}>
        <Icon size={19} aria-hidden="true" />
      </span>
      {title}
    </h2>
  );
}
