import Link from "next/link";
import { Landmark } from "lucide-react";

export function Brand({ compact = false, href = "/", light = false }) {
  return (
    <Link
      href={href}
      className={`inline-flex items-center gap-3 font-semibold tracking-[-0.02em] ${
        light ? "text-white" : "text-brand-navy"
      }`}
      aria-label="Vinculación Universitaria, inicio"
    >
      <span
        className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl ${
          light ? "bg-white/10 text-brand-gold" : "bg-brand-navy text-white"
        }`}
      >
        <Landmark size={21} strokeWidth={2.2} />
      </span>
      {!compact && (
        <span className="leading-[1.05]">
          <span className="block text-[0.68rem] font-medium uppercase tracking-[0.17em] opacity-70">
            Plataforma de
          </span>
          <span className="text-[0.94rem]">Vinculación Universitaria</span>
        </span>
      )}
    </Link>
  );
}
