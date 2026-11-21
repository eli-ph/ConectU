import Link from "next/link";
import { Landmark } from "lucide-react";

export function Brand({ compact = false, href = "/", light = false }) {
  return (
    <Link
      href={href}
      className={`inline-flex items-center gap-2.5 font-semibold tracking-[-0.02em] ${
        light ? "text-white" : "text-brand-navy"
      }`}
      aria-label="Vinculación Universitaria, inicio"
    >
      <span
        className={`grid h-9 w-9 shrink-0 place-items-center rounded-md ${
          light ? "bg-white/10 text-brand-gold" : "bg-brand-navy text-brand-gold"
        }`}
      >
        <Landmark size={19} strokeWidth={2.2} />
      </span>
      {!compact && (
        <span className="leading-[1.05]">
          <span className="block text-[0.95rem] font-bold">Vinculación</span>
          <span className={`block text-[0.63rem] font-semibold uppercase tracking-[0.11em] ${light ? "text-brand-gold" : "text-[#8a6a1c]"}`}>Universitaria</span>
        </span>
      )}
    </Link>
  );
}
