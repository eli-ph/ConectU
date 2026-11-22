"use client";
import { Check, Circle } from "lucide-react";
import { checkPassword } from "@/lib/password-policy";

export function PasswordStrength({ password = "", compact = false }) {
  const result = checkPassword(password);
  const label = !password ? "Sin ingresar" : result.valid ? "Segura" : result.score < 3 ? "Débil" : "En progreso";
  const bar = !password ? "bg-slate-300" : result.valid ? "bg-emerald-500" : result.score < 3 ? "bg-rose-500" : "bg-amber-500";
  return (
    <div className={`rounded-xl border border-slate-200 bg-slate-50/80 ${compact ? "px-4 py-3" : "px-4 py-3.5 sm:px-5"}`}>
      <div className="flex flex-wrap items-center justify-between gap-2 text-sm font-semibold text-slate-700">
        <span>Seguridad de la contraseña</span>
        <span className={result.valid ? "text-emerald-700" : "text-slate-600"}>{label} · {result.score}/5</span>
      </div>
      <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-200" role="progressbar" aria-label="Requisitos cumplidos" aria-valuenow={result.score} aria-valuemin={0} aria-valuemax={5}>
        <div className={`h-full rounded-full transition-[width] duration-200 ${bar}`} style={{ width: `${result.score * 20}%` }} />
      </div>
      <ul className={`mt-3 grid gap-x-6 gap-y-2 text-sm ${compact ? "sm:grid-cols-2" : "md:grid-cols-2 lg:grid-cols-5"}`}>
        {result.checks.map((item) => (
          <li className={`flex items-center gap-1.5 ${item.valid ? "font-medium text-emerald-700" : "text-slate-500"}`} key={item.key}>
            {item.valid ? <Check size={15} aria-hidden="true" /> : <Circle size={13} aria-hidden="true" />}
            <span>{item.label}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
